package com.ticketbooking.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    // =========================================================
    // PRIMARY KEY
    // =========================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =========================================================
    // USER NAME
    // =========================================================

    @Column(nullable = false)
    private String name;


    // =========================================================
    // EMAIL
    // =========================================================

    @Column(nullable = false, unique = true)
    private String email;


    // =========================================================
    // PHONE
    // =========================================================

    @Column(nullable = false)
    private String phone;


    // =========================================================
    // PASSWORD
    // =========================================================
    //
    // WRITE_ONLY means:
    //
    // React can SEND the password.
    // Backend can READ the password.
    // Password will NOT be returned in JSON responses.
    //
    // =========================================================

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;


    // =========================================================
    // ROLE
    // =========================================================
    //
    // USER  = normal customer
    // ADMIN = administrator
    //
    // Every newly created User object starts as USER.
    //
    // IMPORTANT:
    // UserService.createUser() also explicitly sets USER.
    // Therefore the frontend cannot make itself ADMIN by
    // sending "role": "ADMIN".
    //
    // =========================================================

    @Column(nullable = false)
    private String role = "USER";


    // =========================================================
    // DEFAULT CONSTRUCTOR
    // =========================================================
    //
    // Required by JPA.
    //
    // =========================================================

    public User() {
    }


    // =========================================================
    // PARAMETERIZED CONSTRUCTOR
    // =========================================================

    public User(
            String name,
            String email,
            String phone,
            String password,
            String role) {

        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;

        // -----------------------------------------------------
        // ROLE PROTECTION
        // -----------------------------------------------------
        //
        // If no role is supplied, create a normal USER.
        //
        // -----------------------------------------------------

        if (role == null
                || role.trim().isEmpty()) {

            this.role = "USER";

        } else {

            this.role =
                    role.trim().toUpperCase();
        }
    }


    // =========================================================
    // GET ID
    // =========================================================

    public Long getId() {

        return id;
    }


    // =========================================================
    // SET ID
    // =========================================================

    public void setId(Long id) {

        this.id = id;
    }


    // =========================================================
    // GET NAME
    // =========================================================

    public String getName() {

        return name;
    }


    // =========================================================
    // SET NAME
    // =========================================================

    public void setName(String name) {

        this.name = name;
    }


    // =========================================================
    // GET EMAIL
    // =========================================================

    public String getEmail() {

        return email;
    }


    // =========================================================
    // SET EMAIL
    // =========================================================

    public void setEmail(String email) {

        this.email = email;
    }


    // =========================================================
    // GET PHONE
    // =========================================================

    public String getPhone() {

        return phone;
    }


    // =========================================================
    // SET PHONE
    // =========================================================

    public void setPhone(String phone) {

        this.phone = phone;
    }


    // =========================================================
    // GET PASSWORD
    // =========================================================

    public String getPassword() {

        return password;
    }


    // =========================================================
    // SET PASSWORD
    // =========================================================

    public void setPassword(String password) {

        this.password = password;
    }


    // =========================================================
    // GET ROLE
    // =========================================================

    public String getRole() {

        return role;
    }


    // =========================================================
    // SET ROLE
    // =========================================================

    public void setRole(String role) {

        if (role == null
                || role.trim().isEmpty()) {

            this.role = "USER";

        } else {

            this.role =
                    role.trim().toUpperCase();
        }
    }


    // =========================================================
    // TO STRING
    // =========================================================
    //
    // Password intentionally excluded.
    //
    // =========================================================

    @Override
    public String toString() {

        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
}