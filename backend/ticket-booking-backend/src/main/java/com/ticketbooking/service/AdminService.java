package com.ticketbooking.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ticketbooking.entity.User;
import com.ticketbooking.repository.UserRepository;

@Service
public class AdminService {

    private final UserRepository userRepository;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public AdminService(
            UserRepository userRepository) {

        this.userRepository =
                userRepository;
    }


    // =========================================================
    // ADMIN LOGIN
    //
    // POST /admin/login
    //
    // Only an account with role ADMIN
    // can login through this endpoint.
    // =========================================================

    public User adminLogin(
            String email,
            String password) {

        // -----------------------------------------------------
        // VALIDATE EMAIL
        // -----------------------------------------------------

        if (email == null
                || email.trim().isEmpty()) {

            throw new RuntimeException(
                    "Admin email is required."
            );
        }


        // -----------------------------------------------------
        // VALIDATE PASSWORD
        // -----------------------------------------------------

        if (password == null
                || password.trim().isEmpty()) {

            throw new RuntimeException(
                    "Admin password is required."
            );
        }


        // -----------------------------------------------------
        // CLEAN LOGIN DATA
        // -----------------------------------------------------

        String cleanEmail =
                email.trim().toLowerCase();

        String cleanPassword =
                password.trim();


        // -----------------------------------------------------
        // FIND ACCOUNT
        // -----------------------------------------------------

        User user =
                userRepository
                        .findByEmail(cleanEmail)
                        .orElse(null);


        // -----------------------------------------------------
        // ACCOUNT NOT FOUND
        // -----------------------------------------------------

        if (user == null) {

            throw new RuntimeException(
                    "Invalid admin email or password."
            );
        }


        // -----------------------------------------------------
        // CHECK PASSWORD
        // -----------------------------------------------------

        if (user.getPassword() == null
                || user.getPassword()
                        .trim()
                        .isEmpty()) {

            throw new RuntimeException(
                    "Invalid admin email or password."
            );
        }


        if (!cleanPassword.equals(
                user.getPassword().trim())) {

            throw new RuntimeException(
                    "Invalid admin email or password."
            );
        }


        // -----------------------------------------------------
        // CHECK ROLE
        // -----------------------------------------------------

        String role =
                user.getRole() == null
                        ? ""
                        : user.getRole()
                                .trim()
                                .toUpperCase();


        if (!"ADMIN".equals(role)) {

            throw new RuntimeException(
                    "Access denied. This account is not an administrator."
            );
        }


        // -----------------------------------------------------
        // NORMALIZE ROLE
        // -----------------------------------------------------

        user.setRole("ADMIN");


        // -----------------------------------------------------
        // ADMIN LOGIN SUCCESSFUL
        // -----------------------------------------------------

        return user;
    }


    // =========================================================
    // GET ALL USERS
    //
    // GET /admin/users
    // =========================================================

    public List<User> getAllUsers() {

        return userRepository.findAll();
    }


    // =========================================================
    // GET TOTAL NORMAL USERS
    //
    // GET /admin/users/count
    // =========================================================

    public long getTotalUsers() {

        return userRepository
                .findAll()
                .stream()
                .filter(user -> {

                    String role =
                            user.getRole() == null
                                    ? ""
                                    : user.getRole()
                                            .trim()
                                            .toUpperCase();

                    return "USER".equals(role);

                })
                .count();
    }


    // =========================================================
    // GET TOTAL ADMINS
    //
    // GET /admin/admins/count
    // =========================================================

    public long getTotalAdmins() {

        return userRepository
                .findAll()
                .stream()
                .filter(user -> {

                    String role =
                            user.getRole() == null
                                    ? ""
                                    : user.getRole()
                                            .trim()
                                            .toUpperCase();

                    return "ADMIN".equals(role);

                })
                .count();
    }


    // =========================================================
    // DELETE USER
    //
    // DELETE /admin/users/{id}
    //
    // ADMIN accounts cannot be deleted
    // using this endpoint.
    // =========================================================

    @Transactional
    public void deleteUser(Long id) {

        // -----------------------------------------------------
        // VALIDATE ID
        // -----------------------------------------------------

        if (id == null || id <= 0) {

            throw new RuntimeException(
                    "Valid user ID is required."
            );
        }


        // -----------------------------------------------------
        // FIND USER
        // -----------------------------------------------------

        User user =
                userRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found with ID: "
                                                + id
                                )
                        );


        // -----------------------------------------------------
        // CHECK ROLE
        // -----------------------------------------------------

        String role =
                user.getRole() == null
                        ? ""
                        : user.getRole()
                                .trim()
                                .toUpperCase();


        // -----------------------------------------------------
        // PREVENT ADMIN DELETION
        // -----------------------------------------------------

        if ("ADMIN".equals(role)) {

            throw new RuntimeException(
                    "Administrator accounts cannot be deleted."
            );
        }


        // -----------------------------------------------------
        // DELETE NORMAL USER
        // -----------------------------------------------------

        userRepository.delete(user);
    }


    // =========================================================
    // CHANGE USER ROLE
    //
    // PUT /admin/users/{id}/role
    //
    // Allowed:
    //
    // USER
    // ADMIN
    // =========================================================

    @Transactional
    public User changeUserRole(
            Long id,
            String role) {

        // -----------------------------------------------------
        // VALIDATE ID
        // -----------------------------------------------------

        if (id == null || id <= 0) {

            throw new RuntimeException(
                    "Valid user ID is required."
            );
        }


        // -----------------------------------------------------
        // VALIDATE ROLE
        // -----------------------------------------------------

        if (role == null
                || role.trim().isEmpty()) {

            throw new RuntimeException(
                    "Role is required."
            );
        }


        // -----------------------------------------------------
        // CLEAN ROLE
        // -----------------------------------------------------

        String cleanRole =
                role.trim().toUpperCase();


        // -----------------------------------------------------
        // ONLY USER AND ADMIN ARE ALLOWED
        // -----------------------------------------------------

        if (!"USER".equals(cleanRole)
                && !"ADMIN".equals(cleanRole)) {

            throw new RuntimeException(
                    "Invalid role. Use USER or ADMIN."
            );
        }


        // -----------------------------------------------------
        // FIND USER
        // -----------------------------------------------------

        User user =
                userRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found with ID: "
                                                + id
                                )
                        );


        // -----------------------------------------------------
        // PREVENT UNNECESSARY UPDATE
        // -----------------------------------------------------

        String currentRole =
                user.getRole() == null
                        ? ""
                        : user.getRole()
                                .trim()
                                .toUpperCase();


        if (cleanRole.equals(currentRole)) {

            return user;
        }


        // -----------------------------------------------------
        // UPDATE ROLE
        // -----------------------------------------------------

        user.setRole(cleanRole);


        // -----------------------------------------------------
        // SAVE USER
        // -----------------------------------------------------

        return userRepository.save(user);
    }
}
