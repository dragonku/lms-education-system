package com.lms.backend.domain.board;

import com.lms.backend.domain.user.User;
import javax.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "posts")
@EntityListeners(AuditingEntityListener.class)
public class Post {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BoardType boardType;
    
    @Column(nullable = false)
    private Boolean isNotice = false;
    
    @Column(nullable = false)
    private Boolean isSecret = false;
    
    @Column(nullable = false)
    private Integer viewCount = 0;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FileAttachment> attachments = new ArrayList<>();
    
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    protected Post() {} // JPA
    
    public Post(String title, String content, BoardType boardType, User author) {
        this.title = title;
        this.content = content;
        this.boardType = boardType;
        this.author = author;
        this.isNotice = false;
        this.isSecret = false;
        this.viewCount = 0;
        this.attachments = new ArrayList<>();
        this.comments = new ArrayList<>();
    }
    
    public static Post createNotice(String title, String content, User author) {
        Post post = new Post(title, content, BoardType.NOTICE, author);
        post.isNotice = true;
        return post;
    }
    
    public static Post createQnA(String title, String content, User author, boolean isSecret) {
        Post post = new Post(title, content, BoardType.QNA, author);
        post.isSecret = isSecret;
        return post;
    }
    
    public void updateContent(String title, String content) {
        this.title = title;
        this.content = content;
    }
    
    public void incrementViewCount() {
        this.viewCount++;
    }
    
    public void addAttachment(FileAttachment attachment) {
        this.attachments.add(attachment);
        attachment.setPost(this);
    }
    
    public void removeAttachment(FileAttachment attachment) {
        this.attachments.remove(attachment);
        attachment.setPost(null);
    }
    
    public boolean canView(User user) {
        if (!isSecret) {
            return true;
        }
        
        if (user == null) {
            return false;
        }
        
        // 작성자이거나 관리자인 경우
        return author.getId().equals(user.getId()) || user.getAuthorities().contains(com.lms.backend.domain.user.Authority.ADMIN);
    }
    
    public boolean canEdit(User user) {
        if (user == null) {
            return false;
        }
        
        // 작성자이거나 관리자인 경우
        return author.getId().equals(user.getId()) || user.getAuthorities().contains(com.lms.backend.domain.user.Authority.ADMIN);
    }
    
    // Getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public BoardType getBoardType() { return boardType; }
    public Boolean getIsNotice() { return isNotice; }
    public Boolean getIsSecret() { return isSecret; }
    public Integer getViewCount() { return viewCount; }
    public User getAuthor() { return author; }
    public List<FileAttachment> getAttachments() { return attachments; }
    public List<Comment> getComments() { return comments; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}