package com.lms.demo.service;

import com.lms.demo.dto.CourseDto;
import com.lms.demo.entity.Course;
import com.lms.demo.entity.User;
import com.lms.demo.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CourseService {
    
    @Autowired
    private CourseRepository courseRepository;
    
    public Course createCourse(CourseDto.CourseRequest request, Long createdBy) {
        Course course = new Course();
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setObjectives(request.getObjectives());
        course.setTargetAudience(request.getTargetAudience());
        course.setPrerequisites(request.getPrerequisites());
        course.setDuration(request.getDuration());
        course.setMaxStudents(request.getMaxStudents());
        course.setMinStudents(request.getMinStudents());
        course.setCourseType(Course.CourseType.valueOf(request.getCourseType().toUpperCase()));
        course.setCategory(request.getCategory());
        course.setTags(request.getTags());
        course.setCreatedBy(createdBy);
        
        if (request.getStatus() != null) {
            course.setStatus(Course.CourseStatus.valueOf(request.getStatus().toUpperCase()));
        }
        
        return courseRepository.save(course);
    }
    
    public Optional<Course> findById(Long id) {
        return courseRepository.findById(id);
    }
    
    public List<Course> findAllCourses() {
        return courseRepository.findAll();
    }
    
    public Page<Course> findAllCourses(Pageable pageable) {
        return courseRepository.findAll(pageable);
    }
    
    public List<Course> findCoursesByStatus(Course.CourseStatus status) {
        return courseRepository.findByStatus(status);
    }
    
    public Page<Course> findCoursesByStatus(Course.CourseStatus status, Pageable pageable) {
        return courseRepository.findByStatus(status, pageable);
    }
    
    public List<Course> findCoursesByType(Course.CourseType courseType) {
        return courseRepository.findByCourseType(courseType);
    }
    
    public Page<Course> findCoursesByType(Course.CourseType courseType, Pageable pageable) {
        return courseRepository.findByCourseType(courseType, pageable);
    }
    
    public List<Course> findCoursesByCategory(String category) {
        return courseRepository.findByCategory(category);
    }
    
    public Page<Course> findCoursesByCategory(String category, Pageable pageable) {
        return courseRepository.findByCategory(category, pageable);
    }
    
    public List<Course> findCoursesByCreator(Long createdBy) {
        return courseRepository.findByCreatedBy(createdBy);
    }
    
    public List<Course> searchCourses(String keyword) {
        return courseRepository.findByTitleContainingOrDescriptionContaining(keyword);
    }
    
    public Page<Course> searchCourses(String keyword, Pageable pageable) {
        return courseRepository.findByTitleContainingOrDescriptionContaining(keyword, pageable);
    }
    
    public Course updateCourse(Long courseId, CourseDto.CourseRequest request, Long userId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        // Check if user has permission to update (could be creator or admin)
        // This would typically involve checking user roles/permissions
        
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setObjectives(request.getObjectives());
        course.setTargetAudience(request.getTargetAudience());
        course.setPrerequisites(request.getPrerequisites());
        course.setDuration(request.getDuration());
        course.setMaxStudents(request.getMaxStudents());
        course.setMinStudents(request.getMinStudents());
        course.setCourseType(Course.CourseType.valueOf(request.getCourseType().toUpperCase()));
        course.setCategory(request.getCategory());
        course.setTags(request.getTags());
        
        if (request.getStatus() != null) {
            course.setStatus(Course.CourseStatus.valueOf(request.getStatus().toUpperCase()));
        }
        
        return courseRepository.save(course);
    }
    
    public Course updateCourseStatus(Long courseId, Course.CourseStatus status) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        course.setStatus(status);
        return courseRepository.save(course);
    }
    
    public void deleteCourse(Long courseId, Long userId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        // Check if user has permission to delete (could be creator or admin)
        // This would typically involve checking user roles/permissions
        
        courseRepository.delete(course);
    }
    
    public List<String> getCategories() {
        return courseRepository.findDistinctCategoriesByStatus(Course.CourseStatus.PUBLISHED);
    }
    
    public long getCourseCountByType(Course.CourseType courseType) {
        return courseRepository.countByCourseTypeAndStatus(courseType, Course.CourseStatus.PUBLISHED);
    }
    
    public Page<Course> findPublishedCoursesByType(Course.CourseType courseType, Pageable pageable) {
        return courseRepository.findByStatusAndCourseType(Course.CourseStatus.PUBLISHED, courseType, pageable);
    }
}