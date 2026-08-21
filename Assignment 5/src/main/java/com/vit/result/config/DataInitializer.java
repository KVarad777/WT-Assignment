package com.vit.result.config;

import com.vit.result.dto.ResultFormDto;
import com.vit.result.dto.SubjectMarkDto;
import com.vit.result.entity.Subject;
import com.vit.result.repository.SemesterResultRepository;
import com.vit.result.repository.SubjectRepository;
import com.vit.result.service.ResultService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Automatically seeds the 4 standard curriculum subjects and dummy sample results
 * for Varad, Sarvesh, Niraj, Manas, and Piyush on application startup if database is empty.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final SubjectRepository subjectRepository;
    private final SemesterResultRepository semesterResultRepository;
    private final ResultService resultService;

    public DataInitializer(SubjectRepository subjectRepository,
                           SemesterResultRepository semesterResultRepository,
                           ResultService resultService) {
        this.subjectRepository = subjectRepository;
        this.semesterResultRepository = semesterResultRepository;
        this.resultService = resultService;
    }

    @Override
    public void run(String... args) {
        seedSubjects();
        seedSampleResults();
    }

    private void seedSubjects() {
        if (subjectRepository.count() == 0) {
            log.info("Seeding 4 standard curriculum subjects into database...");
            List<Subject> subjects = List.of(
                new Subject("CSE101", "Data Structures", 4),
                new Subject("CSE102", "Database Management Systems", 4),
                new Subject("CSE103", "Computer Networks", 4),
                new Subject("CSE104", "Web Technology", 4)
            );
            subjectRepository.saveAll(subjects);
            log.info("Standard subjects seeded successfully.");
        }
    }

    private void seedSampleResults() {
        if (semesterResultRepository.count() == 0) {
            log.info("Seeding realistic sample student results (Varad, Sarvesh, Niraj, Manas, Piyush)...");

            // 1. Varad (Outstanding / Distinction)
            ResultFormDto varad = new ResultFormDto();
            varad.setRollNumber("22BCE1001");
            varad.setStudentName("Varad");
            varad.setProgram("B.Tech Computer Science and Engineering");
            varad.setSemester(5);
            varad.setSubjects(List.of(
                new SubjectMarkDto("CSE101", "Data Structures", 4, 92.0, 94.0),
                new SubjectMarkDto("CSE102", "Database Management Systems", 4, 88.0, 90.0),
                new SubjectMarkDto("CSE103", "Computer Networks", 4, 90.0, 92.0),
                new SubjectMarkDto("CSE104", "Web Technology", 4, 95.0, 96.0)
            ));
            resultService.processAndSaveResult(varad);

            // 2. Sarvesh (Excellent / Grade A+)
            ResultFormDto sarvesh = new ResultFormDto();
            sarvesh.setRollNumber("22BCE1002");
            sarvesh.setStudentName("Sarvesh");
            sarvesh.setProgram("B.Tech Computer Science and Engineering");
            sarvesh.setSemester(5);
            sarvesh.setSubjects(List.of(
                new SubjectMarkDto("CSE101", "Data Structures", 4, 82.0, 85.0),
                new SubjectMarkDto("CSE102", "Database Management Systems", 4, 80.0, 84.0),
                new SubjectMarkDto("CSE103", "Computer Networks", 4, 78.0, 82.0),
                new SubjectMarkDto("CSE104", "Web Technology", 4, 85.0, 88.0)
            ));
            resultService.processAndSaveResult(sarvesh);

            // 3. Niraj (First Class / Grade A)
            ResultFormDto niraj = new ResultFormDto();
            niraj.setRollNumber("22BCE1003");
            niraj.setStudentName("Niraj");
            niraj.setProgram("B.Tech Computer Science and Engineering");
            niraj.setSemester(5);
            niraj.setSubjects(List.of(
                new SubjectMarkDto("CSE101", "Data Structures", 4, 72.0, 76.0),
                new SubjectMarkDto("CSE102", "Database Management Systems", 4, 75.0, 78.0),
                new SubjectMarkDto("CSE103", "Computer Networks", 4, 68.0, 72.0),
                new SubjectMarkDto("CSE104", "Web Technology", 4, 74.0, 80.0)
            ));
            resultService.processAndSaveResult(niraj);

            // 4. Manas (Average / Grade B+)
            ResultFormDto manas = new ResultFormDto();
            manas.setRollNumber("22BCE1004");
            manas.setStudentName("Manas");
            manas.setProgram("B.Tech Computer Science and Engineering");
            manas.setSemester(5);
            manas.setSubjects(List.of(
                new SubjectMarkDto("CSE101", "Data Structures", 4, 60.0, 62.0),
                new SubjectMarkDto("CSE102", "Database Management Systems", 4, 58.0, 64.0),
                new SubjectMarkDto("CSE103", "Computer Networks", 4, 52.0, 55.0),
                new SubjectMarkDto("CSE104", "Web Technology", 4, 65.0, 68.0)
            ));
            resultService.processAndSaveResult(manas);

            // 5. Piyush (Failing subject demonstration / Grade F in Web Technology)
            ResultFormDto piyush = new ResultFormDto();
            piyush.setRollNumber("22BCE1005");
            piyush.setStudentName("Piyush");
            piyush.setProgram("B.Tech Computer Science and Engineering");
            piyush.setSemester(5);
            piyush.setSubjects(List.of(
                new SubjectMarkDto("CSE101", "Data Structures", 4, 50.0, 52.0),
                new SubjectMarkDto("CSE102", "Database Management Systems", 4, 48.0, 50.0),
                new SubjectMarkDto("CSE103", "Computer Networks", 4, 42.0, 45.0),
                new SubjectMarkDto("CSE104", "Web Technology", 4, 20.0, 32.0)
            ));
            resultService.processAndSaveResult(piyush);

            log.info("Sample dummy student results created successfully.");
        }
    }
}
