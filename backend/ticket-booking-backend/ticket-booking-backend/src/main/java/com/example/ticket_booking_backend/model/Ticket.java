package com.example.ticket_booking_backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Ticket {

    @Id
	private Long id;
    private String eventName;
    private String seatNumber;
    private double price;

    public Ticket() {}
    
    public Ticket(Long id, String eventName, String seatNumber, double price) {
    	this.id = id;
    	this.eventName = eventName;
    	this.seatNumber = seatNumber;
    	this.price = price;
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getEventName() {
		return eventName;
	}

	public void setEventName(String eventName) {
		this.eventName = eventName;
	}

	public String getSeatNumber() {
		return seatNumber;
	}

	public void setSeatNumber(String seatNumber) {
		this.seatNumber = seatNumber;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}
    
    
}