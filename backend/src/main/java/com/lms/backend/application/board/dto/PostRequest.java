package com.lms.backend.application.board.dto;

import com.lms.backend.domain.board.BoardType;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class PostRequest {
    
    @NotBlank(message = "제목은 필수입니다")
    private String title;
    
    @NotBlank(message = "내용은 필수입니다")
    private String content;
    
    @NotNull(message = "게시판 유형은 필수입니다")
    private BoardType boardType;
    
    private Boolean isNotice = false;
    
    private Boolean isSecret = false;
    
    public PostRequest() {}
    
    public PostRequest(String title, String content, BoardType boardType, Boolean isNotice, Boolean isSecret) {
        this.title = title;
        this.content = content;
        this.boardType = boardType;
        this.isNotice = isNotice;
        this.isSecret = isSecret;
    }
    
    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public BoardType getBoardType() { return boardType; }
    public void setBoardType(BoardType boardType) { this.boardType = boardType; }
    
    public Boolean getIsNotice() { return isNotice; }
    public void setIsNotice(Boolean isNotice) { this.isNotice = isNotice; }
    
    public Boolean getIsSecret() { return isSecret; }
    public void setIsSecret(Boolean isSecret) { this.isSecret = isSecret; }
}