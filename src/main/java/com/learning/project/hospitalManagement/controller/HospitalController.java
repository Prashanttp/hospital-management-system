package com.learning.project.hospitalManagement.controller;

import com.learning.project.hospitalManagement.dto.DoctorResponseDto;
import com.learning.project.hospitalManagement.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import com.learning.project.hospitalManagement.dto.ProjectInfoDto;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
public class HospitalController {

    private final DoctorService doctorService;

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorResponseDto>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/project-info")
    public ResponseEntity<ProjectInfoDto> getProjectInfo() {
        ProjectInfoDto info = ProjectInfoDto.builder()
                .projectName("CareSync Pro — Final Year Healthcare Operations System")
                .projectVersion("1.0.0-CAPSTONE")
                .description("Enterprise Spring Boot & Data JPA Hospital Management System featuring Role-Based Security, Patient Registrations, Doctor Consultation Workspace, and Real-Time Analytics.")
                .developerName("Prashant Pandey")
                .email("neeyamashu@gmail.com")
                .githubUrl("https://github.com/Prashanttp")
                .linkedinUrl("https://www.linkedin.com/in/prashant-pandey-a152b8282/")
                .portfolioUrl("https://prashanttp.github.io/prashant-resume/")
                .techStack(List.of(
                        "Java 21",
                        "Spring Boot 3.5.3",
                        "Spring Data JPA & Hibernate",
                        "Spring Security 6 (Stateless JWT Authentication)",
                        "PostgreSQL (Managed Cloud Database)",
                        "Lombok & ModelMapper",
                        "Modern Glassmorphism Frontend (HTML5, Vanilla CSS3, JS ES6)",
                        "Docker & Render Cloud Deployment"
                ))
                .keyFeatures(List.of(
                        "Multi-Role Security Architecture (Patient, Doctor, Admin)",
                        "Patient Electronic Health Records & Insurance Policy Binding",
                        "Appointment Booking & Doctor Schedule Allocation",
                        "Doctor Clinical Workspace (Prescription Writing & Consultation Status Updates)",
                        "Admin Hospital Operations & Real-Time Analytics Dashboard",
                        "Stateless JWT Token Authentication with Secure Filter Chains"
                ))
                .build();
        return ResponseEntity.ok(info);
    }
}
