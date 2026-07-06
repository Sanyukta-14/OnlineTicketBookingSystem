package com.example.ticket_booking_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.ticket_booking_backend.model.Booking;
import com.example.ticket_booking_backend.model.Event;
import com.example.ticket_booking_backend.repository.BookingRepository;
import com.example.ticket_booking_backend.repository.EventRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EventRepository eventRepository;

    /* ==========================
       CREATE BOOKING
    ========================== */

    public Booking saveBooking(Booking booking) {

        Event event = eventRepository.findById(booking.getEventId())
                .orElseThrow(() ->
                        new RuntimeException("Event not found"));

        // Check seat availability
        if (booking.getNumberOfTickets() > event.getAvailableSeats()) {
            throw new RuntimeException("Not enough seats available.");
        }

        // Calculate Total Amount
        booking.setTotalAmount(
                booking.getNumberOfTickets() * event.getTicketPrice()
        );

        // Reduce Available Seats
        event.setAvailableSeats(
                event.getAvailableSeats() - booking.getNumberOfTickets()
        );

        eventRepository.save(event);

        // Default Status
        if (booking.getStatus() == null || booking.getStatus().isBlank()) {
            booking.setStatus("CONFIRMED");
        }

        return bookingRepository.save(booking);
    }

    /* ==========================
       GET ALL BOOKINGS (ADMIN)
    ========================== */

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    /* ==========================
       GET BOOKINGS BY USER
    ========================== */

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    /* ==========================
       DELETE BOOKING
    ========================== */

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    /* ==========================
       UPDATE BOOKING
    ========================== */

    public Booking updateBooking(Long id, Booking updatedBooking) {

        Booking existingBooking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        existingBooking.setUserId(updatedBooking.getUserId());
        existingBooking.setEventId(updatedBooking.getEventId());
        existingBooking.setNumberOfTickets(updatedBooking.getNumberOfTickets());
        existingBooking.setTotalAmount(updatedBooking.getTotalAmount());
        existingBooking.setStatus(updatedBooking.getStatus());

        return bookingRepository.save(existingBooking);
    }

    /* ==========================
       CANCEL BOOKING
    ========================== */

    public Booking cancelBooking(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Booking not found"));

        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            return booking;
        }

        Event event = eventRepository.findById(booking.getEventId())
                .orElseThrow(() ->
                        new RuntimeException("Event not found"));

        // Restore Seats
        event.setAvailableSeats(
                event.getAvailableSeats() + booking.getNumberOfTickets()
        );

        eventRepository.save(event);

        booking.setStatus("CANCELLED");

        return bookingRepository.save(booking);
    }
}