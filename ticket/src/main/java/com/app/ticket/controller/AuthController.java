package com.app.ticket.controller;

import com.app.ticket.model.User;
import com.app.ticket.repository.UserRepository;
import com.app.ticket.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        UserDetails userDetails = userRepository.findByUsername(username)
                .map(user -> new org.springframework.security.core.userdetails.User(
                        user.getUsername(), user.getPassword(),
                        java.util.Collections.singleton(() -> "ROLE_" + user.getRole())
                ))
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        User user = userRepository.findByUsername(username).orElseThrow();
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

        return Map.of("token", token);

    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        user.setPassword(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode(user.getPassword()));
        return userRepository.save(user);
    }
}