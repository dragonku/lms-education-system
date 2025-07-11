package com.lms.backend.application.board;

import com.lms.backend.domain.board.FileAttachment;
import com.lms.backend.domain.board.Post;
import com.lms.backend.infrastructure.board.FileAttachmentRepository;
import com.lms.backend.infrastructure.board.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class FileUploadService {
    
    private final FileAttachmentRepository fileAttachmentRepository;
    private final PostRepository postRepository;
    
    @Value("${file.upload.directory:uploads}")
    private String uploadDirectory;
    
    @Autowired
    public FileUploadService(FileAttachmentRepository fileAttachmentRepository, PostRepository postRepository) {
        this.fileAttachmentRepository = fileAttachmentRepository;
        this.postRepository = postRepository;
    }
    
    public FileAttachment uploadFile(MultipartFile file, Long postId) throws IOException {
        validateFile(file);
        
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));
        
        String originalFileName = file.getOriginalFilename();
        String storedFileName = generateUniqueFileName(originalFileName);
        String contentType = file.getContentType();
        long fileSize = file.getSize();
        
        Path uploadPath = Paths.get(uploadDirectory);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        Path filePath = uploadPath.resolve(storedFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        FileAttachment fileAttachment = new FileAttachment(
                originalFileName,
                storedFileName,
                filePath.toString(),
                fileSize,
                contentType
        );
        
        post.addAttachment(fileAttachment);
        return fileAttachmentRepository.save(fileAttachment);
    }
    
    public List<FileAttachment> uploadFiles(List<MultipartFile> files, Long postId) throws IOException {
        return files.stream()
                .map(file -> {
                    try {
                        return uploadFile(file, postId);
                    } catch (IOException e) {
                        throw new RuntimeException("Failed to upload file: " + file.getOriginalFilename(), e);
                    }
                })
                .collect(java.util.stream.Collectors.toList());
    }
    
    public Resource downloadFile(Long fileId) throws IOException {
        FileAttachment fileAttachment = fileAttachmentRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found with id: " + fileId));
        
        Path filePath = Paths.get(fileAttachment.getFilePath());
        
        if (!Files.exists(filePath)) {
            throw new RuntimeException("File not found on disk: " + fileAttachment.getOriginalFileName());
        }
        
        try {
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("File not readable: " + fileAttachment.getOriginalFileName());
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("File path is invalid: " + fileAttachment.getOriginalFileName(), e);
        }
    }
    
    public void deleteFile(Long fileId) throws IOException {
        FileAttachment fileAttachment = fileAttachmentRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found with id: " + fileId));
        
        Path filePath = Paths.get(fileAttachment.getFilePath());
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }
        
        fileAttachmentRepository.delete(fileAttachment);
    }
    
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }
        
        if (file.getSize() > 10 * 1024 * 1024) { // 10MB limit
            throw new RuntimeException("File size exceeds 10MB limit");
        }
        
        String contentType = file.getContentType();
        if (contentType == null || !isAllowedContentType(contentType)) {
            throw new RuntimeException("File type not allowed: " + contentType);
        }
    }
    
    private boolean isAllowedContentType(String contentType) {
        return contentType.startsWith("image/") ||
               contentType.startsWith("application/pdf") ||
               contentType.startsWith("application/msword") ||
               contentType.startsWith("application/vnd.openxmlformats-officedocument") ||
               contentType.startsWith("text/") ||
               contentType.startsWith("application/zip") ||
               contentType.startsWith("application/x-zip-compressed");
    }
    
    private String generateUniqueFileName(String originalFileName) {
        String uuid = UUID.randomUUID().toString();
        String extension = "";
        
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        
        return uuid + extension;
    }
}