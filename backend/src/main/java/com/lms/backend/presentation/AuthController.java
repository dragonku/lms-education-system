package com.lms.backend.presentation;

import com.lms.backend.application.user.UserService;
import com.lms.backend.application.user.dto.*;
import com.lms.backend.config.security.JwtTokenProvider;
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
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );
            
            String jwt = tokenProvider.generateToken(authentication);
            UserResponse user = userService.findByEmail(loginRequest.getEmail());
            
            return ResponseEntity.ok(new AuthResponse(jwt, user));
            
        } catch (AuthenticationException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "이메일 또는 비밀번호가 올바르지 않습니다");
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest signupRequest) {
        try {
            UserResponse user = userService.signup(signupRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "회원가입이 완료되었습니다. 관리자 승인 후 이용 가능합니다.");
            response.put("user", user);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {
            UserResponse user = userService.findByEmail(authentication.getName());
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "사용자 정보를 찾을 수 없습니다");
            return ResponseEntity.badRequest().body(error);
        }
    }
}