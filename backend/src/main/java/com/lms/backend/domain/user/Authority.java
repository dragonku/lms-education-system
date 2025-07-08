package com.lms.backend.domain.user;

public enum Authority {
    USER("ROLE_USER"),
    ADMIN("ROLE_ADMIN"),
    COMPANY("ROLE_COMPANY");
    
    private final String roleName;
    
    Authority(String roleName) {
        this.roleName = roleName;
    }
    
    public String getRoleName() {
        return roleName;
    }
}