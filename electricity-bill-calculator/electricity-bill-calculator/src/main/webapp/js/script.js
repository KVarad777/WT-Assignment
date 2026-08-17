/**
 * Electricity Bill Calculator — client-side behaviour.
 * Handles: dark-mode toggle (persisted), calculator form validation +
 * loading spinner, toast notifications, and live search/sort/delete on the
 * history table.
 */
(function () {
    "use strict";

    const THEME_KEY = "ebc-theme";

    /* ------------------------------------------------------------------
     * Dark mode
     * ---------------------------------------------------------------- */
    function applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        const icon = document.getElementById("themeIcon");
        if (icon) {
            icon.className = theme === "dark" ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";
        }
    }

    function initTheme() {
        const saved = localStorage.getItem(THEME_KEY) ||
            (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        applyTheme(saved);

        const toggleBtn = document.getElementById("themeToggle");
        if (toggleBtn) {
            toggleBtn.addEventListener("click", function () {
                const current = document.documentElement.getAttribute("data-theme") || "light";
                const next = current === "dark" ? "light" : "dark";
                applyTheme(next);
                localStorage.setItem(THEME_KEY, next);
            });
        }
    }

    /* ------------------------------------------------------------------
     * Loading overlay (shown while the calculate form submits)
     * ---------------------------------------------------------------- */
    function showLoading() {
        const overlay = document.getElementById("loadingOverlay");
        if (overlay) {
            overlay.classList.add("active");
        }
    }

    function hideLoading() {
        const overlay = document.getElementById("loadingOverlay");
        if (overlay) {
            overlay.classList.remove("active");
        }
    }

    /* ------------------------------------------------------------------
     * Toast notifications (Bootstrap 5 Toast)
     * ---------------------------------------------------------------- */
    function showToast(message, variant) {
        variant = variant || "primary";
        const container = document.getElementById("toastContainer");
        if (!container) {
            return;
        }
        const toastEl = document.createElement("div");
        toastEl.className = "toast align-items-center text-bg-" + variant + " border-0";
        toastEl.setAttribute("role", "alert");
        toastEl.setAttribute("aria-live", "assertive");
        toastEl.setAttribute("aria-atomic", "true");
        toastEl.innerHTML =
            '<div class="d-flex">' +
            '<div class="toast-body">' + message + "</div>" +
            '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>' +
            "</div>";
        container.appendChild(toastEl);
        const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
        toast.show();
        toastEl.addEventListener("hidden.bs.toast", function () {
            toastEl.remove();
        });
    }
    window.EBC = window.EBC || {};
    window.EBC.showToast = showToast;

    /* ------------------------------------------------------------------
     * Calculator form: client-side validation + loading state
     * ---------------------------------------------------------------- */
    function initCalculatorForm() {
        const form = document.getElementById("calculatorForm");
        if (!form) {
            return;
        }

        form.addEventListener("submit", function (e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
                showToast("Please fill in all fields correctly.", "danger");
            } else {
                showLoading();
            }
            form.classList.add("was-validated");
        });

        const resetBtn = document.getElementById("resetBtn");
        if (resetBtn) {
            resetBtn.addEventListener("click", function () {
                form.reset();
                form.classList.remove("was-validated");
                showToast("Form has been reset.", "secondary");
            });
        }
    }

    /* ------------------------------------------------------------------
     * History page: instant client-side search + sort + delete confirm
     * ---------------------------------------------------------------- */
    function initHistoryTable() {
        const table = document.getElementById("historyTable");
        if (!table) {
            return;
        }

        const searchInput = document.getElementById("historySearch");
        if (searchInput) {
            searchInput.addEventListener("keyup", function () {
                const term = searchInput.value.toLowerCase();
                const rows = table.querySelectorAll("tbody tr");
                let visibleCount = 0;
                rows.forEach(function (row) {
                    const text = row.textContent.toLowerCase();
                    const match = text.indexOf(term) !== -1;
                    row.style.display = match ? "" : "none";
                    if (match) visibleCount++;
                });
                const emptyState = document.getElementById("historyEmptyState");
                if (emptyState) {
                    emptyState.style.display = visibleCount === 0 ? "block" : "none";
                }
            });
        }

        // Client-side column sorting on header click
        table.querySelectorAll("th[data-sort-key]").forEach(function (th) {
            th.style.cursor = "pointer";
            th.addEventListener("click", function () {
                const key = th.getAttribute("data-sort-key");
                const tbody = table.querySelector("tbody");
                const rows = Array.from(tbody.querySelectorAll("tr"));
                const ascending = th.getAttribute("data-sort-dir") !== "asc";

                rows.sort(function (a, b) {
                    const aVal = a.getAttribute("data-" + key);
                    const bVal = b.getAttribute("data-" + key);
                    const aNum = parseFloat(aVal);
                    const bNum = parseFloat(bVal);
                    let cmp;
                    if (!isNaN(aNum) && !isNaN(bNum)) {
                        cmp = aNum - bNum;
                    } else {
                        cmp = String(aVal).localeCompare(String(bVal));
                    }
                    return ascending ? cmp : -cmp;
                });

                rows.forEach(function (row) {
                    tbody.appendChild(row);
                });

                table.querySelectorAll("th[data-sort-key]").forEach(function (h) {
                    h.removeAttribute("data-sort-dir");
                    const ic = h.querySelector(".sort-icon");
                    if (ic) ic.className = "sort-icon bi bi-arrow-down-up";
                });
                th.setAttribute("data-sort-dir", ascending ? "asc" : "desc");
                const icon = th.querySelector(".sort-icon");
                if (icon) {
                    icon.className = ascending ? "sort-icon bi bi-sort-up" : "sort-icon bi bi-sort-down";
                }
            });
        });

        // Confirm before deleting a bill
        table.querySelectorAll(".delete-bill-form").forEach(function (form) {
            form.addEventListener("submit", function (e) {
                const ok = window.confirm("Delete this bill from history? This cannot be undone.");
                if (!ok) {
                    e.preventDefault();
                }
            });
        });
    }

    /* ------------------------------------------------------------------
     * Contact form: simple client-side check
     * ---------------------------------------------------------------- */
    function initContactForm() {
        const form = document.getElementById("contactForm");
        if (!form) {
            return;
        }
        form.addEventListener("submit", function (e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            form.classList.add("was-validated");
        });
    }

    /* ------------------------------------------------------------------
     * Auto-dismissing server-rendered toasts (e.g. after delete/redirect)
     * ---------------------------------------------------------------- */
    function initServerToasts() {
        document.querySelectorAll(".toast[data-autoshow='true']").forEach(function (el) {
            const toast = new bootstrap.Toast(el, { delay: 4000 });
            toast.show();
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        initTheme();
        initCalculatorForm();
        initHistoryTable();
        initContactForm();
        initServerToasts();
        hideLoading();
    });
})();
