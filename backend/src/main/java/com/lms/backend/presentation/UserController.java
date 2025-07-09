package com.lms.backend.presentation;

import com.lms.backend.application.course.CourseService;
import com.lms.backend.application.course.dto.EnrollmentResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private final CourseService courseService;
    
    @Autowired
    public UserController(CourseService courseService) {
        this.courseService = courseService;
    }
    
    @GetMapping("/{id}/enrollments")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<EnrollmentResponse>> getUserEnrollments(@PathVariable Long id) {
        List<EnrollmentResponse> enrollments = courseService.getUserEnrollments(id);
        return ResponseEntity.ok(enrollments);
    }
}