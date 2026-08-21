package com.ticketbooking.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ticketbooking.entity.Event;
import com.ticketbooking.repository.EventRepository;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final SeatService seatService;

    public EventService(
            EventRepository eventRepository,
            SeatService seatService) {

        this.eventRepository = eventRepository;
        this.seatService = seatService;
    }

    // =========================================================
    // CREATE EVENT
    // =========================================================

    @Transactional
    public Event createEvent(Event event) {

        // Save event first
        Event savedEvent =
                eventRepository.save(event);

        // Automatically create 25 seats
        seatService.generateSeatsForEvent(
                savedEvent.getId());

        return savedEvent;
    }

    // =========================================================
    // GET ALL EVENTS
    // =========================================================

    public List<Event> getAllEvents() {

        return eventRepository.findAll();
    }

    // =========================================================
    // GET EVENT BY ID
    // =========================================================

    public Event getEventById(Long id) {

        if (id == null) {

            throw new RuntimeException(
                    "Event ID is required.");
        }

        return eventRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Event not found with ID: "
                                        + id));
    }

    // =========================================================
    // UPDATE EVENT
    // =========================================================

    @Transactional
    public Event updateEvent(
            Long id,
            Event updatedEvent) {

        Event existingEvent =
                getEventById(id);

        existingEvent.setName(
                updatedEvent.getName());

        existingEvent.setDate(
                updatedEvent.getDate());

        existingEvent.setTime(
                updatedEvent.getTime());

        existingEvent.setVenue(
                updatedEvent.getVenue());

        existingEvent.setTicketPrice(
                updatedEvent.getTicketPrice());

        existingEvent.setCategory(
                updatedEvent.getCategory());

        return eventRepository.save(
                existingEvent);
    }

    // =========================================================
    // DELETE EVENT
    // =========================================================

    @Transactional
    public void deleteEvent(Long id) {

        // Make sure event exists
        getEventById(id);

        // Delete seats first
        // This prevents foreign-key problems
        seatService.deleteSeatsForEvent(id);

        // Delete event
        eventRepository.deleteById(id);
    }
}