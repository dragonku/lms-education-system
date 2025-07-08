package com.lms.backend.application.user;

import com.lms.backend.application.user.dto.SignupRequest;
import com.lms.backend.application.user.dto.UserResponse;
import com.lms.backend.domain.user.User;
import com.lms.backend.domain.user.UserType;
import com.lms.backend.infrastructure.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private SignupRequest signupRequest;
    private User user;

    @BeforeEach
    void setUp() {
        signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setPassword("password123");
        signupRequest.setName("Test User");
        signupRequest.setPhoneNumber("010-1234-5678");
        signupRequest.setUserType(UserType.EMPLOYEE);

        user = User.createIndividualUser(
            "test@example.com",
            "encodedPassword",
            "Test User",
            "010-1234-5678",
            UserType.EMPLOYEE
        );
    }

    @Test
    void signup_ShouldCreateUserSuccessfully_WhenValidRequest() {
        // given
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        // when
        UserResponse result = userService.signup(signupRequest);

        // then
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
        assertEquals("Test User", result.getName());
        assertEquals(UserType.EMPLOYEE, result.getUserType());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void signup_ShouldThrowException_WhenEmailAlreadyExists() {
        // given
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        // when & then
        assertThrows(IllegalArgumentException.class, () -> userService.signup(signupRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void signup_ShouldCreateCompanyUser_WhenCompanyType() {
        // given
        signupRequest.setUserType(UserType.COMPANY);
        signupRequest.setCompanyName("Test Company");
        
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        // when
        UserResponse result = userService.signup(signupRequest);

        // then
        assertNotNull(result);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void signup_ShouldThrowException_WhenCompanyNameMissing() {
        // given
        signupRequest.setUserType(UserType.COMPANY);
        signupRequest.setCompanyName(null);
        
        when(userRepository.existsByEmail(anyString())).thenReturn(false);

        // when & then
        assertThrows(IllegalArgumentException.class, () -> userService.signup(signupRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void findByEmail_ShouldReturnUser_WhenUserExists() {
        // given
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

        // when
        UserResponse result = userService.findByEmail("test@example.com");

        // then
        assertNotNull(result);
        assertEquals("test@example.com", result.getEmail());
    }

    @Test
    void findByEmail_ShouldThrowException_WhenUserNotFound() {
        // given
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // when & then
        assertThrows(IllegalArgumentException.class, () -> userService.findByEmail("test@example.com"));
    }

    @Test
    void approveUser_ShouldApproveUserSuccessfully() {
        // given
        Long userId = 1L;
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        // when
        UserResponse result = userService.approveUser(userId);

        // then
        assertNotNull(result);
        verify(userRepository).save(any(User.class));
    }
}