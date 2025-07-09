package com.lms.backend.presentation;

import com.lms.backend.application.course.CourseService;
import com.lms.backend.application.course.dto.EnrollmentRequest;
import com.lms.backend.application.course.dto.EnrollmentResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {
    
    private final CourseService courseService;
    
    @Autowired
    public EnrollmentController(CourseService courseService) {
        this.courseService = courseService;
    }
    
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<EnrollmentResponse> enrollCourse(@RequestBody EnrollmentRequest request) {
        EnrollmentResponse enrollment = courseService.enrollCourse(request);
        return ResponseEntity.ok(enrollment);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, String>> cancelEnrollment(@PathVariable Long id) {
        courseService.cancelEnrollment(id);
        return ResponseEntity.ok(Map.of("message", "수강 신청이 취소되었습니다."));
    }
    
    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EnrollmentResponse> approveEnrollment(@PathVariable Long id) {
        EnrollmentResponse enrollment = courseService.approveEnrollment(id);
        return ResponseEntity.ok(enrollment);
    }
    
    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EnrollmentResponse> rejectEnrollment(@PathVariable Long id) {
        EnrollmentResponse enrollment = courseService.rejectEnrollment(id);
        return ResponseEntity.ok(enrollment);
    }
}