package com.app.ticket.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.*;

@Setter
@Getter
@Entity
public class TicketActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long ticketId;

    private String type; // CREATED, STATUS_CHANGE, ASSIGNED, etc.

    private String message;

    private LocalDateTime timestamp;

    private String performedBy;

}
