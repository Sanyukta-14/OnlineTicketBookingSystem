package com.example.ticket_booking_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.ticket_booking_backend.model.Ticket;
import com.example.ticket_booking_backend.repository.TicketRepository;

@Service
public class TicketService {
	@Autowired
	private TicketRepository ticketRepository;
	
	public List<Ticket> getAllTickets() {
		return ticketRepository.findAll();
	}
	
	public Ticket saveTicket(Ticket ticket) {
		return ticketRepository.save(ticket);
	}
	
	public Ticket getTicketById(Long id) {
		return ticketRepository.findById(id).orElse(null);
	}
	
	public void deleteTicket(Long id) {
	    ticketRepository.deleteById(id);
	}
	
	public Ticket updateTicket(Long id, Ticket updatedTicket) {
		Ticket ticket = ticketRepository.findById(id).orElse(null);
		
		if (ticket != null) {
			ticket.setEventName(updatedTicket.getEventName());
			
			ticket.setSeatNumber(updatedTicket.getSeatNumber());
			ticket.setPrice(updatedTicket.getPrice());
			
			return ticketRepository.save(ticket);
		}
		return null;
	}
}
