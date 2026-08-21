package com.ticketbooking.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ticketbooking.entity.User;

@Repository
public interface UserRepository
        extends JpaRepository<User, Long> {


    // =========================================================
    // FIND USER BY EMAIL
    //
    // Used for:
    // 1. Normal user login
    // 2. Admin login
    // 3. Finding user profile
    //
    // Example:
    //
    // userRepository.findByEmail("admin@gmail.com");
    //
    // =========================================================

    Optional<User> findByEmail(String email);


    // =========================================================
    // CHECK EMAIL EXISTS
    //
    // Used before creating a new user.
    //
    // This helps prevent:
    //
    // Duplicate entry for key 'email'
    //
    // =========================================================

    boolean existsByEmail(String email);


    // =========================================================
    // FIND USERS BY ROLE
    //
    // Example:
    //
    // USER
    // ADMIN
    //
    // IgnoreCase means:
    //
    // USER
    // user
    // User
    //
    // are treated the same.
    // =========================================================

    List<User> findByRoleIgnoreCase(String role);


    // =========================================================
    // COUNT USERS BY ROLE
    //
    // Used by Admin Dashboard.
    //
    // Example:
    //
    // countByRoleIgnoreCase("USER");
    //
    // countByRoleIgnoreCase("ADMIN");
    //
    // =========================================================

    long countByRoleIgnoreCase(String role);
}