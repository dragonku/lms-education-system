package com.lms.backend.domain.user;

public enum UserStatus {
    PENDING("승인 대기"),
    ACTIVE("활성"),
    REJECTED("승인 거부"),
    SUSPENDED("정지");
    
    private final String displayName;
    
    UserStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}