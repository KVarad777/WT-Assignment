package com.vit.result;

import com.vit.result.dto.ResultFormDto;
import com.vit.result.dto.SubjectMarkDto;
import com.vit.result.entity.SemesterResult;
import com.vit.result.entity.Student;
import com.vit.result.entity.Subject;
import com.vit.result.service.ResultCalculationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Comprehensive Unit Tests for ResultCalculationService.
 */
class ResultCalculationServiceTest {

    private ResultCalculationService service;

    @BeforeEach
    void setUp() {
        service = new ResultCalculationService();
    }

    @Test
    @DisplayName("Should correctly calculate weighted marks for the assignment example (MSE=80, ESE=90 -> Total=87)")
    void testAssignmentPromptExample() {
        double mse = 80.0;
        double ese = 90.0;

        double weightedMse = service.calculateWeightedMse(mse);
        double weightedEse = service.calculateWeightedEse(ese);
        double total = service.calculateSubjectTotal(mse, ese);

        assertEquals(24.0, weightedMse, 0.001);
        assertEquals(63.0, weightedEse, 0.001);
        assertEquals(87.0, total, 0.001);
        assertEquals("A+", service.determineGrade(total));
        assertEquals(9, service.determineGradePoint("A+"));
        assertEquals("PASS", service.determineSubjectStatus(total));
    }

    @Test
    @DisplayName("Should correctly handle boundary marks: Minimum (0) and Maximum (100)")
    void testBoundaryMarks() {
        // Zero marks
        assertEquals(0.0, service.calculateSubjectTotal(0.0, 0.0), 0.001);
        assertEquals("F", service.determineGrade(0.0));
        assertEquals(0, service.determineGradePoint("F"));
        assertEquals("FAIL", service.determineSubjectStatus(0.0));

        // Maximum marks
        assertEquals(100.0, service.calculateSubjectTotal(100.0, 100.0), 0.001);
        assertEquals("O", service.determineGrade(100.0));
        assertEquals(10, service.determineGradePoint("O"));
        assertEquals("PASS", service.determineSubjectStatus(100.0));
    }

    @Test
    @DisplayName("Should correctly assign all grade levels across the scale")
    void testGradeScale() {
        assertEquals("O", service.determineGrade(95.0));
        assertEquals(10, service.determineGradePoint("O"));

        assertEquals("A+", service.determineGrade(85.0));
        assertEquals(9, service.determineGradePoint("A+"));

        assertEquals("A", service.determineGrade(75.0));
        assertEquals(8, service.determineGradePoint("A"));

        assertEquals("B+", service.determineGrade(65.0));
        assertEquals(7, service.determineGradePoint("B+"));

        assertEquals("B", service.determineGrade(55.0));
        assertEquals(6, service.determineGradePoint("B"));

        assertEquals("C", service.determineGrade(45.0));
        assertEquals(5, service.determineGradePoint("C"));

        assertEquals("F", service.determineGrade(35.0));
        assertEquals(0, service.determineGradePoint("F"));
    }

    @Test
    @DisplayName("Should evaluate passing threshold at exactly 40.0")
    void testPassingThreshold() {
        assertEquals("PASS", service.determineSubjectStatus(40.0));
        assertEquals("FAIL", service.determineSubjectStatus(39.99));
    }

    @Test
    @DisplayName("Should compute full semester aggregate result for 4 subjects")
    void testComputeSemesterResult() {
        Student student = new Student("22BCE1001", "Varad Deshpande", "B.Tech CSE", 5);

        Subject s1 = new Subject("CSE101", "Data Structures", 4);
        Subject s2 = new Subject("CSE102", "Database Management Systems", 4);
        Subject s3 = new Subject("CSE103", "Computer Networks", 4);
        Subject s4 = new Subject("CSE104", "Web Technology", 4);

        Map<String, Subject> subjectMap = new HashMap<>();
        subjectMap.put("CSE101", s1);
        subjectMap.put("CSE102", s2);
        subjectMap.put("CSE103", s3);
        subjectMap.put("CSE104", s4);

        ResultFormDto formDto = new ResultFormDto();
        formDto.setRollNumber("22BCE1001");
        formDto.setStudentName("Varad Deshpande");
        formDto.setProgram("B.Tech CSE");
        formDto.setSemester(5);
        formDto.setSubjects(List.of(
            new SubjectMarkDto("CSE101", "Data Structures", 4, 80.0, 90.0), // 87 -> A+ (9)
            new SubjectMarkDto("CSE102", "Database Management Systems", 4, 90.0, 90.0), // 90 -> O (10)
            new SubjectMarkDto("CSE103", "Computer Networks", 4, 70.0, 80.0), // 77 -> A (8)
            new SubjectMarkDto("CSE104", "Web Technology", 4, 85.0, 85.0)  // 85 -> A+ (9)
        ));

        SemesterResult result = service.computeSemesterResult(student, formDto, subjectMap);

        assertNotNull(result);
        assertEquals(4, result.getSubjectMarks().size());
        assertEquals(16, result.getTotalCredits());
        // 87 + 90 + 77 + 85 = 339.0
        assertEquals(339.0, result.getTotalMarks(), 0.01);
        assertEquals(84.75, result.getAveragePercentage(), 0.01);
        // Grade points: (9*4 + 10*4 + 8*4 + 9*4)/16 = 36/4 = 9.0
        assertEquals(9.0, result.getSgpa(), 0.01);
        assertEquals("PASS", result.getResultStatus());
    }
}
