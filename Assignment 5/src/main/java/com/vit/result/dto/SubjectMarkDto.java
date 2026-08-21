package com.vit.result.dto;

import jakarta.validation.constraints.*;

/**
 * DTO for capturing and validating marks for a single subject.
 */
public class SubjectMarkDto {

    private Long subjectId;

    @NotBlank(message = "Subject code is required")
    private String subjectCode;

    @NotBlank(message = "Subject name is required")
    private String subjectName;

    private Integer credits = 4;

    @NotNull(message = "MSE marks are required")
    @DecimalMin(value = "0.0", message = "MSE marks must be at least 0")
    @DecimalMax(value = "100.0", message = "MSE marks cannot exceed 100")
    private Double mseMarks;

    @NotNull(message = "ESE marks are required")
    @DecimalMin(value = "0.0", message = "ESE marks must be at least 0")
    @DecimalMax(value = "100.0", message = "ESE marks cannot exceed 100")
    private Double eseMarks;

    public SubjectMarkDto() {
    }

    public SubjectMarkDto(String subjectCode, String subjectName, Integer credits, Double mseMarks, Double eseMarks) {
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.credits = credits != null ? credits : 4;
        this.mseMarks = mseMarks;
        this.eseMarks = eseMarks;
    }

    // Getters and Setters
    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public String getSubjectCode() {
        return subjectCode;
    }

    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public Integer getCredits() {
        return credits;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }

    public Double getMseMarks() {
        return mseMarks;
    }

    public void setMseMarks(Double mseMarks) {
        this.mseMarks = mseMarks;
    }

    public Double getEseMarks() {
        return eseMarks;
    }

    public void setEseMarks(Double eseMarks) {
        this.eseMarks = eseMarks;
    }
}
