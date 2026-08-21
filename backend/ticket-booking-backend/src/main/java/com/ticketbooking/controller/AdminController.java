package com.ticketbooking.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ticketbooking.entity.User;
import com.ticketbooking.service.AdminService;

@RestController
@RequestMapping("/admin")
@CrossOrigin(
        origins = {
                "http://localhost:3000",
                "http://localhost:5173"
        },
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PUT,
                RequestMethod.DELETE,
                RequestMethod.OPTIONS
        },
        allowedHeaders = "*"
)
public class AdminController {

    private final AdminService adminService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public AdminController(AdminService adminService) {

        this.adminService = adminService;
    }


    // =========================================================
    // ADMIN LOGIN
    //
    // POST /admin/login
    //
    // Request:
    //
    // {
    //     "email": "admin@ticketbook.com",
    //     "password": "your-password"
    // }
    //
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(
            @RequestBody LoginRequest request) {

        try {

            if (request == null) {

                return ResponseEntity
                        .badRequest()
                        .body("Admin login information is required.");
            }

            if (request.getEmail() == null
                    || request.getEmail().trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Email is required.");
            }

            if (request.getPassword() == null
                    || request.getPassword().trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Password is required.");
            }


            User admin =
                    adminService.adminLogin(
                            request.getEmail().trim().toLowerCase(),
                            request.getPassword().trim()
                    );


            if (admin == null) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid administrator credentials.");
            }


            // Make sure only ADMIN accounts can use this endpoint.

            if (admin.getRole() == null
                    || !"ADMIN".equalsIgnoreCase(
                            admin.getRole().toString())) {

                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body("Access denied. Administrator account required.");
            }


            return ResponseEntity.ok(admin);

        } catch (RuntimeException error) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            error.getMessage() != null
                                    ? error.getMessage()
                                    : "Invalid administrator credentials."
                    );
        }
    }


    // =========================================================
    // GET ALL USERS
    //
    // GET /admin/users
    //
    // =========================================================

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {

        List<User> users =
                adminService.getAllUsers();

        return ResponseEntity.ok(users);
    }


    // =========================================================
    // GET TOTAL USERS
    //
    // GET /admin/users/count
    //
    // =========================================================

    @GetMapping("/users/count")
    public ResponseEntity<Long> getTotalUsers() {

        long totalUsers =
                adminService.getTotalUsers();

        return ResponseEntity.ok(totalUsers);
    }


    // =========================================================
    // GET TOTAL ADMINS
    //
    // GET /admin/admins/count
    //
    // =========================================================

    @GetMapping("/admins/count")
    public ResponseEntity<Long> getTotalAdmins() {

        long totalAdmins =
                adminService.getTotalAdmins();

        return ResponseEntity.ok(totalAdmins);
    }


    // =========================================================
    // DELETE USER
    //
    // DELETE /admin/users/{id}
    //
    // ADMIN accounts cannot be deleted.
    //
    // =========================================================

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id) {

        try {

            adminService.deleteUser(id);

            return ResponseEntity
                    .noContent()
                    .build();

        } catch (RuntimeException error) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            error.getMessage() != null
                                    ? error.getMessage()
                                    : "Unable to delete user."
                    );
        }
    }


    // =========================================================
    // CHANGE USER ROLE
    //
    // PUT /admin/users/{id}/role
    //
    // Request:
    //
    // {
    //     "role": "ADMIN"
    // }
    //
    // or
    //
    // {
    //     "role": "USER"
    // }
    //
    // =========================================================

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> changeUserRole(
            @PathVariable Long id,
            @RequestBody RoleRequest request) {

        try {

            if (request == null
                    || request.getRole() == null
                    || request.getRole().trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Role information is required.");
            }


            String role =
                    request.getRole()
                            .trim()
                            .toUpperCase();


            if (!role.equals("ADMIN")
                    && !role.equals("USER")) {

                return ResponseEntity
                        .badRequest()
                        .body("Role must be either ADMIN or USER.");
            }


            User updatedUser =
                    adminService.changeUserRole(
                            id,
                            role
                    );

            return ResponseEntity.ok(updatedUser);

        } catch (RuntimeException error) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            error.getMessage() != null
                                    ? error.getMessage()
                                    : "Unable to change user role."
                    );
        }
    }


    // =========================================================
    // LOGIN REQUEST
    // =========================================================

    public static class LoginRequest {

        private String email;

        private String password;


        // =====================================================
        // DEFAULT CONSTRUCTOR
        // =====================================================

        public LoginRequest() {
        }


        // =====================================================
        // GET EMAIL
        // =====================================================

        public String getEmail() {

            return email;
        }


        // =====================================================
        // SET EMAIL
        // =====================================================

        public void setEmail(String email) {

            this.email = email;
        }


        // =====================================================
        // GET PASSWORD
        // =====================================================

        public String getPassword() {

            return password;
        }


        // =====================================================
        // SET PASSWORD
        // =====================================================

        public void setPassword(String password) {

            this.password = password;
        }
    }


    // =========================================================
    // ROLE REQUEST
    // =========================================================

    public static class RoleRequest {

        private String role;


        // =====================================================
        // DEFAULT CONSTRUCTOR
        // =====================================================

        public RoleRequest() {
        }


        // =====================================================
        // GET ROLE
        // =====================================================

        public String getRole() {

            return role;
        }


        // =====================================================
        // SET ROLE
        // =====================================================

        public void setRole(String role) {

            this.role = role;
        }
    }
}