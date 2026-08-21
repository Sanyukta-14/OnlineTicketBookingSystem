package com.ticketbooking.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ticketbooking.entity.Event;
import com.ticketbooking.service.EventService;

@RestController
@RequestMapping("/events")
@CrossOrigin(origins = "http://localhost:5173")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }


    // =========================================================
    // CREATE EVENT
    // =========================================================

    @PostMapping
    public ResponseEntity<Event> createEvent(
            @RequestBody Event event) {

        Event createdEvent =
                eventService.createEvent(event);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdEvent);
    }


    // =========================================================
    // GET ALL EVENTS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {

        List<Event> events =
                eventService.getAllEvents();

        return ResponseEntity.ok(events);
    }


    // =========================================================
    // GET EVENT BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(
            @PathVariable Long id) {

        Event event =
                eventService.getEventById(id);

        return ResponseEntity.ok(event);
    }


    // =========================================================
    // UPDATE EVENT
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(
            @PathVariable Long id,
            @RequestBody Event event) {

        Event updatedEvent =
                eventService.updateEvent(id, event);

        return ResponseEntity.ok(updatedEvent);
    }


    // =========================================================
    // DELETE EVENT
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEvent(
            @PathVariable Long id) {

        eventService.deleteEvent(id);

        return ResponseEntity.ok(
                "Event deleted successfully."
        );
    }
}