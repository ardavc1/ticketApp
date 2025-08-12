package com.app.ticket.controller;

import com.app.ticket.model.*;
import com.app.ticket.repository.*;
import com.app.ticket.service.TicketService;
import com.app.ticket.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.*;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.*;

import java.io.*;
import java.nio.file.*;
import java.security.Principal;
import java.time.*;
import java.util.*;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TicketController {
    private final TicketActivityRepository activityRepository;
    private final TicketService service;
    private final UserService userService;
    private final TicketRepository ticketRepository;

    // Yalnızca admin tüm ticket'ları görebilir
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



    // Herkes kendi ticket'larını görebilir
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<List<Ticket>> getMyTickets(Principal principal) {
        String username = principal.getName();
        List<Ticket> tickets = service.getTicketsByUsername(username);
        return ResponseEntity.ok(tickets);
    }

    // Kullanıcı veya admin ticket oluşturabilir
    @PostMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public Ticket createTicket(@RequestBody Ticket ticket, Principal principal) {
        ticket.setCreatedBy(principal.getName());
        Ticket savedTicket = service.createTicket(ticket);


        TicketActivity activity = new TicketActivity();
        activity.setTicketId(savedTicket.getId());
        activity.setType("CREATED");
        activity.setMessage("Ticket oluşturuldu");
        activity.setPerformedBy(principal.getName());
        activity.setTimestamp(LocalDateTime.now());
        activityRepository.save(activity);

        return savedTicket;
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
            return ResponseEntity.status(403).<Ticket>build();
        }
    }


    // Sadece admin ticket güncelleyebilir (atama, durum vs.)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Ticket> updateTicket(@PathVariable Long id, @RequestBody Ticket ticket) {
        return ResponseEntity.ok(service.updateTicket(id, ticket));
    }

    // Sadece admin ticket silebilir
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        service.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<?> assignTicket(@PathVariable Long id, @RequestBody Map<String, String> body, Principal principal) {
        String assignedTo = body.get("assignedTo");
        Ticket ticket = ticketRepository.findById(id).orElseThrow();
        ticket.setAssignedTo(assignedTo);
        ticketRepository.save(ticket);


        TicketActivity activity = new TicketActivity();
        activity.setTicketId(id);
        activity.setType("ASSIGNED");
        activity.setMessage("Ticket, " + assignedTo + " kullanıcısına atandı");
        activity.setPerformedBy(principal.getName());
        activity.setTimestamp(LocalDateTime.now());
        activityRepository.save(activity);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body, Principal principal) {
        String status = body.get("status");
        Ticket ticket = ticketRepository.findById(id).orElseThrow();

        String oldStatus = ticket.getStatus();
        ticket.setStatus(status);
        ticketRepository.save(ticket);


        TicketActivity activity = new TicketActivity();
        activity.setTicketId(id);
        activity.setType("STATUS_CHANGE");
        activity.setMessage("Durum " + oldStatus + " → " + status + " olarak değiştirildi");
        activity.setPerformedBy(principal.getName());
        activity.setTimestamp(LocalDateTime.now());
        activityRepository.save(activity);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("ticketId") Long ticketId
    ) {
        try {

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path path = Paths.get("uploads/" + fileName);
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());
            
            Ticket ticket = ticketRepository.findById(ticketId).orElseThrow();
            ticket.setFileName(fileName);
            ticketRepository.save(ticket);

            return ResponseEntity.ok("Dosya yüklendi");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Yükleme hatası");
        }
    }

    @GetMapping("/download/{fileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) throws IOException {
        Path path = Paths.get("uploads/" + fileName);
        Resource resource = new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }

    @GetMapping("/{id}/activities")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<List<TicketActivity>> getTicketActivities(@PathVariable Long id, Principal principal) {
        Ticket ticket = ticketRepository.findById(id).orElseThrow();
        String username = principal.getName();

        User user = userService.getByUsername(username);
        if (!user.getRole().equals(UserRole.ADMIN) && !ticket.getCreatedBy().equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<TicketActivity> activities = activityRepository.findByTicketIdOrderByTimestampAsc(id);
        return ResponseEntity.ok(activities);
    }


}

