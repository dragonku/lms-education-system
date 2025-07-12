package com.lms.backend.presentation;

import com.lms.backend.application.board.BoardService;
import com.lms.backend.application.board.PostService;
import com.lms.backend.application.board.dto.*;
import com.lms.backend.domain.board.BoardType;
import com.lms.backend.domain.user.User;
import com.lms.backend.infrastructure.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/board")
@CrossOrigin(origins = "*")
public class BoardController {
    
    private final PostService postService;
    private final BoardService boardService;
    private final UserRepository userRepository;
    
    @Autowired
    public BoardController(PostService postService, BoardService boardService, UserRepository userRepository) {
        this.postService = postService;
        this.boardService = boardService;
        this.userRepository = userRepository;
    }
    
    // 게시글 목록 조회
    @GetMapping("/{boardType}")
    public ResponseEntity<Map<String, Object>> getPosts(
            @PathVariable BoardType boardType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<PostResponse> posts = postService.getPosts(boardType, keyword, pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("posts", posts.getContent());
        response.put("currentPage", posts.getNumber());
        response.put("totalPages", posts.getTotalPages());
        response.put("totalElements", posts.getTotalElements());
        response.put("hasNext", posts.hasNext());
        response.put("hasPrevious", posts.hasPrevious());
        
        return ResponseEntity.ok(response);
    }
    
    // 공지사항 목록 조회
    @GetMapping("/{boardType}/notices")
    public ResponseEntity<List<PostResponse>> getNotices(@PathVariable BoardType boardType) {
        List<PostResponse> notices = postService.getNotices(boardType);
        return ResponseEntity.ok(notices);
    }
    
    // 게시글 상세 조회
    @GetMapping("/{boardType}/{id}")
    public ResponseEntity<PostResponse> getPost(
            @PathVariable BoardType boardType,
            @PathVariable Long id,
            Authentication authentication) {
        
        User currentUser = getCurrentUser(authentication);
        PostResponse post = postService.getPost(id, currentUser);
        
        return ResponseEntity.ok(post);
    }
    
    // 게시글 작성 (관리자만 공지사항 작성 가능)
    @PostMapping("/{boardType}")
    @PreAuthorize("hasRole('ADMIN') or #boardType.name() != 'NOTICE'")
    public ResponseEntity<PostResponse> createPost(
            @PathVariable BoardType boardType,
            @Valid @RequestBody PostRequest request,
            Authentication authentication) {
        
        User currentUser = getCurrentUser(authentication);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        
        // BoardType 설정
        request.setBoardType(boardType);
        
        PostResponse post = postService.createPost(request, currentUser.getId());
        return ResponseEntity.ok(post);
    }
    
    // 게시글 수정
    @PutMapping("/{boardType}/{id}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable BoardType boardType,
            @PathVariable Long id,
            @Valid @RequestBody PostRequest request,
            Authentication authentication) {
        
        User currentUser = getCurrentUser(authentication);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        
        PostResponse post = postService.updatePost(id, request, currentUser);
        return ResponseEntity.ok(post);
    }
    
    // 게시글 삭제
    @DeleteMapping("/{boardType}/{id}")
    public ResponseEntity<Map<String, String>> deletePost(
            @PathVariable BoardType boardType,
            @PathVariable Long id,
            Authentication authentication) {
        
        User currentUser = getCurrentUser(authentication);
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        
        postService.deletePost(id, currentUser);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "게시글이 성공적으로 삭제되었습니다");
        return ResponseEntity.ok(response);
    }
    
    // 게시판 통계
    @GetMapping("/{boardType}/stats")
    public ResponseEntity<Map<String, Object>> getBoardStats(@PathVariable BoardType boardType) {
        long totalPosts = postService.getPostCount(boardType);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPosts", totalPosts);
        stats.put("boardType", boardType);
        stats.put("boardTypeName", boardType.getDisplayName());
        
        return ResponseEntity.ok(stats);
    }
    
    // Q&A 게시판 전용 엔드포인트
    @GetMapping("/qna")
    public ResponseEntity<Map<String, Object>> getQnAPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            Authentication authentication) {
        
        User currentUser = getCurrentUser(authentication);
        Long userId = currentUser != null ? currentUser.getId() : null;
        
        Page<PostResponse> posts = boardService.getQnAPosts(page, size, keyword, userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("posts", posts.getContent());
        response.put("currentPage", posts.getNumber());
        response.put("totalPages", posts.getTotalPages());
        response.put("totalElements", posts.getTotalElements());
        response.put("hasNext", posts.hasNext());
        response.put("hasPrevious", posts.hasPrevious());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/qna/{id}")
    public ResponseEntity<PostDetailResponse> getQnAPost(
            @PathVariable Long id,
            Authentication authentication) {
        
        User currentUser = getCurrentUser(authentication);
        Long userId = currentUser != null ? currentUser.getId() : null;
        
        PostDetailResponse post = boardService.getPostDetail(id, userId);
        return ResponseEntity.ok(post);
    }
    
    @PostMapping("/qna")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PostResponse> createQnAPost(
            @Valid @RequestBody PostCreateRequest request,
            Authentication authentication) {
        
        User currentUser = getCurrentUser(authentication);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        PostResponse post = boardService.createQnAPost(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(post);
    }
    
    @PutMapping("/qna/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PostResponse> updateQnAPost(
            @PathVariable Long id,
            @Valid @RequestBody PostUpdateRequest request,
            Authentication authentication) {
        
        User currentUser = getCurrentUser(authentication);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        PostResponse post = boardService.updatePost(id, request, currentUser.getId());
        return ResponseEntity.ok(post);
    }
    
    @DeleteMapping("/qna/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> deleteQnAPost(
            @PathVariable Long id,
            Authentication authentication) {
        
        User currentUser = getCurrentUser(authentication);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        boardService.deletePost(id, currentUser.getId());
        return ResponseEntity.ok(Map.of("message", "게시글이 성공적으로 삭제되었습니다."));
    }
    
    @PostMapping("/qna/{postId}/comments")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable Long postId,
            @Valid @RequestBody CommentCreateRequest request,
            Authentication authentication) {
        
        User currentUser = getCurrentUser(authentication);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        CommentResponse comment = boardService.createComment(postId, request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }
    
    @PutMapping("/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentUpdateRequest request,
            Authentication authentication) {
        
        User currentUser = getCurrentUser(authentication);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        CommentResponse comment = boardService.updateComment(commentId, request, currentUser.getId());
        return ResponseEntity.ok(comment);
    }
    
    @DeleteMapping("/comments/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> deleteComment(
            @PathVariable Long commentId,
            Authentication authentication) {
        
        User currentUser = getCurrentUser(authentication);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        boardService.deleteComment(commentId, currentUser.getId());
        return ResponseEntity.ok(Map.of("message", "댓글이 성공적으로 삭제되었습니다."));
    }
    
    // Notice 게시판 전용 엔드포인트
    @GetMapping("/notice")
    public ResponseEntity<Map<String, Object>> getNoticePosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        
        Page<PostResponse> posts = boardService.getNoticePosts(page, size, keyword);
        
        Map<String, Object> response = new HashMap<>();
        response.put("posts", posts.getContent());
        response.put("currentPage", posts.getNumber());
        response.put("totalPages", posts.getTotalPages());
        response.put("totalElements", posts.getTotalElements());
        response.put("hasNext", posts.hasNext());
        response.put("hasPrevious", posts.hasPrevious());
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/notice/{id}")
    public ResponseEntity<PostDetailResponse> getNoticePost(@PathVariable Long id) {
        PostDetailResponse post = boardService.getPostDetail(id, null); // 공지사항은 누구나 볼 수 있음
        return ResponseEntity.ok(post);
    }
    
    @PostMapping("/notice")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PostResponse> createNoticePost(
            @Valid @RequestBody PostCreateRequest request,
            Authentication authentication) {
        
        User currentUser = getCurrentUser(authentication);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        PostResponse post = boardService.createNoticePost(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(post);
    }
    
    @PutMapping("/notice/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PostResponse> updateNoticePost(
            @PathVariable Long id,
            @Valid @RequestBody PostUpdateRequest request,
            Authentication authentication) {
        
        User currentUser = getCurrentUser(authentication);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        PostResponse post = boardService.updatePost(id, request, currentUser.getId());
        return ResponseEntity.ok(post);
    }
    
    @DeleteMapping("/notice/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteNoticePost(
            @PathVariable Long id,
            Authentication authentication) {
        
        User currentUser = getCurrentUser(authentication);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        boardService.deletePost(id, currentUser.getId());
        return ResponseEntity.ok(Map.of("message", "공지사항이 성공적으로 삭제되었습니다."));
    }
    
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
    
    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDeniedException(org.springframework.security.access.AccessDeniedException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
    }
    
    private User getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        
        String email = authentication.getName();
        return userRepository.findByEmail(email).orElse(null);
    }
}