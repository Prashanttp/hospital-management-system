package com.learning.project.hospitalManagement.controller;

import com.learning.project.hospitalManagement.dto.AppointmentResponseDto;
import com.learning.project.hospitalManagement.service.AppointmentService;
import com.learning.project.hospitalManagement.entity.User;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final AppointmentService appointmentService;

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentResponseDto>> getAllAppointmentsOfDoctor(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(appointmentService.getAllAppointmentsOfDoctorByEmail(user.getUsername()));
    }

}
