package com.ticketbooking.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.ticketbooking.entity.User;
import com.ticketbooking.repository.UserRepository;

@Configuration
public class AdminInitializer {

    // =========================================================
    // ADMIN DETAILS
    // =========================================================
    //
    // This admin account will be created automatically
    // when the Spring Boot application starts.
    //
    // IMPORTANT:
    // Change these values if you want your own admin account.
    // =========================================================

    private static final String ADMIN_NAME = "Administrator";

    private static final String ADMIN_EMAIL =
            "admin@ticketbook.com";

    private static final String ADMIN_PHONE =
            "9999999999";

    private static final String ADMIN_PASSWORD =
            "admin123";


    // =========================================================
    // CREATE ADMIN WHEN APPLICATION STARTS
    // =========================================================

    @Bean
    CommandLineRunner createAdmin(
            UserRepository userRepository) {

        return args -> {

            // -------------------------------------------------
            // CHECK WHETHER ADMIN ALREADY EXISTS
            // -------------------------------------------------

            if (userRepository
                    .findByEmail(ADMIN_EMAIL)
                    .isPresent()) {

                User existingAdmin =
                        userRepository
                                .findByEmail(ADMIN_EMAIL)
                                .get();

                // ---------------------------------------------
                // MAKE SURE EXISTING ACCOUNT IS ADMIN
                // ---------------------------------------------

                if (!"ADMIN".equalsIgnoreCase(
                        existingAdmin.getRole())) {

                    existingAdmin.setRole("ADMIN");

                    userRepository.save(existingAdmin);

                    System.out.println(
                            "Existing admin account updated."
                    );

                } else {

                    System.out.println(
                            "Admin account already exists."
                    );
                }

                return;
            }


            // =================================================
            // CREATE NEW ADMIN
            // =================================================

            User admin = new User();

            admin.setName(ADMIN_NAME);

            admin.setEmail(ADMIN_EMAIL);

            admin.setPhone(ADMIN_PHONE);

            admin.setPassword(ADMIN_PASSWORD);

            admin.setRole("ADMIN");


            // =================================================
            // SAVE ADMIN
            // =================================================

            userRepository.save(admin);


            // =================================================
            // CONSOLE MESSAGE
            // =================================================

            System.out.println(
                    "=========================================="
            );

            System.out.println(
                    "ADMIN ACCOUNT CREATED SUCCESSFULLY"
            );

            System.out.println(
                    "Email: " + ADMIN_EMAIL
            );

            System.out.println(
                    "Password: " + ADMIN_PASSWORD
            );

            System.out.println(
                    "Role: ADMIN"
            );

            System.out.println(
                    "=========================================="
            );
        };
    }
}