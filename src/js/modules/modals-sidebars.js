/**
 * ===========================================
 * 🎨 Modals & Sidebars Module
 * ===========================================
 * ניהול חלונות קופצים (Modals) וסרגלים צדדיים (Sidebars)
 * 
 * Stage C:
 * - Profile Modal: חלון קופץ עם גרפים וסטטיסטיקות
 * - Mentor Sidebar: צ'אט נגרר מהצד (כמו WhatsApp)
 */

import { getGameState, ACHIEVEMENTS } from '../core/state.js';
import { formatCurrency } from '../utils/format.js';

/**
 * פתיחת Profile Modal
 */
export function openProfileModal() {
    console.log('📊 Opening Profile Modal');
    
    // יצירת HTML למודל אם לא קיים
    let modalOverlay = document.getElementById('profile-modal-overlay');
    if (!modalOverlay) {
        modalOverlay = createProfileModalHTML();
        document.body.appendChild(modalOverlay);
    }
    
    // עדכון תוכן
    updateProfileModalContent();
    
    // הצגת המודל
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // מניעת גלילה ברקע
}

/**
 * סגירת Profile Modal
 */
export function closeProfileModal() {
    console.log('📊 Closing Profile Modal');
    
    const modalOverlay = document.getElementById('profile-modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = ''; // החזרת גלילה
    }
}

/**
 * יצירת HTML למודל פרופיל
 */
function createProfileModalHTML() {
    const overlay = document.createElement('div');
    overlay.id = 'profile-modal-overlay';
    overlay.className = 'profile-modal-overlay';
    
    overlay.innerHTML = `
        <div class="profile-modal">
            <div class="profile-modal-header">
                <h2 class="profile-modal-title"><i class="fas fa-chart-line"></i> הפרופיל הפיננסי שלך</h2>
                <button class="profile-modal-close" onclick="closeProfileModal()">×</button>
            </div>
            <div class="profile-modal-content">
                <!-- תוכן דינמי ייטען כאן -->
                <div id="profile-modal-body"></div>
            </div>
        </div>
    `;
    
    // סגירה בלחיצה על הרקע
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeProfileModal();
        }
    });
    
    return overlay;
}

/**
 * עדכון תוכן המודל
 */
function updateProfileModalContent() {
    const container = document.getElementById('profile-modal-body');
    if (!container) return;
    
    const state = getGameState();
    
    container.innerHTML = `
        <!-- סטטיסטיקות עליונות -->
        <div class="profile-stats-grid">
            <div class="profile-stat-card">
                <div class="profile-stat-label">רמה נוכחית</div>
                <div class="profile-stat-value">${state.level || 1}</div>
            </div>
            <div class="profile-stat-card">
                <div class="profile-stat-label">ניסיון כולל</div>
                <div class="profile-stat-value">${state.xp || 0} XP</div>
            </div>
            <div class="profile-stat-card">
                <div class="profile-stat-label">שיעורים הושלמו</div>
                <div class="profile-stat-value">${state.lessonsCompleted || 0}/4</div>
            </div>
            <div class="profile-stat-card">
                <div class="profile-stat-label">הישגים</div>
                <div class="profile-stat-value">${state.achievements?.length || 0}/8</div>
            </div>
        </div>
        
        <!-- שתי עמודות -->
        <div class="profile-two-columns">
            <!-- עמודה שמאלית: גרפים -->
            <div class="profile-section">
                <h3><i class="fas fa-chart-area"></i> התקדמות</h3>
                <div class="profile-chart-container">
                    <canvas id="profile-mini-chart"></canvas>
                </div>
                <p style="font-size: 13px; color: #666; margin-top: 12px;">
                    הגרף מציג את התקדמות ה-XP שלך לאורך זמן.
                </p>
            </div>
            
            <!-- עמודה ימנית: הישגים -->
            <div class="profile-section">
                <h3><i class="fas fa-trophy"></i> הישגים אחרונים</h3>
                <div id="profile-achievements-list">
                    ${renderAchievementsList(state.achievements || [])}
                </div>
            </div>
        </div>
        
        <!-- ניהול נתונים -->
        <div class="profile-section" style="margin-top: 24px; border-top: 2px solid #f0f0f0; padding-top: 20px;">
            <h3><i class="fas fa-database"></i> ניהול נתונים</h3>
            <div class="tip-box warn" style="padding: 16px; margin: 12px 0;">
                <p style="margin: 0 0 8px 0; font-weight: 600;">
                    <i class="fas fa-exclamation-triangle"></i> 
                    איפוס מלא של המשחק
                </p>
                <p style="margin: 0 0 12px 0; font-size: 13px; opacity: 0.9;">
                    פעולה זו תמחק את כל ההתקדמות שלך ותחזיר אותך למצב ההתחלתי. שימושי לבדיקות או התחלה מחדש.
                </p>
                <button class="btn-secondary" onclick="resetGameData()" style="width: 100%; font-size: 14px;">
                    🔄 אפס את כל המשחק
                </button>
            </div>
        </div>
        
        <!-- כפתור סגירה -->
        <div style="margin-top: 20px; display: flex; justify-content: center;">
            <button class="btn-primary" onclick="closeProfileModal()" style="min-width: 120px;">
                סגור
            </button>
        </div>
    `;
    
    // ציור גרף קטן
    setTimeout(() => renderProfileMiniChart(state), 100);
}

/**
 * רינדור רשימת הישגים
 */
function renderAchievementsList(achievementIds) {
    if (!achievementIds || achievementIds.length === 0) {
        return '<p style="color: #999; font-size: 14px;">עדיין לא השגת הישגים. המשך ללמוד!</p>';
    }
    
    // תרגום IDs להישגים מלאים
    const achievements = achievementIds
        .map(id => ACHIEVEMENTS.find(ach => ach.id === id))
        .filter(ach => ach); // הסר nulls
    
    return achievements.slice(-3).map(ach => `
        <div style="background: white; padding: 12px; border-radius: 8px; margin-bottom: 8px;">
            <div style="font-weight: 600; margin-bottom: 4px;">${ach.icon} ${ach.title}</div>
            <div style="font-size: 12px; color: #666;">${ach.desc}</div>
        </div>
    `).join('');
}

/**
 * ציור גרף XP קטן
 */
function renderProfileMiniChart(state) {
    const canvas = document.getElementById('profile-mini-chart');
    if (!canvas || typeof Chart === 'undefined') return;
    
    const ctx = canvas.getContext('2d');
    
    // נתונים לדוגמה (בעתיד יבואו מהמצב האמיתי)
    const data = {
        labels: ['התחלה', 'שיעור 1', 'שיעור 2', 'עכשיו'],
        datasets: [{
            label: 'XP',
            data: [0, 20, 60, state.xp || 0],
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

/**
 * פתיחת Mentor Sidebar
 */
export function openMentorSidebar() {
    console.log('🤖 Opening Mentor Sidebar');
    
    // יצירת HTML לסיידבר אם לא קיים
    let sidebarOverlay = document.getElementById('mentor-sidebar-overlay');
    let sidebar = document.getElementById('mentor-sidebar');
    
    if (!sidebarOverlay || !sidebar) {
        const elements = createMentorSidebarHTML();
        document.body.appendChild(elements.overlay);
        document.body.appendChild(elements.sidebar);
        
        sidebarOverlay = elements.overlay;
        sidebar = elements.sidebar;
    }
    
    // הצגת הסיידבר
    sidebarOverlay.classList.add('active');
    setTimeout(() => {
        sidebar.classList.add('active');
    }, 10);
    
    document.body.style.overflow = 'hidden';
    
    // טעינת הודעות קיימות
    loadMentorMessages();
}

/**
 * סגירת Mentor Sidebar
 */
export function closeMentorSidebar() {
    console.log('🤖 Closing Mentor Sidebar');
    
    const sidebarOverlay = document.getElementById('mentor-sidebar-overlay');
    const sidebar = document.getElementById('mentor-sidebar');
    
    if (sidebar) {
        sidebar.classList.remove('active');
    }
    
    setTimeout(() => {
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }, 300);
}

/**
 * יצירת HTML לסיידבר מנטור
 */
function createMentorSidebarHTML() {
    // Overlay
    const overlay = document.createElement('div');
    overlay.id = 'mentor-sidebar-overlay';
    overlay.className = 'mentor-sidebar-overlay';
    overlay.addEventListener('click', closeMentorSidebar);
    
    // Sidebar
    const sidebar = document.createElement('div');
    sidebar.id = 'mentor-sidebar';
    sidebar.className = 'mentor-sidebar';
    
    sidebar.innerHTML = `
        <div class="mentor-sidebar-header">
            <h3 class="mentor-sidebar-title"><i class="fas fa-robot"></i> המנטור הפיננסי שלי</h3>
            <button class="mentor-sidebar-close" onclick="closeMentorSidebar()">×</button>
        </div>
        
        <div class="mentor-chat-container" id="mentor-chat-messages">
            <!-- הודעות יטענו כאן -->
        </div>
        
        <div class="mentor-input-area">
            <input 
                type="text" 
                class="mentor-input" 
                id="mentor-message-input"
                placeholder="שאל אותי כל שאלה פיננסית..."
                onkeypress="if(event.key==='Enter') sendMentorMessage()"
            >
            <button class="mentor-send-button" onclick="sendMentorMessage()">
                ➤
            </button>
        </div>
    `;
    
    return { overlay, sidebar };
}

/**
 * טעינת הודעות קיימות
 */
function loadMentorMessages() {
    const container = document.getElementById('mentor-chat-messages');
    if (!container) return;
    
    // קריאת הודעות מ-localStorage
    const messages = JSON.parse(localStorage.getItem('mentor-messages') || '[]');
    
    if (messages.length === 0) {
        // הודעת ברכה ראשונה
        messages.push({
            type: 'ai',
            text: 'שלום! אני המנטור הפיננסי שלך 🤖\n\nאני כאן כדי לעזור לך עם שאלות על תקציב, חיסכון, השקעות ועוד.\n\nמה תרצה לדעת?',
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('mentor-messages', JSON.stringify(messages));
    }
    
    renderMentorMessages(messages);
}

/**
 * רינדור הודעות בצ'אט
 */
function renderMentorMessages(messages) {
    const container = document.getElementById('mentor-chat-messages');
    if (!container) return;
    
    container.innerHTML = messages.map(msg => {
        const time = new Date(msg.timestamp).toLocaleTimeString('he-IL', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        return `
            <div class="mentor-message ${msg.type}">
                <div class="mentor-avatar">${msg.type === 'ai' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>'}</div>
                <div>
                    <div class="mentor-bubble">${msg.text.replace(/\n/g, '<br>')}</div>
                    <div class="mentor-timestamp">${time}</div>
                </div>
            </div>
        `;
    }).join('');
    
    // גלילה לסוף
    container.scrollTop = container.scrollHeight;
}

/**
 * שליחת הודעה למנטור
 */
export function sendMentorMessage() {
    const input = document.getElementById('mentor-message-input');
    if (!input) return;
    
    const text = input.value.trim();
    if (!text) return;
    
    // שמירת הודעת המשתמש
    const messages = JSON.parse(localStorage.getItem('mentor-messages') || '[]');
    messages.push({
        type: 'user',
        text: text,
        timestamp: new Date().toISOString()
    });
    
    // ניקוי שדה
    input.value = '';
    
    // רינדור מחדש
    renderMentorMessages(messages);
    
    // תגובה אוטומטית (MVP - בעתיד יהיה AI אמיתי)
    setTimeout(() => {
        const response = generateMentorResponse(text);
        messages.push({
            type: 'ai',
            text: response,
            timestamp: new Date().toISOString()
        });
        
        localStorage.setItem('mentor-messages', JSON.stringify(messages));
        renderMentorMessages(messages);
    }, 1000);
}

/**
 * יצירת תגובה אוטומטית (MVP)
 */
function generateMentorResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('תקציב') || msg.includes('הוצאות')) {
        return 'תקציב הוא הבסיס לניהול פיננסי טוב! 💰\n\nכלל 50/30/20:\n- 50% צרכים בסיסיים\n- 30% רצונות\n- 20% חיסכון\n\nרוצה ללמוד עוד? לך ל"אקדמיית הכסף"!';
    }
    
    if (msg.includes('חיסכון') || msg.includes('לחסוך')) {
        return 'חיסכון זה קריטי! 🏦\n\nמומלץ:\n- קרן חירום: 3-6 חודשי הוצאות\n- חיסכון חודשי: לפחות 20% מהמשכורת\n- השקעות לטווח ארוך\n\nהתחל עכשיו בסימולטור!';
    }
    
    if (msg.includes('השקעות') || msg.includes('השקעה')) {
        return 'השקעות זו הדרך הטובה ביותר לצמיחה! 📈\n\nעקרונות בסיסיים:\n- פיזור סיכונים\n- השקעה לטווח ארוך\n- מדדים (תשואה ממוצעת 7%)\n\nיש שיעור על זה באקדמיה!';
    }
    
    if (msg.includes('חוב') || msg.includes('הלוואה')) {
        return 'חובות צריך לטפל בהם בראש סדר! 💳\n\nעדיפויות:\n1. חוב בריבית גבוהה (כרטיסי אשראי)\n2. הלוואות צרכניות\n3. משכנתא\n\nפרעון מהיר חוסך הרבה כסף!';
    }
    
    // תגובה כללית
    return 'שאלה מעניינת! 🤔\n\nאני כאן כדי לעזור. נסה לשאול אותי על:\n- תקציב אישי\n- חיסכון וקרן חירום\n- השקעות\n- ניהול חובות\n\nמה מעניין אותך?';
}

/**
 * אתחול המודול
 */
export function initModals() {
    console.log('🎨 Initializing Modals & Sidebars');
    
    // הוספת פונקציות ל-window scope (לשימוש inline onclick)
    window.openProfileModal = openProfileModal;
    window.closeProfileModal = closeProfileModal;
    window.openMentorSidebar = openMentorSidebar;
    window.closeMentorSidebar = closeMentorSidebar;
    window.sendMentorMessage = sendMentorMessage;
    
    // סגירה עם ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProfileModal();
            closeMentorSidebar();
        }
    });
}
