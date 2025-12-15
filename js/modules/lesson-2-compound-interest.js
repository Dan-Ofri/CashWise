/**
 * CashWise - Lesson 2, Module 2.1: Compound Interest
 * "ריבית דריבית - הכוח של הזמן"
 * 
 * This module teaches users about compound interest through:
 * - Interactive salary vs investment calculator
 * - Exponential growth visualization
 * - Quiz system with gamification
 * - Personal missions and achievements
 * 
 * @version 1.0.0
 * @date 2025-10-20
 */

import store from '../state/store.js';

// Constants (inline instead of separate file)
const XP_REWARDS = {
    CALCULATOR_USE: 10,
    BOTH_TABS: 10,
    PERSONAL_MISSION: 10,
    QUIZ_CORRECT: 5,
    QUIZ_PERFECT: 10,
    MODULE_COMPLETE: 20
};

// ============================================
// Module 2.1: Compound Interest Calculator
// ============================================

class CompoundInterestCalculator {
    constructor(containerId) {
        console.log('🧮 Calculator constructor called with ID:', containerId);
        this.container = document.getElementById(containerId);
        
        if (!this.container) {
            console.error('❌ Calculator container not found:', containerId);
            return;
        }
        
        console.log('✅ Calculator container found:', this.container);
        this.activeTab = 'investment'; // 'investment' or 'salary'
        
        // Investment defaults
        this.principal = 10000;
        this.monthlyContribution = 500;
        this.annualReturn = 0.10;
        this.years = 30;
        
        // Salary defaults
        this.currentSalary = 10000;
        this.annualRaise = 0.10;
        this.salaryYears = 30;
        
        // Chart instance
        this.chart = null;
        
        // Tracking
        this.usedBothTabs = false;
        this.investmentTabUsed = false;
        this.salaryTabUsed = false;
        
        console.log('🚀 Calling init()...');
        this.init();
    }
    
    init() {
        this.render();
        this.attachEventListeners();
        this.updateCalculation();
    }
    
    render() {
        this.container.innerHTML = `
            <div class="compound-calculator" dir="rtl">
                <!-- Header -->
                <div class="calculator-header">
                    <h3>💰 מחשבון ריבית דריבית</h3>
                    <p class="calculator-subtitle">נסה בעצמך - ראה את הקסם!</p>
                </div>
                
                <!-- Tabs -->
                <div class="calculator-tabs">
                    <button class="tab-button active" data-tab="investment">
                        📊 השקעות
                    </button>
                    <button class="tab-button" data-tab="salary">
                        💼 שכר
                    </button>
                </div>
                
                <!-- Investment Tab -->
                <div class="tab-content active" id="investment-tab">
                    <div class="calculator-inputs">
                        <div class="input-group">
                            <label>📊 כמה אתה משקיע בהתחלה?</label>
                            <div class="slider-container">
                                <input type="range" id="principal-slider" 
                                       min="0" max="100000" step="1000" value="10000">
                                <input type="number" id="principal-input" 
                                       value="10000" class="number-input">
                                <span class="currency">₪</span>
                            </div>
                        </div>
                        
                        <div class="input-group">
                            <label>📈 כמה אתה מוסיף כל חודש?</label>
                            <div class="slider-container">
                                <input type="range" id="monthly-slider" 
                                       min="0" max="5000" step="100" value="500">
                                <input type="number" id="monthly-input" 
                                       value="500" class="number-input">
                                <span class="currency">₪</span>
                            </div>
                        </div>
                        
                        <div class="input-group">
                            <label>📊 מה התשואה השנתית? (%)</label>
                            <div class="slider-container">
                                <input type="range" id="return-slider" 
                                       min="0" max="20" step="0.5" value="10">
                                <input type="number" id="return-input" 
                                       value="10" class="number-input">
                                <span class="currency">%</span>
                            </div>
                        </div>
                        
                        <div class="input-group">
                            <label>⏰ לכמה שנים?</label>
                            <div class="slider-container">
                                <input type="range" id="years-slider" 
                                       min="1" max="50" step="1" value="30">
                                <input type="number" id="years-input" 
                                       value="30" class="number-input">
                                <span class="currency">שנים</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Results -->
                    <div class="calculator-results">
                        <h4>📊 התוצאות שלך:</h4>
                        <div class="result-item">
                            <span class="result-label">💵 סה"כ השקעת:</span>
                            <span class="result-value" id="total-invested">190,000₪</span>
                        </div>
                        <div class="result-item highlight">
                            <span class="result-label">💰 סכום סופי:</span>
                            <span class="result-value" id="final-balance">1,141,000₪</span>
                        </div>
                        <div class="result-item success">
                            <span class="result-label">📈 רווח טהור:</span>
                            <span class="result-value" id="total-profit">951,000₪</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">🎯 ROI:</span>
                            <span class="result-value" id="roi">501%</span>
                        </div>
                        <div class="result-item time">
                            <span class="result-label">⏰ זמן עבד בשבילך:</span>
                            <span class="result-value" id="time-worked">30 שנים</span>
                        </div>
                    </div>
                </div>
                
                <!-- Salary Tab -->
                <div class="tab-content" id="salary-tab">
                    <div class="calculator-inputs">
                        <div class="input-group">
                            <label>💼 מה השכר שלך היום? (חודשי)</label>
                            <div class="slider-container">
                                <input type="range" id="salary-slider" 
                                       min="5000" max="50000" step="1000" value="10000">
                                <input type="number" id="salary-input" 
                                       value="10000" class="number-input">
                                <span class="currency">₪</span>
                            </div>
                        </div>
                        
                        <div class="input-group">
                            <label>📈 כמה אחוז העלאה שנתית?</label>
                            <div class="slider-container">
                                <input type="range" id="raise-slider" 
                                       min="0" max="20" step="0.5" value="10">
                                <input type="number" id="raise-input" 
                                       value="10" class="number-input">
                                <span class="currency">%</span>
                            </div>
                        </div>
                        
                        <div class="input-group">
                            <label>⏰ לכמה שנים?</label>
                            <div class="slider-container">
                                <input type="range" id="salary-years-slider" 
                                       min="1" max="50" step="1" value="30">
                                <input type="number" id="salary-years-input" 
                                       value="30" class="number-input">
                                <span class="currency">שנים</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Salary Results -->
                    <div class="calculator-results">
                        <h4>💼 השכר שלך בעוד 30 שנה:</h4>
                        <div class="result-item highlight">
                            <span class="result-label">💰 שכר חודשי:</span>
                            <span class="result-value" id="final-salary-monthly">174,494₪</span>
                        </div>
                        <div class="result-item">
                            <span class="result-label">📊 שכר שנתי:</span>
                            <span class="result-value" id="final-salary-annual">2,093,928₪</span>
                        </div>
                        <div class="result-item success">
                            <span class="result-label">📈 העלאה אחרונה:</span>
                            <span class="result-value" id="last-raise">17,449₪/חודש</span>
                        </div>
                        
                        <div class="insight-box">
                            <p class="insight-text">
                                💡 עכשיו תחשוב: למה הכסף שלך לא יגדל באותו האופן? 
                                <strong>הוא יכול!</strong> 🎯
                            </p>
                        </div>
                    </div>
                    
                    <!-- Personal Mission -->
                    <div class="personal-mission">
                        <h4>🎯 משימה אישית:</h4>
                        <p>חשב את השכר שלך בעוד 30 שנה עם העלאה של 10%</p>
                        <button class="mission-button" id="complete-mission-btn">
                            ✅ השלמתי את המשימה (+10 XP)
                        </button>
                    </div>
                </div>
                
                <!-- Chart -->
                <div class="chart-container">
                    <h4>📈 גרף צמיחה:</h4>
                    <canvas id="compound-chart"></canvas>
                    <p class="chart-note">
                        💡 שים לב לצורה האקספוננציאלית! 
                        ככל שעובר זמן, הקו הולך תלול יותר ויותר 📈
                    </p>
                </div>
                
                <!-- Key Insights -->
                <div class="key-insights">
                    <h4>💡 תובנות חשובות:</h4>
                    <div class="insight-grid">
                        <div class="insight-card">
                            <div class="insight-icon">1️⃣</div>
                            <div class="insight-content">
                                <strong>זמן = הכוח הכי גדול</strong>
                                <p>30 שנה vs 20 שנה = פי 2-3 יותר כסף!</p>
                            </div>
                        </div>
                        <div class="insight-card">
                            <div class="insight-icon">2️⃣</div>
                            <div class="insight-content">
                                <strong>עקביות = המפתח</strong>
                                <p>500₪ כל חודש לאורך זמן > 10,000₪ חד פעמי</p>
                            </div>
                        </div>
                        <div class="insight-card">
                            <div class="insight-icon">3️⃣</div>
                            <div class="insight-content">
                                <strong>תשואה משנה הכל</strong>
                                <p>הפרש של 3% = מאות אלפי שקלים!</p>
                            </div>
                        </div>
                        <div class="insight-card">
                            <div class="insight-icon">4️⃣</div>
                            <div class="insight-content">
                                <strong>התחל עכשיו!</strong>
                                <p>כל שנה שעוברת = עשרות אלפי ₪ שאבדו</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="calculator-actions">
                    <button class="btn-secondary" id="reset-calculator">
                        🔄 נסה שוב
                    </button>
                    <button class="btn-primary" id="continue-to-quiz">
                        ➡️ המשך לשלב הבא
                    </button>
                </div>
            </div>
        `;
    }
    
    attachEventListeners() {
        // Tab switching
        const tabButtons = this.container.querySelectorAll('.tab-button');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
        
        // Investment sliders
        this.syncSlider('principal');
        this.syncSlider('monthly');
        this.syncSlider('return');
        this.syncSlider('years');
        
        // Salary sliders
        this.syncSlider('salary');
        this.syncSlider('raise');
        this.syncSlider('salary-years');
        
        // Mission button
        const missionBtn = this.container.querySelector('#complete-mission-btn');
        if (missionBtn) {
            missionBtn.addEventListener('click', () => this.completeMission());
        }
        
        // Reset button
        const resetBtn = this.container.querySelector('#reset-calculator');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }
        
        // Continue button
        const continueBtn = this.container.querySelector('#continue-to-quiz');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.continueToQuiz());
        }
    }
    
    syncSlider(name) {
        const slider = this.container.querySelector(`#${name}-slider`);
        const input = this.container.querySelector(`#${name}-input`);
        
        if (!slider || !input) return;
        
        slider.addEventListener('input', (e) => {
            input.value = e.target.value;
            this.updateValues(name, parseFloat(e.target.value));
        });
        
        input.addEventListener('input', (e) => {
            slider.value = e.target.value;
            this.updateValues(name, parseFloat(e.target.value));
        });
    }
    
    updateValues(name, value) {
        switch(name) {
            case 'principal':
                this.principal = value;
                break;
            case 'monthly':
                this.monthlyContribution = value;
                break;
            case 'return':
                this.annualReturn = value / 100;
                break;
            case 'years':
                this.years = value;
                break;
            case 'salary':
                this.currentSalary = value;
                break;
            case 'raise':
                this.annualRaise = value / 100;
                break;
            case 'salary-years':
                this.salaryYears = value;
                break;
        }
        
        this.updateCalculation();
    }
    
    switchTab(tab) {
        this.activeTab = tab;
        
        // Track tab usage
        if (tab === 'investment') {
            this.investmentTabUsed = true;
        } else {
            this.salaryTabUsed = true;
        }
        
        // Check if both tabs used
        if (this.investmentTabUsed && this.salaryTabUsed && !this.usedBothTabs) {
            this.usedBothTabs = true;
            this.awardBothTabsBonus();
        }
        
        // Update UI
        const tabButtons = this.container.querySelectorAll('.tab-button');
        const tabContents = this.container.querySelectorAll('.tab-content');
        
        tabButtons.forEach(btn => {
            if (btn.dataset.tab === tab) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        tabContents.forEach(content => {
            if (content.id === `${tab}-tab`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        this.updateCalculation();
    }
    
    calculateInvestment() {
        const months = this.years * 12;
        const monthlyRate = this.annualReturn / 12;
        let balance = this.principal;
        const dataPoints = [];
        
        for (let month = 0; month <= months; month++) {
            if (month > 0) {
                balance = balance * (1 + monthlyRate) + this.monthlyContribution;
            }
            if (month % 12 === 0) {
                dataPoints.push({
                    year: month / 12,
                    value: balance
                });
            }
        }
        
        const totalInvested = this.principal + (this.monthlyContribution * months);
        const totalProfit = balance - totalInvested;
        const roi = ((balance / totalInvested) - 1) * 100;
        
        return {
            finalBalance: balance,
            totalInvested: totalInvested,
            totalProfit: totalProfit,
            roi: roi,
            dataPoints: dataPoints
        };
    }
    
    calculateSalary() {
        let salary = this.currentSalary;
        const dataPoints = [];
        
        for (let year = 0; year <= this.salaryYears; year++) {
            dataPoints.push({
                year: year,
                value: salary
            });
            
            if (year < this.salaryYears) {
                salary = salary * (1 + this.annualRaise);
            }
        }
        
        const finalSalary = this.currentSalary * Math.pow(1 + this.annualRaise, this.salaryYears);
        const lastRaise = finalSalary - (finalSalary / (1 + this.annualRaise));
        
        return {
            finalMonthlySalary: finalSalary,
            finalAnnualSalary: finalSalary * 12,
            lastRaise: lastRaise,
            dataPoints: dataPoints
        };
    }
    
    updateCalculation() {
        if (this.activeTab === 'investment') {
            const results = this.calculateInvestment();
            this.updateInvestmentUI(results);
            this.updateChart(results.dataPoints, 'investment');
        } else {
            const results = this.calculateSalary();
            this.updateSalaryUI(results);
            this.updateChart(results.dataPoints, 'salary');
        }
    }
    
    updateInvestmentUI(results) {
        const format = (num) => Math.round(num).toLocaleString('he-IL') + '₪';
        
        this.container.querySelector('#total-invested').textContent = format(results.totalInvested);
        this.container.querySelector('#final-balance').textContent = format(results.finalBalance);
        this.container.querySelector('#total-profit').textContent = format(results.totalProfit);
        this.container.querySelector('#roi').textContent = Math.round(results.roi) + '%';
        this.container.querySelector('#time-worked').textContent = this.years + ' שנים';
    }
    
    updateSalaryUI(results) {
        const format = (num) => Math.round(num).toLocaleString('he-IL') + '₪';
        
        this.container.querySelector('#final-salary-monthly').textContent = format(results.finalMonthlySalary);
        this.container.querySelector('#final-salary-annual').textContent = format(results.finalAnnualSalary);
        this.container.querySelector('#last-raise').textContent = format(results.lastRaise) + '/חודש';
    }
    
    updateChart(dataPoints, type) {
        const canvas = this.container.querySelector('#compound-chart');
        const ctx = canvas.getContext('2d');
        
        // Destroy existing chart
        if (this.chart) {
            this.chart.destroy();
        }
        
        // Create new chart
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dataPoints.map(d => d.year + ' שנים'),
                datasets: [{
                    label: type === 'investment' ? 'יתרה' : 'שכר חודשי',
                    data: dataPoints.map(d => d.value),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return Math.round(context.parsed.y).toLocaleString('he-IL') + '₪';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                if (value >= 1000000) {
                                    return (value / 1000000).toFixed(1) + 'M';
                                } else if (value >= 1000) {
                                    return (value / 1000).toFixed(0) + 'K';
                                }
                                return value;
                            }
                        }
                    }
                }
            }
        });
    }
    
    completeMission() {
        // Award XP
        this.awardXP(10, 'השלמת משימה אישית');
        
        // Disable button
        const btn = this.container.querySelector('#complete-mission-btn');
        btn.disabled = true;
        btn.textContent = '✅ המשימה הושלמה!';
        btn.classList.add('completed');
        
        // Show notification
        this.showNotification('🎉 קיבלת 10 XP על השלמת המשימה!');
    }
    
    awardBothTabsBonus() {
        this.awardXP(10, 'שימוש בשני הטאבים');
        this.showNotification('🎉 בונוס! קיבלת 10 XP על שימוש בשני הטאבים!');
    }
    
    awardXP(amount, reason) {
        // Use the store's built-in addXP method
        const newXP = store.addXP(amount);
        
        console.log(`✅ Awarded ${amount} XP: ${reason}`);
        console.log(`💎 Total XP: ${newXP}`);
        
        // Show notification
        this.showNotification(`+${amount} XP - ${reason}`);
    }
    
    showNotification(message) {
        // Simple notification (can be enhanced later)
        const notification = document.createElement('div');
        notification.className = 'xp-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    reset() {
        // Reset to defaults
        this.principal = 10000;
        this.monthlyContribution = 500;
        this.annualReturn = 0.10;
        this.years = 30;
        this.currentSalary = 10000;
        this.annualRaise = 0.10;
        this.salaryYears = 30;
        
        // Re-render
        this.render();
        this.attachEventListeners();
        this.updateCalculation();
    }
    
    continueToQuiz() {
        // Navigate to quiz section
        const quizSection = document.querySelector('#module-2-1-quiz');
        if (quizSection) {
            quizSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// ============================================
// Export
// ============================================

export { CompoundInterestCalculator };
