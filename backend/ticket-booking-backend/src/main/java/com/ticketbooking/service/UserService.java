package com.ticketbooking.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ticketbooking.entity.User;
import com.ticketbooking.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    // =========================================================
    // CREATE USER / REGISTER
    //
    // POST /users
    // =========================================================

    @Transactional
    public User createUser(User user) {

        // -----------------------------------------------------
        // CHECK USER OBJECT
        // -----------------------------------------------------

        if (user == null) {

            throw new RuntimeException(
                    "User information is required."
            );
        }


        // -----------------------------------------------------
        // VALIDATE NAME
        // -----------------------------------------------------

        if (user.getName() == null
                || user.getName().trim().isEmpty()) {

            throw new RuntimeException(
                    "User name is required."
            );
        }


        // -----------------------------------------------------
        // VALIDATE EMAIL
        // -----------------------------------------------------

        if (user.getEmail() == null
                || user.getEmail().trim().isEmpty()) {

            throw new RuntimeException(
                    "User email is required."
            );
        }


        // -----------------------------------------------------
        // VALIDATE PHONE
        // -----------------------------------------------------

        if (user.getPhone() == null
                || user.getPhone().trim().isEmpty()) {

            throw new RuntimeException(
                    "User phone number is required."
            );
        }


        // -----------------------------------------------------
        // VALIDATE PASSWORD
        // -----------------------------------------------------

        if (user.getPassword() == null
                || user.getPassword().trim().isEmpty()) {

            throw new RuntimeException(
                    "User password is required."
            );
        }


        if (user.getPassword().trim().length() < 4) {

            throw new RuntimeException(
                    "Password must contain at least 4 characters."
            );
        }


        // -----------------------------------------------------
        // CLEAN USER DATA
        // -----------------------------------------------------

        String cleanName =
                user.getName().trim();

        String cleanEmail =
                user.getEmail()
                        .trim()
                        .toLowerCase();

        String cleanPhone =
                user.getPhone().trim();

        String cleanPassword =
                user.getPassword().trim();


        // -----------------------------------------------------
        // CHECK DUPLICATE EMAIL
        // -----------------------------------------------------

        if (userRepository.existsByEmail(cleanEmail)) {

            throw new RuntimeException(
                    "A user with this email already exists."
            );
        }


        // -----------------------------------------------------
        // SET CLEAN VALUES
        // -----------------------------------------------------

        user.setName(cleanName);

        user.setEmail(cleanEmail);

        user.setPhone(cleanPhone);

        user.setPassword(cleanPassword);


        // =====================================================
        // IMPORTANT ROLE SECURITY
        // =====================================================
        //
        // Normal registration can ONLY create USER accounts.
        //
        // Even if React sends:
        //
        // "role": "ADMIN"
        //
        // the backend ignores it and saves:
        //
        // role = USER
        //
        // Admin accounts are handled separately.
        // =====================================================

        user.setRole("USER");


        // -----------------------------------------------------
        // SAVE USER
        // -----------------------------------------------------

        return userRepository.save(user);
    }


    // =========================================================
    // LOGIN
    //
    // POST /users/login
    // =========================================================

    public User login(
            String email,
            String password) {

        // -----------------------------------------------------
        // VALIDATE EMAIL
        // -----------------------------------------------------

        if (email == null
                || email.trim().isEmpty()) {

            throw new RuntimeException(
                    "Email is required."
            );
        }


        // -----------------------------------------------------
        // VALIDATE PASSWORD
        // -----------------------------------------------------

        if (password == null
                || password.trim().isEmpty()) {

            throw new RuntimeException(
                    "Password is required."
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
        // FIND USER
        // -----------------------------------------------------

        User user =
                userRepository
                        .findByEmail(cleanEmail)
                        .orElse(null);


        // -----------------------------------------------------
        // USER NOT FOUND
        // -----------------------------------------------------

        if (user == null) {

            throw new RuntimeException(
                    "Invalid email or password."
            );
        }


        // -----------------------------------------------------
        // CHECK STORED PASSWORD
        // -----------------------------------------------------

        if (user.getPassword() == null
                || user.getPassword().trim().isEmpty()) {

            throw new RuntimeException(
                    "Password is not set for this user."
            );
        }


        // -----------------------------------------------------
        // CHECK PASSWORD
        // -----------------------------------------------------

        if (!cleanPassword.equals(
                user.getPassword().trim())) {

            throw new RuntimeException(
                    "Invalid email or password."
            );
        }


        // =====================================================
        // HANDLE OLD USERS
        // =====================================================
        //
        // If an older user was created before the role field
        // was introduced, assign USER automatically.
        // =====================================================

        if (user.getRole() == null
                || user.getRole().trim().isEmpty()) {

            user.setRole("USER");
        }


        // -----------------------------------------------------
        // CLEAN ROLE
        // -----------------------------------------------------

        String cleanRole =
                user.getRole()
                        .trim()
                        .toUpperCase();

        user.setRole(cleanRole);


        // -----------------------------------------------------
        // SAVE ROLE IF IT WAS UPDATED
        // -----------------------------------------------------

        user = userRepository.save(user);


        // -----------------------------------------------------
        // LOGIN SUCCESSFUL
        //
        // Password is hidden from JSON because the User entity
        // uses @JsonProperty(access = WRITE_ONLY).
        // -----------------------------------------------------

        return user;
    }


    // =========================================================
    // GET ALL USERS
    //
    // GET /users
    // =========================================================

    public List<User> getAllUsers() {

        return userRepository.findAll();
    }


    // =========================================================
    // GET USER BY ID
    //
    // GET /users/{id}
    // =========================================================

    public User getUserById(Long id) {

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

        return userRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with ID: "
                                        + id
                        )
                );
    }


    // =========================================================
    // GET USER BY EMAIL
    //
    // GET /users/profile?email=example@gmail.com
    // =========================================================

    public User getUserByEmail(String email) {

        // -----------------------------------------------------
        // VALIDATE EMAIL
        // -----------------------------------------------------

        if (email == null
                || email.trim().isEmpty()) {

            throw new RuntimeException(
                    "Email is required."
            );
        }


        // -----------------------------------------------------
        // CLEAN EMAIL
        // -----------------------------------------------------

        String cleanEmail =
                email.trim().toLowerCase();


        // -----------------------------------------------------
        // FIND USER
        // -----------------------------------------------------

        return userRepository
                .findByEmail(cleanEmail)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with email: "
                                        + cleanEmail
                        )
                );
    }


    // =========================================================
    // UPDATE USER
    //
    // PUT /users/{id}
    // =========================================================

    @Transactional
    public User updateUser(
            Long id,
            User updatedUser) {

        // -----------------------------------------------------
        // CHECK UPDATED USER
        // -----------------------------------------------------

        if (updatedUser == null) {

            throw new RuntimeException(
                    "Updated user information is required."
            );
        }


        // -----------------------------------------------------
        // FIND EXISTING USER
        // -----------------------------------------------------

        User existingUser =
                getUserById(id);


        // -----------------------------------------------------
        // VALIDATE NAME
        // -----------------------------------------------------

        if (updatedUser.getName() == null
                || updatedUser.getName()
                        .trim()
                        .isEmpty()) {

            throw new RuntimeException(
                    "User name is required."
            );
        }


        // -----------------------------------------------------
        // VALIDATE EMAIL
        // -----------------------------------------------------

        if (updatedUser.getEmail() == null
                || updatedUser.getEmail()
                        .trim()
                        .isEmpty()) {

            throw new RuntimeException(
                    "User email is required."
            );
        }


        // -----------------------------------------------------
        // VALIDATE PHONE
        // -----------------------------------------------------

        if (updatedUser.getPhone() == null
                || updatedUser.getPhone()
                        .trim()
                        .isEmpty()) {

            throw new RuntimeException(
                    "User phone number is required."
            );
        }


        // -----------------------------------------------------
        // CLEAN DATA
        // -----------------------------------------------------

        String cleanName =
                updatedUser.getName().trim();

        String cleanEmail =
                updatedUser.getEmail()
                        .trim()
                        .toLowerCase();

        String cleanPhone =
                updatedUser.getPhone().trim();


        // =====================================================
        // CHECK DUPLICATE EMAIL
        // =====================================================
        //
        // Allow the current user to keep their own email.
        //
        // But do not allow them to change it to another
        // user's email.
        // =====================================================

        String existingEmail =
                existingUser.getEmail();

        if (existingEmail == null
                || !cleanEmail.equalsIgnoreCase(
                        existingEmail.trim())) {

            if (userRepository.existsByEmail(cleanEmail)) {

                throw new RuntimeException(
                        "A user with this email already exists."
                );
            }
        }


        // =====================================================
        // UPDATE BASIC DETAILS
        // =====================================================

        existingUser.setName(cleanName);

        existingUser.setEmail(cleanEmail);

        existingUser.setPhone(cleanPhone);


        // =====================================================
        // UPDATE PASSWORD IF PROVIDED
        // =====================================================

        if (updatedUser.getPassword() != null
                && !updatedUser.getPassword()
                        .trim()
                        .isEmpty()) {

            String newPassword =
                    updatedUser.getPassword().trim();


            if (newPassword.length() < 4) {

                throw new RuntimeException(
                        "Password must contain at least 4 characters."
                );
            }


            existingUser.setPassword(
                    newPassword
            );
        }


        // =====================================================
        // ROLE SECURITY
        // =====================================================
        //
        // DO NOT update role from updatedUser.
        //
        // A normal user must not be able to send:
        //
        // "role": "ADMIN"
        //
        // and promote themselves.
        //
        // Admin role changes are handled through:
        //
        // AdminController
        // AdminService
        //
        // =====================================================


        // -----------------------------------------------------
        // SAVE UPDATED USER
        // -----------------------------------------------------

        return userRepository.save(
                existingUser
        );
    }


    // =========================================================
    // DELETE USER
    //
    // DELETE /users/{id}
    // =========================================================

    @Transactional
    public void deleteUser(Long id) {

        // -----------------------------------------------------
        // VALIDATE ID AND CHECK USER
        // -----------------------------------------------------

        User user =
                getUserById(id);


        // =====================================================
        // PREVENT NORMAL USER ENDPOINT FROM DELETING ADMIN
        // =====================================================
        //
        // This adds another safety layer.
        //
        // Admin accounts should be managed separately.
        // =====================================================

        if (user.getRole() != null
                && "ADMIN".equalsIgnoreCase(
                        user.getRole().trim())) {

            throw new RuntimeException(
                    "Administrator accounts cannot be deleted."
            );
        }


        // -----------------------------------------------------
        // DELETE USER
        // -----------------------------------------------------

        userRepository.delete(user);
    }
}