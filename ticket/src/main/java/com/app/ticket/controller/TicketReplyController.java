package com.app.ticket.controller;

import com.app.ticket.model.*;
import com.app.ticket.repository.TicketReplyRepository;
import com.app.ticket.repository.TicketRepository;
import com.app.ticket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.*;
import org.springframework.web.bind.annotation.*;

import java.security.*;
import java.time.*;
import java.util.*;

@RestController
@RequestMapping("/api/replies")
public class TicketReplyController {

    @Autowired
    private TicketReplyRepository ticketReplyRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{ticketId}")
    public ResponseEntity<TicketReply> addReply(@PathVariable Long ticketId, @RequestBody Map<String, String> payload, Principal principal) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(ticketId);
        if (ticketOpt.isEmpty()) return ResponseEntity.notFound().build();

        User author = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        TicketReply reply = new TicketReply();
        reply.setTicket(ticketOpt.get());
        reply.setAuthor(author);
        reply.setMessage(payload.get("message"));
        reply.setCreatedAt(LocalDateTime.now());

        return ResponseEntity.ok(ticketReplyRepository.save(reply));
    }

    @GetMapping("/{ticketId}")
    public ResponseEntity<List<TicketReply>> getReplies(@PathVariable Long ticketId) {
        return ResponseEntity.ok(ticketReplyRepository.findByTicketIdOrderByCreatedAtAsc(ticketId));
    }
}
