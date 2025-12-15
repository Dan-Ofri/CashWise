/**
 * CashWise - Lesson 2, Module 2.1: Quiz System
 * "ריבית דריבית - הכוח של הזמן" - Quiz
 * 
 * 3-question quiz with immediate feedback and XP rewards
 * 
 * @version 1.0.0
 * @date 2025-10-20
 */

import store from '../state/store.js';

// Constants (inline)
const XP_REWARDS = {
    QUIZ_CORRECT: 5,
    QUIZ_PERFECT: 10,
    MODULE_COMPLETE: 20
};

// ============================================
// Quiz Data
// ============================================

const quizQuestions = [
    {
        id: 'q1',
        question: 'מה זה ריבית דריבית?',
        options: [
            'ריבית שמקבלים רק על הקרן המקורית',
            'ריבית שמקבלים על הקרן + ריבית נצברת',
            'ריבית כפולה',
            'ריבית שמשלמים לבנק'
        ],
        correctIndex: 1,
        explanation: 'זה בדיוק הקסם - הריבית "מתרבה" על עצמה! הכסף מרויח כסף על הכסף שהרוויח.'
    },
    {
        id: 'q2',
        question: 'מה המרכיב הכי חשוב בריבית דריבית?',
        options: [
            'כמה כסף משקיעים בהתחלה',
            'אחוז הריבית',
            'זמן - כמה שנים השקעה',
            'כמה מוסיפים כל חודש'
        ],
        correctIndex: 2,
        explanation: 'זמן = הנכס הכי יקר שלך! ככל שיש יותר זמן, הריבית הדריבית עובדת חזק יותר ויותר (אקספוננציאלי!). זה למה צעירים = יתרון ענק! 🚀'
    },
    {
        id: 'q3',
        question: 'דני ושרה משקיעים 1,000₪/חודש ב-10%. דני מתחיל בגיל 25, שרה בגיל 35. מי יהיה עם יותר כסף בגיל 65?',
        options: [
            'דני (השקיע 40 שנה)',
            'שרה (השקיעה 30 שנה)',
            'אותו דבר',
            'תלוי בשוק'
        ],
        correctIndex: 0,
        explanation: 'דני: ~6.3M₪ 🚀 | שרה: ~2.3M₪ | הפרש: 4M₪ - רק בגלל 10 שנים! 💡 מוסר: התחל מוקדם ככל שאפשר!'
    }
];

// ============================================
// Quiz Component
// ============================================

class CompoundInterestQuiz {
    constructor(containerId) {
        console.log('📝 Quiz constructor called with ID:', containerId);
        this.container = document.getElementById(containerId);
        
        if (!this.container) {
            console.error('❌ Quiz container not found:', containerId);
            return;
        }
        
        console.log('✅ Quiz container found:', this.container);
        this.questions = quizQuestions;
        this.currentQuestion = 0;
        this.answers = [];
        this.score = 0;
        this.firstAttempt = true;
        
        console.log('🚀 Calling init()...');
        this.init();
    }
    
    init() {
        this.render();
    }
    
    render() {
        if (this.currentQuestion < this.questions.length) {
            this.renderQuestion();
        } else {
            this.renderResults();
        }
    }
    
    renderQuestion() {
        const q = this.questions[this.currentQuestion];
        
        this.container.innerHTML = `
            <div class="quiz-container" dir="rtl">
                <div class="quiz-header">
                    <h3>🧪 Quiz - בדיקת הבנה</h3>
                    <div class="quiz-progress">
                        <span>שאלה ${this.currentQuestion + 1} מתוך ${this.questions.length}</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${((this.currentQuestion + 1) / this.questions.length) * 100}%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="quiz-question">
                    <h4>❓ ${q.question}</h4>
                    <div class="quiz-options">
                        ${q.options.map((option, index) => `
                            <button class="quiz-option" data-index="${index}">
                                <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                                <span class="option-text">${option}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="quiz-feedback" id="quiz-feedback"></div>
            </div>
        `;
        
        this.attachQuestionListeners();
    }
    
    attachQuestionListeners() {
        const options = this.container.querySelectorAll('.quiz-option');
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.checkAnswer(index);
            });
        });
    }
    
    checkAnswer(selectedIndex) {
        const q = this.questions[this.currentQuestion];
        const isCorrect = selectedIndex === q.correctIndex;
        
        // Save answer
        this.answers.push({
            questionId: q.id,
            selectedIndex: selectedIndex,
            isCorrect: isCorrect,
            firstAttempt: this.firstAttempt
        });
        
        if (isCorrect) {
            this.score++;
            this.showFeedback(true, q.explanation);
            
            // Award XP on first attempt
            if (this.firstAttempt) {
                this.awardXP(5, `שאלה ${this.currentQuestion + 1} נכונה בפעם הראשונה`);
            }
            
            // Move to next question after delay
            setTimeout(() => {
                this.currentQuestion++;
                this.firstAttempt = true;
                this.render();
            }, 3000);
        } else {
            this.firstAttempt = false;
            this.showFeedback(false, q.explanation);
        }
    }
    
    showFeedback(isCorrect, explanation) {
        const feedback = this.container.querySelector('#quiz-feedback');
        
        if (isCorrect) {
            feedback.innerHTML = `
                <div class="feedback-success">
                    <div class="feedback-icon">✅</div>
                    <div class="feedback-content">
                        <strong>תשובה נכונה!</strong>
                        <p>📚 ${explanation}</p>
                    </div>
                </div>
            `;
        } else {
            feedback.innerHTML = `
                <div class="feedback-error">
                    <div class="feedback-icon">❌</div>
                    <div class="feedback-content">
                        <strong>לא בדיוק... נסה שוב!</strong>
                        <p>💡 טיפ: ${explanation}</p>
                    </div>
                </div>
            `;
        }
        
        feedback.style.display = 'block';
    }
    
    renderResults() {
        const perfectScore = this.score === this.questions.length;
        const allFirstAttempt = this.answers.every(a => a.firstAttempt && a.isCorrect);
        
        let xpEarned = this.score * 5;
        if (perfectScore && allFirstAttempt) {
            xpEarned += 10; // Bonus for perfect score on first attempt
            this.awardXP(10, 'ציון מושלם בפעם הראשונה');
        }
        
        this.container.innerHTML = `
            <div class="quiz-results" dir="rtl">
                <div class="results-header">
                    ${perfectScore ? `
                        <div class="results-icon success">🎉</div>
                        <h3>מעולה! ציון מושלם!</h3>
                    ` : `
                        <div class="results-icon">📊</div>
                        <h3>סיימת את ה-Quiz!</h3>
                    `}
                </div>
                
                <div class="results-stats">
                    <div class="stat-item">
                        <div class="stat-value">${this.score}/${this.questions.length}</div>
                        <div class="stat-label">תשובות נכונות</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${Math.round((this.score / this.questions.length) * 100)}%</div>
                        <div class="stat-label">ציון</div>
                    </div>
                    <div class="stat-item success">
                        <div class="stat-value">+${xpEarned} XP</div>
                        <div class="stat-label">נקודות ניסיון</div>
                    </div>
                </div>
                
                ${perfectScore && allFirstAttempt ? `
                    <div class="achievement-unlocked">
                        <div class="achievement-icon">🏆</div>
                        <div class="achievement-content">
                            <strong>Achievement Unlocked!</strong>
                            <p>"מומחה ריבית דריבית" 🎖️</p>
                            <small>ענית נכון על כל השאלות בפעם הראשונה!</small>
                        </div>
                    </div>
                ` : ''}
                
                <div class="results-review">
                    <h4>📝 סיכום תשובות:</h4>
                    ${this.questions.map((q, i) => {
                        const answer = this.answers.find(a => a.questionId === q.id);
                        return `
                            <div class="review-item ${answer && answer.isCorrect ? 'correct' : 'incorrect'}">
                                <div class="review-header">
                                    <span class="review-icon">${answer && answer.isCorrect ? '✅' : '❌'}</span>
                                    <span class="review-question">שאלה ${i + 1}</span>
                                </div>
                                <p class="review-text">${q.question}</p>
                                <p class="review-answer">
                                    <strong>תשובתך:</strong> ${q.options[answer?.selectedIndex || 0]}
                                </p>
                                ${!answer?.isCorrect ? `
                                    <p class="review-correct">
                                        <strong>תשובה נכונה:</strong> ${q.options[q.correctIndex]}
                                    </p>
                                ` : ''}
                                <p class="review-explanation">💡 ${q.explanation}</p>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="results-actions">
                    <button class="btn-secondary" id="retake-quiz">
                        🔄 נסה שוב
                    </button>
                    <button class="btn-primary" id="complete-module">
                        ✅ סיים את המודול
                    </button>
                </div>
            </div>
        `;
        
        this.attachResultsListeners();
    }
    
    attachResultsListeners() {
        const retakeBtn = this.container.querySelector('#retake-quiz');
        if (retakeBtn) {
            retakeBtn.addEventListener('click', () => this.retake());
        }
        
        const completeBtn = this.container.querySelector('#complete-module');
        if (completeBtn) {
            completeBtn.addEventListener('click', () => this.completeModule());
        }
    }
    
    retake() {
        this.currentQuestion = 0;
        this.answers = [];
        this.score = 0;
        this.firstAttempt = true;
        this.render();
    }
    
    completeModule() {
        // Award completion XP
        this.awardXP(20, 'סיום Module 2.1');
        
        // Mark lesson as completed
        store.completeLesson('lesson-2-module-1');
        
        // Add achievement if perfect score
        if (this.score === quizQuestions.length && this.firstAttemptCorrect.every(val => val)) {
            store.addAchievement('מומחה ריבית דריבית');
            console.log('🏆 Achievement unlocked: מומחה ריבית דריבית');
        }
        
        // Show completion screen
        this.showCompletionScreen();
    }
    
    showCompletionScreen() {
        this.container.innerHTML = `
            <div class="module-completion" dir="rtl">
                <div class="completion-header">
                    <div class="completion-icon">🎉</div>
                    <h2>כל הכבוד! סיימת Module 2.1</h2>
                </div>
                
                <div class="completion-content">
                    <h3>📚 מה למדת:</h3>
                    <ul class="completion-list">
                        <li>✅ ריבית דריבית = "הפלא השמיני בתבל"</li>
                        <li>✅ זמן = המרכיב הכי חשוב (יתרון לצעירים!)</li>
                        <li>✅ צמיחה אקספוננציאלית = הכח של ריבית דריבית</li>
                        <li>✅ ככל שמתחילים מוקדם יותר = יותר כסף בסוף</li>
                        <li>✅ ההשקעות שלך יכולות לגדול כמו שכר עם העלאות!</li>
                    </ul>
                    
                    <div class="completion-quote">
                        <p>💡 <strong>המסר המרכזי:</strong></p>
                        <p>"זמן = הנכס הכי יקר שיש לך. אל תבזבז אותו - תתחיל להשקיע עכשיו!"</p>
                    </div>
                    
                    <div class="completion-stats">
                        <h4>🏆 הישגים:</h4>
                        <div class="achievement-badge">
                            <div class="badge-icon">🎖️</div>
                            <div class="badge-text">
                                <strong>"מבין ריבית דריבית"</strong>
                                <p>סיים בהצלחה את Module 2.1</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="completion-xp">
                        <h4>💎 סיכום XP:</h4>
                        <ul>
                            <li>20 XP - סיום בסיסי של המודול</li>
                            <li id="quiz-xp">0 XP - ציון ב-Quiz</li>
                            <li id="tabs-xp" style="display: none;">+10 XP - שימוש בשני הטאבים</li>
                            <li id="mission-xp" style="display: none;">+10 XP - השלמת משימה אישית</li>
                        </ul>
                        <div class="xp-total">
                            <strong>סה"כ XP שהושג:</strong>
                            <span class="xp-value" id="total-xp-earned">20 XP</span>
                        </div>
                    </div>
                </div>
                
                <div class="completion-actions">
                    <button class="btn-secondary" id="back-to-overview">
                        ⬅️ חזור למבט כללי
                    </button>
                    <button class="btn-primary" id="next-module">
                        ➡️ המשך ל-Module 2.2
                    </button>
                </div>
            </div>
        `;
        
        this.attachCompletionListeners();
    }
    
    attachCompletionListeners() {
        const backBtn = this.container.querySelector('#back-to-overview');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                // Navigate back to academy overview
                window.location.hash = '#academy';
            });
        }
        
        const nextBtn = this.container.querySelector('#next-module');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                // Navigate to Module 2.2
                window.location.hash = '#lesson-2-module-2';
            });
        }
    }
    
    awardXP(amount, reason) {
        // Use the store's built-in addXP method
        const newXP = store.addXP(amount);
        
        console.log(`✅ Awarded ${amount} XP: ${reason}`);
        console.log(`💎 Total XP: ${newXP}`);
    }
}

// ============================================
// Export
// ============================================

export { CompoundInterestQuiz };
