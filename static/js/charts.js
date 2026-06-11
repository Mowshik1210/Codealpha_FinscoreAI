/**
 * FinScoreAI — Charts Manager
 * charts.js
 *
 * Handles all Chart.js visualizations:
 * - Hero Radar Chart
 * - Home Trend Area Chart
 * - Result Gauge/Doughnut Chart
 */

(function () {
    'use strict';

    // ============================================================
    // HELPERS
    // ============================================================

    /**
     * Get the current theme (dark or light)
     */
    function isDark() {
        return document.documentElement.getAttribute('data-theme') !== 'light';
    }

    /**
     * Theme-aware color helpers
     */
    function getTextColor() {
        return isDark() ? '#94A3B8' : '#64748B';
    }

    function getGridColor() {
        return isDark() ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';
    }

    function getCardBg() {
        return isDark() ? '#1E293B' : '#FFFFFF';
    }

    /**
     * Chart.js global defaults for FinScoreAI theme
     */
    function setGlobalDefaults() {
        if (typeof Chart === 'undefined') return;

        Chart.defaults.font.family = "'Inter', -apple-system, sans-serif";
        Chart.defaults.color = getTextColor();
        Chart.defaults.plugins.legend.display = false;
        Chart.defaults.plugins.tooltip.backgroundColor = getCardBg();
        Chart.defaults.plugins.tooltip.titleColor = isDark() ? '#F8FAFC' : '#0F172A';
        Chart.defaults.plugins.tooltip.bodyColor = getTextColor();
        Chart.defaults.plugins.tooltip.borderColor = isDark() ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
        Chart.defaults.plugins.tooltip.borderWidth = 1;
        Chart.defaults.plugins.tooltip.cornerRadius = 12;
        Chart.defaults.plugins.tooltip.padding = 12;
    }

    // ============================================================
    // HERO RADAR CHART
    // ============================================================
    function initHeroRadar(metrics) {
        const canvas = document.getElementById('heroRadarChart');
        if (!canvas || typeof Chart === 'undefined') return;

        const ctx = canvas.getContext('2d');

        const data = {
            labels: ['Accuracy', 'Precision', 'Recall', 'F1 Score', 'ROC-AUC'],
            datasets: [{
                label: 'Model Performance',
                data: [
                    metrics.accuracy,
                    metrics.precision,
                    metrics.recall,
                    metrics.f1_score,
                    metrics.roc_auc
                ],
                borderColor: '#38BDF8',
                borderWidth: 2,
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                pointBackgroundColor: '#38BDF8',
                pointBorderColor: '#38BDF8',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
            }]
        };

        new Chart(ctx, {
            type: 'radar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1500,
                    easing: 'easeInOutQuart',
                },
                scales: {
                    r: {
                        min: 80,
                        max: 100,
                        ticks: {
                            display: false,
                            stepSize: 5,
                        },
                        grid: {
                            color: getGridColor(),
                            lineWidth: 1,
                        },
                        angleLines: {
                            color: getGridColor(),
                            lineWidth: 1,
                        },
                        pointLabels: {
                            color: getTextColor(),
                            font: {
                                size: 10,
                                weight: '600',
                            },
                        },
                    },
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(ctx) {
                                return ctx.label + ': ' + ctx.raw.toFixed(2) + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // ============================================================
    // HOME TREND CHART (Area/Line)
    // ============================================================
    function initTrendChart() {
        const canvas = document.getElementById('trendChart');
        if (!canvas || typeof Chart === 'undefined') return;

        const ctx = canvas.getContext('2d');

        // Sample trend data
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
        const approvals = [65, 72, 68, 78, 82, 79, 88];
        const rejections = [35, 28, 32, 22, 18, 21, 12];

        // Gradient fills
        const approvalGradient = ctx.createLinearGradient(0, 0, 0, 160);
        approvalGradient.addColorStop(0, 'rgba(34, 197, 94, 0.25)');
        approvalGradient.addColorStop(1, 'rgba(34, 197, 94, 0.02)');

        const rejectionGradient = ctx.createLinearGradient(0, 0, 0, 160);
        rejectionGradient.addColorStop(0, 'rgba(239, 68, 68, 0.2)');
        rejectionGradient.addColorStop(1, 'rgba(239, 68, 68, 0.02)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Approvals',
                        data: approvals,
                        borderColor: '#22C55E',
                        borderWidth: 2.5,
                        backgroundColor: approvalGradient,
                        pointBackgroundColor: '#22C55E',
                        pointBorderColor: '#22C55E',
                        pointRadius: 4,
                        pointHoverRadius: 7,
                        fill: true,
                        tension: 0.4,
                    },
                    {
                        label: 'Rejections',
                        data: rejections,
                        borderColor: '#EF4444',
                        borderWidth: 2.5,
                        backgroundColor: rejectionGradient,
                        pointBackgroundColor: '#EF4444',
                        pointBorderColor: '#EF4444',
                        pointRadius: 4,
                        pointHoverRadius: 7,
                        fill: true,
                        tension: 0.4,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                animation: {
                    duration: 1200,
                    easing: 'easeInOutQuart',
                },
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    x: {
                        grid: { display: false },
                        border: { display: false },
                        ticks: {
                            color: getTextColor(),
                            font: { size: 11 },
                        },
                    },
                    y: {
                        display: false,
                        min: 0,
                        max: 100,
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(ctx) {
                                return ' ' + ctx.dataset.label + ': ' + ctx.raw + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // ============================================================
    // RESULT GAUGE CHART (built inline in result.html)
    // Using a doughnut chart as a gauge
    // ============================================================
    function initGaugeChart(canvasId, value, color) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || typeof Chart === 'undefined') return;

        const ctx = canvas.getContext('2d');

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [value, 100 - value],
                    backgroundColor: [
                        color,
                        isDark() ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                    ],
                    borderWidth: 0,
                    circumference: 180,
                    rotation: 270,
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                },
                animation: {
                    animateRotate: true,
                    duration: 1800,
                    easing: 'easeInOutCubic',
                }
            }
        });
    }

    // ============================================================
    // COMBINED INIT FOR HOME PAGE
    // Called from index.html template
    // ============================================================
    function initHomeCharts(metrics) {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded yet, retrying...');
            setTimeout(function() { initHomeCharts(metrics); }, 500);
            return;
        }

        setGlobalDefaults();
        initHeroRadar(metrics);
        initTrendChart();

        // Re-init on theme change
        document.getElementById('themeToggle')?.addEventListener('click', function () {
            setTimeout(function () {
                setGlobalDefaults();
                // Charts auto-update via Chart.js defaults
            }, 100);
        });
    }

    // ============================================================
    // EXPOSE PUBLIC API
    // ============================================================
    window.FinScoreCharts = {
        initHomeCharts: initHomeCharts,
        initHeroRadar: initHeroRadar,
        initTrendChart: initTrendChart,
        initGaugeChart: initGaugeChart,
        setGlobalDefaults: setGlobalDefaults,
    };

    // Direct global function for template calls
    window.initHomeCharts = initHomeCharts;

})();
