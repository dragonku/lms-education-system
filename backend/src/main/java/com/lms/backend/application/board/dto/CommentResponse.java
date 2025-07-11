package com.lms.backend.application.board.dto;

import com.lms.backend.domain.board.Comment;

import java.time.LocalDateTime;

public class CommentResponse {
    
    private Long id;
    private String content;
    private String authorName;
    private Long authorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public CommentResponse() {}
    
    public CommentResponse(Long id, String content, String authorName, Long authorId,
                          LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.content = content;
        this.authorName = authorName;
        this.authorId = authorId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    public static CommentResponse fromComment(Comment comment) {
        return new CommentResponse(
            comment.getId(),
            comment.getContent(),
            comment.getAuthor().getName(),
            comment.getAuthor().getId(),
            comment.getCreatedAt(),
            comment.getUpdatedAt()
        );
    }
    
    // Getters
    public Long getId() { return id; }
    public String getContent() { return content; }
    public String getAuthorName() { return authorName; }
    public Long getAuthorId() { return authorId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}