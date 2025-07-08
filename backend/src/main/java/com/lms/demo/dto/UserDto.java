package com.lms.demo.dto;

import com.lms.demo.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class UserDto {
    
    public static class LoginRequest {
        @Email
        @NotBlank
        private String email;
        
        @NotBlank
        private String password;
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getPassword() {
            return password;
        }
        
        public void setPassword(String password) {
            this.password = password;
        }
    }
    
    public static class RegisterRequest {
        @Email
        @NotBlank
        private String email;
        
        @NotBlank
        @Size(min = 8)
        private String password;
        
        @NotBlank
        private String name;
        
        private String phoneNumber;
        
        @NotBlank
        private String userType;
        
        private Long companyId;
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getPassword() {
            return password;
        }
        
        public void setPassword(String password) {
            this.password = password;
        }
        
        public String getName() {
            return name;
        }
        
        public void setName(String name) {
            this.name = name;
        }
        
        public String getPhoneNumber() {
            return phoneNumber;
        }
        
        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }
        
        public String getUserType() {
            return userType;
        }
        
        public void setUserType(String userType) {
            this.userType = userType;
        }
        
        public Long getCompanyId() {
            return companyId;
        }
        
        public void setCompanyId(Long companyId) {
            this.companyId = companyId;
        }
    }
    
    public static class UserResponse {
        private String id;
        private String email;
        private String name;
        private String phoneNumber;
        private String userType;
        private String status;
        private Long companyId;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        public UserResponse() {}
        
        public UserResponse(User user) {
            this.id = user.getId().toString();
            this.email = user.getEmail();
            this.name = user.getName();
            this.phoneNumber = user.getPhoneNumber();
            this.userType = user.getUserType().name().toLowerCase();
            this.status = user.getStatus().name().toLowerCase();
            this.companyId = user.getCompanyId();
            this.createdAt = user.getCreatedAt();
            this.updatedAt = user.getUpdatedAt();
        }
        
        public String getId() {
            return id;
        }
        
        public void setId(String id) {
            this.id = id;
        }
        
        public String getEmail() {
            return email;
        }
        
        public void setEmail(String email) {
            this.email = email;
        }
        
        public String getName() {
            return name;
        }
        
        public void setName(String name) {
            this.name = name;
        }
        
        public String getPhoneNumber() {
            return phoneNumber;
        }
        
        public void setPhoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
        }
        
        public String getUserType() {
            return userType;
        }
        
        public void setUserType(String userType) {
            this.userType = userType;
        }
        
        public String getStatus() {
            return status;
        }
        
        public void setStatus(String status) {
            this.status = status;
        }
        
        public Long getCompanyId() {
            return companyId;
        }
        
        public void setCompanyId(Long companyId) {
            this.companyId = companyId;
        }
        
        public LocalDateTime getCreatedAt() {
            return createdAt;
        }
        
        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
        
        public LocalDateTime getUpdatedAt() {
            return updatedAt;
        }
        
        public void setUpdatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
        }
    }
    
    public static class AuthResponse {
        private UserResponse user;
        private String token;
        private String refreshToken;
        
        public AuthResponse(UserResponse user, String token, String refreshToken) {
            this.user = user;
            this.token = token;
            this.refreshToken = refreshToken;
        }
        
        public UserResponse getUser() {
            return user;
        }
        
        public void setUser(UserResponse user) {
            this.user = user;
        }
        
        public String getToken() {
            return token;
        }
        
        public void setToken(String token) {
            this.token = token;
        }
        
        public String getRefreshToken() {
            return refreshToken;
        }
        
        public void setRefreshToken(String refreshToken) {
            this.refreshToken = refreshToken;
        }
    }
}