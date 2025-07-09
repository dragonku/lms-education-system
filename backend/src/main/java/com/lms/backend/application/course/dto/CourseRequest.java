package com.lms.backend.application.course.dto;

import com.lms.backend.domain.course.Course;
import com.lms.backend.domain.course.CourseStatus;

import java.time.LocalDate;

public class CourseRequest {
    private String title;
    private String description;
    private String instructor;
    private String category;
    private Integer capacity;
    private LocalDate startDate;
    private LocalDate endDate;
    private String duration;
    private Long price;
    private CourseStatus status;
    private String imageUrl;
    
    public CourseRequest() {}
    
    public CourseRequest(String title, String description, String instructor, String category, 
                        Integer capacity, LocalDate startDate, LocalDate endDate, String duration, 
                        Long price, CourseStatus status, String imageUrl) {
        this.title = title;
        this.description = description;
        this.instructor = instructor;
        this.category = category;
        this.capacity = capacity;
        this.startDate = startDate;
        this.endDate = endDate;
        this.duration = duration;
        this.price = price;
        this.status = status;
        this.imageUrl = imageUrl;
    }
    
    // Getters and Setters
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
    
    public Course toEntity() {
        Course course = new Course();
        course.setTitle(title);
        course.setDescription(description);
        course.setInstructor(instructor);
        course.setCategory(category);
        course.setCapacity(capacity);
        course.setStartDate(startDate);
        course.setEndDate(endDate);
        course.setDuration(duration);
        course.setPrice(price);
        course.setStatus(status != null ? status : CourseStatus.ACTIVE);
        course.setImageUrl(imageUrl);
        course.setCurrentEnrollment(0);
        return course;
    }
}