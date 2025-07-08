package com.lms.backend.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {
    
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "LMS Backend is running");
        response.put("timestamp", System.currentTimeMillis());
        response.put("version", "1.0.0-Release-1");
        
        return ResponseEntity.ok(response);
    }
}