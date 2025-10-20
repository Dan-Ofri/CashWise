/**
 * ===========================================
 * 🎓 Lesson Player Module
 * ===========================================
 * מנוע הצגת שיעורים אינטראקטיביים
 * 
 * תכונות:
 * - 5 שלבים לכל שיעור (הסבר→המחשה→תרגול→חידון→סיום)
 * - ניווט בין שלבים
 * - שמירת התקדמות
 * - אינטגרציה עם lessons.js
 * - מסך מלא ללא גלילה
 */

import { completeLesson, getLessonState } from './lessons.js';
import { MATH_CONSTANTS, UI_TIMING } from '../config/index.js';
import { showSection } from '../core/router.js';
import { addXP } from '../core/state.js';
import { showSuccess, showNotification } from '../utils/notifications.js';

/**
 * מצב נוכחי של ה-player
 */
let currentLesson = null;
let currentStepIndex = 0;
let quizAnswers = [];

/**
 * פתיחת שיעור
 */
export function openLesson(lessonId) {
    console.log(`🎓 Opening lesson: ${lessonId}`);
    
    // טעינת נתוני השיעור
    const lessonData = getLessonData(lessonId);
    if (!lessonData) {
        showNotification('❌ שיעור לא נמצא', 'error');
        return;
    }
    
    // בדיקה שהשיעור פתוח
    const state = getLessonState(lessonId);
    if (!state || state.status === 'locked') {
        showNotification('🔒 שיעור זה נעול. השלם שיעורים קודמים.', 'warning');
        return;
    }
    
    // איפוס מצב
    currentLesson = lessonData;
    currentStepIndex = 0;
    quizAnswers = [];
    
    // מעבר למסך אקדמיה
    showSection('academy');
    
    // רינדור השלב הראשון
    renderCurrentStep();
    
    console.log(`✅ Lesson loaded: ${lessonData.title}`);
}

/**
 * רינדור השלב הנוכחי
 */
function renderCurrentStep() {
    const container = document.getElementById('academy-content');
    if (!container || !currentLesson) return;
    
    const step = currentLesson.steps[currentStepIndex];
    const totalSteps = currentLesson.steps.length;
    const progress = Math.round(((currentStepIndex + MATH_CONSTANTS.ONE) / totalSteps) * MATH_CONSTANTS.PERCENT_TO_DECIMAL);
    
    container.innerHTML = `
        <div class="lesson-player">
            <!-- Header -->
            <div class="lesson-header">
                <h1 class="lesson-title">🎓 ${currentLesson.title}</h1>
                <div class="lesson-progress">
                    <div class="lesson-progress-bar">
                        <div class="lesson-progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <span class="lesson-progress-text">${currentStepIndex + 1}/${totalSteps}</span>
                </div>
            </div>
            
            <!-- Content -->
            <div class="lesson-content">
                ${renderStepContent(step)}
            </div>
            
            <!-- Navigation -->
            <div class="lesson-nav">
                ${currentStepIndex > 0 ? `
                    <button class="lesson-btn lesson-btn-prev" onclick="previousStep()">
                        <span>◀</span>
                        <span>הקודם</span>
                    </button>
                ` : '<div></div>'}
                
                ${renderNextButton(step)}
            </div>
        </div>
    `;
}

/**
 * רינדור תוכן השלב לפי סוג
 */
function renderStepContent(step) {
    switch(step.type) {
        case 'explanation':
            return renderExplanation(step);
        case 'visualization':
            return renderVisualization(step);
        case 'practice':
            return renderPractice(step);
        case 'quiz':
            return renderQuiz(step);
        case 'completion':
            return renderCompletion(step);
        default:
            return `<p>סוג שלב לא נתמך: ${step.type}</p>`;
    }
}

/**
 * רינדור שלב הסבר
 */
function renderExplanation(step) {
    return `
        <div class="lesson-step lesson-explanation">
            <div class="step-icon">${step.icon || '📖'}</div>
            <h2 class="step-title">${step.title}</h2>
            
            <div class="step-body">
                ${step.content.map(paragraph => `
                    <p class="step-paragraph">${paragraph}</p>
                `).join('')}
            </div>
            
            ${step.keyPoints ? `
                <div class="key-points">
                    <h3>💡 נקודות מפתח:</h3>
                    <ul>
                        ${step.keyPoints.map(point => `
                            <li>${point}</li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * רינדור שלב המחשה
 */
function renderVisualization(step) {
    return `
        <div class="lesson-step lesson-visualization">
            <div class="step-icon">${step.icon || '📊'}</div>
            <h2 class="step-title">${step.title}</h2>
            
            <div class="step-body">
                ${step.description ? `<p>${step.description}</p>` : ''}
                
                ${step.chartType ? `
                    <div class="chart-container">
                        <canvas id="lesson-chart"></canvas>
                    </div>
                ` : ''}
                
                ${step.example ? `
                    <div class="example-box">
                        <h4>דוגמה:</h4>
                        <p>${step.example}</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

/**
 * רינדור שלב תרגול
 */
function renderPractice(step) {
    return `
        <div class="lesson-step lesson-practice">
            <div class="step-icon">${step.icon || '🎮'}</div>
            <h2 class="step-title">${step.title}</h2>
            
            <div class="step-body">
                <p>${step.instruction}</p>
                
                <div class="practice-area">
                    ${step.interactiveType === 'calculator' ? `
                        <div class="calculator">
                            <label>סכום התחלתי (₪):</label>
                            <input type="number" id="practice-amount" value="10000" />
                            
                            <label>תשואה שנתית (%):</label>
                            <input type="number" id="practice-rate" value="7" />
                            
                            <label>שנים:</label>
                            <input type="number" id="practice-years" value="10" />
                            
                            <button class="lesson-btn" onclick="calculatePractice()">
                                חשב
                            </button>
                            
                            <div id="practice-result" class="result-box" style="display: none;">
                                <!-- התוצאה תוצג כאן -->
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

/**
 * רינדור שלב חידון
 */
function renderQuiz(step) {
    const questionIndex = quizAnswers.length;
    const question = step.questions[questionIndex];
    
    if (!question) {
        // סיימנו את כל השאלות
        return `
            <div class="lesson-step lesson-quiz-complete">
                <div class="step-icon">🎉</div>
                <h2>כל הכבוד!</h2>
                <p>עברת את החידון בהצלחה!</p>
                <p>ענית נכון על ${quizAnswers.length} שאלות.</p>
            </div>
        `;
    }
    
    return `
        <div class="lesson-step lesson-quiz">
            <div class="step-icon">❓</div>
            <h2 class="step-title">שאלה ${questionIndex + 1}/${step.questions.length}</h2>
            
            <div class="quiz-question">
                <p class="question-text">${question.question}</p>
                
                <div class="quiz-options">
                    ${question.options.map((option, index) => `
                        <button class="quiz-option" onclick="selectQuizAnswer(${index})">
                            ${option}
                        </button>
                    `).join('')}
                </div>
                
                <div id="quiz-feedback" class="quiz-feedback" style="display: none;">
                    <!-- Feedback יוצג כאן -->
                </div>
            </div>
        </div>
    `;
}

/**
 * רינדור שלב סיום
 */
function renderCompletion(step) {
    return `
        <div class="lesson-step lesson-completion">
            <div class="completion-icon">🎉</div>
            <h2 class="completion-title">כל הכבוד!</h2>
            <p class="completion-subtitle">סיימת את השיעור "${currentLesson.title}"</p>
            
            <div class="completion-summary">
                <h3>📌 סיכום נקודות מפתח:</h3>
                <ul>
                    ${step.summary.map(point => `
                        <li>${point}</li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="completion-rewards">
                <div class="reward">
                    <span class="reward-icon">🏆</span>
                    <span class="reward-text">הישג: ${step.achievement}</span>
                </div>
                <div class="reward">
                    <span class="reward-icon">⭐</span>
                    <span class="reward-text">+${step.xp} XP</span>
                </div>
            </div>
            
            <button class="lesson-btn lesson-btn-finish" onclick="finishLesson()">
                ✅ למדתי - חזור לסימולטור
            </button>
        </div>
    `;
}

/**
 * רינדור כפתור הבא
 */
function renderNextButton(step) {
    // בשלב חידון - רק אם ענינו על כל השאלות
    if (step.type === 'quiz') {
        const allAnswered = quizAnswers.length >= step.questions.length;
        if (!allAnswered) {
            return '<div></div>'; // לא מציגים כפתור
        }
    }
    
    // בשלב אחרון - לא צריך כפתור הבא (יש כפתור סיום)
    if (currentStepIndex === currentLesson.steps.length - 1) {
        return '<div></div>';
    }
    
    return `
        <button class="lesson-btn lesson-btn-next" onclick="nextStep()">
            <span>הבא</span>
            <span>▶</span>
        </button>
    `;
}

/**
 * מעבר לשלב הבא
 */
export function nextStep() {
    if (currentStepIndex < currentLesson.steps.length - 1) {
        currentStepIndex++;
        renderCurrentStep();
        
        // גלילה לראש המסך
        window.scrollTo(0, 0);
    }
}

/**
 * חזרה לשלב הקודם
 */
export function previousStep() {
    if (currentStepIndex > 0) {
        currentStepIndex--;
        renderCurrentStep();
        window.scrollTo(0, 0);
    }
}

/**
 * בחירת תשובה בחידון
 */
export function selectQuizAnswer(optionIndex) {
    const step = currentLesson.steps[currentStepIndex];
    const questionIndex = quizAnswers.length;
    const question = step.questions[questionIndex];
    
    const isCorrect = optionIndex === question.correctIndex;
    const feedback = document.getElementById('quiz-feedback');
    
    if (isCorrect) {
        feedback.innerHTML = `
            <div class="feedback-correct">
                <span class="feedback-icon">✅</span>
                <span class="feedback-text">נכון! ${question.explanation}</span>
            </div>
        `;
        feedback.style.display = 'block';
        
        // שמירת תשובה נכונה
        quizAnswers.push(true);
        
        // המתנה קצרה ומעבר לשאלה הבאה
        setTimeout(() => {
            renderCurrentStep();
        }, UI_TIMING.QUIZ_NEXT_QUESTION_DELAY);
        
    } else {
        feedback.innerHTML = `
            <div class="feedback-wrong">
                <span class="feedback-icon">❌</span>
                <span class="feedback-text">לא מדויק. נסה שוב!</span>
            </div>
        `;
        feedback.style.display = 'block';
        
        // הסתרה אחרי שנייה
        setTimeout(() => {
            feedback.style.display = 'none';
        }, UI_TIMING.QUIZ_WRONG_ANSWER_HIDE_DELAY);
    }
}

/**
 * סיום שיעור
 */
export function finishLesson() {
    if (!currentLesson) return;
    
    // סימון השיעור כהושלם
    completeLesson(currentLesson.id);
    
    // הוספת XP
    const completionStep = currentLesson.steps[currentLesson.steps.length - 1];
    addXP(completionStep.xp, `השלמת שיעור: ${currentLesson.title}`);
    
    // הודעת הצלחה
    showSuccess(`🎉 סיימת את "${currentLesson.title}"!`);
    
    // חזרה לסימולטור
    showSection('simulation');
    
    // איפוס מצב
    currentLesson = null;
    currentStepIndex = 0;
    quizAnswers = [];
}

/**
 * טעינת נתוני שיעור (זמני - יועבר ל-lesson-data.js)
 */
function getLessonData(lessonId) {
    // זמני - נחזיר מבנה בסיסי
    // בשלב הבא נטען מ-lesson-data.js
    
    if (lessonId === 'compound-interest') {
        return {
            id: 'compound-interest',
            title: 'ריבית דריבית',
            steps: [
                {
                    type: 'explanation',
                    icon: '📖',
                    title: 'מה זה ריבית דריבית?',
                    content: [
                        'ריבית דריבית היא "ריבית על ריבית" - המושג הכי חשוב בפיננסים.',
                        'כשההון שלך גדל, גם הריבית גדלה ביחד איתו. זה כמו כדור שלג שמתגלגל ומתעבה.',
                        'דוגמה: 10,000₪ עם 7% ריבית → שנה ראשונה +700₪ → שנה שנייה +749₪ על 10,700₪'
                    ],
                    keyPoints: [
                        'ריבית דריבית = ריבית על ההון המקורי + הריבית שנצברה',
                        'ככל שעובר יותר זמן, ההשפעה גדולה יותר',
                        'התחלה מוקדמת = הבדל עצום בטווח הארוך'
                    ]
                },
                {
                    type: 'completion',
                    summary: [
                        'ריבית דריבית = כוח צמיחה עוצמתי',
                        'הבדל של 5% בתשואה = הבדל ענק בטווח ארוך',
                        'ככל שמתחילים מוקדם יותר, כך הרווח גדול יותר'
                    ],
                    achievement: 'משקיע מתחיל',
                    xp: 50
                }
            ]
        };
    }
    
    return null;
}

/**
 * חישוב תרגול (לדוגמה)
 */
export function calculatePractice() {
    const amount = parseFloat(document.getElementById('practice-amount').value);
    const rate = parseFloat(document.getElementById('practice-rate').value) / MATH_CONSTANTS.PERCENT_TO_DECIMAL;
    const years = parseInt(document.getElementById('practice-years').value);
    
    const result = amount * Math.pow(MATH_CONSTANTS.ONE + rate, years);
    const profit = result - amount;
    
    const resultBox = document.getElementById('practice-result');
    resultBox.innerHTML = `
        <h4>תוצאה:</h4>
        <p>אחרי ${years} שנים עם ${(rate * MATH_CONSTANTS.PERCENT_TO_DECIMAL).toFixed(MATH_CONSTANTS.ONE)}% תשואה:</p>
        <p class="result-amount">₪${result.toLocaleString('he-IL', {maximumFractionDigits: MATH_CONSTANTS.ZERO})}</p>
        <p class="result-profit">רווח: ₪${profit.toLocaleString('he-IL', {maximumFractionDigits: 0})}</p>
    `;
    resultBox.style.display = 'block';
}

/**
 * אתחול מודול
 */
export function initLessonPlayer() {
    console.log('🎓 Lesson Player initialized');
}

// הפונקציות נחשפות דרך global-bridge.js בלבד
