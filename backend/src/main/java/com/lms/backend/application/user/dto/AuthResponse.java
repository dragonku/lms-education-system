package com.lms.backend.application.user.dto;

public class AuthResponse {
    
    private String token;
    private String tokenType = "Bearer";
    private UserResponse user;
    
    // 기본 생성자
    public AuthResponse() {}
    
    // 생성자
    public AuthResponse(String token, UserResponse user) {
        this.token = token;
        this.user = user;
    }
    
    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }
    
    public UserResponse getUser() { return user; }
    public void setUser(UserResponse user) { this.user = user; }
}