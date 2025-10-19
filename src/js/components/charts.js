/**
 * ===========================================
 * 📊 Charts Component
 * ===========================================
 * מערכת תרשימים עם Chart.js
 */

import { formatCurrency, formatPercent } from '../utils/format.js';

// אחסון instances של תרשימים
const charts = {};

/**
 * יצירת תרשים עמודות
 */
export function createBarChart(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) {
        console.error(`Canvas ${canvasId} not found`);
        return null;
    }
    
    // הרס תרשים קיים
    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }
    
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: options.showLegend !== false,
                position: 'bottom',
                rtl: true,
                textDirection: 'rtl'
            },
            title: {
                display: !!options.title,
                text: options.title || '',
                font: { size: 16, family: 'Heebo' }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: options.formatValue || ((value) => value)
                }
            },
            x: {
                ticks: {
                    font: { family: 'Heebo' }
                }
            }
        }
    };
    
    charts[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels || [],
            datasets: data.datasets || []
        },
        options: { ...defaultOptions, ...options.chartOptions }
    });
    
    return charts[canvasId];
}

/**
 * יצירת תרשים עוגה/דונאט
 */
export function createDoughnutChart(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) {
        console.error(`Canvas ${canvasId} not found`);
        return null;
    }
    
    // הרס תרשים קיים
    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }
    
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: options.showLegend !== false,
                position: 'bottom',
                rtl: true,
                textDirection: 'rtl',
                labels: {
                    font: { family: 'Heebo' }
                }
            },
            title: {
                display: !!options.title,
                text: options.title || '',
                font: { size: 16, family: 'Heebo' }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const formatted = options.formatValue ? 
                            options.formatValue(value) : 
                            formatCurrency(value);
                        return `${label}: ${formatted}`;
                    }
                }
            }
        }
    };
    
    charts[canvasId] = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels || [],
            datasets: data.datasets || []
        },
        options: { ...defaultOptions, ...options.chartOptions }
    });
    
    return charts[canvasId];
}

/**
 * יצירת תרשים קווי
 */
export function createLineChart(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) {
        console.error(`Canvas ${canvasId} not found`);
        return null;
    }
    
    // הרס תרשים קיים
    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }
    
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: options.showLegend !== false,
                position: 'bottom',
                rtl: true,
                textDirection: 'rtl'
            },
            title: {
                display: !!options.title,
                text: options.title || '',
                font: { size: 16, family: 'Heebo' }
            }
        },
        scales: {
            y: {
                beginAtZero: options.beginAtZero !== false,
                ticks: {
                    callback: options.formatValue || ((value) => formatCurrency(value))
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };
    
    charts[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels || [],
            datasets: data.datasets || []
        },
        options: { ...defaultOptions, ...options.chartOptions }
    });
    
    return charts[canvasId];
}

/**
 * עדכון נתוני תרשים קיים
 */
export function updateChartData(canvasId, newData) {
    const chart = charts[canvasId];
    if (!chart) {
        console.error(`Chart ${canvasId} not found`);
        return false;
    }
    
    if (newData.labels) {
        chart.data.labels = newData.labels;
    }
    
    if (newData.datasets) {
        chart.data.datasets = newData.datasets;
    }
    
    chart.update();
    return true;
}

/**
 * הרס תרשים
 */
export function destroyChart(canvasId) {
    if (charts[canvasId]) {
        charts[canvasId].destroy();
        delete charts[canvasId];
        return true;
    }
    return false;
}

/**
 * קבלת instance של תרשים
 */
export function getChart(canvasId) {
    return charts[canvasId] || null;
}

// ===== תרשימים ספציפיים לפרויקט =====

/**
 * תרשים התקדמות (דונאט)
 */
export function createProgressChart(canvasId, lessonsCompleted, totalLessons, scenariosCompleted) {
    return createDoughnutChart(canvasId, {
        labels: ['שיעורים הושלמו', 'שיעורים נותרו', 'תרחישים הושלמו'],
        datasets: [{
            data: [lessonsCompleted, Math.max(0, totalLessons - lessonsCompleted), scenariosCompleted],
            backgroundColor: ['#4CAF50', '#e0e0e0', '#2196F3'],
            borderWidth: 2,
            borderColor: '#fff'
        }]
    }, {
        title: 'ההתקדמות שלך באפליקציה',
        formatValue: (value) => `${value} פריטים`
    });
}

/**
 * תרשים XP (עמודות)
 */
export function createXPChart(canvasId, currentLevel, currentXP, maxLevels = 10) {
    const levels = [];
    const xpPerLevel = [];
    
    for (let i = 1; i <= Math.max(maxLevels, currentLevel + 2); i++) {
        levels.push(`רמה ${i}`);
        xpPerLevel.push(i < currentLevel ? 100 : (i === currentLevel ? currentXP % 100 : 0));
    }
    
    return createBarChart(canvasId, {
        labels: levels,
        datasets: [{
            label: 'XP',
            data: xpPerLevel,
            backgroundColor: levels.map((_, i) => 
                i < currentLevel - 1 ? '#4CAF50' : 
                i === currentLevel - 1 ? '#FFD700' : '#e0e0e0'
            ),
            borderColor: '#fff',
            borderWidth: 2
        }]
    }, {
        title: 'מסלול העלייה לרמות',
        showLegend: false,
        chartOptions: {
            scales: {
                y: {
                    max: 100,
                    ticks: {
                        callback: (value) => value + ' XP'
                    }
                }
            }
        }
    });
}

/**
 * תרשים היסטוריית עושר (קווי)
 */
export function createNetWorthChart(canvasId, history) {
    const labels = history.map((_, index) => `שנה ${index + 1}`);
    const netWorthData = history.map(h => h.netWorth || 0);
    
    return createLineChart(canvasId, {
        labels,
        datasets: [{
            label: 'עושר נטו',
            data: netWorthData,
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#667eea'
        }]
    }, {
        title: 'היסטוריית עושר נטו',
        formatValue: (value) => formatCurrency(value)
    });
}

/**
 * תרשים התפלגות תקציב (דונאט)
 */
export function createBudgetChart(canvasId, budget) {
    const categories = Object.keys(budget);
    const values = Object.values(budget);
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    
    return createDoughnutChart(canvasId, {
        labels: categories,
        datasets: [{
            data: values,
            backgroundColor: colors.slice(0, categories.length),
            borderWidth: 2,
            borderColor: '#fff'
        }]
    }, {
        title: 'התפלגות תקציב',
        formatValue: (value) => formatCurrency(value)
    });
}
