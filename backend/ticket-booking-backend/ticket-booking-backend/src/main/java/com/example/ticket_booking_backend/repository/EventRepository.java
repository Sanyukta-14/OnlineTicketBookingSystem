package com.example.ticket_booking_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.ticket_booking_backend.model.Event;

public interface EventRepository extends JpaRepository<Event, Long> {

}