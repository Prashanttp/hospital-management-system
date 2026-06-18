package com.learning.project.hospitalManagement.controller;

import com.learning.project.hospitalManagement.Security.AuthService;
import com.learning.project.hospitalManagement.dto.LoginRequestDto;
import com.learning.project.hospitalManagement.dto.LoginResponseDto;
import com.learning.project.hospitalManagement.dto.SignupResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto loginRequestDto){
        return ResponseEntity.ok(authService.login(loginRequestDto));
    }
    @PostMapping("/signup")
    public ResponseEntity<SignupResponseDto> signup(@RequestBody LoginRequestDto signupRequestDto){
        return ResponseEntity.ok(authService.signup(signupRequestDto));
    }

}
