package com.lms.backend.domain.user;

import javax.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false)
    private UserType userType;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status = UserStatus.PENDING;
    
    @Column(name = "company_name")
    private String companyName; // 협약사 가입시 사용
    
    @ElementCollection(targetClass = Authority.class, fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "user_authorities", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "authority")
    private Set<Authority> authorities;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    protected User() {} // JPA
    
    public User(String email, String password, String name, String phoneNumber, 
                UserType userType, String companyName) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.userType = userType;
        this.companyName = companyName;
        this.status = UserStatus.PENDING;
        this.authorities = Set.of(Authority.USER);
    }
    
    // 협약사 가입자 생성자
    public static User createCompanyUser(String email, String password, String name, 
                                       String phoneNumber, String companyName) {
        User user = new User(email, password, name, phoneNumber, UserType.COMPANY, companyName);
        user.authorities = Set.of(Authority.USER, Authority.COMPANY);
        return user;
    }
    
    // 재직자/구직자 생성자
    public static User createIndividualUser(String email, String password, String name, 
                                          String phoneNumber, UserType userType) {
        return new User(email, password, name, phoneNumber, userType, null);
    }
    
    public void approve() {
        this.status = UserStatus.ACTIVE;
    }
    
    public void reject() {
        this.status = UserStatus.REJECTED;
    }
    
    public void suspend() {
        this.status = UserStatus.SUSPENDED;
    }
    
    public boolean isActive() {
        return this.status == UserStatus.ACTIVE;
    }
    
    // Getters
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getName() { return name; }
    public String getPhoneNumber() { return phoneNumber; }
    public UserType getUserType() { return userType; }
    public UserStatus getStatus() { return status; }
    public String getCompanyName() { return companyName; }
    public Set<Authority> getAuthorities() { return authorities; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}