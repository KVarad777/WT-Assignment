package com.vit.result.entity;

import jakarta.persistence.*;

/**
 * Subject Entity representing the academic curriculum courses.
 */
@Entity
@Table(name = "subjects", indexes = {
    @Index(name = "idx_subject_code", columnList = "subject_code", unique = true)
})
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "subject_code", nullable = false, unique = true, length = 20)
    private String subjectCode;

    @Column(name = "subject_name", nullable = false, length = 150)
    private String subjectName;

    @Column(name = "credits", nullable = false)
    private Integer credits = 4;

    public Subject() {
    }

    public Subject(String subjectCode, String subjectName, Integer credits) {
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.credits = credits != null ? credits : 4;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
}
