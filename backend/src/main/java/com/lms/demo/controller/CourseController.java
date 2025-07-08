package com.lms.demo.controller;

import com.lms.demo.dto.CourseDto;
import com.lms.demo.entity.Course;
import com.lms.demo.entity.User;
import com.lms.demo.service.CourseService;
import com.lms.demo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/courses")
@CrossOrigin(origins = "*")
public class CourseController {
    
    @Autowired
    private CourseService courseService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public ResponseEntity<?> getAllCourses(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String courseType,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        
        try {
            Pageable pageable = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
            Page<Course> coursePage;
            
            if (search != null && !search.trim().isEmpty()) {
                coursePage = courseService.searchCourses(search, pageable);
            } else if (status != null && !status.trim().isEmpty()) {
                Course.CourseStatus courseStatus = Course.CourseStatus.valueOf(status.toUpperCase());
                coursePage = courseService.findCoursesByStatus(courseStatus, pageable);
            } else if (courseType != null && !courseType.trim().isEmpty()) {
                Course.CourseType type = Course.CourseType.valueOf(courseType.toUpperCase());
                coursePage = courseService.findCoursesByType(type, pageable);
            } else if (category != null && !category.trim().isEmpty()) {
                coursePage = courseService.findCoursesByCategory(category, pageable);
            } else {
                coursePage = courseService.findAllCourses(pageable);
            }
            
            List<CourseDto.CourseResponse> courseResponses = coursePage.getContent()
                    .stream()
                    .map(CourseDto.CourseResponse::new)
                    .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", courseResponses);
            response.put("pagination", Map.of(
                "page", page,
                "limit", limit,
                "total", coursePage.getTotalElements(),
                "totalPages", coursePage.getTotalPages()
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "강좌 목록을 불러오는데 실패했습니다.");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getCourse(@PathVariable Long id) {
        try {
            Course course = courseService.findById(id)
                    .orElseThrow(() -> new RuntimeException("Course not found"));
            
            CourseDto.CourseResponse courseResponse = new CourseDto.CourseResponse(course);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", courseResponse);
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "강좌를 찾을 수 없습니다.");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createCourse(@Valid @RequestBody CourseDto.CourseRequest courseRequest, 
                                          Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Course course = courseService.createCourse(courseRequest, user.getId());
            CourseDto.CourseResponse courseResponse = new CourseDto.CourseResponse(course);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", courseResponse);
            response.put("message", "강좌가 성공적으로 생성되었습니다.");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "강좌 생성에 실패했습니다.");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, 
                                          @Valid @RequestBody CourseDto.CourseRequest courseRequest,
                                          Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Course course = courseService.updateCourse(id, courseRequest, user.getId());
            CourseDto.CourseResponse courseResponse = new CourseDto.CourseResponse(course);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", courseResponse);
            response.put("message", "강좌가 성공적으로 수정되었습니다.");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "강좌 수정에 실패했습니다.");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id, Authentication authentication) {
        try {
            User user = userService.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            courseService.deleteCourse(id, user.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "강좌가 성공적으로 삭제되었습니다.");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "강좌 삭제에 실패했습니다.");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        try {
            List<String> categories = courseService.getCategories();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", categories);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", "카테고리를 불러오는데 실패했습니다.");
            
            return ResponseEntity.badRequest().body(response);
        }
    }
}