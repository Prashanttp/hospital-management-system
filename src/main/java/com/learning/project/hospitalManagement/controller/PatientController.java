package com.learning.project.hospitalManagement.controller;

import com.learning.project.hospitalManagement.dto.AppointmentResponseDto;
import com.learning.project.hospitalManagement.dto.CreateAppointmentRequestDto;
import com.learning.project.hospitalManagement.dto.PatientResponseDto;
import com.learning.project.hospitalManagement.entity.Insurance;
import com.learning.project.hospitalManagement.entity.Patient;
import com.learning.project.hospitalManagement.repository.AppointmentRepository;
import com.learning.project.hospitalManagement.repository.DoctorRepository;
import com.learning.project.hospitalManagement.service.AppointmentService;
import com.learning.project.hospitalManagement.service.InsuranceService;
import com.learning.project.hospitalManagement.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.learning.project.hospitalManagement.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;
    private final AppointmentService appointmentService;
    private final InsuranceService insuranceService;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final ModelMapper modelMapper;

    @PostMapping("/appointments")
    public ResponseEntity<AppointmentResponseDto> createNewAppointment(@RequestBody CreateAppointmentRequestDto createAppointmentRequestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.createNewAppointment(createAppointmentRequestDto));
    }

    @GetMapping("/profile")
    public ResponseEntity<PatientResponseDto> getPatientProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(patientService.getPatientByEmail(user.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientResponseDto> getPatientById(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @PostMapping
    public ResponseEntity<PatientResponseDto> createPatient(@RequestBody Patient patient) {
        return ResponseEntity.status(HttpStatus.CREATED).body(patientService.savePatient(patient));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/insurance")
    public ResponseEntity<PatientResponseDto> assignInsurance(@PathVariable Long id, @RequestBody Insurance insurance) {
        Patient patient = insuranceService.assignInsuranceToPatient(insurance, id);
        return ResponseEntity.ok(modelMapper.map(patient, PatientResponseDto.class));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPatients", patientService.getTotalPatientsCount());
        stats.put("bloodGroups", patientService.getBloodGroupStats());
        stats.put("totalDoctors", doctorRepository.count());
        stats.put("totalAppointments", appointmentRepository.count());
        return ResponseEntity.ok(stats);
    }
}
