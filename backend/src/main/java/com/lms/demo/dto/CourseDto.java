package com.lms.demo.dto;

import com.lms.demo.entity.Course;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public class CourseDto {
    
    public static class CourseRequest {
        @NotBlank
        private String title;
        
        private String description;
        
        private List<String> objectives;
        
        private String targetAudience;
        
        private List<String> prerequisites;
        
        @NotNull
        @Min(1)
        private Integer duration;
        
        @NotNull
        @Min(1)
        private Integer maxStudents;
        
        @NotNull
        @Min(1)
        private Integer minStudents;
        
        @NotBlank
        private String courseType;
        
        private String status;
        
        @NotBlank
        private String category;
        
        private List<String> tags;
        
        public String getTitle() {
            return title;
        }
        
        public void setTitle(String title) {
            this.title = title;
        }
        
        public String getDescription() {
            return description;
        }
        
        public void setDescription(String description) {
            this.description = description;
        }
        
        public List<String> getObjectives() {
            return objectives;
        }
        
        public void setObjectives(List<String> objectives) {
            this.objectives = objectives;
        }
        
        public String getTargetAudience() {
            return targetAudience;
        }
        
        public void setTargetAudience(String targetAudience) {
            this.targetAudience = targetAudience;
        }
        
        public List<String> getPrerequisites() {
            return prerequisites;
        }
        
        public void setPrerequisites(List<String> prerequisites) {
            this.prerequisites = prerequisites;
        }
        
        public Integer getDuration() {
            return duration;
        }
        
        public void setDuration(Integer duration) {
            this.duration = duration;
        }
        
        public Integer getMaxStudents() {
            return maxStudents;
        }
        
        public void setMaxStudents(Integer maxStudents) {
            this.maxStudents = maxStudents;
        }
        
        public Integer getMinStudents() {
            return minStudents;
        }
        
        public void setMinStudents(Integer minStudents) {
            this.minStudents = minStudents;
        }
        
        public String getCourseType() {
            return courseType;
        }
        
        public void setCourseType(String courseType) {
            this.courseType = courseType;
        }
        
        public String getStatus() {
            return status;
        }
        
        public void setStatus(String status) {
            this.status = status;
        }
        
        public String getCategory() {
            return category;
        }
        
        public void setCategory(String category) {
            this.category = category;
        }
        
        public List<String> getTags() {
            return tags;
        }
        
        public void setTags(List<String> tags) {
            this.tags = tags;
        }
    }
    
    public static class CourseResponse {
        private String id;
        private String title;
        private String description;
        private List<String> objectives;
        private String targetAudience;
        private List<String> prerequisites;
        private Integer duration;
        private Integer maxStudents;
        private Integer minStudents;
        private String courseType;
        private String status;
        private String category;
        private List<String> tags;
        private String createdBy;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        
        public CourseResponse() {}
        
        public CourseResponse(Course course) {
            this.id = course.getId().toString();
            this.title = course.getTitle();
            this.description = course.getDescription();
            this.objectives = course.getObjectives();
            this.targetAudience = course.getTargetAudience();
            this.prerequisites = course.getPrerequisites();
            this.duration = course.getDuration();
            this.maxStudents = course.getMaxStudents();
            this.minStudents = course.getMinStudents();
            this.courseType = course.getCourseType().name().toLowerCase();
            this.status = course.getStatus().name().toLowerCase();
            this.category = course.getCategory();
            this.tags = course.getTags();
            this.createdBy = course.getCreatedBy().toString();
            this.createdAt = course.getCreatedAt();
            this.updatedAt = course.getUpdatedAt();
        }
        
        public String getId() {
            return id;
        }
        
        public void setId(String id) {
            this.id = id;
        }
        
        public String getTitle() {
            return title;
        }
        
        public void setTitle(String title) {
            this.title = title;
        }
        
        public String getDescription() {
            return description;
        }
        
        public void setDescription(String description) {
            this.description = description;
        }
        
        public List<String> getObjectives() {
            return objectives;
        }
        
        public void setObjectives(List<String> objectives) {
            this.objectives = objectives;
        }
        
        public String getTargetAudience() {
            return targetAudience;
        }
        
        public void setTargetAudience(String targetAudience) {
            this.targetAudience = targetAudience;
        }
        
        public List<String> getPrerequisites() {
            return prerequisites;
        }
        
        public void setPrerequisites(List<String> prerequisites) {
            this.prerequisites = prerequisites;
        }
        
        public Integer getDuration() {
            return duration;
        }
        
        public void setDuration(Integer duration) {
            this.duration = duration;
        }
        
        public Integer getMaxStudents() {
            return maxStudents;
        }
        
        public void setMaxStudents(Integer maxStudents) {
            this.maxStudents = maxStudents;
        }
        
        public Integer getMinStudents() {
            return minStudents;
        }
        
        public void setMinStudents(Integer minStudents) {
            this.minStudents = minStudents;
        }
        
        public String getCourseType() {
            return courseType;
        }
        
        public void setCourseType(String courseType) {
            this.courseType = courseType;
        }
        
        public String getStatus() {
            return status;
        }
        
        public void setStatus(String status) {
            this.status = status;
        }
        
        public String getCategory() {
            return category;
        }
        
        public void setCategory(String category) {
            this.category = category;
        }
        
        public List<String> getTags() {
            return tags;
        }
        
        public void setTags(List<String> tags) {
            this.tags = tags;
        }
        
        public String getCreatedBy() {
            return createdBy;
        }
        
        public void setCreatedBy(String createdBy) {
            this.createdBy = createdBy;
        }
        
        public LocalDateTime getCreatedAt() {
            return createdAt;
        }
        
        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
        
        public LocalDateTime getUpdatedAt() {
            return updatedAt;
        }
        
        public void setUpdatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
        }
    }
}