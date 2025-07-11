package com.lms.backend.application.board.dto;

import com.lms.backend.domain.board.BoardType;
import com.lms.backend.domain.board.Post;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class PostResponse {
    
    private Long id;
    private String title;
    private String content;
    private BoardType boardType;
    private Boolean isNotice;
    private Boolean isSecret;
    private Integer viewCount;
    private String authorName;
    private Long authorId;
    private List<FileAttachmentResponse> attachments;
    private int commentCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public PostResponse() {}
    
    public PostResponse(Post post) {
        this.id = post.getId();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.boardType = post.getBoardType();
        this.isNotice = post.getIsNotice();
        this.isSecret = post.getIsSecret();
        this.viewCount = post.getViewCount();
        this.authorName = post.getAuthor().getName();
        this.authorId = post.getAuthor().getId();
        this.attachments = post.getAttachments().stream()
                .map(FileAttachmentResponse::new)
                .collect(Collectors.toList());
        this.commentCount = post.getComments().size();
        this.createdAt = post.getCreatedAt();
        this.updatedAt = post.getUpdatedAt();
    }
    
    // Summary constructor for list view (without content and attachments)
    public static PostResponse summary(Post post) {
        PostResponse response = new PostResponse();
        response.id = post.getId();
        response.title = post.getTitle();
        response.boardType = post.getBoardType();
        response.isNotice = post.getIsNotice();
        response.isSecret = post.getIsSecret();
        response.viewCount = post.getViewCount();
        response.authorName = post.getAuthor().getName();
        response.authorId = post.getAuthor().getId();
        response.commentCount = post.getComments().size();
        response.createdAt = post.getCreatedAt();
        response.updatedAt = post.getUpdatedAt();
        return response;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public BoardType getBoardType() { return boardType; }
    public void setBoardType(BoardType boardType) { this.boardType = boardType; }
    
    public Boolean getIsNotice() { return isNotice; }
    public void setIsNotice(Boolean isNotice) { this.isNotice = isNotice; }
    
    public Boolean getIsSecret() { return isSecret; }
    public void setIsSecret(Boolean isSecret) { this.isSecret = isSecret; }
    
    public Integer getViewCount() { return viewCount; }
    public void setViewCount(Integer viewCount) { this.viewCount = viewCount; }
    
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    
    public Long getAuthorId() { return authorId; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }
    
    public List<FileAttachmentResponse> getAttachments() { return attachments; }
    public void setAttachments(List<FileAttachmentResponse> attachments) { this.attachments = attachments; }
    
    public int getCommentCount() { return commentCount; }
    public void setCommentCount(int commentCount) { this.commentCount = commentCount; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}