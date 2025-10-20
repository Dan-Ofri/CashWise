/**
 * ===========================================
 * 🪟 Modal Component
 * ===========================================
 * מערכת Modal מרכזית ומתקדמת
 */

import { Z_INDEX, UI_TIMING } from '../config/index.js';

/**
 * יצירת modal כללי
 * @param {Object} options - אפשרויות המודל
 * @returns {HTMLElement}
 */
export function createModal(options = {}) {
    const {
        id = 'modal-' + Date.now(),
        title = '',
        content = '',
        icon = '',
        buttons = [],
        onClose = null,
        closeOnBackdrop = true,
        maxWidth = '600px',
        showCloseButton = true
    } = options;
    
    // הסרת modal קיים עם אותו ID
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    
    // בניית כפתורים
    let buttonsHtml = '';
    if (buttons.length > 0) {
        buttonsHtml = buttons.map(btn => `
            <button 
                class="modal-btn ${btn.className || ''}"
                data-action="${btn.action || ''}"
                style="
                    padding: 12px 24px;
                    margin: 0 8px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: all 0.3s;
                    background: ${btn.primary ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f5f5f5'};
                    color: ${btn.primary ? '#fff' : '#333'};
                "
            >${btn.label}</button>
        `).join('');
    }
    
    // יצירת HTML
    const html = `
        <div class="modal-backdrop" style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: ${Z_INDEX.MODAL};
            animation: fadeIn 0.3s ease;
        ">
            <div class="modal-content" onclick="event.stopPropagation()" style="
                background: #fff;
                border-radius: 16px;
                padding: 30px;
                max-width: ${maxWidth};
                width: 90%;
                max-height: 85vh;
                overflow-y: auto;
                animation: slideUp 0.3s ease;
            ">
                ${showCloseButton ? `
                    <button class="modal-close" style="
                        position: absolute;
                        top: 20px;
                        left: 20px;
                        background: none;
                        border: none;
                        font-size: 28px;
                        cursor: pointer;
                        color: #999;
                    ">×</button>
                ` : ''}
                
                ${title || icon ? `
                    <div class="modal-header" style="text-align: center; margin-bottom: 24px;">
                        ${icon ? `<div style="font-size: 48px; margin-bottom: 12px;">${icon}</div>` : ''}
                        ${title ? `<h2 style="margin: 0; color: #667eea; font-size: 24px;">${title}</h2>` : ''}
                    </div>
                ` : ''}
                
                <div class="modal-body">
                    ${content}
                </div>
                
                ${buttonsHtml ? `
                    <div class="modal-footer" style="
                        display: flex;
                        justify-content: center;
                        margin-top: 24px;
                        flex-wrap: wrap;
                    ">
                        ${buttonsHtml}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    // יצירת אלמנט
    const modalDiv = document.createElement('div');
    modalDiv.id = id;
    modalDiv.innerHTML = html;
    
    // Event listeners
    const backdrop = modalDiv.querySelector('.modal-backdrop');
    const closeBtn = modalDiv.querySelector('.modal-close');
    
    // סגירה על backdrop
    if (closeOnBackdrop) {
        backdrop.addEventListener('click', () => {
            closeModal(id);
            if (onClose) onClose();
        });
    }
    
    // סגירה על כפתור X
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeModal(id);
            if (onClose) onClose();
        });
    }
    
    // אירועי כפתורים
    buttons.forEach(btn => {
        if (btn.onClick) {
            const btnElement = modalDiv.querySelector(`[data-action="${btn.action}"]`);
            if (btnElement) {
                btnElement.addEventListener('click', () => {
                    const shouldClose = btn.onClick();
                    if (shouldClose !== false) {
                        closeModal(id);
                    }
                });
            }
        }
    });
    
    // הוספה לדף
    document.body.appendChild(modalDiv);
    
    // Focus trap (עבור נגישות)
    const focusableElements = modalDiv.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
    
    return modalDiv;
}

/**
 * סגירת modal
 */
export function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), UI_TIMING.FADE_OUT_DURATION);
    }
}

/**
 * modal אישור/ביטול
 */
export function confirm(message, title = 'אישור', icon = '❓') {
    return new Promise((resolve) => {
        createModal({
            id: 'confirm-modal',
            title,
            icon,
            content: `<p style="text-align: center; font-size: 16px; line-height: 1.6;">${message}</p>`,
            buttons: [
                {
                    label: 'ביטול',
                    action: 'cancel',
                    onClick: () => {
                        resolve(false);
                        return true;
                    }
                },
                {
                    label: 'אישור',
                    action: 'confirm',
                    primary: true,
                    onClick: () => {
                        resolve(true);
                        return true;
                    }
                }
            ],
            closeOnBackdrop: false,
            onClose: () => resolve(false)
        });
    });
}

/**
 * modal התראה פשוט
 */
export function alert(message, title = 'התראה', icon = 'ℹ️') {
    return new Promise((resolve) => {
        createModal({
            id: 'alert-modal',
            title,
            icon,
            content: `<p style="text-align: center; font-size: 16px; line-height: 1.6;">${message}</p>`,
            buttons: [
                {
                    label: 'הבנתי',
                    action: 'ok',
                    primary: true,
                    onClick: () => {
                        resolve(true);
                        return true;
                    }
                }
            ],
            onClose: () => resolve(true)
        });
    });
}

/**
 * modal קלט טקסט
 */
export function prompt(message, title = 'הזן ערך', defaultValue = '') {
    return new Promise((resolve) => {
        const content = `
            <p style="margin-bottom: 16px; text-align: center;">${message}</p>
            <input 
                type="text" 
                id="prompt-input" 
                value="${defaultValue}"
                style="
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #ddd;
                    border-radius: 8px;
                    font-size: 16px;
                    text-align: right;
                "
            />
        `;
        
        createModal({
            id: 'prompt-modal',
            title,
            icon: '✏️',
            content,
            buttons: [
                {
                    label: 'ביטול',
                    action: 'cancel',
                    onClick: () => {
                        resolve(null);
                        return true;
                    }
                },
                {
                    label: 'אישור',
                    action: 'submit',
                    primary: true,
                    onClick: () => {
                        const input = document.getElementById('prompt-input');
                        resolve(input ? input.value : null);
                        return true;
                    }
                }
            ],
            closeOnBackdrop: false,
            onClose: () => resolve(null)
        });
        
        // Focus על input
        setTimeout(() => {
            const input = document.getElementById('prompt-input');
            if (input) {
                input.focus();
                input.select();
            }
        }, UI_TIMING.INPUT_FOCUS_DELAY);
    });
}

// הזרקת סטיילים למודלים
(function injectModalStyles() {
    if (document.getElementById('modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .modal-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .modal-close:hover {
            color: #333;
            transform: rotate(90deg);
        }
        
        .modal-content {
            position: relative;
        }
    `;
    document.head.appendChild(style);
})();
