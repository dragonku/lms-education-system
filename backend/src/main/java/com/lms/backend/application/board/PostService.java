package com.lms.backend.application.board;

import com.lms.backend.application.board.dto.PostRequest;
import com.lms.backend.application.board.dto.PostResponse;
import com.lms.backend.domain.board.BoardType;
import com.lms.backend.domain.board.Post;
import com.lms.backend.domain.user.User;
import com.lms.backend.infrastructure.board.PostRepository;
import com.lms.backend.infrastructure.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PostService {
    
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    
    @Autowired
    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }
    
    public PostResponse createPost(PostRequest request, Long authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));
        
        Post post;
        if (request.getBoardType() == BoardType.NOTICE) {
            post = Post.createNotice(request.getTitle(), request.getContent(), author);
        } else {
            post = Post.createQnA(request.getTitle(), request.getContent(), author, 
                                 request.getIsSecret() != null ? request.getIsSecret() : false);
        }
        
        Post savedPost = postRepository.save(post);
        return new PostResponse(savedPost);
    }
    
    @Transactional(readOnly = true)
    public Page<PostResponse> getPosts(BoardType boardType, String keyword, Pageable pageable) {
        Page<Post> posts;
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            posts = postRepository.findByBoardTypeAndKeywordContaining(boardType, keyword.trim(), pageable);
        } else {
            posts = postRepository.findByBoardTypeOrderByCreatedAtDesc(boardType, pageable);
        }
        
        return posts.map(PostResponse::summary);
    }
    
    @Transactional(readOnly = true)
    public List<PostResponse> getNotices(BoardType boardType) {
        List<Post> notices = postRepository.findByBoardTypeAndIsNoticeOrderByCreatedAtDesc(boardType, true);
        return notices.stream()
                .map(PostResponse::summary)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public PostResponse getPost(Long id, User currentUser) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다"));
        
        // 비밀글 접근 권한 확인
        if (!post.canView(currentUser)) {
            throw new IllegalArgumentException("게시글을 볼 권한이 없습니다");
        }
        
        // 조회수 증가
        post.incrementViewCount();
        postRepository.save(post);
        
        return new PostResponse(post);
    }
    
    public PostResponse updatePost(Long id, PostRequest request, User currentUser) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다"));
        
        // 수정 권한 확인
        if (!post.canEdit(currentUser)) {
            throw new IllegalArgumentException("게시글을 수정할 권한이 없습니다");
        }
        
        post.updateContent(request.getTitle(), request.getContent());
        Post savedPost = postRepository.save(post);
        
        return new PostResponse(savedPost);
    }
    
    public void deletePost(Long id, User currentUser) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다"));
        
        // 삭제 권한 확인 (수정 권한과 동일)
        if (!post.canEdit(currentUser)) {
            throw new IllegalArgumentException("게시글을 삭제할 권한이 없습니다");
        }
        
        postRepository.delete(post);
    }
    
    @Transactional(readOnly = true)
    public long getPostCount(BoardType boardType) {
        return postRepository.countByBoardType(boardType);
    }
}