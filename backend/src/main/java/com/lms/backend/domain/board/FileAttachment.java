package com.lms.backend.domain.board;

import javax.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "file_attachments")
@EntityListeners(AuditingEntityListener.class)
public class FileAttachment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String originalFileName;
    
    @Column(nullable = false)
    private String storedFileName;
    
    @Column(nullable = false)
    private String filePath;
    
    @Column(nullable = false)
    private Long fileSize;
    
    @Column(nullable = false)
    private String contentType;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    protected FileAttachment() {} // JPA
    
    public FileAttachment(String originalFileName, String storedFileName, String filePath, 
                         Long fileSize, String contentType) {
        this.originalFileName = originalFileName;
        this.storedFileName = storedFileName;
        this.filePath = filePath;
        this.fileSize = fileSize;
        this.contentType = contentType;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getOriginalFileName() { return originalFileName; }
    public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }
    
    public String getStoredFileName() { return storedFileName; }
    public void setStoredFileName(String storedFileName) { this.storedFileName = storedFileName; }
    
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    
    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    
    public Post getPost() { return post; }
    public void setPost(Post post) { this.post = post; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}