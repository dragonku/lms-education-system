package com.lms.backend.infrastructure.course;

import com.lms.backend.domain.course.Enrollment;
import com.lms.backend.domain.course.EnrollmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    
    List<Enrollment> findByUserIdOrderByEnrolledAtDesc(Long userId);
    
    List<Enrollment> findByCourseIdOrderByEnrolledAtDesc(Long courseId);
    
    Optional<Enrollment> findByUserIdAndCourseId(Long userId, Long courseId);
    
    List<Enrollment> findByStatus(EnrollmentStatus status);
    
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.course.id = :courseId AND e.status = :status")
    Long countByCourseIdAndStatus(@Param("courseId") Long courseId, @Param("status") EnrollmentStatus status);
    
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.user.id = :userId AND e.status = :status")
    Long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") EnrollmentStatus status);
    
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
}