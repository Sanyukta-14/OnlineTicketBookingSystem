package com.ticketbooking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ticketbooking.entity.Seat;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

    // Get all seats for a particular event
    List<Seat> findByEventId(Long eventId);

    // Count seats for a particular event
    long countByEventId(Long eventId);
}