package com.ticketbooking.service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ticketbooking.entity.Booking;
import com.ticketbooking.entity.Event;
import com.ticketbooking.entity.Seat;
import com.ticketbooking.entity.User;
import com.ticketbooking.repository.BookingRepository;
import com.ticketbooking.repository.EventRepository;
import com.ticketbooking.repository.SeatRepository;
import com.ticketbooking.repository.UserRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final SeatRepository seatRepository;
    private final SeatService seatService;

    public BookingService(
            BookingRepository bookingRepository,
            UserRepository userRepository,
            EventRepository eventRepository,
            SeatRepository seatRepository,
            SeatService seatService) {

        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.seatRepository = seatRepository;
        this.seatService = seatService;
    }

    // =========================================================
    // CREATE BOOKING
    // =========================================================

    @Transactional
    public Booking createBooking(
            Long userId,
            Long eventId,
            List<Long> seatIds) {

        // -----------------------------------------------------
        // 1. VALIDATE USER ID
        // -----------------------------------------------------

        if (userId == null || userId <= 0) {
            throw new RuntimeException("Invalid user ID.");
        }

        // -----------------------------------------------------
        // 2. VALIDATE EVENT ID
        // -----------------------------------------------------

        if (eventId == null || eventId <= 0) {
            throw new RuntimeException("Invalid event ID.");
        }

        // -----------------------------------------------------
        // 3. VALIDATE SEATS
        // -----------------------------------------------------

        if (seatIds == null || seatIds.isEmpty()) {
            throw new RuntimeException(
                    "Please select at least one seat.");
        }

        // -----------------------------------------------------
        // 4. REMOVE/REJECT DUPLICATE SEAT IDS
        // -----------------------------------------------------

        Set<Long> uniqueSeatIds = new HashSet<>(seatIds);

        if (uniqueSeatIds.size() != seatIds.size()) {
            throw new RuntimeException(
                    "Duplicate seats are not allowed.");
        }

        // -----------------------------------------------------
        // 5. VALIDATE EACH SEAT ID
        // -----------------------------------------------------

        for (Long seatId : seatIds) {

            if (seatId == null || seatId <= 0) {
                throw new RuntimeException(
                        "Invalid seat ID: " + seatId);
            }
        }

        // -----------------------------------------------------
        // 6. FIND USER
        // -----------------------------------------------------

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with ID: " + userId));

        // -----------------------------------------------------
        // 7. FIND EVENT
        // -----------------------------------------------------

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Event not found with ID: " + eventId));

        // -----------------------------------------------------
        // 8. FIND SELECTED SEATS
        // -----------------------------------------------------

        List<Seat> seats =
                seatRepository.findAllById(seatIds);

        // -----------------------------------------------------
        // 9. MAKE SURE ALL SEATS EXIST
        // -----------------------------------------------------

        if (seats.size() != seatIds.size()) {
            throw new RuntimeException(
                    "One or more selected seats were not found.");
        }

        // -----------------------------------------------------
        // 10. VALIDATE EACH SEAT
        // -----------------------------------------------------

        for (Seat seat : seats) {

            // -------------------------------------------------
            // CHECK SEAT EVENT
            // -------------------------------------------------

            if (seat.getEvent() == null ||
                    seat.getEvent().getId() == null) {

                throw new RuntimeException(
                        "Seat " +
                        seat.getSeatNumber() +
                        " is not assigned to an event.");
            }

            // -------------------------------------------------
            // CHECK SEAT BELONGS TO EVENT
            // -------------------------------------------------

            if (!seat.getEvent()
                    .getId()
                    .equals(eventId)) {

                throw new RuntimeException(
                        "Seat " +
                        seat.getSeatNumber() +
                        " does not belong to this event.");
            }

            // -------------------------------------------------
            // CHECK SEAT STATUS
            // -------------------------------------------------

            if (seat.getStatus() == null ||
                    !"AVAILABLE".equalsIgnoreCase(
                            seat.getStatus())) {

                throw new RuntimeException(
                        "Seat " +
                        seat.getSeatNumber() +
                        " is already booked.");
            }
        }

        // -----------------------------------------------------
        // 11. CALCULATE TOTAL AMOUNT
        // -----------------------------------------------------

        double ticketPrice = event.getTicketPrice();

        double totalAmount =
                ticketPrice * seats.size();

        // -----------------------------------------------------
        // 12. BOOK SELECTED SEATS
        // -----------------------------------------------------

        seatService.bookSeats(seatIds);

        // -----------------------------------------------------
        // 13. CREATE BOOKING
        // -----------------------------------------------------

        Booking booking = new Booking();

        booking.setUser(user);

        booking.setEvent(event);

        booking.setSeats(seats);

        booking.setTotalAmount(totalAmount);

        booking.setBookingDate(
                LocalDateTime.now()
        );

        booking.setStatus("CONFIRMED");

        // -----------------------------------------------------
        // 14. SAVE BOOKING
        // -----------------------------------------------------

        return bookingRepository.save(booking);
    }

    // =========================================================
    // GET ALL BOOKINGS
    // =========================================================

    public List<Booking> getAllBookings() {

        return bookingRepository.findAll();
    }

    // =========================================================
    // GET BOOKING BY ID
    // =========================================================

    public Booking getBookingById(Long id) {

        if (id == null || id <= 0) {

            throw new RuntimeException(
                    "Invalid booking ID.");
        }

        return bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found with ID: " + id));
    }

    // =========================================================
    // CANCEL BOOKING
    // =========================================================

    @Transactional
    public Booking cancelBooking(Long id) {

        // -----------------------------------------------------
        // 1. FIND BOOKING
        // -----------------------------------------------------

        Booking booking =
                getBookingById(id);

        // -----------------------------------------------------
        // 2. CHECK BOOKING STATUS
        // -----------------------------------------------------

        if ("CANCELLED".equalsIgnoreCase(
                booking.getStatus())) {

            throw new RuntimeException(
                    "Booking is already cancelled.");
        }

        // -----------------------------------------------------
        // 3. RELEASE SEATS
        // -----------------------------------------------------

        if (booking.getSeats() != null &&
                !booking.getSeats().isEmpty()) {

            List<Long> seatIds =
                    booking.getSeats()
                            .stream()
                            .map(Seat::getId)
                            .toList();

            seatService.releaseSeats(seatIds);
        }

        // -----------------------------------------------------
        // 4. CHANGE BOOKING STATUS
        // -----------------------------------------------------

        booking.setStatus("CANCELLED");

        // -----------------------------------------------------
        // 5. SAVE UPDATED BOOKING
        // -----------------------------------------------------

        return bookingRepository.save(booking);
    }

    // =========================================================
    // GET BOOKINGS BY USER
    // =========================================================

    public List<Booking> getBookingsByUser(
            Long userId) {

        // -----------------------------------------------------
        // VALIDATE USER ID
        // -----------------------------------------------------

        if (userId == null || userId <= 0) {

            throw new RuntimeException(
                    "Invalid user ID.");
        }

        // -----------------------------------------------------
        // CHECK USER EXISTS
        // -----------------------------------------------------

        userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with ID: " + userId));

        // -----------------------------------------------------
        // GET USER BOOKINGS
        // -----------------------------------------------------

        return bookingRepository.findByUser_Id(userId);
    }

    // =========================================================
    // GET BOOKINGS BY EVENT
    // =========================================================

    public List<Booking> getBookingsByEvent(
            Long eventId) {

        // -----------------------------------------------------
        // VALIDATE EVENT ID
        // -----------------------------------------------------

        if (eventId == null || eventId <= 0) {

            throw new RuntimeException(
                    "Invalid event ID.");
        }

        // -----------------------------------------------------
        // CHECK EVENT EXISTS
        // -----------------------------------------------------

        eventRepository.findById(eventId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Event not found with ID: " + eventId));

        // -----------------------------------------------------
        // GET EVENT BOOKINGS
        // -----------------------------------------------------

        return bookingRepository.findByEvent_Id(eventId);
    }
}
