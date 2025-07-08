package com.lms.backend.presentation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.backend.application.user.UserService;
import com.lms.backend.application.user.dto.LoginRequest;
import com.lms.backend.application.user.dto.SignupRequest;
import com.lms.backend.application.user.dto.UserResponse;
import com.lms.backend.config.security.JwtTokenProvider;
import com.lms.backend.domain.user.UserType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtTokenProvider tokenProvider;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void login_ShouldReturnToken_WhenValidCredentials() throws Exception {
        // given
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");

        Authentication authentication = mock(Authentication.class);
        UserResponse userResponse = new UserResponse();
        userResponse.setEmail("test@example.com");
        userResponse.setName("Test User");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenReturn(authentication);
        when(tokenProvider.generateToken(any(Authentication.class))).thenReturn("jwt-token");
        when(userService.findByEmail(anyString())).thenReturn(userResponse);

        // when & then
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.user.email").value("test@example.com"));
    }

    @Test
    void signup_ShouldReturnSuccess_WhenValidRequest() throws Exception {
        // given
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setPassword("password123");
        signupRequest.setName("Test User");
        signupRequest.setPhoneNumber("010-1234-5678");
        signupRequest.setUserType(UserType.EMPLOYEE);

        UserResponse userResponse = new UserResponse();
        userResponse.setEmail("test@example.com");
        userResponse.setName("Test User");

        when(userService.signup(any(SignupRequest.class))).thenReturn(userResponse);

        // when & then
        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpected(status().isOk())
                .andExpect(jsonPath("$.message").value("회원가입이 완료되었습니다. 관리자 승인 후 이용 가능합니다."))
                .andExpect(jsonPath("$.user.email").value("test@example.com"));
    }

    @Test
    void signup_ShouldReturnError_WhenInvalidRequest() throws Exception {
        // given
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setPassword("password123");
        signupRequest.setName("Test User");
        signupRequest.setPhoneNumber("010-1234-5678");
        signupRequest.setUserType(UserType.EMPLOYEE);

        when(userService.signup(any(SignupRequest.class)))
            .thenThrow(new IllegalArgumentException("이미 사용 중인 이메일입니다"));

        // when & then
        mockMvc.perform(post("/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("이미 사용 중인 이메일입니다"));
    }
}