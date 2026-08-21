package com.ticketbooking.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private LocalDate date;

    private LocalTime time;

    private String venue;

    private double ticketPrice;

    private String category;


    // =========================================================
    // DEFAULT CONSTRUCTOR
    // =========================================================

    public Event() {
    }


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public Event(
            String name,
            LocalDate date,
            LocalTime time,
            String venue,
            double ticketPrice,
            String category) {

        this.name = name;
        this.date = date;
        this.time = time;
        this.venue = venue;
        this.ticketPrice = ticketPrice;
        this.category = category;
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
    // GET NAME
    // =========================================================

    public String getName() {
        return name;
    }


    // =========================================================
    // SET NAME
    // =========================================================

    public void setName(String name) {
        this.name = name;
    }


    // =========================================================
    // GET DATE
    // =========================================================

    public LocalDate getDate() {
        return date;
    }


    // =========================================================
    // SET DATE
    // =========================================================

    public void setDate(LocalDate date) {
        this.date = date;
    }


    // =========================================================
    // GET TIME
    // =========================================================

    public LocalTime getTime() {
        return time;
    }


    // =========================================================
    // SET TIME
    // =========================================================

    public void setTime(LocalTime time) {
        this.time = time;
    }


    // =========================================================
    // GET VENUE
    // =========================================================

    public String getVenue() {
        return venue;
    }


    // =========================================================
    // SET VENUE
    // =========================================================

    public void setVenue(String venue) {
        this.venue = venue;
    }


    // =========================================================
    // GET TICKET PRICE
    // =========================================================

    public double getTicketPrice() {
        return ticketPrice;
    }


    // =========================================================
    // SET TICKET PRICE
    // =========================================================

    public void setTicketPrice(double ticketPrice) {
        this.ticketPrice = ticketPrice;
    }


    // =========================================================
    // GET CATEGORY
    // =========================================================

    public String getCategory() {
        return category;
    }


    // =========================================================
    // SET CATEGORY
    // =========================================================

    public void setCategory(String category) {
        this.category = category;
    }
}