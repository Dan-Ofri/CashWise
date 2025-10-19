/**
 * 🎓 Floating Academy Module - CashWise v7.0
 * ניהול כפתור צף ו-Modal רשימת שיעורים
 */

import { getAllLessons, hasAnyUnlockedLessons, hasUncompletedLessons, isLessonCompleted, attemptOpenLockedLesson } from './lessons.js';
import { showSection } from '../core/router.js';
import { showNotification } from '../utils/notifications.js';

// ===================================
// עדכון כפתור צף
// ===================================

/**
 * מעדכן את תצוגת הכפתור הצף בהתאם למצב השיעורים
 */
export function updateFloatingButton() {
    const button = document.getElementById('floating-academy-btn');
    if (!button) return;
    
    // הכפתור הצף תמיד גלוי - גם לפני שיעור ראשון
    button.style.display = 'flex';
    
    // הוסף אינדיקציה חזותית אם יש שיעורים פתוחים שלא הושלמו
    // זהב = יש מה ללמוד | כחול-אפור = סיים הכל או אין שיעורים
    if (hasUncompletedLessons()) {
        button.classList.add('has-unlocked');
    } else {
        button.classList.remove('has-unlocked');
    }
}

// ===================================
// Modal רשימת שיעורים
// ===================================

/**
 * פותח את Modal רשימת השיעורים
 */
export function openLessonListModal() {
    const modal = document.getElementById('lesson-list-modal');
    if (!modal) {
        console.error('Modal לא נמצא');
        return;
    }
    
    // רנדור רשימת שיעורים
    renderLessonList();
    
    // הצג Modal
    modal.style.display = 'flex';
    
    // נעילת גלילה ברקע
    document.body.style.overflow = 'hidden';
}

/**
 * סוגר את Modal רשימת השיעורים
 */
export function closeLessonListModal() {
    const modal = document.getElementById('lesson-list-modal');
    if (!modal) return;
    
    modal.style.display = 'none';
    
    // שחרור גלילה
    document.body.style.overflow = '';
}

/**
 * רנדור רשימת השיעורים ב-section#academy
 */
export function renderAcademySection() {
    console.log('🎓 renderAcademySection called!');
    
    const container = document.getElementById('academy-lessons-list');
    if (!container) {
        console.error('❌ academy-lessons-list container not found!');
        return;
    }
    
    console.log('✅ Container found:', container);
    console.log('📏 Container dimensions:', {
        width: container.offsetWidth,
        height: container.offsetHeight,
        display: window.getComputedStyle(container).display,
        visibility: window.getComputedStyle(container).visibility
    });
    
    const lessons = getAllLessons();
    console.log('📚 Total lessons:', lessons.length);
    console.log('📋 Lessons data:', lessons);
    
    // בדיקה אם יש שיעורים פתוחים
    const unlockedLessons = lessons.filter(lesson => lesson.unlocked);
    console.log('🔓 Unlocked lessons:', unlockedLessons.length);
    console.log('🔒 All lessons details:', lessons.map(l => ({id: l.id, unlocked: l.unlocked, title: l.title})));
    
    // ✅ אם אין שיעורים פתוחים - הצג הודעת כיוון
    if (unlockedLessons.length === 0) {
        container.innerHTML = `
            <div style="display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 70vh;
                        padding: 40px 20px;">
                
                <div style="text-align: center; 
                            max-width: 650px;
                            width: 100%;">
                    
                    <!-- אייקון ראשי -->
                    <div style="margin-bottom: 32px;">
                        <div style="display: inline-flex;
                                    align-items: center;
                                    justify-content: center;
                                    width: 100px;
                                    height: 100px;
                                    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
                                    border-radius: 24px;
                                    box-shadow: 0 8px 24px rgba(14, 165, 233, 0.3);">
                            <span style="font-size: 56px;">🎓</span>
                        </div>
                    </div>
                    
                    <!-- כותרת -->
                    <h2 style="font-size: 28px; 
                                color: #1e293b; 
                                margin: 0 0 16px 0; 
                                font-weight: 700;">
                        ברוך הבא לאקדמיית הכסף!
                    </h2>
                    
                    <!-- תיאור -->
                    <p style="font-size: 16px; 
                              color: #64748b; 
                              line-height: 1.6; 
                              margin: 0 0 40px 0;">
                        כדי לפתוח שיעורים, השלם את הסימולטור הפיננסי והשג 
                        <strong style="color: #0ea5e9;">50,000₪</strong>
                    </p>
                    
                    <!-- 3 קלפים קטנים -->
                    <div style="display: grid;
                                grid-template-columns: repeat(3, 1fr);
                                gap: 16px;
                                margin-bottom: 36px;">
                        
                        <div style="background: #f8fafc;
                                    padding: 20px 16px;
                                    border-radius: 12px;
                                    border: 2px solid #e2e8f0;
                                    text-align: center;">
                            <div style="font-size: 32px; margin-bottom: 8px;">🎯</div>
                            <div style="font-weight: 600; color: #1e293b; margin-bottom: 4px; font-size: 14px;">המטרה</div>
                            <div style="color: #64748b; font-size: 13px;">50,000₪</div>
                        </div>
                        
                        <div style="background: #f8fafc;
                                    padding: 20px 16px;
                                    border-radius: 12px;
                                    border: 2px solid #e2e8f0;
                                    text-align: center;">
                            <div style="font-size: 32px; margin-bottom: 8px;">🏆</div>
                            <div style="font-weight: 600; color: #1e293b; margin-bottom: 4px; font-size: 14px;">הפרס</div>
                            <div style="color: #64748b; font-size: 13px;">שיעור חדש</div>
                        </div>
                        
                        <div style="background: #f8fafc;
                                    padding: 20px 16px;
                                    border-radius: 12px;
                                    border: 2px solid #e2e8f0;
                                    text-align: center;">
                            <div style="font-size: 32px; margin-bottom: 8px;">💡</div>
                            <div style="font-weight: 600; color: #1e293b; margin-bottom: 4px; font-size: 14px;">היתרון</div>
                            <div style="color: #64748b; font-size: 13px;">השקעות חכמות</div>
                        </div>
                    </div>
                    
                    <!-- כפתור CTA -->
                    <button id="start-sim-btn"
                            onclick="showSection('simulation')" 
                            style="padding: 16px 48px;
                                   background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
                                   color: white;
                                   border: none;
                                   border-radius: 12px;
                                   font-size: 17px;
                                   font-weight: 600;
                                   cursor: pointer;
                                   box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
                                   transition: all 0.2s ease;
                                   font-family: inherit;">
                        🚀 התחל סימולטור
                    </button>
                </div>
            </div>
        `;
        
        // הוספת hover effect
        const btn = document.getElementById('start-sim-btn');
        if (btn) {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px)';
                btn.style.boxShadow = '0 6px 20px rgba(14, 165, 233, 0.4)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = '0 4px 12px rgba(14, 165, 233, 0.3)';
            });
        }
        console.log('ℹ️ No unlocked lessons - showing guidance message');
        return;
    }
    
    // הצג את כל השיעורים (גם נעולים!)
    console.log('✏️ Rendering all lessons...');
    const htmlContent = lessons.map(lesson => {
        const isLocked = !lesson.unlocked;
        const isCompleted = lesson.completed;
        
        return `
            <div class="lesson-item ${isLocked ? 'locked' : 'unlocked'} ${isCompleted ? 'completed' : ''}"
                 onclick="${isLocked ? 'attemptOpenLockedLesson(\'' + lesson.id + '\')' : 'openLesson(\'' + lesson.id + '\')'}"
                 style="cursor: pointer;">
                <div class="lesson-icon">${lesson.icon}</div>
                <div class="lesson-info">
                    <h3>${lesson.title}</h3>
                    <p>${lesson.description}</p>
                </div>
                <div class="lesson-status">
                    ${isCompleted ? '<span class="status-badge completed">✓ הושלם</span>' : 
                      isLocked ? '<span class="status-badge locked">🔒 נעול</span>' : 
                      '<span class="status-badge unlocked">פתוח</span>'}
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = htmlContent;
    console.log('✅ HTML content set, length:', htmlContent.length);
    console.log('📦 Container after render:', {
        childElementCount: container.childElementCount,
        innerHTML: container.innerHTML.substring(0, 200) + '...'
    });
}

/**
 * רנדור רשימת השיעורים ב-Modal
 */
function renderLessonList() {
    const container = document.getElementById('lesson-list-container');
    if (!container) return;
    
    const lessons = getAllLessons();
    
    // בדיקה אם יש שיעורים פתוחים
    const unlockedLessons = lessons.filter(lesson => lesson.unlocked);
    
    if (unlockedLessons.length === 0) {
        container.innerHTML = `
            <div class="empty-lessons">
                <div class="icon" style="font-size: 80px; margin-bottom: 20px;">🎓</div>
                <h3 style="font-size: 24px; color: #2c3e50; margin-bottom: 16px;">
                    אין שיעורים פתוחים עדיין
                </h3>
                <p style="font-size: 16px; color: #34495e; margin-bottom: 12px;">
                    🎮 <strong>כדי לפתוח שיעורים</strong>, צא למסע בסימולטור החיים!
                </p>
                <p class="hint" style="font-size: 15px; color: #7f8c8d; margin-bottom: 24px;">
                    💡 התקדם בסימולטור, התמודד עם אתגרים פיננסיים,<br>
                    ושיעורים יפתחו לך אוטומטית!
                </p>
                
                <button onclick="closeLessonListModal(); showSection('simulation');" 
                        style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                               color: white; 
                               border: none; 
                               padding: 14px 32px; 
                               border-radius: 8px; 
                               font-size: 16px; 
                               font-weight: 600; 
                               cursor: pointer; 
                               margin-bottom: 32px;
                               box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                               transition: all 0.3s;">
                    🎮 קח אותי לסימולטור!
                </button>
                
                <div class="lessons-preview" style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); 
                                                     padding: 24px; 
                                                     border-radius: 12px;">
                    <h4 style="margin: 0 0 20px 0; font-size: 18px; color: #34495e;">
                        📚 שיעורים שמחכים לך:
                    </h4>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        ${lessons.map(lesson => `
                            <li style="display: flex; 
                                       align-items: center; 
                                       justify-content: space-between; 
                                       padding: 14px; 
                                       margin-bottom: 10px; 
                                       background: white; 
                                       border-radius: 8px; 
                                       box-shadow: 0 2px 6px rgba(0,0,0,0.08);">
                                <span style="font-size: 28px; margin-left: 12px; opacity: 0.4;">${lesson.icon}</span>
                                <span style="flex: 1; 
                                             text-align: right; 
                                             font-size: 16px; 
                                             color: #2c3e50; 
                                             font-weight: 500;">${lesson.title}</span>
                                <span style="font-size: 14px; 
                                             color: #95a5a6; 
                                             background: #ecf0f1; 
                                             padding: 4px 12px; 
                                             border-radius: 12px;">🔒 נעול</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
        return;
    }
    
    // יצירת HTML לכל שיעור
    let html = '';
    
    lessons.forEach(lesson => {
        const statusClass = lesson.completed ? 'completed' : 
                           lesson.unlocked ? 'unlocked' : 'locked';
        
        const icon = lesson.completed ? '✅' : 
                    lesson.unlocked ? lesson.icon : '🔒';
        
        let statusText = '';
        let actionButton = '';
        
        if (lesson.completed) {
            // שיעור הושלם
            statusText = `הושלם ב-${formatDate(lesson.completedAt)}`;
            actionButton = `
                <button class="btn-review" onclick="goToLesson('${lesson.id}')">
                    📖 חזור לשיעור
                </button>
            `;
        } else if (lesson.unlocked) {
            // שיעור פתוח אבל לא הושלם
            statusText = `נפתח ב-${formatDate(lesson.unlockedAt)}`;
            actionButton = `
                <button class="btn-start" onclick="goToLesson('${lesson.id}')">
                    🎓 התחל שיעור
                </button>
            `;
        } else {
            // שיעור נעול
            statusText = 'דרוש: פגוש אתגר מתאים בסימולטור';
            actionButton = `
                <button class="btn-review" style="opacity: 0.5; cursor: not-allowed;" 
                        onclick="attemptOpenLocked('${lesson.id}')">
                    🔒 נעול
                </button>
            `;
        }
        
        html += `
            <div class="lesson-item ${statusClass}">
                <div class="lesson-icon">${icon}</div>
                <div class="lesson-info">
                    <h3>${lesson.title}</h3>
                    <p>${statusText}</p>
                </div>
                ${actionButton}
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * פורמט תאריך לעברית
 */
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}

/**
 * מעבר לשיעור ספציפי
 */
function goToLesson(lessonId) {
    // סגור Modal
    closeLessonListModal();
    
    // שמור את השיעור הפעיל
    localStorage.setItem('active-lesson', lessonId);
    
    // מעבר לאקדמיה
    showSection('academy');
    
    // הצג הודעה
    showNotification(`🎓 נכנסת לשיעור`, 'info');
}

/**
 * ניסיון לפתוח שיעור נעול
 */
function attemptOpenLocked(lessonId) {
    attemptOpenLockedLesson(lessonId);
}

// ===================================
// חיבור לגלובל
// ===================================

// חשיפת פונקציות ל-window לשימוש ב-onclick
window.openLessonListModal = openLessonListModal;
window.closeLessonListModal = closeLessonListModal;
window.goToLesson = goToLesson;
window.attemptOpenLocked = attemptOpenLocked;

// ===================================
// אתחול
// ===================================

/**
 * אתחול המודול
 */
export function initFloatingAcademy() {
    console.log('🎓 Floating Academy Module initialized');
    
    // עדכון כפתור צף בהתחלה
    updateFloatingButton();
    
    // האזנה לשינויים במצב השיעורים
    // (יקרא אוטומטית כאשר unlockLesson או completeLesson נקראים)
    window.addEventListener('lesson-state-changed', () => {
        updateFloatingButton();
    });
}

// חשיפה גלובלית לדיבאג
window.FloatingAcademyModule = {
    open: openLessonListModal,
    close: closeLessonListModal,
    update: updateFloatingButton,
    render: renderLessonList
};
