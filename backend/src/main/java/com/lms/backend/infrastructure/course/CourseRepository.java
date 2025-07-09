package com.lms.backend.infrastructure.course;

import com.lms.backend.domain.course.Course;
import com.lms.backend.domain.course.CourseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    Page<Course> findByStatus(CourseStatus status, Pageable pageable);
    
    Page<Course> findByCategory(String category, Pageable pageable);
    
    Page<Course> findByCategoryAndStatus(String category, CourseStatus status, Pageable pageable);
    
    @Query("SELECT c FROM Course c WHERE " +
           "(:category IS NULL OR c.category = :category) AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:search IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(c.instructor) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Course> findCoursesWithFilters(@Param("category") String category, 
                                       @Param("status") CourseStatus status,
                                       @Param("search") String search,
                                       Pageable pageable);
    
    @Query("SELECT DISTINCT c.category FROM Course c")
    List<String> findDistinctCategories();
    
    @Query("SELECT COUNT(c) FROM Course c WHERE c.status = :status")
    Long countByStatus(@Param("status") CourseStatus status);
}