package com.lms.backend.infrastructure.user;

import com.lms.backend.domain.user.User;
import com.lms.backend.domain.user.UserStatus;
import com.lms.backend.domain.user.UserType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<User> findByUserType(UserType userType);
    
    List<User> findByStatus(UserStatus status);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.userType = :userType AND u.status = :status")
    long countByUserTypeAndStatus(@Param("userType") UserType userType, 
                                 @Param("status") UserStatus status);
    
    @Query("SELECT u FROM User u WHERE u.name LIKE %:keyword% OR u.email LIKE %:keyword%")
    List<User> findByNameOrEmailContaining(@Param("keyword") String keyword);
}