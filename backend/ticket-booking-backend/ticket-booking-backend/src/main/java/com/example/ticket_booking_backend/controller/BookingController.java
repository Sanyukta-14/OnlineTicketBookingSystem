package com.example.ticket_booking_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.ticket_booking_backend.model.Booking;
import com.example.ticket_booking_backend.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    /* ==========================
       CREATE BOOKING
    ========================== */

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.saveBooking(booking);
    }

    /* ==========================
       GET ALL BOOKINGS (ADMIN)
    ========================== */

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    /* ==========================
       GET BOOKINGS BY USER
    ========================== */

    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUser(
            @PathVariable Long userId) {

        return bookingService.getBookingsByUser(userId);
    }

    /* ==========================
       UPDATE BOOKING
    ========================== */

    @PutMapping("/{id}")
    public Booking updateBooking(
            @PathVariable Long id,
            @RequestBody Booking booking) {

        return bookingService.updateBooking(id, booking);
    }

    /* ==========================
       CANCEL BOOKING
    ========================== */

    @PutMapping("/{id}/cancel")
    public Booking cancelBooking(
            @PathVariable Long id) {

        return bookingService.cancelBooking(id);
    }

    /* ==========================
       DELETE BOOKING
    ========================== */

    @DeleteMapping("/{id}")
    public void deleteBooking(
            @PathVariable Long id) {

        bookingService.deleteBooking(id);
    }

}