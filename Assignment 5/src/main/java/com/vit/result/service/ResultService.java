package com.vit.result.service;

import com.vit.result.dto.ResultFormDto;
import com.vit.result.dto.SubjectMarkDto;
import com.vit.result.entity.SemesterResult;
import com.vit.result.entity.Student;
import com.vit.result.entity.Subject;
import com.vit.result.repository.SemesterResultRepository;
import com.vit.result.repository.StudentRepository;
import com.vit.result.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ResultService {

    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;
    private final SemesterResultRepository semesterResultRepository;
    private final ResultCalculationService calculationService;

    public ResultService(StudentRepository studentRepository,
                         SubjectRepository subjectRepository,
                         SemesterResultRepository semesterResultRepository,
                         ResultCalculationService calculationService) {
        this.studentRepository = studentRepository;
        this.subjectRepository = subjectRepository;
        this.semesterResultRepository = semesterResultRepository;
        this.calculationService = calculationService;
    }

    /**
     * Retrieves the standard four curriculum subjects in order.
     */
    public List<Subject> getStandardSubjects() {
        List<Subject> subjects = subjectRepository.findAllByOrderBySubjectCodeAsc();
        if (subjects.isEmpty()) {
            // Fallback default 4 subjects if database is fresh
            return List.of(
                new Subject("CSE101", "Data Structures", 4),
                new Subject("CSE102", "Database Management Systems", 4),
                new Subject("CSE103", "Computer Networks", 4),
                new Subject("CSE104", "Web Technology", 4)
            );
        }
        return subjects;
    }

    /**
     * Creates an initial empty ResultFormDto pre-populated with standard 4 subjects.
     */
    public ResultFormDto createEmptyForm() {
        ResultFormDto formDto = new ResultFormDto();
        formDto.setProgram("B.Tech Computer Science and Engineering");
        formDto.setSemester(5);

        List<Subject> subjects = getStandardSubjects();
        List<SubjectMarkDto> subjectDtos = new ArrayList<>();
        for (Subject sub : subjects) {
            SubjectMarkDto dto = new SubjectMarkDto();
            dto.setSubjectId(sub.getId());
            dto.setSubjectCode(sub.getSubjectCode());
            dto.setSubjectName(sub.getSubjectName());
            dto.setCredits(sub.getCredits());
            dto.setMseMarks(null);
            dto.setEseMarks(null);
            subjectDtos.add(dto);
        }
        formDto.setSubjects(subjectDtos);
        return formDto;
    }

    /**
     * Generates, calculates and persists the semester result in MySQL.
     */
    @Transactional
    public SemesterResult processAndSaveResult(ResultFormDto formDto) {
        String rollNumber = formDto.getRollNumber().trim().toUpperCase();

        // 1. Find or create Student
        Student student = studentRepository.findByRollNumberIgnoreCase(rollNumber)
                .orElseGet(() -> new Student(rollNumber, formDto.getStudentName().trim(), formDto.getProgram().trim(), formDto.getSemester()));

        // Update student fields if details changed
        student.setName(formDto.getStudentName().trim());
        student.setProgram(formDto.getProgram().trim());
        student.setSemester(formDto.getSemester());
        student = studentRepository.save(student);

        // 2. Fetch subject map
        Map<String, Subject> subjectMap = subjectRepository.findAll().stream()
                .collect(Collectors.toMap(s -> s.getSubjectCode().toUpperCase(), s -> s, (s1, s2) -> s1));

        // 3. Compute Result using business calculation service
        SemesterResult semesterResult = calculationService.computeSemesterResult(student, formDto, subjectMap);

        // 4. Save and return
        return semesterResultRepository.save(semesterResult);
    }

    /**
     * Retrieve a specific result by ID.
     */
    @Transactional(readOnly = true)
    public Optional<SemesterResult> getResultById(Long id) {
        return semesterResultRepository.findById(id);
    }

    /**
     * Retrieve all saved results sorted latest first.
     */
    @Transactional(readOnly = true)
    public List<SemesterResult> getAllResults() {
        return semesterResultRepository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * Search results by roll number or student name keyword.
     */
    @Transactional(readOnly = true)
    public List<SemesterResult> searchResults(String query) {
        if (query == null || query.isBlank()) {
            return getAllResults();
        }
        String trimmed = query.trim();
        return semesterResultRepository.searchResults(trimmed, trimmed);
    }
}
