package com.lms.backend.application.board.dto;

import com.lms.backend.domain.board.BoardType;
import com.lms.backend.domain.board.Post;

import java.time.LocalDateTime;
import java.util.List;

public class PostDetailResponse {
    
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
    private List<CommentResponse> comments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public PostDetailResponse() {}
    
    public PostDetailResponse(Long id, String title, String content, BoardType boardType,
                             Boolean isNotice, Boolean isSecret, Integer viewCount,
                             String authorName, Long authorId, List<FileAttachmentResponse> attachments,
                             List<CommentResponse> comments, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.boardType = boardType;
        this.isNotice = isNotice;
        this.isSecret = isSecret;
        this.viewCount = viewCount;
        this.authorName = authorName;
        this.authorId = authorId;
        this.attachments = attachments;
        this.comments = comments;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    public static PostDetailResponse fromPost(Post post, List<CommentResponse> comments) {
        return new PostDetailResponse(
            post.getId(),
            post.getTitle(),
            post.getContent(),
            post.getBoardType(),
            post.getIsNotice(),
            post.getIsSecret(),
            post.getViewCount(),
            post.getAuthor().getName(),
            post.getAuthor().getId(),
            post.getAttachments().stream()
                .map(FileAttachmentResponse::new)
                .collect(java.util.stream.Collectors.toList()),
            comments,
            post.getCreatedAt(),
            post.getUpdatedAt()
        );
    }
    
    // Getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public BoardType getBoardType() { return boardType; }
    public Boolean getIsNotice() { return isNotice; }
    public Boolean getIsSecret() { return isSecret; }
    public Integer getViewCount() { return viewCount; }
    public String getAuthorName() { return authorName; }
    public Long getAuthorId() { return authorId; }
    public List<FileAttachmentResponse> getAttachments() { return attachments; }
    public List<CommentResponse> getComments() { return comments; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}