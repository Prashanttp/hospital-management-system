package com.learning.project.hospitalManagement;

import com.learning.project.hospitalManagement.entity.User;
import com.learning.project.hospitalManagement.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@SpringBootApplication
public class HospitalManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(HospitalManagementApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed Admin
            if (userRepository.findByUsername("admin@example.com").isEmpty()) {
                userRepository.save(User.builder()
                        .username("admin@example.com")
                        .password(passwordEncoder.encode("password123"))
                        .role("ROLE_ADMIN")
                        .build());
            }

            // Seed Doctors (matching data.sql emails)
            List<String> doctors = List.of(
                    "rakesh.mehta@example.com",
                    "sneha.kapoor@example.com",
                    "arjun.nair@example.com"
            );
            for (String email : doctors) {
                if (userRepository.findByUsername(email).isEmpty()) {
                    userRepository.save(User.builder()
                            .username(email)
                            .password(passwordEncoder.encode("password123"))
                            .role("ROLE_DOCTOR")
                            .build());
                }
            }

            // Seed Patients (matching data.sql emails)
            List<String> patients = List.of(
                    "aarav.sharma@example.com",
                    "diya.patel@example.com",
                    "dishant.verma@example.com",
                    "neha.iyer@example.com",
                    "kabir.singh@example.com"
            );
            for (String email : patients) {
                if (userRepository.findByUsername(email).isEmpty()) {
                    userRepository.save(User.builder()
                            .username(email)
                            .password(passwordEncoder.encode("password123"))
                            .role("ROLE_PATIENT")
                            .build());
                }
            }
        };
    }

}
