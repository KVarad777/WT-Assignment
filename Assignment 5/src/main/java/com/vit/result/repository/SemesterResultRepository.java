package com.vit.result.repository;

import com.vit.result.entity.SemesterResult;
import com.vit.result.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SemesterResultRepository extends JpaRepository<SemesterResult, Long> {
    List<SemesterResult> findByStudentOrderByCreatedAtDesc(Student student);
    List<SemesterResult> findAllByOrderByCreatedAtDesc();

    @Query("SELECT r FROM SemesterResult r WHERE LOWER(r.student.rollNumber) = LOWER(:rollNumber) ORDER BY r.createdAt DESC")
    List<SemesterResult> findByStudentRollNumber(@Param("rollNumber") String rollNumber);

    @Query("SELECT r FROM SemesterResult r WHERE LOWER(r.student.rollNumber) = LOWER(:rollNumber) OR LOWER(r.student.name) LIKE LOWER(CONCAT('%', :keyword, '%')) ORDER BY r.createdAt DESC")
    List<SemesterResult> searchResults(@Param("rollNumber") String rollNumber, @Param("keyword") String keyword);
}
