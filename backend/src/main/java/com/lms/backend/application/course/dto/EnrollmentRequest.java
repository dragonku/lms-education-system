package com.lms.backend.application.course.dto;

public class EnrollmentRequest {
    private Long courseId;
    private Long userId;
    
    public EnrollmentRequest() {}
    
    public EnrollmentRequest(Long courseId, Long userId) {
        this.courseId = courseId;
        this.userId = userId;
    }
    
    // Getters and Setters
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}