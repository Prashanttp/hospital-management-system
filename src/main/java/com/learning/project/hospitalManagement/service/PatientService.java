package com.learning.project.hospitalManagement.service;

import com.learning.project.hospitalManagement.dto.BloodGroupCountResponseEntity;
import com.learning.project.hospitalManagement.dto.PatientResponseDto;
import com.learning.project.hospitalManagement.entity.Patient;
import com.learning.project.hospitalManagement.repository.PatientRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public PatientResponseDto getPatientById(Long patientId) {
        Patient patient = patientRepository.findById(patientId).orElseThrow(() -> new EntityNotFoundException("Patient Not " +
                "Found with id: " + patientId));
        return modelMapper.map(patient, PatientResponseDto.class);
    }

    @Transactional
    public PatientResponseDto getPatientByEmail(String email) {
        Patient patient = patientRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("Patient Not " +
                "Found with email: " + email));
        return modelMapper.map(patient, PatientResponseDto.class);
    }

    public List<PatientResponseDto> getAllPatients(Integer pageNumber, Integer pageSize) {
        return patientRepository.findAllPatients(PageRequest.of(pageNumber, pageSize))
                .stream()
                .map(patient -> modelMapper.map(patient, PatientResponseDto.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public PatientResponseDto savePatient(Patient patient) {
        Patient savedPatient = patientRepository.save(patient);
        return modelMapper.map(savedPatient, PatientResponseDto.class);
    }

    public void deletePatient(Long id) {
        if (!patientRepository.existsById(id)) {
            throw new EntityNotFoundException("Patient not found with ID: " + id);
        }
        patientRepository.deleteById(id);
    }

    public List<BloodGroupCountResponseEntity> getBloodGroupStats() {
        return patientRepository.countEachBloodGroupType();
    }

    public long getTotalPatientsCount() {
        return patientRepository.count();
    }
}
