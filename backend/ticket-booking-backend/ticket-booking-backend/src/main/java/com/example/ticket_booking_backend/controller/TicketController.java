package com.example.ticket_booking_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.ticket_booking_backend.model.Ticket;
import com.example.ticket_booking_backend.service.TicketService;

@CrossOrigin (origins= "http://localhost:5173")
@RestController
@RequestMapping("/tickets")
public class TicketController {
	
	@Autowired
	private TicketService ticketService;
	
	@GetMapping
	public List<Ticket> getAllTickets() {
		return ticketService.getAllTickets();
	}
	
	@PostMapping
	public Ticket createTicket(@RequestBody Ticket ticket) {
		return ticketService.saveTicket(ticket);
	}
	
	@GetMapping("/{id}")
	public Ticket getTicketById(@PathVariable Long id) {
		return ticketService.getTicketById(id);
	}
	
	 @DeleteMapping("/{id}")
	    public String deleteTicket(@PathVariable Long id) {
	        ticketService.deleteTicket(id);
	        return "Ticket deleted successfully";
	 }
	 
	 @PutMapping("/{id}")
	 public Ticket updateTicket(@PathVariable Long id, @RequestBody Ticket ticket) {
		 return ticketService.updateTicket(id, ticket);
	 }
}
