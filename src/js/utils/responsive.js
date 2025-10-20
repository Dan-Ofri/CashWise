/**
 * ============================================
 * 📱 Device Detection & Responsive Utilities
 * ============================================
 * 
 * Purpose: Detect device type, screen size, orientation
 * Version: 7.0
 * Created: October 19, 2025
 */

import { BREAKPOINTS, UI_TIMING, MATH_CONSTANTS } from '../config/index.js';

/**
 * Device detection and classification
 */
export function detectDevice() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const userAgent = navigator.userAgent.toLowerCase();
    
    const device = {
        // Screen dimensions
        width,
        height,
        
        // Device type
        isMobile: width < BREAKPOINTS.TABLET,
        isTablet: width >= BREAKPOINTS.TABLET && width < BREAKPOINTS.LAPTOP,
        isLaptop: width >= BREAKPOINTS.LAPTOP && width < BREAKPOINTS.DESKTOP,
        isDesktop: width >= BREAKPOINTS.DESKTOP,
        
        // Specific breakpoints
        isMobileSmall: width < BREAKPOINTS.MOBILE_SMALL,
        isMobileLarge: width >= BREAKPOINTS.MOBILE_SMALL && width < BREAKPOINTS.TABLET,
        
        // Orientation
        isPortrait: height > width,
        isLandscape: width > height,
        
        // Touch capability
        isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        
        // Device OS
        isIOS: /iphone|ipad|ipod/.test(userAgent),
        isAndroid: /android/.test(userAgent),
        
        // Browser
        isChrome: /chrome/.test(userAgent) && !/edg/.test(userAgent),
        isSafari: /safari/.test(userAgent) && !/chrome/.test(userAgent),
        isFirefox: /firefox/.test(userAgent),
        
        // Pixel ratio (for retina displays)
        pixelRatio: window.devicePixelRatio || MATH_CONSTANTS.ONE,
        isRetina: window.devicePixelRatio > MATH_CONSTANTS.ONE,
        
        // Connection (if supported)
        connection: navigator.connection ? {
            type: navigator.connection.effectiveType,
            downlink: navigator.connection.downlink,
            saveData: navigator.connection.saveData
        } : null
    };
    
    return device;
}

/**
 * Add device classes to body
 */
export function applyDeviceClasses() {
    const device = detectDevice();
    const body = document.body;
    
    // Remove old classes
    body.className = body.className.replace(/\b(mobile|tablet|laptop|desktop|portrait|landscape|touch|no-touch)\b/g, '').trim();
    
    // Add device type
    if (device.isMobileSmall) body.classList.add('mobile-small');
    if (device.isMobileLarge) body.classList.add('mobile-large');
    if (device.isMobile) body.classList.add('mobile');
    if (device.isTablet) body.classList.add('tablet');
    if (device.isLaptop) body.classList.add('laptop');
    if (device.isDesktop) body.classList.add('desktop');
    
    // Add orientation
    if (device.isPortrait) body.classList.add('portrait');
    if (device.isLandscape) body.classList.add('landscape');
    
    // Add touch capability
    if (device.isTouch) body.classList.add('touch');
    else body.classList.add('no-touch');
    
    // Add OS
    if (device.isIOS) body.classList.add('ios');
    if (device.isAndroid) body.classList.add('android');
    
    // Add retina
    if (device.isRetina) body.classList.add('retina');
    
    console.log('📱 Device detected:', {
        type: device.isMobile ? 'Mobile' : device.isTablet ? 'Tablet' : device.isLaptop ? 'Laptop' : 'Desktop',
        size: `${device.width}x${device.height}`,
        orientation: device.isPortrait ? 'Portrait' : 'Landscape',
        touch: device.isTouch,
        os: device.isIOS ? 'iOS' : device.isAndroid ? 'Android' : 'Other'
    });
    
    return device;
}

/**
 * Handle orientation change
 */
function handleOrientationChange() {
    console.log('🔄 Orientation changed');
    applyDeviceClasses();
    
    // Emit custom event
    window.dispatchEvent(new CustomEvent('app:orientation:changed', {
        detail: detectDevice()
    }));
}

/**
 * Handle resize with debounce
 */
let resizeTimeout;
function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        console.log('📏 Window resized');
        applyDeviceClasses();
        
        // Emit custom event
        window.dispatchEvent(new CustomEvent('app:resize', {
            detail: detectDevice()
        }));
    }, UI_TIMING.RESIZE_DEBOUNCE_DELAY);
}

/**
 * Get safe area insets (for notch devices)
 */
export function getSafeAreaInsets() {
    const style = getComputedStyle(document.documentElement);
    
    return {
        top: parseInt(style.getPropertyValue('env(safe-area-inset-top)')) || 0,
        right: parseInt(style.getPropertyValue('env(safe-area-inset-right)')) || 0,
        bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)')) || 0,
        left: parseInt(style.getPropertyValue('env(safe-area-inset-left)')) || 0
    };
}

/**
 * Check if device is in standalone mode (PWA)
 */
export function isStandalone() {
    return (window.matchMedia('(display-mode: standalone)').matches) ||
           (window.navigator.standalone) ||
           document.referrer.includes('android-app://');
}

/**
 * Get viewport dimensions (excluding browser chrome)
 */
export function getViewportDimensions() {
    return {
        width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    };
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element, threshold = 0) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const viewHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewWidth = window.innerWidth || document.documentElement.clientWidth;
    
    return (
        rect.top >= -threshold &&
        rect.left >= -threshold &&
        rect.bottom <= viewHeight + threshold &&
        rect.right <= viewWidth + threshold
    );
}

/**
 * Scroll to element with smooth behavior
 */
export function scrollToElement(element, offset = 0) {
    if (!element) return;
    
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

/**
 * Lock scroll (for modals)
 */
export function lockScroll() {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // For iOS
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
}

/**
 * Unlock scroll
 */
export function unlockScroll() {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    
    // For iOS
    document.body.style.position = '';
    document.body.style.width = '';
}

/**
 * Initialize responsive utilities
 */
export function initResponsive() {
    console.log('📱 Initializing Responsive Utilities...');
    
    // Initial detection
    const device = applyDeviceClasses();
    
    // Listen for orientation changes
    if (window.screen && window.screen.orientation) {
        window.screen.orientation.addEventListener('change', handleOrientationChange);
    } else {
        // Fallback for older browsers
        window.addEventListener('orientationchange', handleOrientationChange);
    }
    
    // Listen for resize
    window.addEventListener('resize', handleResize);
    
    // Log standalone mode
    if (isStandalone()) {
        console.log('📱 Running in standalone mode (PWA)');
        document.body.classList.add('standalone');
    }
    
    // Log safe area insets
    const insets = getSafeAreaInsets();
    if (insets.top > 0 || insets.bottom > 0) {
        console.log('📱 Safe area insets detected:', insets);
        document.body.style.setProperty('--safe-area-top', `${insets.top}px`);
        document.body.style.setProperty('--safe-area-bottom', `${insets.bottom}px`);
    }
    
    console.log('✅ Responsive Utilities initialized');
    
    return device;
}

// Global exposure for debugging
if (typeof window !== 'undefined') {
    window.ResponsiveUtils = {
        detectDevice,
        applyDeviceClasses,
        getSafeAreaInsets,
        isStandalone,
        getViewportDimensions,
        isInViewport,
        scrollToElement,
        lockScroll,
        unlockScroll
    };
}
