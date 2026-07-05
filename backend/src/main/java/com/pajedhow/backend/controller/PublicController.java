package com.pajedhow.backend.controller;

import com.pajedhow.backend.config.AppProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/** Health check and public runtime config (e.g. WhatsApp contact number). */
@RestController
@RequiredArgsConstructor
public class PublicController {

    private final AppProperties appProperties;

    @GetMapping("/api/health")
    public Map<String, Object> health() {
        return Map.of("status", "UP", "time", Instant.now().toString());
    }

    @GetMapping("/api/config/whatsapp")
    public Map<String, String> whatsapp() {
        return Map.of("phone", appProperties.getWhatsapp().getPhone());
    }
}
