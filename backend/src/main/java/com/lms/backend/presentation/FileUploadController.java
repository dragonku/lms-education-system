package com.lms.backend.presentation;

import com.lms.backend.application.board.FileUploadService;
import com.lms.backend.application.board.dto.FileAttachmentResponse;
import com.lms.backend.domain.board.FileAttachment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = {"http://localhost:3000", "https://lms-frontend.vercel.app"})
public class FileUploadController {
    
    private final FileUploadService fileUploadService;
    
    @Autowired
    public FileUploadController(FileUploadService fileUploadService) {
        this.fileUploadService = fileUploadService;
    }
    
    @PostMapping("/upload")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<FileAttachmentResponse> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("postId") Long postId) {
        try {
            FileAttachment attachment = fileUploadService.uploadFile(file, postId);
            return ResponseEntity.ok(new FileAttachmentResponse(attachment));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }
    }
    
    @PostMapping("/upload/multiple")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<FileAttachmentResponse>> uploadFiles(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("postId") Long postId) {
        try {
            List<FileAttachment> attachments = fileUploadService.uploadFiles(files, postId);
            List<FileAttachmentResponse> responses = attachments.stream()
                    .map(FileAttachmentResponse::new)
                    .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok(responses);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }
    }
    
    @GetMapping("/{fileId}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId) {
        try {
            Resource resource = fileUploadService.downloadFile(fileId);
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
    }
    
    @DeleteMapping("/{fileId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<Void> deleteFile(@PathVariable Long fileId) {
        try {
            fileUploadService.deleteFile(fileId);
            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .build();
        }
    }
}