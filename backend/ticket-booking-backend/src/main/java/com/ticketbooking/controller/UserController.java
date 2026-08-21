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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ticketbooking.entity.User;
import com.ticketbooking.service.UserService;

@RestController

/*
 * Support BOTH API paths:
 *
 * http://localhost:8080/users
 *
 * and
 *
 * http://localhost:8080/api/users
 *
 * This allows the existing frontend code to work
 * whether it uses /users or /api/users.
 */
@RequestMapping({
        "/users",
        "/api/users"
})

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
public class UserController {

    private final UserService userService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public UserController(UserService userService) {

        this.userService = userService;
    }


    // =========================================================
    // CREATE USER / REGISTER
    //
    // POST /users
    // POST /api/users
    // =========================================================

    @PostMapping
    public ResponseEntity<?> createUser(
            @RequestBody User user) {

        try {

            User createdUser =
                    userService.createUser(user);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(createdUser);

        } catch (RuntimeException error) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(error.getMessage());
        }
    }


    // =========================================================
    // LOGIN
    //
    // POST /users/login
    // POST /api/users/login
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        try {

            if (request == null) {

                return ResponseEntity
                        .badRequest()
                        .body("Login information is required.");
            }

            if (request.getEmail() == null ||
                    request.getEmail().trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Email is required.");
            }

            if (request.getPassword() == null ||
                    request.getPassword().trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Password is required.");
            }

            User user =
                    userService.login(
                            request.getEmail().trim().toLowerCase(),
                            request.getPassword()
                    );

            return ResponseEntity.ok(user);

        } catch (RuntimeException error) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(error.getMessage());
        }
    }


    // =========================================================
    // GET ALL USERS
    //
    // GET /users
    // GET /api/users
    // =========================================================

    @GetMapping
    public ResponseEntity<?> getAllUsers() {

        try {

            List<User> users =
                    userService.getAllUsers();

            return ResponseEntity.ok(users);

        } catch (RuntimeException error) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(error.getMessage());
        }
    }


    // =========================================================
    // GET USER BY ID
    //
    // GET /users/{id}
    // GET /api/users/{id}
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(
            @PathVariable Long id) {

        try {

            User user =
                    userService.getUserById(id);

            return ResponseEntity.ok(user);

        } catch (RuntimeException error) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(error.getMessage());
        }
    }


    // =========================================================
    // GET USER BY EMAIL
    //
    // GET /users/profile?email=example@gmail.com
    // GET /api/users/profile?email=example@gmail.com
    // =========================================================

    @GetMapping("/profile")
    public ResponseEntity<?> getUserByEmail(
            @RequestParam String email) {

        try {

            User user =
                    userService.getUserByEmail(
                            email.trim().toLowerCase()
                    );

            return ResponseEntity.ok(user);

        } catch (RuntimeException error) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(error.getMessage());
        }
    }


    // =========================================================
    // UPDATE USER
    //
    // PUT /users/{id}
    // PUT /api/users/{id}
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody User user) {

        try {

            User updatedUser =
                    userService.updateUser(
                            id,
                            user
                    );

            return ResponseEntity.ok(updatedUser);

        } catch (RuntimeException error) {

            String message =
                    error.getMessage();

            if (message != null &&
                    message.toLowerCase()
                            .contains("already exists")) {

                return ResponseEntity
                        .status(HttpStatus.CONFLICT)
                        .body(message);
            }

            if (message != null &&
                    message.toLowerCase()
                            .contains("not found")) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(message);
            }

            return ResponseEntity
                    .badRequest()
                    .body(message);
        }
    }


    // =========================================================
    // DELETE USER
    //
    // DELETE /users/{id}
    // DELETE /api/users/{id}
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(
            @PathVariable Long id) {

        try {

            userService.deleteUser(id);

            return ResponseEntity
                    .noContent()
                    .build();

        } catch (RuntimeException error) {

            String message =
                    error.getMessage();

            if (message != null &&
                    message.toLowerCase()
                            .contains("not found")) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(message);
            }

            return ResponseEntity
                    .badRequest()
                    .body(message);
        }
    }


    // =========================================================
    // LOGIN REQUEST CLASS
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
}