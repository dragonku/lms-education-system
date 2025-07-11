package com.lms.backend.application.board;

import com.lms.backend.application.board.dto.PostCreateRequest;
import com.lms.backend.application.board.dto.PostResponse;
import com.lms.backend.domain.board.BoardType;
import com.lms.backend.domain.board.Post;
import com.lms.backend.domain.user.Authority;
import com.lms.backend.domain.user.User;
import com.lms.backend.domain.user.UserStatus;
import com.lms.backend.domain.user.UserType;
import com.lms.backend.infrastructure.board.CommentRepository;
import com.lms.backend.infrastructure.board.PostRepository;
import com.lms.backend.infrastructure.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BoardServiceTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private BoardService boardService;

    private User testUser;
    private Post testPost;

    @BeforeEach
    void setUp() {
        testUser = User.createIndividualUser("test@example.com", "password", "테스트사용자", "01012345678", UserType.JOB_SEEKER);
        testUser.approve();
        // Reflection을 사용하여 ID 설정
        try {
            java.lang.reflect.Field idField = testUser.getClass().getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(testUser, 1L);
        } catch (Exception e) {
            // Ignore reflection exceptions in test
        }
        
        testPost = Post.createQnA("테스트 제목", "테스트 내용", testUser, false);
        // Post ID도 설정
        try {
            java.lang.reflect.Field idField = testPost.getClass().getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(testPost, 1L);
        } catch (Exception e) {
            // Ignore reflection exceptions in test
        }
    }

    @Test
    void getQnAPosts_shouldReturnPagedPosts() {
        // Given
        Pageable pageable = PageRequest.of(0, 10);
        Page<Post> postPage = new PageImpl<>(Arrays.asList(testPost), pageable, 1);
        
        when(postRepository.findByBoardTypeOrderByCreatedAtDesc(eq(BoardType.QNA), any(Pageable.class)))
                .thenReturn(postPage);
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));

        // When
        Page<PostResponse> result = boardService.getQnAPosts(0, 10, null, testUser.getId());

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("테스트 제목", result.getContent().get(0).getTitle());
        assertEquals("테스트 내용", result.getContent().get(0).getContent());
        
        verify(postRepository).findByBoardTypeOrderByCreatedAtDesc(eq(BoardType.QNA), any(Pageable.class));
    }

    @Test
    void getQnAPosts_withKeyword_shouldReturnFilteredPosts() {
        // Given
        String keyword = "테스트";
        Pageable pageable = PageRequest.of(0, 10);
        Page<Post> postPage = new PageImpl<>(Arrays.asList(testPost), pageable, 1);
        
        when(postRepository.findByBoardTypeAndKeywordContaining(eq(BoardType.QNA), eq(keyword), any(Pageable.class)))
                .thenReturn(postPage);
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));

        // When
        Page<PostResponse> result = boardService.getQnAPosts(0, 10, keyword, testUser.getId());

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        
        verify(postRepository).findByBoardTypeAndKeywordContaining(eq(BoardType.QNA), eq(keyword), any(Pageable.class));
    }

    @Test
    void createQnAPost_shouldCreatePost() {
        // Given
        PostCreateRequest request = new PostCreateRequest("새 질문", "새 질문 내용", false);
        Post savedPost = Post.createQnA(request.getTitle(), request.getContent(), testUser, request.getIsSecret());
        
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(postRepository.save(any(Post.class))).thenReturn(savedPost);

        // When
        PostResponse result = boardService.createQnAPost(request, testUser.getId());

        // Then
        assertNotNull(result);
        assertEquals("새 질문", result.getTitle());
        assertEquals("새 질문 내용", result.getContent());
        assertEquals(BoardType.QNA, result.getBoardType());
        assertFalse(result.getIsSecret());
        
        verify(userRepository).findById(testUser.getId());
        verify(postRepository).save(any(Post.class));
    }

    @Test
    void createQnAPost_withSecret_shouldCreateSecretPost() {
        // Given
        PostCreateRequest request = new PostCreateRequest("비밀 질문", "비밀 질문 내용", true);
        Post savedPost = Post.createQnA(request.getTitle(), request.getContent(), testUser, request.getIsSecret());
        
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(postRepository.save(any(Post.class))).thenReturn(savedPost);

        // When
        PostResponse result = boardService.createQnAPost(request, testUser.getId());

        // Then
        assertNotNull(result);
        assertEquals("비밀 질문", result.getTitle());
        assertTrue(result.getIsSecret());
        
        verify(userRepository).findById(testUser.getId());
        verify(postRepository).save(any(Post.class));
    }

    @Test
    void createQnAPost_withNonExistentUser_shouldThrowException() {
        // Given
        PostCreateRequest request = new PostCreateRequest("새 질문", "새 질문 내용", false);
        
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            boardService.createQnAPost(request, 999L);
        });
        
        verify(userRepository).findById(999L);
        verify(postRepository, never()).save(any(Post.class));
    }

    @Test
    void deletePost_byAuthor_shouldDeletePost() {
        // Given
        Long postId = 1L;
        
        when(postRepository.findById(postId)).thenReturn(Optional.of(testPost));
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));

        // When
        boardService.deletePost(postId, testUser.getId());

        // Then
        verify(postRepository).findById(postId);
        verify(userRepository).findById(testUser.getId());
        verify(postRepository).delete(testPost);
    }

    @Test
    void deletePost_byNonAuthor_shouldThrowException() {
        // Given
        Long postId = 1L;
        
        User otherUser = User.createIndividualUser("other@example.com", "password", "다른사용자", "01087654321", UserType.JOB_SEEKER);
        otherUser.approve();
        // otherUser ID 설정
        try {
            java.lang.reflect.Field idField = otherUser.getClass().getDeclaredField("id");
            idField.setAccessible(true);
            idField.set(otherUser, 2L);
        } catch (Exception e) {
            // Ignore reflection exceptions in test
        }
        
        when(postRepository.findById(postId)).thenReturn(Optional.of(testPost));
        when(userRepository.findById(otherUser.getId())).thenReturn(Optional.of(otherUser));

        // When & Then
        assertThrows(org.springframework.security.access.AccessDeniedException.class, () -> {
            boardService.deletePost(postId, otherUser.getId());
        });
        
        verify(postRepository).findById(postId);
        verify(userRepository).findById(otherUser.getId());
        verify(postRepository, never()).delete(any(Post.class));
    }
}