/**
 * VIT Semester Result — Frontend Live Preview Calculation
 * Formula: (MSE * 0.30) + (ESE * 0.70)
 * Note: The final result is always calculated securely by the Spring Boot backend service.
 */

document.addEventListener('DOMContentLoaded', () => {
    const subjectCards = document.querySelectorAll('.subject-input-card');
    const summaryTotalMarks = document.getElementById('summary-total-marks');
    const summaryAverage = document.getElementById('summary-average');
    const summarySgpa = document.getElementById('summary-sgpa');
    const summaryStatus = document.getElementById('summary-status');

    if (!subjectCards.length) {
        return; // Not on the form page
    }

    /**
     * Determines grade from total marks
     */
    function getGrade(total) {
        if (total >= 90.0) return 'O';
        if (total >= 80.0) return 'A+';
        if (total >= 70.0) return 'A';
        if (total >= 60.0) return 'B+';
        if (total >= 50.0) return 'B';
        if (total >= 40.0) return 'C';
        return 'F';
    }

    /**
     * Determines grade point from grade
     */
    function getGradePoint(grade) {
        switch (grade) {
            case 'O': return 10;
            case 'A+': return 9;
            case 'A': return 8;
            case 'B+': return 7;
            case 'B': return 6;
            case 'C': return 5;
            default: return 0;
        }
    }

    /**
     * Updates live calculations across all subjects and overall summary
     */
    function updateLivePreview() {
        let grandTotal = 0;
        let totalCredits = 0;
        let weightedPointsSum = 0;
        let allValid = true;
        let allPassed = true;
        let hasAnyInput = false;

        subjectCards.forEach(card => {
            const index = card.getAttribute('data-index');
            const mseInput = card.querySelector('.mse-input');
            const eseInput = card.querySelector('.ese-input');
            const totalEl = document.getElementById(`live-total-${index}`);
            const gradeEl = document.getElementById(`live-grade-${index}`);
            const formulaEl = document.getElementById(`live-breakdown-${index}`);

            const mseVal = mseInput.value.trim();
            const eseVal = eseInput.value.trim();

            if (mseVal !== '' || eseVal !== '') {
                hasAnyInput = true;
            }

            if (mseVal === '' || eseVal === '' || isNaN(mseVal) || isNaN(eseVal)) {
                if (totalEl) totalEl.textContent = '--';
                if (gradeEl) {
                    gradeEl.textContent = '--';
                    gradeEl.className = 'calc-grade-badge';
                }
                if (formulaEl) formulaEl.textContent = '(0 × 0.3) + (0 × 0.7)';
                allValid = false;
                return;
            }

            const mse = Math.min(100, Math.max(0, parseFloat(mseVal)));
            const ese = Math.min(100, Math.max(0, parseFloat(eseVal)));

            const weightedMse = mse * 0.30;
            const weightedEse = ese * 0.70;
            const subjectTotal = parseFloat((weightedMse + weightedEse).toFixed(2));
            const grade = getGrade(subjectTotal);
            const gradePoint = getGradePoint(grade);
            const isPass = subjectTotal >= 40.0;

            if (!isPass) {
                allPassed = false;
            }

            if (totalEl) totalEl.textContent = subjectTotal.toFixed(1);
            if (gradeEl) {
                gradeEl.textContent = `${grade} (${gradePoint})`;
                gradeEl.className = `calc-grade-badge ${isPass ? 'badge-pass-sm' : 'badge-fail-sm'}`;
            }
            if (formulaEl) {
                formulaEl.textContent = `(${weightedMse.toFixed(1)} + ${weightedEse.toFixed(1)})`;
            }

            grandTotal += subjectTotal;
            totalCredits += 4;
            weightedPointsSum += (gradePoint * 4);
        });

        // Update overall summary bar
        if (hasAnyInput && allValid && subjectCards.length > 0) {
            const avg = grandTotal / subjectCards.length;
            const sgpa = totalCredits > 0 ? (weightedPointsSum / totalCredits) : 0.0;

            if (summaryTotalMarks) summaryTotalMarks.innerHTML = `${grandTotal.toFixed(1)} <span class="metric-unit">/ 400</span>`;
            if (summaryAverage) summaryAverage.innerHTML = `${avg.toFixed(2)} <span class="metric-unit">%</span>`;
            if (summarySgpa) summarySgpa.textContent = sgpa.toFixed(2);

            if (summaryStatus) {
                if (allPassed) {
                    summaryStatus.textContent = 'Projected PASS';
                    summaryStatus.className = 'badge badge-pass';
                } else {
                    summaryStatus.textContent = 'Projected FAIL';
                    summaryStatus.className = 'badge badge-fail';
                }
            }
        } else {
            if (summaryTotalMarks) summaryTotalMarks.innerHTML = `0.00 <span class="metric-unit">/ 400</span>`;
            if (summaryAverage) summaryAverage.innerHTML = `0.00 <span class="metric-unit">%</span>`;
            if (summarySgpa) summarySgpa.textContent = `0.00`;
            if (summaryStatus) {
                summaryStatus.textContent = 'Pending Inputs';
                summaryStatus.className = 'badge badge-pending';
            }
        }
    }

    // Attach real-time input listeners
    document.querySelectorAll('.mark-input').forEach(input => {
        input.addEventListener('input', updateLivePreview);
        input.addEventListener('change', updateLivePreview);
    });

    // Run once on load to handle pre-populated sample values
    updateLivePreview();
});
