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
        origins = "http://localhost:5173",
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PUT,
                RequestMethod.DELETE,
                RequestMethod.OPTIONS
        }
)
public class AdminController {

    private final AdminService adminService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public AdminController(
            AdminService adminService) {

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
    //     "email": "admin@gmail.com",
    //     "password": "123456"
    // }
    //
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<User> adminLogin(
            @RequestBody LoginRequest request) {

        if (request == null) {

            throw new RuntimeException(
                    "Admin login information is required."
            );
        }

        User admin =
                adminService.adminLogin(
                        request.getEmail(),
                        request.getPassword()
                );

        return ResponseEntity.ok(admin);
    }


    // =========================================================
    // GET ALL USERS
    //
    // GET /admin/users
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
    // =========================================================

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id) {

        adminService.deleteUser(id);

        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
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
    public ResponseEntity<User> changeUserRole(
            @PathVariable Long id,
            @RequestBody RoleRequest request) {

        if (request == null) {

            throw new RuntimeException(
                    "Role information is required."
            );
        }

        User updatedUser =
                adminService.changeUserRole(
                        id,
                        request.getRole()
                );

        return ResponseEntity.ok(updatedUser);
    }


    // =========================================================
    // LOGIN REQUEST
    // =========================================================

    public static class LoginRequest {

        private String email;

        private String password;


        // -----------------------------------------------------
        // DEFAULT CONSTRUCTOR
        // -----------------------------------------------------

        public LoginRequest() {
        }


        // -----------------------------------------------------
        // GET EMAIL
        // -----------------------------------------------------

        public String getEmail() {

            return email;
        }


        // -----------------------------------------------------
        // SET EMAIL
        // -----------------------------------------------------

        public void setEmail(String email) {

            this.email = email;
        }


        // -----------------------------------------------------
        // GET PASSWORD
        // -----------------------------------------------------

        public String getPassword() {

            return password;
        }


        // -----------------------------------------------------
        // SET PASSWORD
        // -----------------------------------------------------

        public void setPassword(String password) {

            this.password = password;
        }
    }


    // =========================================================
    // ROLE REQUEST
    // =========================================================

    public static class RoleRequest {

        private String role;


        // -----------------------------------------------------
        // DEFAULT CONSTRUCTOR
        // -----------------------------------------------------

        public RoleRequest() {
        }


        // -----------------------------------------------------
        // GET ROLE
        // -----------------------------------------------------

        public String getRole() {

            return role;
        }


        // -----------------------------------------------------
        // SET ROLE
        // -----------------------------------------------------

        public void setRole(String role) {

            this.role = role;
        }
    }
}
