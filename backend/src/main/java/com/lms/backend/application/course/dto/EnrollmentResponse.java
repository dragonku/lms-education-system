package com.lms.backend.application.course.dto;

import com.lms.backend.application.user.dto.UserResponse;
import com.lms.backend.domain.course.Enrollment;
import com.lms.backend.domain.course.EnrollmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
    
    public static EnrollmentResponse from(Enrollment enrollment) {
        return EnrollmentResponse.builder()
                .id(enrollment.getId())
                .userId(enrollment.getUser().getId())
                .courseId(enrollment.getCourse().getId())
                .status(enrollment.getStatus())
                .enrolledAt(enrollment.getEnrolledAt())
                .approvedAt(enrollment.getApprovedAt())
                .updatedAt(enrollment.getUpdatedAt())
                .course(CourseResponse.from(enrollment.getCourse()))
                .user(UserResponse.from(enrollment.getUser()))
                .build();
    }
}