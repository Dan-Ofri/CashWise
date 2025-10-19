/**
 * ===========================================
 * 📢 Notifications & Toast System
 * ===========================================
 * מערכת הודעות ו-toast מרכזית
 */

/**
 * הצגת הודעת Toast למשתמש
 * @param {string} message - תוכן ההודעה
 * @param {string} type - סוג: 'success' | 'error' | 'warning' | 'info'
 * @param {number} duration - משך זמן בms (ברירת מחדל: 3000)
 */
export function showNotification(message, type = 'info', duration = 3000) {
    // יצירת אלמנט Toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // אייקון לפי סוג
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <span style="font-size:24px;margin-left:12px;">${icons[type] || icons.info}</span>
        <span style="font-size:16px;font-weight:500;">${message}</span>
    `;
    
    // הוספה לדף
    document.body.appendChild(toast);
    
    // הסרה אוטומטית
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
    
    return toast;
}

/**
 * הודעת הצלחה מהירה
 */
export function showSuccess(message) {
    return showNotification(message, 'success', 3000);
}

/**
 * הודעת שגיאה
 */
export function showError(message) {
    return showNotification(message, 'error', 4000);
}

/**
 * הודעת אזהרה
 */
export function showWarning(message) {
    return showNotification(message, 'warning', 3500);
}

/**
 * הודעת מידע
 */
export function showInfo(message) {
    return showNotification(message, 'info', 3000);
}

// ===== הזרקת Styles למסך Toast =====
(function injectToastStyles() {
    if (document.getElementById('toast-styles')) return; // כבר קיים
    
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
        .toast {
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 16px 24px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            z-index: 10000;
            animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            max-width: 400px;
        }
        
        .toast.success { border-right: 4px solid #10B981; }
        .toast.error { border-right: 4px solid #EF4444; }
        .toast.warning { border-right: 4px solid #F59E0B; }
        .toast.info { border-right: 4px solid #3B82F6; }
        
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(-100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes fadeOut {
            to {
                opacity: 0;
                transform: scale(0.95);
            }
        }
    `;
    document.head.appendChild(style);
})();
