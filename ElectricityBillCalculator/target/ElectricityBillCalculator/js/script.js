/**
 * ElectroBill — Main JavaScript
 * jQuery-powered interactions: validation, live preview, 
 * pagination, search, dark mode, animations, counters.
 *
 * @author Senior Full Stack Java Developer
 * @version 1.0
 */

$(document).ready(function () {

    /* ═══════════════════════════════════════════════════
       1. DARK MODE TOGGLE
    ════════════════════════════════════════════════════ */
    const DARK_MODE_KEY = 'electrobill_dark_mode';

    // Load saved preference (default: dark)
    if (localStorage.getItem(DARK_MODE_KEY) === 'light') {
        $('body').addClass('light-mode');
        $('#darkModeIcon').removeClass('bi-moon-fill').addClass('bi-sun-fill');
    }

    $('#darkModeToggle').on('click', function () {
        $('body').toggleClass('light-mode');
        const isLight = $('body').hasClass('light-mode');
        $('#darkModeIcon')
            .toggleClass('bi-moon-fill', !isLight)
            .toggleClass('bi-sun-fill', isLight);
        localStorage.setItem(DARK_MODE_KEY, isLight ? 'light' : 'dark');
    });


    /* ═══════════════════════════════════════════════════
       2. CALCULATOR FORM VALIDATION
    ════════════════════════════════════════════════════ */
    $('#billForm').on('submit', function (e) {
        let valid = true;

        // Clear previous errors
        clearErrors();

        // Customer Name
        const name = $('#customerName').val().trim();
        if (!name) {
            showError('customerName', 'nameError', 'Customer name is required');
            valid = false;
        } else if (name.length < 2) {
            showError('customerName', 'nameError', 'Name must be at least 2 characters');
            valid = false;
        }

        // Customer Number
        const number = $('#customerNumber').val().trim();
        if (!number) {
            showError('customerNumber', 'numberError', 'Customer/Meter number is required');
            valid = false;
        }

        // Units
        const unitsStr = $('#units').val().trim();
        if (!unitsStr) {
            showError('units', 'unitsError', 'Units consumed is required');
            valid = false;
        } else {
            const units = parseFloat(unitsStr);
            if (isNaN(units)) {
                showError('units', 'unitsError', 'Please enter a valid number');
                valid = false;
            } else if (units < 0) {
                showError('units', 'unitsError', 'Units cannot be negative');
                valid = false;
            } else if (units > 99999) {
                showError('units', 'unitsError', 'Units seem unrealistically high (max 99,999)');
                valid = false;
            }
        }

        if (!valid) {
            e.preventDefault();
            // Shake the card on error
            $('.calculator-card').addClass('shake');
            setTimeout(() => $('.calculator-card').removeClass('shake'), 600);
        } else {
            // Show loading state
            $('#calculateBtn .btn-text').addClass('d-none');
            $('#calculateBtn .btn-spinner').removeClass('d-none');
            $('#calculateBtn').prop('disabled', true);
        }
    });

    function showError(inputId, errorId, message) {
        $('#' + inputId).addClass('is-error');
        $('#' + errorId).html('<i class="bi bi-exclamation-circle-fill"></i> ' + message);
    }

    function clearErrors() {
        $('.form-control-custom').removeClass('is-error');
        $('.invalid-feedback-custom').html('');
    }

    // Clear error on input
    $('.form-control-custom').on('input', function () {
        $(this).removeClass('is-error');
        const id = $(this).attr('id');
        $('#' + id + 'Error').html('');
    });


    /* ═══════════════════════════════════════════════════
       3. RESET BUTTON
    ════════════════════════════════════════════════════ */
    $('#resetBtn').on('click', function () {
        clearErrors();
        $('#livePreview').addClass('d-none');
        $('#liveAmount').text('₹0.00');
    });


    /* ═══════════════════════════════════════════════════
       4. LIVE PREVIEW — estimate as user types units
    ════════════════════════════════════════════════════ */
    $('#units').on('input', function () {
        const val = parseFloat($(this).val());
        if (!isNaN(val) && val >= 0) {
            const est = calculateBillJS(val);
            $('#liveAmount').text('₹' + est.toFixed(2));
            $('#livePreview').removeClass('d-none');
        } else {
            $('#livePreview').addClass('d-none');
        }
    });

    /**
     * JavaScript mirror of the Java slab calculation
     * Used only for live preview — the server does the authoritative calc.
     */
    function calculateBillJS(units) {
        let total = 0;
        let remaining = units;

        const s1 = Math.min(remaining, 50);    total += s1 * 3.50; remaining -= s1;
        const s2 = Math.min(remaining, 100);   total += s2 * 4.00; remaining -= s2;
        const s3 = Math.min(remaining, 100);   total += s3 * 5.20; remaining -= s3;
        const s4 = remaining;                  total += s4 * 6.50;

        return Math.round(total * 100) / 100;
    }


    /* ═══════════════════════════════════════════════════
       5. ANIMATED COUNTER (Hero stats)
    ════════════════════════════════════════════════════ */
    animateCounter($('#counterBills'), 0, 1247, 2000);


    /* ═══════════════════════════════════════════════════
       6. SMOOTH SCROLL
    ════════════════════════════════════════════════════ */
    $('a[href^="#"]').on('click', function (e) {
        const target = $(this.getAttribute('href'));
        if (target.length) {
            e.preventDefault();
            $('html, body').stop().animate({ scrollTop: target.offset().top - 80 }, 600, 'swing');
        }
    });


    /* ═══════════════════════════════════════════════════
       7. AUTO-DISMISS ALERTS
    ════════════════════════════════════════════════════ */
    setTimeout(function () {
        $('.alert').not('.alert-permanent').fadeOut(500, function () {
            $(this).remove();
        });
    }, 5000);


    /* ═══════════════════════════════════════════════════
       8. INTERSECTION OBSERVER — staggered fade-in
    ════════════════════════════════════════════════════ */
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.animate-fadeUp').forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }


    /* ═══════════════════════════════════════════════════
       9. CARD HOVER RIPPLE
    ════════════════════════════════════════════════════ */
    $('.feature-card').on('mouseenter', function (e) {
        const $card = $(this);
        const offset = $card.offset();
        const x = e.pageX - offset.left;
        const y = e.pageY - offset.top;

        const $ripple = $('<span class="ripple-effect"></span>').css({
            left: x, top: y
        });

        $card.append($ripple);
        setTimeout(() => $ripple.remove(), 700);
    });

}); // end document ready


/* ═══════════════════════════════════════════════════
   10. ANIMATED COUNTER UTILITY (used on result page too)
════════════════════════════════════════════════════ */
function animateCounter($el, from, to, duration) {
    if (!$el.length) return;
    const start   = Date.now();
    const isFloat = to % 1 !== 0;

    function update() {
        const elapsed  = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current  = from + (to - from) * eased;

        $el.text(isFloat ? current.toFixed(2) : Math.floor(current).toLocaleString('en-IN'));

        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}


/* ═══════════════════════════════════════════════════
   11. HISTORY TABLE: Search + Pagination + Sort
════════════════════════════════════════════════════ */
function initHistoryTable(contextPath) {
    const $rows       = $('#historyTableBody .history-row');
    const $search     = $('#historySearch');
    const $clearBtn   = $('#clearSearch');
    const $noResults  = $('#noSearchResults');
    const $pageList   = $('#paginationList');
    const $pageSelect = $('#pageSizeSelect');
    const $visible    = $('#visibleCount');

    let pageSize    = parseInt($pageSelect.val()) || 10;
    let currentPage = 1;
    let filteredRows = $rows.toArray();

    // ── Search ──────────────────────────────────────────────
    $search.on('input', function () {
        const q = $(this).val().trim().toLowerCase();
        $clearBtn.toggleClass('d-none', q === '');

        filteredRows = $rows.filter(function () {
            const text = (
                $(this).data('name') + ' ' +
                $(this).data('number') + ' ' +
                $(this).data('amount') + ' ' +
                $(this).data('date')
            ).toLowerCase();
            return text.includes(q);
        }).toArray();

        currentPage = 1;
        renderPage();
    });

    $clearBtn.on('click', function () {
        $search.val('').trigger('input');
        $(this).addClass('d-none');
    });

    // ── Page Size ────────────────────────────────────────────
    $pageSelect.on('change', function () {
        pageSize    = parseInt($(this).val()) || $rows.length;
        currentPage = 1;
        renderPage();
    });

    // ── Sort ─────────────────────────────────────────────────
    let sortCol = null, sortAsc = true;

    $('.sortable').on('click', function () {
        const col = $(this).data('sort');
        if (sortCol === col) {
            sortAsc = !sortAsc;
        } else {
            sortCol = col; sortAsc = true;
        }

        // Update icons
        $('.sortable .sort-icon')
            .removeClass('bi-chevron-up bi-chevron-down')
            .addClass('bi-chevron-expand').css('opacity', 0.4);

        $(this).find('.sort-icon')
            .removeClass('bi-chevron-expand')
            .addClass(sortAsc ? 'bi-chevron-up' : 'bi-chevron-down')
            .css('opacity', 1);

        filteredRows.sort(function (a, b) {
            let aVal, bVal;
            switch (col) {
                case 'id':     aVal = parseInt($(a).data('id'));    bVal = parseInt($(b).data('id'));    break;
                case 'name':   aVal = $(a).data('name').toLowerCase(); bVal = $(b).data('name').toLowerCase(); break;
                case 'units':  aVal = parseFloat($(a).data('units')); bVal = parseFloat($(b).data('units')); break;
                case 'amount': aVal = parseFloat($(a).data('amount')); bVal = parseFloat($(b).data('amount')); break;
                case 'date':   aVal = $(a).data('date');            bVal = $(b).data('date');            break;
                default: return 0;
            }
            if (aVal < bVal) return sortAsc ? -1 : 1;
            if (aVal > bVal) return sortAsc ?  1 : -1;
            return 0;
        });

        renderPage();
    });

    // ── Render Page ──────────────────────────────────────────
    function renderPage() {
        $rows.hide();
        $noResults.addClass('d-none');

        if (filteredRows.length === 0) {
            $noResults.removeClass('d-none');
            $pageList.empty();
            $visible.text(0);
            return;
        }

        const total       = filteredRows.length;
        const totalPages  = Math.ceil(total / pageSize);
        currentPage       = Math.min(currentPage, totalPages);

        const start = (currentPage - 1) * pageSize;
        const end   = Math.min(start + pageSize, total);

        filteredRows.forEach(function (row, i) {
            if (i >= start && i < end) {
                $(row).show();
            }
        });

        $visible.text(total);

        // ── Pagination UI ────────────────────────────────────
        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        $pageList.empty();
        if (totalPages <= 1) return;

        // Prev
        $pageList.append(buildPageItem('&laquo;', currentPage - 1, currentPage === 1));

        // Page numbers (window of 5)
        let startP = Math.max(1, currentPage - 2);
        let endP   = Math.min(totalPages, startP + 4);
        if (endP - startP < 4) startP = Math.max(1, endP - 4);

        for (let p = startP; p <= endP; p++) {
            $pageList.append(buildPageItem(p, p, false, p === currentPage));
        }

        // Next
        $pageList.append(buildPageItem('&raquo;', currentPage + 1, currentPage === totalPages));
    }

    function buildPageItem(label, targetPage, disabled, active) {
        const $li = $('<li class="page-item"></li>');
        if (disabled) $li.addClass('disabled');
        if (active)   $li.addClass('active');

        const $a = $('<a class="page-link" href="#"></a>').html(label);

        if (!disabled && !active) {
            $a.on('click', function (e) {
                e.preventDefault();
                currentPage = targetPage;
                renderPage();
                $('html,body').animate({ scrollTop: $('#historyTable').offset().top - 100 }, 300);
            });
        }

        $li.append($a);
        return $li;
    }

    // Initial render
    renderPage();
}


/* ═══════════════════════════════════════════════════
   12. CSS-only SHAKE animation (injected dynamically)
════════════════════════════════════════════════════ */
$('<style>')
    .text(`
        @keyframes shake {
            0%,100% { transform: translateX(0); }
            15%      { transform: translateX(-8px); }
            30%      { transform: translateX(8px); }
            45%      { transform: translateX(-5px); }
            60%      { transform: translateX(5px); }
            75%      { transform: translateX(-3px); }
        }
        .shake { animation: shake 0.55s cubic-bezier(0.36,0.07,0.19,0.97) both; }

        @keyframes ripple {
            to { transform: scale(4); opacity: 0; }
        }
        .ripple-effect {
            position: absolute;
            width: 40px; height: 40px;
            border-radius: 50%;
            background: rgba(108,99,255,0.3);
            transform: scale(0);
            animation: ripple 0.7s linear;
            pointer-events: none;
            margin-left: -20px; margin-top: -20px;
        }
    `)
    .appendTo('head');
