package com.ticketbooking.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.ticketbooking.entity.Booking;
import com.ticketbooking.service.BookingService;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // =========================================================
    // CREATE BOOKING
    // =========================================================

    @PostMapping
    public Booking createBooking(
            @RequestParam Long userId,
            @RequestParam Long eventId,
            @RequestBody List<Long> seatIds) {

        return bookingService.createBooking(
                userId,
                eventId,
                seatIds
        );
    }

    // =========================================================
    // GET ALL BOOKINGS
    // =========================================================

    @GetMapping
    public List<Booking> getAllBookings() {

        return bookingService.getAllBookings();
    }

    // =========================================================
    // GET BOOKING BY ID
    // =========================================================

    @GetMapping("/{id}")
    public Booking getBookingById(
            @PathVariable Long id) {

        return bookingService.getBookingById(id);
    }

    // =========================================================
    // GET BOOKINGS BY USER
    //
    // Example:
    // GET http://localhost:8080/bookings/user/1
    // =========================================================

    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUser(
            @PathVariable Long userId) {

        return bookingService.getBookingsByUser(userId);
    }

    // =========================================================
    // GET BOOKINGS BY EVENT
    //
    // Example:
    // GET http://localhost:8080/bookings/event/1
    // =========================================================

    @GetMapping("/event/{eventId}")
    public List<Booking> getBookingsByEvent(
            @PathVariable Long eventId) {

        return bookingService.getBookingsByEvent(eventId);
    }

    // =========================================================
    // CANCEL BOOKING
    //
    // Example:
    // PUT http://localhost:8080/bookings/1/cancel
    // =========================================================

    @PutMapping("/{id}/cancel")
    public Booking cancelBooking(
            @PathVariable Long id) {

        return bookingService.cancelBooking(id);
    }
}
