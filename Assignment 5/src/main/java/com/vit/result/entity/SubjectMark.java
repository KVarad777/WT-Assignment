package com.vit.result.entity;

import jakarta.persistence.*;

/**
 * SubjectMark Entity representing MSE (30%) + ESE (70%) marks for an individual subject in a semester.
 */
@Entity
@Table(name = "subject_marks", indexes = {
    @Index(name = "idx_mark_result", columnList = "semester_result_id"),
    @Index(name = "idx_mark_subject", columnList = "subject_id")
})
public class SubjectMark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "semester_result_id", nullable = false)
    private SemesterResult semesterResult;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(name = "mse_marks", nullable = false)
    private Double mseMarks;

    @Column(name = "ese_marks", nullable = false)
    private Double eseMarks;

    @Column(name = "weighted_mse", nullable = false)
    private Double weightedMse;

    @Column(name = "weighted_ese", nullable = false)
    private Double weightedEse;

    @Column(name = "total_marks", nullable = false)
    private Double totalMarks;

    @Column(name = "grade", nullable = false, length = 10)
    private String grade;

    @Column(name = "grade_point", nullable = false)
    private Integer gradePoint;

    @Column(name = "status", nullable = false, length = 10)
    private String status; // PASS or FAIL

    public SubjectMark() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public SemesterResult getSemesterResult() {
        return semesterResult;
    }

    public void setSemesterResult(SemesterResult semesterResult) {
        this.semesterResult = semesterResult;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
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

    public Double getWeightedMse() {
        return weightedMse;
    }

    public void setWeightedMse(Double weightedMse) {
        this.weightedMse = weightedMse;
    }

    public Double getWeightedEse() {
        return weightedEse;
    }

    public void setWeightedEse(Double weightedEse) {
        this.weightedEse = weightedEse;
    }

    public Double getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Double totalMarks) {
        this.totalMarks = totalMarks;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public Integer getGradePoint() {
        return gradePoint;
    }

    public void setGradePoint(Integer gradePoint) {
        this.gradePoint = gradePoint;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
