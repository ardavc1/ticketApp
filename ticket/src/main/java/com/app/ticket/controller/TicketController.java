package com.app.ticket.controller;

import com.app.ticket.model.Ticket;
import com.app.ticket.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService service;

    // 🔐 Yalnızca admin tüm ticket'ları görebilir
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Ticket> getAllTickets() {
        return service.getAllTickets();
    }

    // 🔓 Herkes kendi ticket'ını görebilir
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<List<Ticket>> getMyTickets(Principal principal) {
        String username = principal.getName();
        List<Ticket> tickets = service.getTicketsByUsername(username);
        return ResponseEntity.ok(tickets);
    }

    // 🔓 Herkes sadece kendi ticket'ını oluşturabilir
    @PostMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public Ticket createTicket(@RequestBody Ticket ticket, Principal principal) {
        ticket.setCreatedBy(principal.getName());
        return service.createTicket(ticket);
    }

    // 🔐 Belirli ID'deki ticket'ı sadece admin görebilir
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Ticket> getTicket(@PathVariable Long id) {
        return service.getTicketById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔐 Sadece admin güncelleyebilir (örneğin: atama veya durum değişikliği)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Ticket> updateTicket(@PathVariable Long id, @RequestBody Ticket ticket) {
        return ResponseEntity.ok(service.updateTicket(id, ticket));
    }

    // 🔐 Sadece admin silebilir
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        service.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
}
