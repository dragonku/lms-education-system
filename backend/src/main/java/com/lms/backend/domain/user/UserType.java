package com.lms.backend.domain.user;

public enum UserType {
    EMPLOYEE("재직자"),
    JOB_SEEKER("구직자"),
    COMPANY("협약사"),
    ADMIN("관리자");
    
    private final String displayName;
    
    UserType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}