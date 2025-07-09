package com.lms.backend.presentation;

import com.lms.backend.application.course.CourseService;
import com.lms.backend.application.course.dto.*;
import com.lms.backend.domain.course.CourseStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
public class CourseController {
    
    private final CourseService courseService;
    
    @Autowired
    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getCourses(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) CourseStatus status,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        
        Page<CourseResponse> courses = courseService.getCourses(category, status, search, pageable);
        
        Map<String, Object> response = Map.of(
            "courses", courses.getContent(),
            "total", courses.getTotalElements(),
            "page", courses.getNumber(),
            "size", courses.getSize(),
            "totalPages", courses.getTotalPages()
        );
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> getCourse(@PathVariable Long id) {
        CourseResponse course = courseService.getCourse(id);
        return ResponseEntity.ok(course);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseResponse> createCourse(@RequestBody CourseRequest request) {
        CourseResponse course = courseService.createCourse(request);
        return ResponseEntity.ok(course);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CourseResponse> updateCourse(@PathVariable Long id, @RequestBody CourseRequest request) {
        CourseResponse course = courseService.updateCourse(id, request);
        return ResponseEntity.ok(course);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        List<String> categories = courseService.getCategories();
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/{id}/enrollments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<EnrollmentResponse>> getCourseEnrollments(@PathVariable Long id) {
        List<EnrollmentResponse> enrollments = courseService.getCourseEnrollments(id);
        return ResponseEntity.ok(enrollments);
    }
}