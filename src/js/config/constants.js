/**
 * ===========================================
 * ⚙️ CashWise - Application Constants
 * ===========================================
 * ריכוז כל הקבועים והערכים הקבועים במערכת
 * 
 * פילוסופיה: "בעיניי עם בסיס חזק בונים גבוה"
 * מטרה: להסיר את כל ה-Magic Numbers מהקוד
 * 
 * Created: 2025-01-XX
 * Last Updated: 2025-01-XX
 * ===========================================
 */

// ===== מערכת XP & LEVELING =====

/**
 * הגדרות מערכת הרמות וה-XP
 */
export const XP_CONFIG = {
    /** XP נדרש לעליית רמה אחת */
    XP_PER_LEVEL: 100,
    
    /** רמה מקסימלית במערכת */
    MAX_LEVEL: 50,
    
    /** בונוס XP לעליית רמה */
    LEVEL_UP_BONUS_XP: 50
};

/**
 * ערכי XP להישגים
 */
export const ACHIEVEMENT_XP = {
    /** השלמת שיעור התקציב */
    FIRST_BUDGET: 50,
    
    /** חישוב ריבית דריבית */
    COMPOUND_MASTER: 50,
    
    /** תכנון קרן חירום */
    EMERGENCY_READY: 50,
    
    /** חישוב השקעה מלא */
    INVESTOR: 50,
    
    /** סיום סימולציה */
    SIMULATION_DONE: 100,
    
    /** שאלת מנטור */
    ASK_MENTOR: 30,
    
    /** הגעה לרמה 5 */
    LEVEL_5: 0,
    
    /** סיום כל השיעורים */
    ALL_LESSONS: 200,
    
    /** הגעה לרמה 10 */
    MONEY_MASTER: 0
};

/**
 * ערכי XP לפעולות ושיעורים
 */
export const XP_REWARDS = {
    /** התחלת סימולציה */
    START_SIMULATION: 10,
    
    /** התקדמות חודש בסימולציה */
    MONTH_PROGRESS: 5,
    
    /** השגת יעד סימולציה */
    GOAL_ACHIEVED: 100,
    
    /** פתיחת שיעור */
    OPEN_LESSON: 10,
    
    /** מעבר ללמידה מהסימולטור */
    LEARN_FROM_SIM: 15,
    
    /** השלמת שיעור (ברירת מחדל) */
    COMPLETE_LESSON: 30,
    
    /** שיעור תקציב */
    LESSON_BUDGET: 30,
    
    /** שיעור ריבית דריבית */
    LESSON_COMPOUND: 25,
    
    /** שיעור קרן חירום */
    LESSON_EMERGENCY: 25,
    
    /** שיעור השקעות */
    LESSON_INVESTMENT: 20
};

/**
 * רמות משמעותיות במערכת
 */
export const LEVEL_MILESTONES = {
    /** רמה שמפתחת הישג מיוחד */
    LEVEL_5: 5,
    
    /** רמה של "מאסטר כסף" */
    LEVEL_10: 10
};

// ===== כללים פיננסיים =====

/**
 * כללים פיננסיים כלליים
 */
export const FINANCIAL_RULES = {
    /** מספר חודשים לקרן חירום - מינימום */
    EMERGENCY_FUND_MONTHS_MIN: 3,
    
    /** מספר חודשים לקרן חירום - מקסימום */
    EMERGENCY_FUND_MONTHS_MAX: 6,
    
    /** ברירת מחדל לקרן חירום (חודשים) */
    EMERGENCY_FUND_MONTHS_DEFAULT: 3,
    
    /** הכנסה חודשית מינימלית (₪) */
    MIN_MONTHLY_INCOME: 3000,
    
    /** מכפיל הכנסה מינימלי לחישובי חירום */
    MIN_INCOME_MULTIPLIER: 0.5,
    
    /** שיעור חיסכון ברירת מחדל (20%) */
    DEFAULT_SAVING_RATE: 0.20,
    
    /** שיעור חיסכון מומלץ (25%) */
    RECOMMENDED_SAVING_RATE: 0.25,
    
    /** שיעור חיסכון גבוה (30%) */
    HIGH_SAVING_RATE: 0.30,
    
    /** מס על רווחי השקעות (25%) */
    INVESTMENT_TAX_RATE: 0.25,
    
    /** תשואה שנתית ממוצעת - שוק מניות (7%) */
    STOCK_MARKET_RETURN: 0.07,
    
    /** תשואה שנתית - חיסכון בבנק (2%) */
    BANK_SAVINGS_RETURN: 0.02,
    
    /** שיעור אינפלציה ברירת מחדל (3%) */
    INFLATION_RATE_DEFAULT: 0.03,
    
    /** חודשים בשנה */
    MONTHS_PER_YEAR: 12,
    
    /** מספר תקופות ריבית דריבית בשנה */
    COMPOUND_PERIODS_YEARLY: 12,
    
    /** חיסכון מינימלי מומלץ (₪) */
    MIN_SAVINGS_AMOUNT: 500,
    
    /** סף "חיסכון נמוך" יחסית להכנסה (10%) */
    LOW_SAVINGS_THRESHOLD: 0.1,
    
    /** סף "חיסכון טוב" יחסית להכנסה (20%) */
    GOOD_SAVINGS_THRESHOLD: 0.2,
    
    /** סף מינימלי מוחלט לחיסכון (₪) */
    ABSOLUTE_MIN_SAVINGS: 1000,
    
    /** סף "חיסכון טוב" מוחלט (₪) */
    ABSOLUTE_GOOD_SAVINGS: 1200
};

/**
 * כללי תקציב 50/30/20
 */
export const BUDGET_RULES = {
    /** צרכים בסיסיים (50%) */
    NEEDS_PERCENTAGE: 0.50,
    
    /** רצונות (30%) */
    WANTS_PERCENTAGE: 0.30,
    
    /** חיסכון (20%) */
    SAVINGS_PERCENTAGE: 0.20,
    
    /** סף חיסכון מינימלי המומלץ על ידי המנטור */
    MENTOR_MIN_SAVINGS: 0.10
};

/**
 * מגבלות וסיכונים
 */
export const RISK_THRESHOLDS = {
    /** מתי חיסכון חודשי נמוך מדי יחסית להוצאות (15%) */
    LOW_MONTHLY_SAVING: 0.15,
    
    /** כמה חודשים "מהירים" לקרן חירום */
    FAST_EMERGENCY_BUILD: 12
};

// ===== פעולות מנטור =====

/**
 * XP לפעולות המנטור
 */
export const MENTOR_ACTION_XP = {
    /** העלאת חיסכון ב-10% */
    RAISE_SAVING_10: 20,
    
    /** העלאת חיסכון ב-20% */
    RAISE_SAVING_20: 30,
    
    /** הגדרת קרן חירום ל-3 חודשים */
    SET_EMERGENCY_3: 25,
    
    /** הצעה להשקעה ב-7% */
    SUGGEST_INVEST_7: 20
};

// ===== הגדרות סימולציה =====

/**
 * הגדרות ברירת מחדל לסימולטור
 */
export const SIMULATION_CONFIG = {
    /** גיל התחלתי */
    STARTING_AGE: 25,
    
    /** משכורת ברירת מחדל (₪) */
    DEFAULT_SALARY: 6000,
    
    /** הוצאות ברירת מחדל (₪) */
    DEFAULT_EXPENSES: 4500,
    
    /** גיל פרישה */
    RETIREMENT_AGE: 67,
    
    /** יעד חיסכון ברירת מחדל (₪) */
    DEFAULT_GOAL_AMOUNT: 50000,
    
    /** ריבית בנק בסימולציה (2%) */
    BANK_INTEREST_RATE: 0.02,
    
    /** חודשים עד אירוע/בדיקה שנתית */
    MONTHS_PER_YEAR: 12
};

// ===== זמנים ואנימציות =====

/**
 * זמנים לממשק המשתמש
 */
export const UI_TIMING = {
    /** משך הצגת התראה (3 שניות) */
    NOTIFICATION_DURATION: 3000,
    
    /** משך הצגת התראת הצלחה */
    NOTIFICATION_SUCCESS: 3000,
    
    /** משך הצגת התראת שגיאה (4 שניות) */
    NOTIFICATION_ERROR: 4000,
    
    /** משך הצגת התראת אזהרה (3.5 שניות) */
    NOTIFICATION_WARNING: 3500,
    
    /** משך הצגת התראת מידע */
    NOTIFICATION_INFO: 3000,
    
    /** משך אנימציה רגילה (1 שנייה) */
    ANIMATION_DURATION: 1000,
    
    /** משך אנימציה מהירה (חצי שנייה) */
    ANIMATION_DURATION_FAST: 500,
    
    /** משך אנימציה של Ripple */
    RIPPLE_DURATION: 600,
    
    /** עיכוב Debounce (300ms) */
    DEBOUNCE_DELAY: 300,
    
    /** עיכוב Throttle (100ms) */
    THROTTLE_DELAY: 100,
    
    /** עיכוב לבדיקת הישגים (שנייה) */
    ACHIEVEMENT_CHECK_DELAY: 1000,
    
    /** עיכוב קצר לאנימציות (0.5 שניות) */
    SHORT_DELAY: 500,
    
    /** עיכוב לרינדור תרשים */
    CHART_RENDER_DELAY: 100,
    
    /** עיכוב לסגירת מודאל */
    MODAL_CLOSE_DELAY: 300,
    
    /** עיכוב קצר לעדכון UI */
    SHORT_UI_UPDATE: 10,
    
    /** עיכוב להודעת מנטור */
    MENTOR_MESSAGE_DELAY: 800,
    
    /** עיכוב להודעת מנטור AI */
    AI_MENTOR_DELAY: 1000,
    
    /** עיכוב להצגת פרופיל מיני */
    PROFILE_MINI_DELAY: 100,
    
    /** עיכוב למעבר פנימי (300ms) */
    SECTION_TRANSITION: 300,
    
    /** עיכוב להשלמת שיעור */
    LESSON_COMPLETE_DELAY: 2000,
    
    /** עיכוב לחזרה מאקדמיה */
    ACADEMY_RETURN_DELAY: 1500,
    
    /** עיכוב לעדכון תרשימים */
    CHART_UPDATE_DELAY: 1500,
    
    /** זמן הצגת קונפטי */
    CONFETTI_DURATION: 3000,
    
    /** עיכוב בין יצירת קונפטי */
    CONFETTI_DELAY_EACH: 30,
    
    /** מסגרות לשנייה לאנימציות */
    ANIMATION_FPS: 16,
    
    /** עיכוב קצר לסימולציה */
    SIM_SHORT_DELAY: 50
};

// ===== אנימציות וקונפטי =====

/**
 * הגדרות אפקטים ויזואליים
 */
export const VISUAL_EFFECTS = {
    /** מספר חלקיקי קונפטי */
    CONFETTI_PARTICLE_COUNT: 50,
    
    /** עיכוב מקסימלי בין קונפטי (שניות) */
    CONFETTI_MAX_DELAY: 0.3,
    
    /** זמן אנימציה מינימלי לקונפטי (שניות) */
    CONFETTI_MIN_DURATION: 2,
    
    /** זמן אנימציה מקסימלי לקונפטי (שניות) */
    CONFETTI_MAX_DURATION: 4,
    
    /** אחוז מלא לפרוגרס בר */
    PROGRESS_BAR_MAX: 100,
    
    /** אחוז מינימלי לפרוגרס בר */
    PROGRESS_BAR_MIN: 0,
    
    /** מקדם Easing לאנימציות (cubic) */
    EASING_CUBIC_POWER: 3,
    
    /** עוצמה של אנימציית Ripple */
    RIPPLE_SCALE: 1
};

// ===== תרשימים =====

/**
 * הגדרות תרשימים (Chart.js)
 */
export const CHART_CONFIG = {
    /** גודל פונט לכותרות */
    TITLE_FONT_SIZE: 16,
    
    /** משפחת פונט */
    FONT_FAMILY: 'Heebo',
    
    /** רדיוס נקודה */
    POINT_RADIUS: 4,
    
    /** עובי קו גבול */
    BORDER_WIDTH: 2,
    
    /** מתיחות קו (smooth) */
    LINE_TENSION: 0.4,
    
    /** מקסימום רמות ברירת מחדל לתרשים XP */
    DEFAULT_MAX_LEVELS: 10,
    
    /** מספר רמות נוספות להציג מעבר לנוכחי */
    EXTRA_LEVELS_DISPLAY: 2,
    
    /** אופציות תצוגה לתרשים */
    RESPONSIVE: true,
    MAINTAIN_ASPECT_RATIO: false
};

// ===== מספרים כלליים ומתמטיים =====

/**
 * קבועים מתמטיים ומספריים
 */
export const MATH_CONSTANTS = {
    /** שניות בדקה */
    SECONDS_PER_MINUTE: 60,
    
    /** דקות בשעה */
    MINUTES_PER_HOUR: 60,
    
    /** שעות ביום */
    HOURS_PER_DAY: 24,
    
    /** מילישניות בשנייה */
    MILLISECONDS_PER_SECOND: 1000,
    
    /** מספר עשרוני ברירת מחדל לעיגול */
    DEFAULT_DECIMALS: 2,
    
    /** מכפיל עיגול לאחוזים */
    PERCENT_DECIMAL_MULTIPLIER: 10,
    
    /** אחוז מלא (100%) */
    FULL_PERCENT: 100,
    
    /** חלוקת אחוזים (לקבלת עשרוני מ-100) */
    PERCENT_TO_DECIMAL: 100,
    
    /** כפל לקבלת אחוז מעשרוני */
    DECIMAL_TO_PERCENT: 100,
    
    /** אפס (לבדיקות) */
    ZERO: 0,
    
    /** אחד (לבדיקות) */
    ONE: 1
};

/**
 * זמן - חישובים
 */
export const TIME_CALCULATIONS = {
    /** מילישניות ביום אחד */
    ONE_DAY_MS: 24 * 60 * 60 * 1000,
    
    /** יום בחודש (ממוצע) */
    DAYS_PER_MONTH_AVG: 30,
    
    /** ימים בשנה */
    DAYS_PER_YEAR: 365
};

// ===== ולידציה =====

/**
 * סף ערכים לולידציה
 */
export const VALIDATION = {
    /** גיל מינימלי */
    MIN_AGE: 18,
    
    /** גיל מקסימלי */
    MAX_AGE: 120,
    
    /** משכורת מינימלית (₪) */
    MIN_SALARY: 0,
    
    /** משכורת מקסימלית (₪) */
    MAX_SALARY: 1000000,
    
    /** אחוז מינימלי */
    MIN_PERCENTAGE: 0,
    
    /** אחוז מקסימלי */
    MAX_PERCENTAGE: 100,
    
    /** שנות השקעה מינימלי */
    MIN_INVESTMENT_YEARS: 1,
    
    /** שנות השקעה מקסימלי */
    MAX_INVESTMENT_YEARS: 50,
    
    /** חודשי קרן חירום - מינימום */
    MIN_EMERGENCY_MONTHS: 1,
    
    /** חודשי קרן חירום - מקסימום */
    MAX_EMERGENCY_MONTHS: 12
};

// ===== Responsive =====

/**
 * נקודות שבירה ל-Responsive
 */
export const BREAKPOINTS = {
    /** Mobile קטן */
    MOBILE_SMALL: 480,
    
    /** Mobile רגיל */
    MOBILE: 768,
    
    /** Tablet */
    TABLET: 1024,
    
    /** Laptop */
    LAPTOP: 1440,
    
    /** גודל עיכוב Responsive */
    RESIZE_DEBOUNCE: 150
};

// ===== Z-INDEX =====

/**
 * רמות Z-Index למניעת קונפליקטים
 */
export const Z_INDEX = {
    /** רקע מודאל */
    MODAL_BACKDROP: 1000,
    
    /** קונפטי */
    CONFETTI: 9999,
    
    /** תפריטים */
    MENU: 100,
    
    /** התראות */
    NOTIFICATIONS: 5000,
    
    /** טיפים */
    TOOLTIPS: 3000
};

// ===== אחרים =====

/**
 * קבועים הקשורים לשיעורים והישגים
 */
export const LESSON_CONSTANTS = {
    /** מספר הישגים כולל */
    TOTAL_ACHIEVEMENTS: 9,
    
    /** מספר שיעורים כולל */
    TOTAL_LESSONS: 4,
    
    /** מספר תסריטי סימולציה */
    TOTAL_SCENARIOS: 1,
    
    /** מינימום שיעורים להישג "כולם יחד" */
    MIN_LESSONS_FOR_ALL_ACHIEVEMENT: 4
};

/**
 * ערכים שימושיים נוספים
 */
export const MISC = {
    
    /** עיכוב אוטומטי לאנימציית קלט */
    INPUT_ANIMATION_DELAY: 500,
    
    /** מספר הישגים אחרונים להצגה */
    RECENT_ACHIEVEMENTS_COUNT: 3,
    
    /** תבנית תאריך */
    DATE_FORMAT: 'he-IL',
    
    /** אפשרויות פורמט שעה */
    HOUR_FORMAT: '2-digit',
    MINUTE_FORMAT: '2-digit',
    
    /** מקסימום תווים להצגה מקוצרת */
    TRUNCATE_TEXT_LENGTH: 200,
    
    /** אינדקס ראשון במערך */
    FIRST_INDEX: 0,
    
    /** אינדקס אחרון (offset -1) */
    LAST_INDEX_OFFSET: 1
};

/**
 * קבועי דוגמאות ומספרים לתוכן
 */
export const EXAMPLE_VALUES = {
    /** סכום לדוגמה בשיעורים (₪) */
    EXAMPLE_AMOUNT: 10000,
    
    /** ריבית לדוגמה (7%) */
    EXAMPLE_RATE: 0.07,
    
    /** רווח לדוגמה בשנה ראשונה (₪) */
    EXAMPLE_FIRST_YEAR_PROFIT: 700,
    
    /** רווח לדוגמה בשנה שנייה (₪) */
    EXAMPLE_SECOND_YEAR_PROFIT: 749,
    
    /** סכום אחרי שנה לדוגמה (₪) */
    EXAMPLE_AFTER_YEAR: 10700,
    
    /** יעד סימולציה לדוגמה (₪) */
    EXAMPLE_SIM_GOAL: 50000,
    
    /** יחס מנייתי/אג"ח גבוה (80/20) */
    EXAMPLE_STOCK_RATIO: 80,
    EXAMPLE_BOND_RATIO: 20,
    
    /** אופק השקעה ארוך */
    EXAMPLE_LONG_HORIZON: 10
};

// ===== Exports =====

/**
 * ייצוא כולל של כל הקטגוריות
 */
export default {
    XP_CONFIG,
    ACHIEVEMENT_XP,
    XP_REWARDS,
    LEVEL_MILESTONES,
    FINANCIAL_RULES,
    BUDGET_RULES,
    RISK_THRESHOLDS,
    MENTOR_ACTION_XP,
    SIMULATION_CONFIG,
    UI_TIMING,
    VISUAL_EFFECTS,
    CHART_CONFIG,
    MATH_CONSTANTS,
    TIME_CALCULATIONS,
    VALIDATION,
    BREAKPOINTS,
    Z_INDEX,
    LESSON_CONSTANTS,
    MISC,
    EXAMPLE_VALUES
};
