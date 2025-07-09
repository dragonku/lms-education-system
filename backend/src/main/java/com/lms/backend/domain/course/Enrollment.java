package com.lms.backend.domain.course;

import com.lms.backend.domain.user.User;
import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "enrollments")
public class Enrollment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EnrollmentStatus status = EnrollmentStatus.PENDING;
    
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime enrolledAt;
    
    private LocalDateTime approvedAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    public void approve() {
        this.status = EnrollmentStatus.APPROVED;
        this.approvedAt = LocalDateTime.now();
    }
    
    public void reject() {
        this.status = EnrollmentStatus.REJECTED;
    }
    
    public void cancel() {
        this.status = EnrollmentStatus.CANCELLED;
    }
}