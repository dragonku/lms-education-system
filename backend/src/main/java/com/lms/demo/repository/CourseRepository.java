package com.lms.demo.repository;

import com.lms.demo.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    List<Course> findByStatus(Course.CourseStatus status);
    
    List<Course> findByCourseType(Course.CourseType courseType);
    
    List<Course> findByCategory(String category);
    
    List<Course> findByCreatedBy(Long createdBy);
    
    Page<Course> findByStatus(Course.CourseStatus status, Pageable pageable);
    
    Page<Course> findByCourseType(Course.CourseType courseType, Pageable pageable);
    
    Page<Course> findByCategory(String category, Pageable pageable);
    
    @Query("SELECT c FROM Course c WHERE c.title LIKE %:keyword% OR c.description LIKE %:keyword%")
    List<Course> findByTitleContainingOrDescriptionContaining(@Param("keyword") String keyword);
    
    @Query("SELECT c FROM Course c WHERE c.title LIKE %:keyword% OR c.description LIKE %:keyword%")
    Page<Course> findByTitleContainingOrDescriptionContaining(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT DISTINCT c.category FROM Course c WHERE c.status = :status ORDER BY c.category")
    List<String> findDistinctCategoriesByStatus(@Param("status") Course.CourseStatus status);
    
    @Query("SELECT COUNT(c) FROM Course c WHERE c.courseType = :courseType AND c.status = :status")
    long countByCourseTypeAndStatus(@Param("courseType") Course.CourseType courseType, @Param("status") Course.CourseStatus status);
    
    @Query("SELECT c FROM Course c WHERE c.status = :status AND c.courseType = :courseType")
    Page<Course> findByStatusAndCourseType(@Param("status") Course.CourseStatus status, 
                                           @Param("courseType") Course.CourseType courseType, 
                                           Pageable pageable);
}