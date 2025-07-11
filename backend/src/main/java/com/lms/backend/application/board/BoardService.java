package com.lms.backend.application.board;

import com.lms.backend.application.board.dto.*;
import com.lms.backend.domain.board.BoardType;
import com.lms.backend.domain.board.Comment;
import com.lms.backend.domain.board.Post;
import com.lms.backend.domain.user.Authority;
import com.lms.backend.domain.user.User;
import com.lms.backend.infrastructure.board.CommentRepository;
import com.lms.backend.infrastructure.board.PostRepository;
import com.lms.backend.infrastructure.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BoardService {
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private CommentRepository commentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Page<PostResponse> getQnAPosts(int page, int size, String keyword, Long userId) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts;
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            posts = postRepository.findByBoardTypeAndKeywordContaining(BoardType.QNA, keyword, pageable);
        } else {
            posts = postRepository.findByBoardTypeOrderByCreatedAtDesc(BoardType.QNA, pageable);
        }
        
        return posts.map(post -> {
            User user = userId != null ? getUserById(userId) : null;
            boolean canView = post.canView(user);
            return convertToPostResponse(post, canView);
        });
    }
    
    public PostDetailResponse getPostDetail(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        
        User user = userId != null ? getUserById(userId) : null;
        
        if (!post.canView(user)) {
            throw new AccessDeniedException("게시글을 볼 권한이 없습니다.");
        }
        
        // 조회수 증가
        post.incrementViewCount();
        postRepository.save(post);
        
        // 댓글 조회
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(postId);
        List<CommentResponse> commentResponses = comments.stream()
            .map(CommentResponse::fromComment)
            .collect(Collectors.toList());
        
        return PostDetailResponse.fromPost(post, commentResponses);
    }
    
    public PostResponse createQnAPost(PostCreateRequest request, Long userId) {
        User author = getUserById(userId);
        
        Post post = Post.createQnA(request.getTitle(), request.getContent(), author, request.getIsSecret());
        Post savedPost = postRepository.save(post);
        
        return convertToPostResponse(savedPost, true);
    }
    
    public PostResponse updatePost(Long postId, PostUpdateRequest request, Long userId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        
        User user = getUserById(userId);
        
        if (!post.canEdit(user)) {
            throw new AccessDeniedException("게시글을 수정할 권한이 없습니다.");
        }
        
        post.updateContent(request.getTitle(), request.getContent());
        Post updatedPost = postRepository.save(post);
        
        return convertToPostResponse(updatedPost, true);
    }
    
    public void deletePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        
        User user = getUserById(userId);
        
        if (!post.canEdit(user)) {
            throw new AccessDeniedException("게시글을 삭제할 권한이 없습니다.");
        }
        
        postRepository.delete(post);
    }
    
    public CommentResponse createComment(Long postId, CommentCreateRequest request, Long userId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        
        User author = getUserById(userId);
        
        // 비밀글인 경우 권한 확인
        if (!post.canView(author)) {
            throw new AccessDeniedException("댓글을 작성할 권한이 없습니다.");
        }
        
        Comment comment = new Comment(request.getContent(), post, author);
        Comment savedComment = commentRepository.save(comment);
        
        return CommentResponse.fromComment(savedComment);
    }
    
    public CommentResponse updateComment(Long commentId, CommentUpdateRequest request, Long userId) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
        
        User user = getUserById(userId);
        
        if (!comment.canEdit(user)) {
            throw new AccessDeniedException("댓글을 수정할 권한이 없습니다.");
        }
        
        comment.updateContent(request.getContent());
        Comment updatedComment = commentRepository.save(comment);
        
        return CommentResponse.fromComment(updatedComment);
    }
    
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));
        
        User user = getUserById(userId);
        
        if (!comment.canEdit(user)) {
            throw new AccessDeniedException("댓글을 삭제할 권한이 없습니다.");
        }
        
        commentRepository.delete(comment);
    }
    
    private User getUserById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    }
    
    private PostResponse convertToPostResponse(Post post, boolean canView) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setTitle(canView ? post.getTitle() : "[비밀글]");
        response.setContent(canView ? post.getContent() : null);
        response.setBoardType(post.getBoardType());
        response.setIsNotice(post.getIsNotice());
        response.setIsSecret(post.getIsSecret());
        response.setViewCount(post.getViewCount());
        response.setAuthorName(post.getAuthor().getName());
        response.setAuthorId(post.getAuthor().getId());
        response.setCommentCount(post.getComments().size());
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());
        return response;
    }
}