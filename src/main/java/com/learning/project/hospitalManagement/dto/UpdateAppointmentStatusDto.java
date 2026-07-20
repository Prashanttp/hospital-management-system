package com.learning.project.hospitalManagement.dto;

import lombok.Data;

@Data
public class UpdateAppointmentStatusDto {
    private String status; // SCHEDULED, COMPLETED, CANCELLED
    private String prescription;
}
