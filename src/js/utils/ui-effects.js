/**
 * ===========================================
 * 🎨 UI Effects & Animations
 * ===========================================
 * אפקטים ויזואליים ואנימציות למשתמש
 */

/**
 * הוספת אפקט Ripple לכפתור
 */
export function addRippleEffect(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    
    // חישוב מיקום
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // סטייל
    ripple.style.position = 'absolute';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = ripple.style.height = '1px';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.animation = 'ripple 0.6s ease-out';
    ripple.style.pointerEvents = 'none';
    
    // הוספה למיכל
    if (button.style.position !== 'absolute' && button.style.position !== 'relative') {
        button.style.position = 'relative';
    }
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    // הסרה אחרי האנימציה
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

/**
 * Smooth scroll לאלמנט
 */
export function smoothScrollTo(element) {
    if (!element) return;
    
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

/**
 * הצגת מצב טעינה בכפתור
 */
export function setButtonLoading(button, isLoading) {
    if (!button) return;
    
    if (isLoading) {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<div class="loading"></div> טוען...';
        button.style.opacity = '0.7';
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || button.innerHTML;
        button.style.opacity = '1';
    }
}

/**
 * חגיגת הישג עם אפקט קונפטי
 */
export function celebrateAchievement() {
    // יצירת סטייל קונפטי אם לא קיים
    if (!document.getElementById('confetti-styles')) {
        const style = document.createElement('style');
        style.id = 'confetti-styles';
        style.textContent = `
            .confetti {
                position: fixed;
                width: 10px;
                height: 10px;
                background: #ffd700;
                position: fixed;
                top: -10px;
                z-index: 9999;
                animation: confetti-fall 3s linear forwards;
            }
            @keyframes confetti-fall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // יצירת 50 קונפטי
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.3 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 3000);
        }, i * 30);
    }
}

/**
 * אנימציית Progress Bar
 */
export function animateProgressBar(element, targetWidth, duration = 1000) {
    if (!element) return;
    
    const start = parseFloat(element.style.width) || 0;
    const end = Math.min(100, Math.max(0, targetWidth));
    const range = end - start;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentWidth = start + (range * eased);
        
        element.style.width = currentWidth + '%';
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/**
 * אנימציית מספרים (Counter)
 */
export function animateNumber(element, targetNumber, duration = 1000) {
    if (!element) return;
    
    const startNumber = parseFloat(element.textContent.replace(/[^0-9.-]/g, '')) || 0;
    const increment = (targetNumber - startNumber) / (duration / 16);
    let current = startNumber;
    
    const timer = setInterval(() => {
        current += increment;
        
        if ((increment > 0 && current >= targetNumber) || (increment < 0 && current <= targetNumber)) {
            current = targetNumber;
            clearInterval(timer);
        }
        
        element.textContent = Math.round(current).toLocaleString() + '₪';
    }, 16);
}

/**
 * Lazy loading לתמונות
 */
export function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * אתחול אפקטים גלובליים
 */
export function initUIEffects() {
    // Ripple לכל הכפתורים
    document.querySelectorAll('button, .action').forEach(button => {
        button.addEventListener('click', addRippleEffect);
    });
    
    // Lazy loading
    if ('IntersectionObserver' in window) {
        setupLazyLoading();
    }
    
    // Smooth scrolling לקישורים
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#' || href.length <= 1) return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) smoothScrollTo(target);
        });
    });
    
    console.log('✨ UI Effects initialized');
}
