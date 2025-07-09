package com.lms.backend.presentation;

import com.lms.backend.application.user.UserService;
import com.lms.backend.application.user.dto.UserResponse;
import com.lms.backend.domain.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    private final UserService userService;
    
    @Autowired
    public AdminController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<User> users = userService.findAllUsers();
        List<UserResponse> userResponses = users.stream()
                .map(UserResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userResponses);
    }
    
    @GetMapping("/users/pending")
    public ResponseEntity<List<UserResponse>> getPendingUsers() {
        List<UserResponse> pendingUsers = userService.findPendingUsers();
        return ResponseEntity.ok(pendingUsers);
    }
    
    @PostMapping("/users/{userId}/approve")
    public ResponseEntity<Map<String, String>> approveUser(@PathVariable Long userId) {
        userService.approveUser(userId);
        return ResponseEntity.ok(Map.of("message", "사용자가 승인되었습니다."));
    }
    
    @PostMapping("/users/{userId}/reject")
    public ResponseEntity<Map<String, String>> rejectUser(@PathVariable Long userId) {
        userService.rejectUser(userId);
        return ResponseEntity.ok(Map.of("message", "사용자가 거절되었습니다."));
    }
    
    @PostMapping("/users/{userId}/suspend")
    public ResponseEntity<Map<String, String>> suspendUser(@PathVariable Long userId) {
        userService.suspendUser(userId);
        return ResponseEntity.ok(Map.of("message", "사용자가 정지되었습니다."));
    }
    
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok(Map.of("message", "사용자가 삭제되었습니다."));
    }
    
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = userService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
}