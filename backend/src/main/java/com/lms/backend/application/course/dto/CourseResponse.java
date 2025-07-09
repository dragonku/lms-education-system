package com.lms.backend.application.course.dto;

import com.lms.backend.domain.course.Course;
import com.lms.backend.domain.course.CourseStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class CourseResponse {
    private Long id;
    private String title;
    private String description;
    private String instructor;
    private String category;
    private Integer capacity;
    private Integer currentEnrollment;
    private LocalDate startDate;
    private LocalDate endDate;
    private String duration;
    private Long price;
    private CourseStatus status;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public CourseResponse() {}
    
    public CourseResponse(Long id, String title, String description, String instructor, String category, 
                         Integer capacity, Integer currentEnrollment, LocalDate startDate, LocalDate endDate, 
                         String duration, Long price, CourseStatus status, String imageUrl, 
                         LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.instructor = instructor;
        this.category = category;
        this.capacity = capacity;
        this.currentEnrollment = currentEnrollment;
        this.startDate = startDate;
        this.endDate = endDate;
        this.duration = duration;
        this.price = price;
        this.status = status;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getInstructor() { return instructor; }
    public void setInstructor(String instructor) { this.instructor = instructor; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    
    public Integer getCurrentEnrollment() { return currentEnrollment; }
    public void setCurrentEnrollment(Integer currentEnrollment) { this.currentEnrollment = currentEnrollment; }
    
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    
    public Long getPrice() { return price; }
    public void setPrice(Long price) { this.price = price; }
    
    public CourseStatus getStatus() { return status; }
    public void setStatus(CourseStatus status) { this.status = status; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public static CourseResponse from(Course course) {
        CourseResponse response = new CourseResponse();
        response.setId(course.getId());
        response.setTitle(course.getTitle());
        response.setDescription(course.getDescription());
        response.setInstructor(course.getInstructor());
        response.setCategory(course.getCategory());
        response.setCapacity(course.getCapacity());
        response.setCurrentEnrollment(course.getCurrentEnrollment());
        response.setStartDate(course.getStartDate());
        response.setEndDate(course.getEndDate());
        response.setDuration(course.getDuration());
        response.setPrice(course.getPrice());
        response.setStatus(course.getStatus());
        response.setImageUrl(course.getImageUrl());
        response.setCreatedAt(course.getCreatedAt());
        response.setUpdatedAt(course.getUpdatedAt());
        return response;
    }
}