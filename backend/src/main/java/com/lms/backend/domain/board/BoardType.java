package com.lms.backend.domain.board;

public enum BoardType {
    NOTICE("공지사항"),
    QNA("Q&A"),
    FAQ("FAQ");
    
    private final String displayName;
    
    BoardType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}