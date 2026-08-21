package com.ticketbooking.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ticketbooking.entity.Event;
import com.ticketbooking.entity.Seat;
import com.ticketbooking.repository.EventRepository;
import com.ticketbooking.repository.SeatRepository;

@Service
public class SeatService {

    private final SeatRepository seatRepository;
    private final EventRepository eventRepository;

    public SeatService(
            SeatRepository seatRepository,
            EventRepository eventRepository) {

        this.seatRepository = seatRepository;
        this.eventRepository = eventRepository;
    }


    // =========================================================
    // GENERATE 25 SEATS FOR EVENT
    // =========================================================

    @Transactional
    public List<Seat> generateSeatsForEvent(Long eventId) {

        if (eventId == null || eventId <= 0) {

            throw new RuntimeException(
                    "Invalid event ID.");
        }


        // -----------------------------------------------------
        // FIND EVENT
        // -----------------------------------------------------

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Event not found with ID: " + eventId));


        // -----------------------------------------------------
        // CHECK EXISTING SEATS
        // -----------------------------------------------------

        List<Seat> existingSeats =
                seatRepository.findByEventId(eventId);


        // -----------------------------------------------------
        // PREVENT DUPLICATE SEATS
        // -----------------------------------------------------

        if (!existingSeats.isEmpty()) {

            return existingSeats;
        }


        // -----------------------------------------------------
        // CREATE SEATS
        // -----------------------------------------------------

        List<Seat> seats = new ArrayList<>();

        String[] rows = {
                "A",
                "B",
                "C",
                "D",
                "E"
        };


        // 5 rows × 5 seats = 25 seats

        for (String row : rows) {

            for (int number = 1; number <= 5; number++) {

                Seat seat = new Seat();

                seat.setSeatNumber(
                        row + number
                );

                seat.setStatus(
                        "AVAILABLE"
                );

                seat.setEvent(event);

                seats.add(seat);
            }
        }


        // -----------------------------------------------------
        // SAVE ALL SEATS
        // -----------------------------------------------------

        return seatRepository.saveAll(seats);
    }


    // =========================================================
    // GET SEATS FOR EVENT
    // =========================================================

    @Transactional
    public List<Seat> getSeatsByEvent(Long eventId) {

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
        // GET EXISTING SEATS
        // -----------------------------------------------------

        List<Seat> seats =
                seatRepository.findByEventId(eventId);


        // -----------------------------------------------------
        // GENERATE SEATS IF NONE EXIST
        // -----------------------------------------------------

        if (seats.isEmpty()) {

            seats = generateSeatsForEvent(eventId);
        }


        return seats;
    }


    // =========================================================
    // GET SEAT BY ID
    // =========================================================

    public Seat getSeatById(Long id) {

        if (id == null || id <= 0) {

            throw new RuntimeException(
                    "Invalid seat ID.");
        }


        return seatRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Seat not found with ID: " + id));
    }


    // =========================================================
    // BOOK SELECTED SEATS
    // =========================================================

    @Transactional
    public void bookSeats(List<Long> seatIds) {

        // -----------------------------------------------------
        // VALIDATE SEAT IDS
        // -----------------------------------------------------

        if (seatIds == null || seatIds.isEmpty()) {

            throw new RuntimeException(
                    "No seats selected.");
        }


        // -----------------------------------------------------
        // BOOK EACH SEAT
        // -----------------------------------------------------

        for (Long seatId : seatIds) {

            if (seatId == null || seatId <= 0) {

                throw new RuntimeException(
                        "Invalid seat ID: " + seatId);
            }


            Seat seat = getSeatById(seatId);


            // -------------------------------------------------
            // CHECK SEAT STATUS
            // -------------------------------------------------

            if (seat.getStatus() == null) {

                throw new RuntimeException(
                        "Seat " +
                        seat.getSeatNumber() +
                        " has an invalid status.");
            }


            // -------------------------------------------------
            // CHECK AVAILABILITY
            // -------------------------------------------------

            if (!"AVAILABLE".equalsIgnoreCase(
                    seat.getStatus())) {

                throw new RuntimeException(
                        "Seat " +
                        seat.getSeatNumber() +
                        " is already booked.");
            }


            // -------------------------------------------------
            // CHANGE STATUS
            // -------------------------------------------------

            seat.setStatus("BOOKED");

            seatRepository.save(seat);
        }
    }


    // =========================================================
    // RELEASE SEATS
    // =========================================================

    @Transactional
    public void releaseSeats(List<Long> seatIds) {

        // -----------------------------------------------------
        // NOTHING TO RELEASE
        // -----------------------------------------------------

        if (seatIds == null || seatIds.isEmpty()) {

            return;
        }


        // -----------------------------------------------------
        // RELEASE EACH SEAT
        // -----------------------------------------------------

        for (Long seatId : seatIds) {

            if (seatId == null || seatId <= 0) {

                continue;
            }


            Seat seat = getSeatById(seatId);


            // -------------------------------------------------
            // CHANGE STATUS
            // -------------------------------------------------

            seat.setStatus("AVAILABLE");

            seatRepository.save(seat);
        }
    }


    // =========================================================
    // DELETE SEATS FOR EVENT
    // =========================================================

    @Transactional
    public void deleteSeatsForEvent(Long eventId) {

        if (eventId == null || eventId <= 0) {

            throw new RuntimeException(
                    "Invalid event ID.");
        }


        // -----------------------------------------------------
        // FIND EVENT
        // -----------------------------------------------------

        eventRepository.findById(eventId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Event not found with ID: " + eventId));


        // -----------------------------------------------------
        // FIND EVENT SEATS
        // -----------------------------------------------------

        List<Seat> seats =
                seatRepository.findByEventId(eventId);


        // -----------------------------------------------------
        // DELETE SEATS
        // -----------------------------------------------------

        if (!seats.isEmpty()) {

            seatRepository.deleteAll(seats);
        }
    }
}