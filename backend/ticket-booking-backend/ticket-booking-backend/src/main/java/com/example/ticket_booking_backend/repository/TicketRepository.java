package com.example.ticket_booking_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ticket_booking_backend.model.Ticket;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

}