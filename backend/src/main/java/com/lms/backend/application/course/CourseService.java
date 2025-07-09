package com.lms.backend.application.course;

import com.lms.backend.application.course.dto.*;
import com.lms.backend.domain.course.Course;
import com.lms.backend.domain.course.CourseStatus;
import com.lms.backend.domain.course.Enrollment;
import com.lms.backend.domain.course.EnrollmentStatus;
import com.lms.backend.domain.user.User;
import com.lms.backend.infrastructure.course.CourseRepository;
import com.lms.backend.infrastructure.course.EnrollmentRepository;
import com.lms.backend.infrastructure.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CourseService {
    
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    
    @Autowired
    public CourseService(CourseRepository courseRepository, EnrollmentRepository enrollmentRepository, UserRepository userRepository) {
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
    }
    
    public Page<CourseResponse> getCourses(String category, CourseStatus status, String search, Pageable pageable) {
        Page<Course> courses = courseRepository.findCoursesWithFilters(category, status, search, pageable);
        return courses.map(CourseResponse::from);
    }
    
    public CourseResponse getCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return CourseResponse.from(course);
    }
    
    @Transactional
    public CourseResponse createCourse(CourseRequest request) {
        Course course = request.toEntity();
        Course savedCourse = courseRepository.save(course);
        return CourseResponse.from(savedCourse);
    }
    
    @Transactional
    public CourseResponse updateCourse(Long id, CourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setInstructor(request.getInstructor());
        course.setCategory(request.getCategory());
        course.setCapacity(request.getCapacity());
        course.setStartDate(request.getStartDate());
        course.setEndDate(request.getEndDate());
        course.setDuration(request.getDuration());
        course.setPrice(request.getPrice());
        course.setStatus(request.getStatus());
        course.setImageUrl(request.getImageUrl());
        
        Course updatedCourse = courseRepository.save(course);
        return CourseResponse.from(updatedCourse);
    }
    
    @Transactional
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        courseRepository.delete(course);
    }
    
    @Transactional
    public EnrollmentResponse enrollCourse(EnrollmentRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        // Check if already enrolled
        if (enrollmentRepository.existsByUserIdAndCourseId(request.getUserId(), request.getCourseId())) {
            throw new RuntimeException("Already enrolled in this course");
        }
        
        // Check if enrollment is available
        if (!course.isEnrollmentAvailable()) {
            throw new RuntimeException("Course enrollment is not available");
        }
        
        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);
        enrollment.setStatus(EnrollmentStatus.PENDING);
        
        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        course.incrementEnrollment();
        courseRepository.save(course);
        
        return EnrollmentResponse.from(savedEnrollment);
    }
    
    @Transactional
    public void cancelEnrollment(Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        
        if (enrollment.getStatus() == EnrollmentStatus.APPROVED) {
            throw new RuntimeException("Cannot cancel approved enrollment");
        }
        
        Course course = enrollment.getCourse();
        course.decrementEnrollment();
        courseRepository.save(course);
        
        enrollmentRepository.delete(enrollment);
    }
    
    @Transactional
    public EnrollmentResponse approveEnrollment(Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        
        enrollment.approve();
        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        return EnrollmentResponse.from(savedEnrollment);
    }
    
    @Transactional
    public EnrollmentResponse rejectEnrollment(Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        
        enrollment.reject();
        Course course = enrollment.getCourse();
        course.decrementEnrollment();
        courseRepository.save(course);
        
        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        return EnrollmentResponse.from(savedEnrollment);
    }
    
    public List<EnrollmentResponse> getUserEnrollments(Long userId) {
        List<Enrollment> enrollments = enrollmentRepository.findByUserIdOrderByEnrolledAtDesc(userId);
        return enrollments.stream()
                .map(EnrollmentResponse::from)
                .collect(Collectors.toList());
    }
    
    public List<EnrollmentResponse> getCourseEnrollments(Long courseId) {
        List<Enrollment> enrollments = enrollmentRepository.findByCourseIdOrderByEnrolledAtDesc(courseId);
        return enrollments.stream()
                .map(EnrollmentResponse::from)
                .collect(Collectors.toList());
    }
    
    public List<String> getCategories() {
        return courseRepository.findDistinctCategories();
    }
}