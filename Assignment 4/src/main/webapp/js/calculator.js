/**
 * Interactive Client-side Progressive Electricity Bill Estimator
 * Mirroring the backend progressive algorithm for real-time reactivity.
 */

// Progressive tariff definition
const TARIFF_SLABS = [
    { order: 1, name: 'First 50 units', min: 0, max: 50, rate: 3.50, capacity: 50, color: 'var(--slab-1-color)' },
    { order: 2, name: 'Next 100 units', min: 50, max: 150, rate: 4.00, capacity: 100, color: 'var(--slab-2-color)' },
    { order: 3, name: 'Next 100 units', min: 150, max: 250, rate: 5.20, capacity: 100, color: 'var(--slab-3-color)' },
    { order: 4, name: 'Above 250 units', min: 250, max: null, rate: 6.50, capacity: null, color: 'var(--slab-4-color)' }
];

document.addEventListener('DOMContentLoaded', () => {
    initModeToggle();
    initCalculationListeners();
    initPresets();
    runLiveEstimate(); // Initial run
});

function initModeToggle() {
    const modeRadios = document.querySelectorAll('input[name="readingMode"]');
    const meterReadingsGroup = document.getElementById('meterReadingsGroup');
    const directUnitsGroup = document.getElementById('directUnitsGroup');

    modeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'direct') {
                meterReadingsGroup.style.display = 'none';
                directUnitsGroup.style.display = 'block';
            } else {
                meterReadingsGroup.style.display = 'grid';
                directUnitsGroup.style.display = 'none';
            }
            runLiveEstimate();
        });
    });
}

function initCalculationListeners() {
    const inputs = ['previousReading', 'currentReading', 'directUnits'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', runLiveEstimate);
        }
    });
}

function getCalculatedUnits() {
    const isDirect = document.querySelector('input[name="readingMode"]:checked')?.value === 'direct';
    if (isDirect) {
        const val = parseFloat(document.getElementById('directUnits')?.value) || 0;
        return Math.max(0, val);
    } else {
        const prev = parseFloat(document.getElementById('previousReading')?.value) || 0;
        const curr = parseFloat(document.getElementById('currentReading')?.value) || 0;
        const diff = curr - prev;
        return diff > 0 ? diff : 0;
    }
}

function runLiveEstimate() {
    const units = getCalculatedUnits();
    const result = calculateProgressive(units);

    // Update Live Estimate Panel
    const liveUnitsEl = document.getElementById('liveUnitsDisplay');
    const liveTotalEl = document.getElementById('liveTotalDisplay');
    const liveAvgRateEl = document.getElementById('liveAvgRateDisplay');
    const liveTierBadge = document.getElementById('liveTierBadge');
    const liveInsightText = document.getElementById('liveInsightText');

    if (liveUnitsEl) liveUnitsEl.innerText = units.toLocaleString('en-IN', { maximumFractionDigits: 2 });
    if (liveTotalEl) liveTotalEl.innerText = '₹' + result.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (liveAvgRateEl) liveAvgRateEl.innerText = '₹' + result.avgRate.toFixed(2) + ' / unit';

    // Update Badge & Insights
    if (liveTierBadge) {
        if (units <= 50) {
            liveTierBadge.className = 'badge badge-emerald';
            liveTierBadge.innerText = 'Slab 1: Lifeline';
            if (liveInsightText) liveInsightText.innerText = 'Within subsidized base lifeline tier (@ ₹3.50/unit).';
        } else if (units <= 150) {
            liveTierBadge.className = 'badge badge-blue';
            liveTierBadge.innerText = 'Slab 2: Moderate';
            if (liveInsightText) liveInsightText.innerText = 'Within moderate domestic tier (@ ₹4.00/unit).';
        } else if (units <= 250) {
            liveTierBadge.className = 'badge badge-amber';
            liveTierBadge.innerText = 'Slab 3: High Usage';
            if (liveInsightText) liveInsightText.innerText = 'Entered Slab 3 (@ ₹5.20/unit). Conserve to lower tariff.';
        } else {
            liveTierBadge.className = 'badge badge-rose';
            liveTierBadge.innerText = 'Slab 4: Surcharge Tier';
            if (liveInsightText) liveInsightText.innerText = 'Entered top tier (@ ₹6.50/unit) for consumption over 250 units.';
        }
    }

    // Update Slab ladder items
    result.breakdown.forEach((item, idx) => {
        const slabUnitsEl = document.getElementById(`liveSlabUnits_${idx + 1}`);
        const slabAmountEl = document.getElementById(`liveSlabAmount_${idx + 1}`);
        if (slabUnitsEl) slabUnitsEl.innerText = `${item.units.toFixed(1)} u`;
        if (slabAmountEl) slabAmountEl.innerText = '₹' + item.amount.toFixed(2);
    });

    // Update Progress Bars
    result.breakdown.forEach((item, idx) => {
        const barEl = document.getElementById(`liveMeterSeg_${idx + 1}`);
        if (barEl) {
            const pct = units > 0 ? (item.units / units) * 100 : 0;
            barEl.style.width = pct + '%';
        }
    });
}

function calculateProgressive(units) {
    let remaining = units;
    let total = 0;
    const breakdown = [];

    TARIFF_SLABS.forEach(slab => {
        let consumedInSlab = 0;
        if (remaining > 0) {
            if (slab.capacity !== null) {
                if (remaining >= slab.capacity) {
                    consumedInSlab = slab.capacity;
                    remaining -= slab.capacity;
                } else {
                    consumedInSlab = remaining;
                    remaining = 0;
                }
            } else {
                consumedInSlab = remaining;
                remaining = 0;
            }
        }
        const amt = consumedInSlab * slab.rate;
        total += amt;
        breakdown.push({
            order: slab.order,
            name: slab.name,
            rate: slab.rate,
            units: consumedInSlab,
            amount: amt
        });
    });

    const avgRate = units > 0 ? (total / units) : 0;
    return { total, avgRate, breakdown };
}

function initPresets() {
    const presets = [
        { name: 'Lifeline (45u)', units: 45, custName: 'Priya Sharma', consumer: 'ELC-10021' },
        { name: 'Family (120u)', units: 120, custName: 'Rajesh Patel', consumer: 'ELC-10042' },
        { name: 'Moderate (200u)', units: 200, custName: 'Vikram Verma', consumer: 'ELC-10085' },
        { name: 'High (300u)', units: 300, custName: 'Ananya Iyer', consumer: 'ELC-10114' },
        { name: 'Heavy (450u)', units: 450, custName: 'Rohan Mehta', consumer: 'ELC-10190' }
    ];

    const container = document.getElementById('presetsContainer');
    if (container) {
        container.innerHTML = '';
        presets.forEach(p => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'preset-chip';
            chip.innerText = p.name;
            chip.addEventListener('click', () => {
                const directRadio = document.getElementById('modeDirect');
                if (directRadio) {
                    directRadio.checked = true;
                    directRadio.dispatchEvent(new Event('change'));
                }
                const nameInput = document.getElementById('customerName');
                const numInput = document.getElementById('consumerNumber');
                const unitsInput = document.getElementById('directUnits');

                if (nameInput) nameInput.value = p.custName;
                if (numInput) numInput.value = p.consumer;
                if (unitsInput) unitsInput.value = p.units;

                runLiveEstimate();
            });
            container.appendChild(chip);
        });
    }
}
