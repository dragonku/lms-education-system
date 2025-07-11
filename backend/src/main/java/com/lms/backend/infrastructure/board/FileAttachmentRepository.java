package com.lms.backend.infrastructure.board;

import com.lms.backend.domain.board.FileAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileAttachmentRepository extends JpaRepository<FileAttachment, Long> {
    
    List<FileAttachment> findByPostId(Long postId);
    
    void deleteByPostId(Long postId);
}