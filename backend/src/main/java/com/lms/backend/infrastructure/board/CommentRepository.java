package com.lms.backend.infrastructure.board;

import com.lms.backend.domain.board.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    List<Comment> findByPostIdOrderByCreatedAtAsc(Long postId);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.post.id = :postId")
    long countByPostId(@Param("postId") Long postId);
    
    @Query("SELECT c FROM Comment c WHERE c.author.id = :authorId ORDER BY c.createdAt DESC")
    List<Comment> findByAuthorIdOrderByCreatedAtDesc(@Param("authorId") Long authorId);
}