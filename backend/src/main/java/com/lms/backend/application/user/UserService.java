package com.lms.backend.application.user;

import com.lms.backend.application.user.dto.SignupRequest;
import com.lms.backend.application.user.dto.UserResponse;
import com.lms.backend.domain.user.User;
import com.lms.backend.domain.user.UserType;
import com.lms.backend.infrastructure.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService implements UserDetailsService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + email));
        
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(user.getAuthorities().stream()
                        .map(authority -> authority.getRoleName())
                        .toArray(String[]::new))
                .accountExpired(false)
                .accountLocked(!user.isActive())
                .credentialsExpired(false)
                .disabled(!user.isActive())
                .build();
    }
    
    public UserResponse signup(SignupRequest request) {
        // 이메일 중복 체크
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다");
        }
        
        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        
        // 사용자 유형에 따른 User 생성
        User user;
        if (request.getUserType() == UserType.COMPANY) {
            if (request.getCompanyName() == null || request.getCompanyName().trim().isEmpty()) {
                throw new IllegalArgumentException("협약사 이름은 필수입니다");
            }
            user = User.createCompanyUser(
                    request.getEmail(),
                    encodedPassword,
                    request.getName(),
                    request.getPhoneNumber(),
                    request.getCompanyName()
            );
        } else {
            user = User.createIndividualUser(
                    request.getEmail(),
                    encodedPassword,
                    request.getName(),
                    request.getPhoneNumber(),
                    request.getUserType()
            );
        }
        
        User savedUser = userRepository.save(user);
        return new UserResponse(savedUser);
    }
    
    public UserResponse findByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));
        return new UserResponse(user);
    }
    
    public List<UserResponse> findPendingUsers() {
        return userRepository.findByStatus(com.lms.backend.domain.user.UserStatus.PENDING)
                .stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }
    
    public UserResponse approveUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));
        
        user.approve();
        User savedUser = userRepository.save(user);
        return new UserResponse(savedUser);
    }
    
    public UserResponse rejectUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));
        
        user.reject();
        User savedUser = userRepository.save(user);
        return new UserResponse(savedUser);
    }
    
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }
    
    public void suspendUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));
        
        user.suspend();
        userRepository.save(user);
    }
    
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다"));
        
        userRepository.delete(user);
    }
    
    public Map<String, Object> getDashboardStats() {
        List<User> allUsers = userRepository.findAll();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", allUsers.size());
        stats.put("activeUsers", allUsers.stream().filter(User::isActive).count());
        stats.put("pendingUsers", allUsers.stream().filter(u -> u.getStatus() == com.lms.backend.domain.user.UserStatus.PENDING).count());
        stats.put("companyUsers", allUsers.stream().filter(u -> u.getUserType() == UserType.COMPANY).count());
        
        return stats;
    }
}