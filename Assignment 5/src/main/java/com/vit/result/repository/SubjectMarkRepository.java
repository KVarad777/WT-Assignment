package com.vit.result.repository;

import com.vit.result.entity.SubjectMark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectMarkRepository extends JpaRepository<SubjectMark, Long> {
    List<SubjectMark> findBySemesterResultId(Long semesterResultId);
}
