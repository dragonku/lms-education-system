package com.lms.backend.application.board.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class CommentCreateRequest {
    
    @NotBlank(message = "댓글 내용을 입력해주세요.")
    @Size(max = 1000, message = "댓글은 1000자 이하로 입력해주세요.")
    private String content;
    
    public CommentCreateRequest() {}
    
    public CommentCreateRequest(String content) {
        this.content = content;
    }
    
    // Getters and Setters
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}