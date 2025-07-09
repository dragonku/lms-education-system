package com.lms.backend.application.course.dto;

import com.lms.backend.domain.course.Course;
import com.lms.backend.domain.course.CourseStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
    
    public static CourseResponse from(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .instructor(course.getInstructor())
                .category(course.getCategory())
                .capacity(course.getCapacity())
                .currentEnrollment(course.getCurrentEnrollment())
                .startDate(course.getStartDate())
                .endDate(course.getEndDate())
                .duration(course.getDuration())
                .price(course.getPrice())
                .status(course.getStatus())
                .imageUrl(course.getImageUrl())
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .build();
    }
}