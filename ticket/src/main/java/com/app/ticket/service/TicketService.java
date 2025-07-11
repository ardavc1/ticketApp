package com.app.ticket.service;

import com.app.ticket.model.Ticket;
import com.app.ticket.repository.TicketRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;

import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    private final TicketRepository repo;

    public TicketService(TicketRepository repo) {
        this.repo = repo;
    }

    public List<Ticket> getAllTickets() {
        return repo.findAll();
    }

    public Optional<Ticket> getTicketById(Long id) {
        return repo.findById(id);
    }

    public Ticket createTicket(Ticket ticket) {
        return repo.save(ticket);
    }

    public List<Ticket> getLatestTickets(int count) {
        Pageable pageable = PageRequest.of(0, count, Sort.by(Sort.Direction.DESC, "createdAt"));
        return repo.findLatestTickets(pageable);
    }




    public Ticket updateTicket(Long id, Ticket updatedTicket) {
        return repo.findById(id).map(ticket -> {
            ticket.setTitle(updatedTicket.getTitle());
            ticket.setDescription(updatedTicket.getDescription());
            ticket.setPriority(updatedTicket.getPriority());
            ticket.setStatus(updatedTicket.getStatus());
            ticket.setAssignedTo(updatedTicket.getAssignedTo());
            ticket.setCategory(updatedTicket.getCategory());
            return repo.save(ticket);
        }).orElseThrow();
    }


    public List<Ticket> getTicketsByUsername(String username) {
        return repo.findByCreatedBy(username);
    }

    public void deleteTicket(Long id) {
        repo.deleteById(id);
    }
}
