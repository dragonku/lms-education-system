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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private String instructor;
    
    @Column(nullable = false)
    private String category;
    
    @Column(nullable = false)
    private Integer capacity;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer currentEnrollment = 0;
    
    @Column(nullable = false)
    private LocalDate startDate;
    
    @Column(nullable = false)
    private LocalDate endDate;
    
    @Column(nullable = false)
    private String duration;
    
    @Column(nullable = false)
    private Long price;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private CourseStatus status = CourseStatus.ACTIVE;
    
    private String imageUrl;
    
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Enrollment> enrollments = new ArrayList<>();
    
    public void incrementEnrollment() {
        this.currentEnrollment++;
        if (this.currentEnrollment >= this.capacity) {
            this.status = CourseStatus.FULL;
        }
    }
    
    public void decrementEnrollment() {
        if (this.currentEnrollment > 0) {
            this.currentEnrollment--;
            if (this.status == CourseStatus.FULL) {
                this.status = CourseStatus.ACTIVE;
            }
        }
    }
    
    public boolean isEnrollmentAvailable() {
        return this.status == CourseStatus.ACTIVE && this.currentEnrollment < this.capacity;
    }
}