package com.ticketbooking.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {


    // =========================================================
    // RUNTIME EXCEPTION
    // =========================================================
    //
    // Handles validation errors thrown from services.
    //
    // Example:
    //
    // "User email is required."
    // "User not found with ID: 5"
    // "A user with this email already exists."
    //
    // =========================================================

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException exception) {

        String message =
                exception.getMessage();

        if (message == null
                || message.trim().isEmpty()) {

            message =
                    "An unexpected error occurred.";
        }


        String lowerMessage =
                message.toLowerCase();


        // =====================================================
        // USER NOT FOUND
        // =====================================================

        if (lowerMessage.contains("not found")) {

            return createResponse(
                    HttpStatus.NOT_FOUND,
                    message
            );
        }


        // =====================================================
        // DUPLICATE EMAIL
        // =====================================================

        if (lowerMessage.contains("already exists")
                || lowerMessage.contains("duplicate")) {

            return createResponse(
                    HttpStatus.CONFLICT,
                    message
            );
        }


        // =====================================================
        // INVALID LOGIN
        // =====================================================

        if (lowerMessage.contains("invalid email")
                || lowerMessage.contains("invalid password")
                || lowerMessage.contains("invalid admin")) {

            return createResponse(
                    HttpStatus.UNAUTHORIZED,
                    message
            );
        }


        // =====================================================
        // ACCESS DENIED
        // =====================================================

        if (lowerMessage.contains("access denied")
                || lowerMessage.contains("administrator accounts")) {

            return createResponse(
                    HttpStatus.FORBIDDEN,
                    message
            );
        }


        // =====================================================
        // DEFAULT BAD REQUEST
        // =====================================================

        return createResponse(
                HttpStatus.BAD_REQUEST,
                message
        );
    }


    // =========================================================
    // DATABASE CONSTRAINT VIOLATION
    // =========================================================
    //
    // This is VERY IMPORTANT for duplicate email.
    //
    // Even if UserService checks:
    //
    // existsByEmail(email)
    //
    // the database can still throw:
    //
    // DataIntegrityViolationException
    //
    // when two requests happen at almost the same time.
    //
    // =========================================================

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>>
    handleDataIntegrityViolation(
            DataIntegrityViolationException exception) {

        String message =
                "This email address is already registered.";


        return createResponse(
                HttpStatus.CONFLICT,
                message
        );
    }


    // =========================================================
    // ILLEGAL ARGUMENT EXCEPTION
    // =========================================================

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>>
    handleIllegalArgumentException(
            IllegalArgumentException exception) {

        String message =
                exception.getMessage();


        if (message == null
                || message.trim().isEmpty()) {

            message =
                    "Invalid request.";
        }


        return createResponse(
                HttpStatus.BAD_REQUEST,
                message
        );
    }


    // =========================================================
    // GENERAL EXCEPTION
    // =========================================================
    //
    // Last safety net.
    //
    // If an unexpected error occurs anywhere in the backend,
    // the frontend receives JSON instead of a large HTML error
    // page or raw stack trace.
    //
    // =========================================================

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>>
    handleGeneralException(
            Exception exception) {

        exception.printStackTrace();


        return createResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Something went wrong on the server."
        );
    }


    // =========================================================
    // CREATE ERROR RESPONSE
    // =========================================================

    private ResponseEntity<Map<String, Object>>
    createResponse(
            HttpStatus status,
            String message) {

        Map<String, Object> response =
                new HashMap<>();


        response.put(
                "status",
                status.value()
        );


        response.put(
                "error",
                status.getReasonPhrase()
        );


        response.put(
                "message",
                message
        );


        return ResponseEntity
                .status(status)
                .body(response);
    }
}