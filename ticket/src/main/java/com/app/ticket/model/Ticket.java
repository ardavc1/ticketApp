package com.app.ticket.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String priority;   // LOW, MEDIUM, HIGH
    private String status;     // OPEN, IN_PROGRESS, CLOSED
    private String category;

    private String assignedTo;

    @Column(name = "file_name")
    private String fileName;

    private LocalDateTime createdAt;

    private String createdBy;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
