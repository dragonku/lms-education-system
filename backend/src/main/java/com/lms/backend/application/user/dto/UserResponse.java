package com.lms.backend.application.user.dto;

import com.lms.backend.domain.user.Authority;
import com.lms.backend.domain.user.User;
import com.lms.backend.domain.user.UserStatus;
import com.lms.backend.domain.user.UserType;

import java.time.LocalDateTime;
import java.util.Set;

public class UserResponse {
    
    private Long id;
    private String email;
    private String name;
    private String phoneNumber;
    private UserType userType;
    private UserStatus status;
    private String companyName;
    private Set<Authority> authorities;
    private LocalDateTime createdAt;
    
    // 기본 생성자
    public UserResponse() {}
    
    // User 엔티티로부터 생성하는 생성자
    public UserResponse(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.phoneNumber = user.getPhoneNumber();
        this.userType = user.getUserType();
        this.status = user.getStatus();
        this.companyName = user.getCompanyName();
        this.authorities = user.getAuthorities();
        this.createdAt = user.getCreatedAt();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public UserType getUserType() { return userType; }
    public void setUserType(UserType userType) { this.userType = userType; }
    
    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }
    
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    
    public Set<Authority> getAuthorities() { return authorities; }
    public void setAuthorities(Set<Authority> authorities) { this.authorities = authorities; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}