package com.learning.project.hospitalManagement.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProjectInfoDto {
    private String projectName;
    private String projectVersion;
    private String description;
    private String developerName;
    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;
    private String email;
    private List<String> techStack;
    private List<String> keyFeatures;
}
