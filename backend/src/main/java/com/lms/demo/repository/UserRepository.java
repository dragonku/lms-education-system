package com.lms.demo.repository;

import com.lms.demo.entity.User;
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
    
    List<User> findByUserType(User.UserType userType);
    
    List<User> findByStatus(User.UserStatus status);
    
    List<User> findByUserTypeAndStatus(User.UserType userType, User.UserStatus status);
    
    @Query("SELECT u FROM User u WHERE u.companyId = :companyId")
    List<User> findByCompanyId(@Param("companyId") Long companyId);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.userType = :userType")
    long countByUserType(@Param("userType") User.UserType userType);
    
    @Query("SELECT u FROM User u WHERE u.name LIKE %:name% OR u.email LIKE %:email%")
    List<User> findByNameContainingOrEmailContaining(@Param("name") String name, @Param("email") String email);
}