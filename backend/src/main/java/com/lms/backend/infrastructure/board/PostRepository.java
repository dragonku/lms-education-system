package com.lms.backend.infrastructure.board;

import com.lms.backend.domain.board.BoardType;
import com.lms.backend.domain.board.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    
    Page<Post> findByBoardTypeOrderByCreatedAtDesc(BoardType boardType, Pageable pageable);
    
    Page<Post> findByBoardTypeAndTitleContainingIgnoreCaseOrderByCreatedAtDesc(
            BoardType boardType, String title, Pageable pageable);
    
    @Query("SELECT p FROM Post p WHERE p.boardType = :boardType AND " +
           "(p.title LIKE %:keyword% OR p.content LIKE %:keyword%) " +
           "ORDER BY p.createdAt DESC")
    Page<Post> findByBoardTypeAndKeywordContaining(
            @Param("boardType") BoardType boardType, 
            @Param("keyword") String keyword, 
            Pageable pageable);
    
    List<Post> findByBoardTypeAndIsNoticeOrderByCreatedAtDesc(BoardType boardType, Boolean isNotice);
    
    @Modifying
    @Query("UPDATE Post p SET p.viewCount = p.viewCount + 1 WHERE p.id = :id")
    void incrementViewCount(@Param("id") Long id);
    
    @Query("SELECT COUNT(p) FROM Post p WHERE p.boardType = :boardType")
    long countByBoardType(@Param("boardType") BoardType boardType);
}