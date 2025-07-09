package com.lms.backend.application.course.dto;

import com.lms.backend.domain.course.Course;
import com.lms.backend.domain.course.CourseStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
    
    public Course toEntity() {
        return Course.builder()
                .title(title)
                .description(description)
                .instructor(instructor)
                .category(category)
                .capacity(capacity)
                .startDate(startDate)
                .endDate(endDate)
                .duration(duration)
                .price(price)
                .status(status != null ? status : CourseStatus.ACTIVE)
                .imageUrl(imageUrl)
                .currentEnrollment(0)
                .build();
    }
}