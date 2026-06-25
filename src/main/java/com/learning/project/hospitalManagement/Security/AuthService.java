package com.learning.project.hospitalManagement.Security;

import com.learning.project.hospitalManagement.dto.LoginRequestDto;
import com.learning.project.hospitalManagement.dto.LoginResponseDto;
import com.learning.project.hospitalManagement.dto.SignupResponseDto;
import com.learning.project.hospitalManagement.entity.User;
import com.learning.project.hospitalManagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final AuthUtil authUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    public LoginResponseDto login(LoginRequestDto loginRequestDto) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken( loginRequestDto.getUsername() , loginRequestDto.getPassword()));

        User user = (User) authentication.getPrincipal();
        String token = authUtil.generateAccessToken(user);

        return new LoginResponseDto(token , user.getId());

    }

    public SignupResponseDto signup(LoginRequestDto signupRequestDto) {

        User user = userRepository.findByUsername(signupRequestDto.getUsername()).orElse(null) ;
        if (user!=null) throw new IllegalArgumentException("User Already Exist");

        String username = signupRequestDto.getUsername();
        String role = "ROLE_PATIENT";
        if (username.startsWith("admin")) {
            role = "ROLE_ADMIN";
        } else if (username.startsWith("doctor") || username.equals("rakesh.mehta@example.com") || username.equals("sneha.kapoor@example.com") || username.equals("arjun.nair@example.com")) {
            role = "ROLE_DOCTOR";
        }

        user=userRepository.save(User.builder()
                .username(username)
                .password(passwordEncoder.encode(signupRequestDto.getPassword()))
                .role(role)
                .build()
        );

        return new SignupResponseDto(user.getId(), user.getUsername());
    }
}
