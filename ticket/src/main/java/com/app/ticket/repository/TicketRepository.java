// repository/TicketRepository.java
package com.app.ticket.repository;

import com.app.ticket.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
}