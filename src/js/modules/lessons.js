/**
 * ===========================================
 * 🔐 Lessons State Module
 * ===========================================
 * מערכת ניהול מצב שיעורים - נעילה, פתיחה, השלמה
 * 
 * עקרונות:
 * - שיעורים נעולים כברירת מחדל
 * - נפתחים רק דרך טריגרים מהסימולטור
 * - מצב נשמר ב-localStorage
 * - אי אפשר לפתוח שיעור נעול ידנית
 */

import { addXP } from '../core/state.js';
import { showNotification, showSuccess } from '../utils/notifications.js';

/**
 * הגדרת כל השיעורים במערכת
 */
const LESSONS_DEFINITION = {
    investments: {
        id: 'investments',
        title: 'ריבית דריבית והשקעות',
        icon: '📈',
        description: 'למד איך להשקיע את כספך בחכמה ולהרוויח יותר',
        xpReward: 30,
        order: 1
    },
    emergencyFund: {
        id: 'emergencyFund',
        title: 'קרן חירום',
        icon: '🛡️',
        description: 'בנה רשת ביטחון פיננסית לימים קשים',
        xpReward: 25,
        order: 2
    },
    insurance: {
        id: 'insurance',
        title: 'ביטוח וניהול סיכונים',
        icon: '🏥',
        description: 'הגן על עצמך ועל משפחתך מפני הפתעות',
        xpReward: 25,
        order: 3
    },
    debtManagement: {
        id: 'debtManagement',
        title: 'ניהול חובות',
        icon: '💳',
        description: 'למד איך לצאת מחובות ולהישאר בירוק',
        xpReward: 20,
        order: 4
    }
};

/**
 * מצב שיעורים גלובלי
 */
let lessonsState = {};

/**
 * אתחול מצב שיעורים
 */
export function initLessonsState() {
    console.log('🔐 Initializing Lessons State...');
    
    // טעינה מ-localStorage
    const saved = localStorage.getItem('lessons-state');
    
    if (saved) {
        try {
            lessonsState = JSON.parse(saved);
            console.log('✅ Loaded lessons state from localStorage:', lessonsState);
            
            // ✅ בדיקה: האם אין אף שיעור פתוח?
            const unlockedCount = Object.values(lessonsState).filter(l => l.unlocked).length;
            if (unlockedCount === 0) {
                // בדיקה: האם המשתמש סיים סימולציה?
                const hasCompletedSimulation = localStorage.getItem('simulation-completed') === 'true';
                
                if (hasCompletedSimulation) {
                    console.warn('⚠️ No unlocked lessons found! Auto-unlocking investments (user completed simulation)');
                    lessonsState.investments.unlocked = true;
                    lessonsState.investments.unlockedAt = new Date().toISOString();
                    lessonsState.investments.unlockedReason = 'auto-unlock-after-simulation';
                    saveLessonsState();
                    console.log('✅ Auto-unlocked: investments');
                } else {
                    console.log('ℹ️ No lessons unlocked yet - user needs to complete simulation first');
                }
            }
        } catch (e) {
            console.error('❌ Failed to parse lessons state:', e);
            resetLessonsState();
        }
    } else {
        // אתחול ראשוני
        resetLessonsState();
    }
    
    console.log('✅ Lessons State initialized');
}

/**
 * איפוס מצב שיעורים (כל השיעורים נעולים בהתחלה!)
 */
function resetLessonsState() {
    lessonsState = {};
    
    // בדיקה: האם המשתמש סיים סימולציה?
    const hasCompletedSimulation = localStorage.getItem('simulation-completed') === 'true';
    
    Object.values(LESSONS_DEFINITION).forEach(lesson => {
        lessonsState[lesson.id] = {
            id: lesson.id,
            // 🔐 investments נפתח רק אחרי השלמת סימולציה!
            unlocked: lesson.id === 'investments' && hasCompletedSimulation,
            completed: false,
            unlockedAt: (lesson.id === 'investments' && hasCompletedSimulation) ? new Date().toISOString() : null,
            completedAt: null,
            unlockedReason: (lesson.id === 'investments' && hasCompletedSimulation) ? 'simulation-completed' : null
        };
    });
    
    saveLessonsState();
    
    if (hasCompletedSimulation) {
        console.log('🔄 Lessons state reset - investments unlocked (simulation completed)');
    } else {
        console.log('🔄 Lessons state reset - all lessons locked (complete simulation first)');
    }
}

/**
 * שמירת מצב שיעורים
 */
function saveLessonsState() {
    try {
        localStorage.setItem('lessons-state', JSON.stringify(lessonsState));
        console.log('💾 Lessons state saved');
        
        // הפעלת event לעדכון UI
        window.dispatchEvent(new CustomEvent('lesson-state-changed'));
    } catch (e) {
        console.error('❌ Failed to save lessons state:', e);
    }
}

/**
 * פתיחת שיעור (רק מטריגר!)
 */
export function unlockLesson(lessonId, reason = 'simulator-trigger') {
    console.log(`🔓 Unlocking lesson: ${lessonId}, reason: ${reason}`);
    
    // בדיקה שהשיעור קיים
    if (!LESSONS_DEFINITION[lessonId]) {
        console.error(`❌ Lesson ${lessonId} does not exist`);
        return false;
    }
    
    // בדיקה אם כבר פתוח
    if (lessonsState[lessonId]?.unlocked) {
        console.log(`ℹ️ Lesson ${lessonId} is already unlocked`);
        return true;
    }
    
    // פתיחת השיעור
    lessonsState[lessonId] = {
        ...lessonsState[lessonId],
        unlocked: true,
        unlockedAt: new Date().toISOString(),
        unlockedReason: reason
    };
    
    saveLessonsState();
    
    // הודעה למשתמש
    const lesson = LESSONS_DEFINITION[lessonId];
    showSuccess(`🎓 שיעור חדש נפתח: ${lesson.title}!`);
    addXP(10, 'פתיחת שיעור חדש');
    
    console.log(`✅ Lesson ${lessonId} unlocked successfully`);
    return true;
}

/**
 * סימון שיעור כהושלם
 */
export function completeLesson(lessonId) {
    console.log(`✅ Completing lesson: ${lessonId}`);
    
    // בדיקה שהשיעור קיים ופתוח
    if (!LESSONS_DEFINITION[lessonId]) {
        console.error(`❌ Lesson ${lessonId} does not exist`);
        return false;
    }
    
    if (!lessonsState[lessonId]?.unlocked) {
        console.error(`❌ Cannot complete locked lesson: ${lessonId}`);
        return false;
    }
    
    // בדיקה אם כבר הושלם
    if (lessonsState[lessonId]?.completed) {
        console.log(`ℹ️ Lesson ${lessonId} already completed`);
        return true;
    }
    
    // סימון כהושלם
    lessonsState[lessonId].completed = true;
    lessonsState[lessonId].completedAt = new Date().toISOString();
    
    saveLessonsState();
    
    // פרס
    const lesson = LESSONS_DEFINITION[lessonId];
    showSuccess(`🎉 סיימת את השיעור: ${lesson.title}!`);
    addXP(lesson.xpReward, `השלמת שיעור: ${lesson.title}`);
    
    console.log(`✅ Lesson ${lessonId} completed successfully`);
    return true;
}

/**
 * בדיקה האם שיעור פתוח
 */
export function isLessonUnlocked(lessonId) {
    return lessonsState[lessonId]?.unlocked === true;
}

/**
 * בדיקה האם שיעור הושלם
 */
export function isLessonCompleted(lessonId) {
    return lessonsState[lessonId]?.completed === true;
}

/**
 * קבלת כל השיעורים הפתוחים
 */
export function getUnlockedLessons() {
    return Object.values(lessonsState)
        .filter(lesson => lesson.unlocked)
        .map(lesson => ({
            ...LESSONS_DEFINITION[lesson.id],
            ...lesson
        }))
        .sort((a, b) => a.order - b.order);
}

/**
 * קבלת כל השיעורים (פתוחים + נעולים)
 */
export function getAllLessons() {
    return Object.values(LESSONS_DEFINITION)
        .map(lessonDef => ({
            ...lessonDef,
            ...lessonsState[lessonDef.id]
        }))
        .sort((a, b) => a.order - b.order);
}

/**
 * קבלת מצב שיעור ספציפי
 */
export function getLessonState(lessonId) {
    if (!LESSONS_DEFINITION[lessonId]) {
        return null;
    }
    
    return {
        ...LESSONS_DEFINITION[lessonId],
        ...lessonsState[lessonId]
    };
}

/**
 * בדיקה האם יש שיעורים פתוחים
 */
export function hasAnyUnlockedLessons() {
    return Object.values(lessonsState).some(lesson => lesson.unlocked);
}

/**
 * בדיקה האם יש שיעורים פתוחים שעדיין לא הושלמו
 * (זה מה שקובע את צבע הכפתור - זהב = יש מה ללמוד)
 */
export function hasUncompletedLessons() {
    return Object.values(lessonsState).some(lesson => lesson.unlocked && !lesson.completed);
}

/**
 * ספירת שיעורים שהושלמו
 */
export function getCompletedLessonsCount() {
    return Object.values(lessonsState).filter(lesson => lesson.completed).length;
}

/**
 * ספירת סך כל השיעורים
 */
export function getTotalLessonsCount() {
    return Object.keys(LESSONS_DEFINITION).length;
}

/**
 * חישוב אחוז התקדמות
 */
export function getLessonsProgress() {
    const total = getTotalLessonsCount();
    const completed = getCompletedLessonsCount();
    return total > 0 ? Math.round((completed / total) * 100) : 0;
}

/**
 * ניסיון לפתוח שיעור נעול (כשל במכוון)
 */
export function attemptOpenLockedLesson(lessonId) {
    console.log(`🔒 Attempted to open locked lesson: ${lessonId}`);
    
    const lesson = LESSONS_DEFINITION[lessonId];
    if (!lesson) return;
    
    showNotification(
        `🔒 ${lesson.title} עדיין נעול.\nהמשך לשחק בסימולטור כדי לפתוח שיעור זה!`,
        'warning',
        4000
    );
}

/**
 * איפוס מצב לצורכי פיתוח/בדיקה
 */
export function resetAllLessons() {
    if (confirm('האם אתה בטוח שברצונך לאפס את כל השיעורים?')) {
        resetLessonsState();
        showNotification('🔄 כל השיעורים אופסו', 'info');
        return true;
    }
    return false;
}

// חשיפה גלובלית לצורכי debugging
if (typeof window !== 'undefined') {
    window.LessonsModule = {
        unlock: unlockLesson,
        complete: completeLesson,
        isUnlocked: isLessonUnlocked,
        isCompleted: isLessonCompleted,
        getAll: getAllLessons,
        getUnlocked: getUnlockedLessons,
        getState: getLessonState,
        hasAny: hasAnyUnlockedLessons,
        progress: getLessonsProgress,
        reset: resetAllLessons
    };
}
