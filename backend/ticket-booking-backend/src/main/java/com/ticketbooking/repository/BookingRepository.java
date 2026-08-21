package com.ticketbooking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ticketbooking.entity.Booking;

@Repository
public interface BookingRepository
        extends JpaRepository<Booking, Long> {

    // =========================================================
    // GET BOOKINGS BY USER
    // =========================================================

    List<Booking> findByUser_Id(Long userId);


    // =========================================================
    // GET BOOKINGS BY EVENT
    // =========================================================

    List<Booking> findByEvent_Id(Long eventId);
}