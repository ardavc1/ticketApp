package com.app.ticket.controller;

import com.app.ticket.model.Ticket;
import com.app.ticket.model.User;
import com.app.ticket.model.UserRole;
import com.app.ticket.repository.TicketRepository;
import com.app.ticket.service.TicketService;
import com.app.ticket.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService service;
    private final UserService userService;
    private final TicketRepository ticketRepository;

    // 🔐 Yalnızca admin tüm ticket'ları görebilir
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Ticket> getAllTickets() {
        return service.getAllTickets();
    }

    @GetMapping("/latest")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Ticket> getLatestTickets(@RequestParam(defaultValue = "5") int count) {
        return service.getLatestTickets(count);
    }



    // 🔓 Herkes kendi ticket'larını görebilir
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<List<Ticket>> getMyTickets(Principal principal) {
        String username = principal.getName();
        List<Ticket> tickets = service.getTicketsByUsername(username);
        return ResponseEntity.ok(tickets);
    }

    // 🔓 Kullanıcı veya admin ticket oluşturabilir
    @PostMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public Ticket createTicket(@RequestBody Ticket ticket, Principal principal) {
        ticket.setCreatedBy(principal.getName());
        return service.createTicket(ticket);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id, Principal principal) {
        String username = principal.getName();
        Optional<Ticket> ticketOpt = service.getTicketById(id);

        if (ticketOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Ticket ticket = ticketOpt.get();

        User user = userService.getByUsername(username);

        if (user.getRole().name().equals("ADMIN") || ticket.getCreatedBy().equals(username)) {
            return ResponseEntity.ok(ticket);
        } else {
            return ResponseEntity.status(403).<Ticket>build(); // ✅ Buraya dikkat
        }
    }


    // 🔐 Sadece admin ticket güncelleyebilir (atama, durum vs.)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Ticket> updateTicket(@PathVariable Long id, @RequestBody Ticket ticket) {
        return ResponseEntity.ok(service.updateTicket(id, ticket));
    }

    // 🔐 Sadece admin ticket silebilir
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        service.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<?> assignTicket(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String assignedTo = body.get("assignedTo");
        Ticket ticket = ticketRepository.findById(id).orElseThrow();
        ticket.setAssignedTo(assignedTo);
        ticketRepository.save(ticket);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status"); // "OPEN" veya "CLOSED"
        Ticket ticket = ticketRepository.findById(id).orElseThrow();
        ticket.setStatus(status);
        ticketRepository.save(ticket);
        return ResponseEntity.ok().build();
    }

}

