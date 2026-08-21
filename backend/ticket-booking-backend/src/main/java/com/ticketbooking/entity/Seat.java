package com.ticketbooking.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String seatNumber;

    private String status;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;


    // =========================================================
    // DEFAULT CONSTRUCTOR
    // =========================================================

    public Seat() {
    }


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public Seat(
            String seatNumber,
            String status,
            Event event) {

        this.seatNumber = seatNumber;
        this.status = status;
        this.event = event;
    }


    // =========================================================
    // GET ID
    // =========================================================

    public Long getId() {
        return id;
    }


    // =========================================================
    // SET ID
    // =========================================================

    public void setId(Long id) {
        this.id = id;
    }


    // =========================================================
    // GET SEAT NUMBER
    // =========================================================

    public String getSeatNumber() {
        return seatNumber;
    }


    // =========================================================
    // SET SEAT NUMBER
    // =========================================================

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }


    // =========================================================
    // GET STATUS
    // =========================================================

    public String getStatus() {
        return status;
    }


    // =========================================================
    // SET STATUS
    // =========================================================

    public void setStatus(String status) {
        this.status = status;
    }


    // =========================================================
    // GET EVENT
    // =========================================================

    public Event getEvent() {
        return event;
    }


    // =========================================================
    // SET EVENT
    // =========================================================

    public void setEvent(Event event) {
        this.event = event;
    }
}