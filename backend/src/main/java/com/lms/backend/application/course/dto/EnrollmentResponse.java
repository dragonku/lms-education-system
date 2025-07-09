package com.lms.backend.application.course.dto;

import com.lms.backend.application.user.dto.UserResponse;
import com.lms.backend.domain.course.Enrollment;
import com.lms.backend.domain.course.EnrollmentStatus;

import java.time.LocalDateTime;

public class EnrollmentResponse {
    private Long id;
    private Long userId;
    private Long courseId;
    private EnrollmentStatus status;
    private LocalDateTime enrolledAt;
    private LocalDateTime approvedAt;
    private LocalDateTime updatedAt;
    private CourseResponse course;
    private UserResponse user;
    
    public EnrollmentResponse() {}
    
    public EnrollmentResponse(Long id, Long userId, Long courseId, EnrollmentStatus status, LocalDateTime enrolledAt, LocalDateTime approvedAt, LocalDateTime updatedAt, CourseResponse course, UserResponse user) {
        this.id = id;
        this.userId = userId;
        this.courseId = courseId;
        this.status = status;
        this.enrolledAt = enrolledAt;
        this.approvedAt = approvedAt;
        this.updatedAt = updatedAt;
        this.course = course;
        this.user = user;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    
    public EnrollmentStatus getStatus() { return status; }
    public void setStatus(EnrollmentStatus status) { this.status = status; }
    
    public LocalDateTime getEnrolledAt() { return enrolledAt; }
    public void setEnrolledAt(LocalDateTime enrolledAt) { this.enrolledAt = enrolledAt; }
    
    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public CourseResponse getCourse() { return course; }
    public void setCourse(CourseResponse course) { this.course = course; }
    
    public UserResponse getUser() { return user; }
    public void setUser(UserResponse user) { this.user = user; }
    
    public static EnrollmentResponse from(Enrollment enrollment) {
        EnrollmentResponse response = new EnrollmentResponse();
        response.setId(enrollment.getId());
        response.setUserId(enrollment.getUser().getId());
        response.setCourseId(enrollment.getCourse().getId());
        response.setStatus(enrollment.getStatus());
        response.setEnrolledAt(enrollment.getEnrolledAt());
        response.setApprovedAt(enrollment.getApprovedAt());
        response.setUpdatedAt(enrollment.getUpdatedAt());
        response.setCourse(CourseResponse.from(enrollment.getCourse()));
        response.setUser(UserResponse.from(enrollment.getUser()));
        return response;
    }
}