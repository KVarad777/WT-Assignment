package com.vit.result.service;

import com.vit.result.dto.ResultFormDto;
import com.vit.result.dto.SubjectMarkDto;
import com.vit.result.entity.SemesterResult;
import com.vit.result.entity.Student;
import com.vit.result.entity.Subject;
import com.vit.result.entity.SubjectMark;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Service dedicated to business calculations for VIT Semester Results.
 * MSE: 30% weight, ESE: 70% weight.
 * Grading scale:
 *  90–100 -> O (10)
 *  80–89  -> A+ (9)
 *  70–79  -> A (8)
 *  60–69  -> B+ (7)
 *  50–59  -> B (6)
 *  40–49  -> C (5)
 *  < 40   -> F (0)
 */
@Service
public class ResultCalculationService {

    public static final double MSE_WEIGHT = 0.30;
    public static final double ESE_WEIGHT = 0.70;
    public static final double PASSING_THRESHOLD = 40.0;

    /**
     * Calculates weighted MSE marks (30%).
     */
    public double calculateWeightedMse(double mseMarks) {
        return round(mseMarks * MSE_WEIGHT, 2);
    }

    /**
     * Calculates weighted ESE marks (70%).
     */
    public double calculateWeightedEse(double eseMarks) {
        return round(eseMarks * ESE_WEIGHT, 2);
    }

    /**
     * Calculates subject total: (MSE * 0.30) + (ESE * 0.70).
     */
    public double calculateSubjectTotal(double mseMarks, double eseMarks) {
        return round((mseMarks * MSE_WEIGHT) + (eseMarks * ESE_WEIGHT), 2);
    }

    /**
     * Determines letter grade from total marks.
     */
    public String determineGrade(double totalMarks) {
        double rounded = round(totalMarks, 2);
        if (rounded >= 90.0) {
            return "O";
        } else if (rounded >= 80.0) {
            return "A+";
        } else if (rounded >= 70.0) {
            return "A";
        } else if (rounded >= 60.0) {
            return "B+";
        } else if (rounded >= 50.0) {
            return "B";
        } else if (rounded >= 40.0) {
            return "C";
        } else {
            return "F";
        }
    }

    /**
     * Determines grade point (0-10) based on letter grade.
     */
    public int determineGradePoint(String grade) {
        if (grade == null) return 0;
        return switch (grade.toUpperCase()) {
            case "O" -> 10;
            case "A+" -> 9;
            case "A" -> 8;
            case "B+" -> 7;
            case "B" -> 6;
            case "C" -> 5;
            default -> 0;
        };
    }

    /**
     * Determines if a subject is passed (total >= 40).
     */
    public String determineSubjectStatus(double totalMarks) {
        return totalMarks >= PASSING_THRESHOLD ? "PASS" : "FAIL";
    }

    /**
     * Compiles complete SemesterResult entity from submitted DTO and database Subjects.
     */
    public SemesterResult computeSemesterResult(Student student, ResultFormDto formDto, Map<String, Subject> subjectMap) {
        SemesterResult result = new SemesterResult();
        result.setStudent(student);

        double totalMarksSum = 0.0;
        int totalCredits = 0;
        double weightedGradePointSum = 0.0;
        boolean allPassed = true;

        List<SubjectMark> markEntities = new ArrayList<>();

        for (SubjectMarkDto markDto : formDto.getSubjects()) {
            Subject subject = subjectMap.get(markDto.getSubjectCode().toUpperCase());
            if (subject == null) {
                subject = new Subject(markDto.getSubjectCode().toUpperCase(), markDto.getSubjectName(), markDto.getCredits());
            }

            double mse = markDto.getMseMarks();
            double ese = markDto.getEseMarks();
            double weightedMse = calculateWeightedMse(mse);
            double weightedEse = calculateWeightedEse(ese);
            double subjectTotal = calculateSubjectTotal(mse, ese);
            String grade = determineGrade(subjectTotal);
            int gradePoint = determineGradePoint(grade);
            String status = determineSubjectStatus(subjectTotal);

            if (!"PASS".equalsIgnoreCase(status)) {
                allPassed = false;
            }

            SubjectMark mark = new SubjectMark();
            mark.setSubject(subject);
            mark.setMseMarks(round(mse, 2));
            mark.setEseMarks(round(ese, 2));
            mark.setWeightedMse(weightedMse);
            mark.setWeightedEse(weightedEse);
            mark.setTotalMarks(subjectTotal);
            mark.setGrade(grade);
            mark.setGradePoint(gradePoint);
            mark.setStatus(status);

            totalMarksSum += subjectTotal;
            int credits = subject.getCredits() != null ? subject.getCredits() : 4;
            totalCredits += credits;
            weightedGradePointSum += (gradePoint * credits);

            result.addSubjectMark(mark);
        }

        double totalMarksRounded = round(totalMarksSum, 2);
        double averagePercentage = round(totalMarksRounded / formDto.getSubjects().size(), 2);
        double sgpa = totalCredits > 0 ? round(weightedGradePointSum / totalCredits, 2) : 0.0;

        result.setTotalMarks(totalMarksRounded);
        result.setAveragePercentage(averagePercentage);
        result.setSgpa(sgpa);
        result.setTotalCredits(totalCredits);
        result.setResultStatus(allPassed ? "PASS" : "FAIL");

        return result;
    }

    /**
     * Utility method for clean rounding to required decimal places.
     */
    public double round(double value, int places) {
        if (places < 0) throw new IllegalArgumentException("Decimal places cannot be negative");
        BigDecimal bd = BigDecimal.valueOf(value);
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }
}
