package com.vit.result.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Form DTO representing the submission data for generating a student's semester result.
 */
public class ResultFormDto {

    @NotBlank(message = "Student name is required")
    @Size(min = 2, max = 100, message = "Student name must be between 2 and 100 characters")
    private String studentName;

    @NotBlank(message = "Roll number is required")
    @Pattern(regexp = "^[a-zA-Z0-9_-]{3,20}$", message = "Roll number must be 3-20 alphanumeric characters (e.g. 22BCE1001)")
    private String rollNumber;

    @NotBlank(message = "Program is required")
    private String program = "B.Tech Computer Science and Engineering";

    @NotNull(message = "Semester is required")
    @Min(value = 1, message = "Semester must be between 1 and 8")
    @Max(value = 8, message = "Semester must be between 1 and 8")
    private Integer semester = 5;

    @NotEmpty(message = "Marks for all four subjects are required")
    @Size(min = 4, max = 4, message = "Exactly four subjects must be submitted")
    @Valid
    private List<SubjectMarkDto> subjects = new ArrayList<>();

    public ResultFormDto() {
    }

    // Getters and Setters
    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber != null ? rollNumber.trim().toUpperCase() : null;
    }

    public String getProgram() {
        return program;
    }

    public void setProgram(String program) {
        this.program = program;
    }

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }

    public List<SubjectMarkDto> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<SubjectMarkDto> subjects) {
        this.subjects = subjects;
    }
}
