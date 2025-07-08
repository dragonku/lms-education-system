package com.lms.demo.controller;

import com.lms.demo.dto.UserDto;
import com.lms.demo.entity.User;
import com.lms.demo.security.JwtTokenProvider;
import com.lms.demo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody UserDto.LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );
            
            String jwt = tokenProvider.generateToken(authentication);
            
            User user = userService.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            UserDto.UserResponse userResponse = new UserDto.UserResponse(user);
            UserDto.AuthResponse authResponse = new UserDto.AuthResponse(userResponse, jwt, "refresh-token-placeholder");
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", authResponse);
            
            return ResponseEntity.ok(response);
            
        } catch (AuthenticationException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserDto.RegisterRequest signUpRequest) {
        try {
            User user = userService.registerUser(signUpRequest);
            UserDto.UserResponse userResponse = new UserDto.UserResponse(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", userResponse);
            response.put("message", "회원가입이 완료되었습니다. 관리자 승인 후 이용 가능합니다.");
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            UserDto.UserResponse userResponse = new UserDto.UserResponse(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", userResponse);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }
}