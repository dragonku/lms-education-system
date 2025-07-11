package com.lms.backend.application.board.dto;

import com.lms.backend.domain.board.FileAttachment;

import java.time.LocalDateTime;

public class FileAttachmentResponse {
    
    private Long id;
    private String originalFileName;
    private String downloadUrl;
    private Long fileSize;
    private String contentType;
    private LocalDateTime createdAt;
    
    public FileAttachmentResponse() {}
    
    public FileAttachmentResponse(FileAttachment attachment) {
        this.id = attachment.getId();
        this.originalFileName = attachment.getOriginalFileName();
        this.downloadUrl = "/api/files/" + attachment.getId() + "/download";
        this.fileSize = attachment.getFileSize();
        this.contentType = attachment.getContentType();
        this.createdAt = attachment.getCreatedAt();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getOriginalFileName() { return originalFileName; }
    public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }
    
    public String getDownloadUrl() { return downloadUrl; }
    public void setDownloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; }
    
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    
    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}