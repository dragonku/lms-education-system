package com.lms.backend.application.board.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class PostUpdateRequest {
    
    @NotBlank(message = "제목을 입력해주세요.")
    @Size(max = 200, message = "제목은 200자 이하로 입력해주세요.")
    private String title;
    
    @NotBlank(message = "내용을 입력해주세요.")
    @Size(max = 10000, message = "내용은 10000자 이하로 입력해주세요.")
    private String content;
    
    public PostUpdateRequest() {}
    
    public PostUpdateRequest(String title, String content) {
        this.title = title;
        this.content = content;
    }
    
    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}