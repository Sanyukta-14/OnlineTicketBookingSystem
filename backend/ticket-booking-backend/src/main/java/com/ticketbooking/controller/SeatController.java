package com.ticketbooking.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ticketbooking.entity.Seat;
import com.ticketbooking.service.SeatService;

@RestController
@RequestMapping("/seats")
@CrossOrigin(origins = "http://localhost:5173")
public class SeatController {

    private final SeatService seatService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }


    // =========================================================
    // GET SEATS FOR EVENT
    // =========================================================
    //
    // GET:
    // http://localhost:8080/seats/event/1
    //
    // Used by SeatSelection.jsx
    //
    // =========================================================

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Seat>> getSeatsByEvent(
            @PathVariable Long eventId) {

        if (eventId == null || eventId <= 0) {

            throw new RuntimeException(
                    "Invalid event ID."
            );
        }

        List<Seat> seats =
                seatService.getSeatsByEvent(eventId);

        return ResponseEntity.ok(seats);
    }


    // =========================================================
    // GET SEAT BY ID
    // =========================================================
    //
    // GET:
    // http://localhost:8080/seats/1
    //
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Seat> getSeatById(
            @PathVariable Long id) {

        if (id == null || id <= 0) {

            throw new RuntimeException(
                    "Invalid seat ID."
            );
        }

        Seat seat =
                seatService.getSeatById(id);

        return ResponseEntity.ok(seat);
    }


    // =========================================================
    // GENERATE SEATS FOR EVENT
    // =========================================================
    //
    // POST:
    // http://localhost:8080/seats/generate/1
    //
    // Creates:
    //
    // A1 A2 A3 A4 A5
    // B1 B2 B3 B4 B5
    // C1 C2 C3 C4 C5
    // D1 D2 D3 D4 D5
    // E1 E2 E3 E4 E5
    //
    // =========================================================

    @PostMapping("/generate/{eventId}")
    public ResponseEntity<List<Seat>> generateSeats(
            @PathVariable Long eventId) {

        if (eventId == null || eventId <= 0) {

            throw new RuntimeException(
                    "Invalid event ID."
            );
        }

        List<Seat> seats =
                seatService.generateSeatsForEvent(
                        eventId
                );

        return ResponseEntity.ok(seats);
    }


    // =========================================================
    // BOOK SEATS
    // =========================================================
    //
    // POST:
    // http://localhost:8080/seats/book
    //
    // Request body:
    //
    // [
    //     1,
    //     2,
    //     3
    // ]
    //
    // =========================================================

    @PostMapping("/book")
    public ResponseEntity<String> bookSeats(
            @RequestBody List<Long> seatIds) {

        if (seatIds == null || seatIds.isEmpty()) {

            throw new RuntimeException(
                    "No seats selected."
            );
        }

        seatService.bookSeats(seatIds);

        return ResponseEntity.ok(
                "Seats booked successfully."
        );
    }


    // =========================================================
    // RELEASE SEATS
    // =========================================================
    //
    // POST:
    // http://localhost:8080/seats/release
    //
    // Request body:
    //
    // [
    //     1,
    //     2,
    //     3
    // ]
    //
    // =========================================================

    @PostMapping("/release")
    public ResponseEntity<String> releaseSeats(
            @RequestBody List<Long> seatIds) {

        if (seatIds == null || seatIds.isEmpty()) {

            return ResponseEntity.ok(
                    "No seats to release."
            );
        }

        seatService.releaseSeats(seatIds);

        return ResponseEntity.ok(
                "Seats released successfully."
        );
    }


    // =========================================================
    // DELETE ALL SEATS FOR EVENT
    // =========================================================
    //
    // DELETE:
    // http://localhost:8080/seats/event/1
    //
    // Normally EventService handles this automatically
    // when an event is deleted.
    //
    // =========================================================

    @DeleteMapping("/event/{eventId}")
    public ResponseEntity<String> deleteSeatsForEvent(
            @PathVariable Long eventId) {

        if (eventId == null || eventId <= 0) {

            throw new RuntimeException(
                    "Invalid event ID."
            );
        }

        seatService.deleteSeatsForEvent(eventId);

        return ResponseEntity.ok(
                "Seats deleted successfully."
        );
    }
}
