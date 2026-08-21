package com.vit.result.controller;

import com.vit.result.dto.ResultFormDto;
import com.vit.result.dto.SubjectMarkDto;
import com.vit.result.entity.SemesterResult;
import com.vit.result.service.ResultService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.Optional;

/**
 * Controller managing Result entry form, calculation, marksheet view, and history.
 */
@Controller
@RequestMapping("/result")
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    /**
     * Display empty semester result form with standard four subjects.
     */
    @GetMapping({"", "/new"})
    public String showResultForm(Model model) {
        if (!model.containsAttribute("resultForm")) {
            model.addAttribute("resultForm", resultService.createEmptyForm());
        }
        return "form";
    }

    /**
     * Pre-populate form with dummy sample student data for instant live demo.
     */
    @GetMapping("/sample/{studentKey}")
    public String loadSampleData(@PathVariable("studentKey") String studentKey, Model model) {
        ResultFormDto formDto = new ResultFormDto();
        formDto.setProgram("B.Tech Computer Science and Engineering");
        formDto.setSemester(5);

        switch (studentKey.toLowerCase()) {
            case "varad" -> {
                formDto.setRollNumber("22BCE1001");
                formDto.setStudentName("Varad Deshpande");
                formDto.setSubjects(List.of(
                    new SubjectMarkDto("CSE101", "Data Structures", 4, 92.0, 94.0),
                    new SubjectMarkDto("CSE102", "Database Management Systems", 4, 88.0, 90.0),
                    new SubjectMarkDto("CSE103", "Computer Networks", 4, 90.0, 92.0),
                    new SubjectMarkDto("CSE104", "Web Technology", 4, 95.0, 96.0)
                ));
            }
            case "sarvesh" -> {
                formDto.setRollNumber("22BCE1002");
                formDto.setStudentName("Sarvesh Joshi");
                formDto.setSubjects(List.of(
                    new SubjectMarkDto("CSE101", "Data Structures", 4, 82.0, 85.0),
                    new SubjectMarkDto("CSE102", "Database Management Systems", 4, 80.0, 84.0),
                    new SubjectMarkDto("CSE103", "Computer Networks", 4, 78.0, 82.0),
                    new SubjectMarkDto("CSE104", "Web Technology", 4, 85.0, 88.0)
                ));
            }
            case "niraj" -> {
                formDto.setRollNumber("22BCE1003");
                formDto.setStudentName("Niraj Patil");
                formDto.setSubjects(List.of(
                    new SubjectMarkDto("CSE101", "Data Structures", 4, 72.0, 76.0),
                    new SubjectMarkDto("CSE102", "Database Management Systems", 4, 75.0, 78.0),
                    new SubjectMarkDto("CSE103", "Computer Networks", 4, 68.0, 72.0),
                    new SubjectMarkDto("CSE104", "Web Technology", 4, 74.0, 80.0)
                ));
            }
            case "manas" -> {
                formDto.setRollNumber("22BCE1004");
                formDto.setStudentName("Manas Kulkarni");
                formDto.setSubjects(List.of(
                    new SubjectMarkDto("CSE101", "Data Structures", 4, 60.0, 62.0),
                    new SubjectMarkDto("CSE102", "Database Management Systems", 4, 58.0, 64.0),
                    new SubjectMarkDto("CSE103", "Computer Networks", 4, 52.0, 55.0),
                    new SubjectMarkDto("CSE104", "Web Technology", 4, 65.0, 68.0)
                ));
            }
            case "piyush" -> {
                formDto.setRollNumber("22BCE1005");
                formDto.setStudentName("Piyush Shinde");
                formDto.setSubjects(List.of(
                    new SubjectMarkDto("CSE101", "Data Structures", 4, 50.0, 52.0),
                    new SubjectMarkDto("CSE102", "Database Management Systems", 4, 48.0, 50.0),
                    new SubjectMarkDto("CSE103", "Computer Networks", 4, 42.0, 45.0),
                    new SubjectMarkDto("CSE104", "Web Technology", 4, 20.0, 32.0)
                ));
            }
            default -> {
                formDto = resultService.createEmptyForm();
            }
        }

        model.addAttribute("resultForm", formDto);
        model.addAttribute("sampleLoaded", studentKey);
        return "form";
    }

    /**
     * Submit and calculate semester result.
     */
    @PostMapping("/calculate")
    public String calculateResult(@Valid @ModelAttribute("resultForm") ResultFormDto formDto,
                                  BindingResult bindingResult,
                                  Model model,
                                  RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("errorMessage", "Please correct the highlighted errors in the form.");
            return "form";
        }

        try {
            SemesterResult savedResult = resultService.processAndSaveResult(formDto);
            redirectAttributes.addFlashAttribute("successMessage", "Semester result generated and recorded successfully!");
            return "redirect:/result/view/" + savedResult.getId();
        } catch (Exception ex) {
            model.addAttribute("errorMessage", "Error calculating result: " + ex.getMessage());
            return "form";
        }
    }

    /**
     * Display the official academic result marksheet.
     */
    @GetMapping("/view/{id}")
    public String viewResult(@PathVariable("id") Long id, Model model) {
        Optional<SemesterResult> resultOpt = resultService.getResultById(id);
        if (resultOpt.isEmpty()) {
            model.addAttribute("errorTitle", "Result Not Found");
            model.addAttribute("errorMessage", "The requested semester result record could not be found.");
            return "error";
        }

        model.addAttribute("result", resultOpt.get());
        return "result";
    }

    /**
     * Display list of all generated semester results / history search.
     */
    @GetMapping("/all")
    public String listAllResults(@RequestParam(value = "query", required = false) String query, Model model) {
        List<SemesterResult> results = resultService.searchResults(query);
        model.addAttribute("results", results);
        model.addAttribute("query", query != null ? query : "");
        return "history";
    }
}
