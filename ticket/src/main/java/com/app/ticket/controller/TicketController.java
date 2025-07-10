package com.app.ticket.controller;

import com.app.ticket.model.Ticket;
import com.app.ticket.service.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService service;

    public TicketController(TicketService service) {
        this.service = service;
    }

    // Tüm ticket'ları getir (admin veya test amaçlı kullanılabilir)
    @GetMapping
    public List<Ticket> getAllTickets() {
        return service.getAllTickets();
    }

    // Belirli ID'ye göre ticket getir
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicket(@PathVariable Long id) {
        return service.getTicketById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Giriş yapan kullanıcıya ait ticket'ları getir
    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> getMyTickets(Principal principal) {
        String username = principal.getName();
        List<Ticket> tickets = service.getTicketsByUsername(username);
        return ResponseEntity.ok(tickets);
    }

    // Yeni ticket oluştur (giriş yapan kullanıcıya bağlı)
    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket, Principal principal) {
        ticket.setCreatedBy(principal.getName()); // giriş yapan kullanıcıyı ata
        return service.createTicket(ticket);
    }

    // Ticket güncelle
    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable Long id, @RequestBody Ticket ticket) {
        return ResponseEntity.ok(service.updateTicket(id, ticket));
    }

    // Ticket sil
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        service.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
}
