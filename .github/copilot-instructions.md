# CashWise - AI Agent Instructions

## 🎯 Project Vision & Core Model

CashWise is an interactive financial education platform based on an **experiential learning cycle**:

### 🔄 The Interactive Learning Loop
```
סימולטור החיים → אקדמיית הכסף → סימולטור החיים
(Experience)    →    (Learn)     →   (Apply)
```

**How it works:**
1. **חווה** - User faces a financial challenge in the Life Simulator
2. **לומד** - Directed to Money Academy to learn about the topic
3. **מיישם** - Returns to simulator with new tools to solve the problem

### 📚 Example Learning Paths

**Path 1: Slow Savings**
- 💸 Simulator: Bank savings grow too slowly
- 🎓 Academy: Learn about investment returns & compound interest
- 💎 Simulator: Invest in index funds, see faster growth

**Path 2: Job Loss**
- 😰 Simulator: Sudden unemployment, no safety net
- 🎓 Academy: Learn about emergency funds (3-6 months)
- 🛡️ Simulator: Build emergency fund, weather the crisis

**Path 3: Medical Emergency**
- 🏥 Simulator: Unexpected medical expense drains savings
- 🎓 Academy: Learn about health insurance & risk management
- 🏥 Simulator: Purchase insurance, protected from future shocks

### Core Components
- **אקדמיית הכסף (Money Academy)**: 4 lessons (budget, compound interest, emergency fund, investments)
- **סימולטור החיים (Life Simulator)**: 4 scenarios with real financial decisions
- **AI Financial Mentor**: Personalized analysis and recommendations

### 🔄 User Experience Flow

```
[ סימולטור החיים ] → חוויה של קושי פיננסי
        ↓  
[ אקדמיית הכסף ] → שיעור אינטראקטיבי בנושא הרלוונטי  
        ↓  
[ סימולטור החיים ] → חזרה עם כלים חדשים ליישום
```

**Example Full Simulation Flow:**

**תרחיש: חיסכון איטי בבנק**
1. → המשתמש רואה שההון כמעט לא גדל  
2. → מופיע טריגר: "💡 רוצה ללמוד על השקעות?"  
3. → שיעור באקדמיה על ריבית דריבית  
4. → חזרה לסימולטור עם אפשרות להשקיע  
5. → ההון מתחיל לצמוח בקצב מהיר  
6. → נפתח הישג: "משקיע חכם" 🏆

## 🎯 Target Audience

האפליקציה מיועדת ל:
- **צעירים בתחילת דרכם** - גיל 18-30, משכורת ראשונה
- **משפחות צעירות** - זוגות עם ילדים, צרכים משתנים
- **עצמאיים** - הכנסה משתנה, צורך בתכנון
- **כל מי שמעוניין** - לשפר אוריינות פיננסית בצורה חווייתית, אינטראקטיבית וללא סיכון אמיתי

## 🏗️ Current Architecture

### Technology Stack
- **Platform**: Web-based (HTML/CSS/JavaScript)
- **Future**: React + Node.js backend, mobile apps (iOS/Android)
- **Language**: Hebrew (RTL support)
- **Base File**: `cashwise_prototype.html` - Single-page prototype

### Core Modules (Current)
1. **מסך פתיחה (Opening)** - Welcome screen
2. **אקדמיית הכסף (Academy)** - Budget building lessons
3. **סימולטור החיים (Simulation)** - Life scenarios (age 25, 6000₪ salary)
4. **פרופיל פיננסי (Profile)** - User financial dashboard
5. **מנטור פיננסי (Mentor)** - AI chat interface (simulated)

## 📋 Development Roadmap

### 🧱 Simulator Development Stages

**CashWise נבנית בשלבים מודולריים** - מהקל אל הכבד, כדי לאפשר בדיקות איכות, שיפור חוויית משתמש, ולמידה מתמשכת. כל שלב מוסיף יכולות חדשות, תוך שמירה על פשטות ויכולת הרחבה עתידית.

**Stage 1 - MVP Basic (Current)**
- ✅ Fixed character setup
- ✅ Single action: Savings only
- ✅ Basic time progression
- ✅ One event type: Simple financial challenge

**Stage 2 - Expansion**
- 🔄 Add investments & emergency fund
- 🔄 Basic decision system
- 🔄 Graphical reports (Chart.js)

**Stage 3 - Advanced Interactivity**
- ⏳ Character selection
- ⏳ Diverse random events
- ⏳ Deep integration with Academy
- ⏳ Learning path triggers (challenge → lesson → solution)

**Stage 4 - Full User Experience**
- ⏳ Animations & dialogues
- ⏳ XP & achievement system
- ⏳ Profile-based personalization
- ⏳ AI mentor integration

### 🎯 Learning Path Examples (Planned)

**Path 1: Investment Discovery**
1. Simulator: "Your savings grow at only 2% in the bank"
2. Trigger: "💡 Learn about better investment options?"
3. Academy: Compound interest + Investment lesson
4. Return: Option to invest in index funds (7% return)
5. Result: Visible wealth growth acceleration

**Path 2: Emergency Preparedness**
1. Simulator: Random event - "You lost your job!"
2. Without emergency fund: Forced to sell investments at loss
3. Trigger: "🛡️ Learn how to prepare for emergencies"
4. Academy: Emergency fund lesson (3-6 months expenses)
5. Return: Build emergency fund before next crisis

**Path 3: Insurance Education**
1. Simulator: Medical emergency costs 20,000₪
2. Impact: Savings wiped out
3. Trigger: "🏥 Learn about financial protection"
4. Academy: Risk management & insurance lesson
5. Return: Purchase health insurance, protected from future shocks

### Phase 1 - Core MVP (Completed ✅)
- Modular architecture (24 files)
- 4 Academy lessons
- 4 Basic simulation scenarios
- Profile management
- AI Mentor simulation

### Phase 2 - Advanced Features
- User authentication and profiles
- Real financial data integration
- Community features and leaderboards
- Historical scenarios and economic crises simulation
- Investment portfolio builder

### Phase 3 - Monetization & Partnerships
- CPA integration with banks/investment companies
- Premium content partnerships
- Community challenges and competitions

## 💡 Key Design Patterns

### Financial Calculations
```javascript
// All monetary values in ILS (₪)
// Use percentages for savings targets (e.g., 20% of income)
// Compound interest: A = P(1 + r/n)^(nt)
```

### Hebrew UI Standards
```html
<html lang="he" dir="rtl">
<!-- All text in Hebrew -->
<!-- Right-to-left layout throughout -->
```

### Module Structure
- Each section is a `<section>` with unique ID
- Navigation via `showSection(id)` function
- Feedback displayed in dedicated divs (`#*-feedback`, `#*-response`)

## 🎮 Gamification & Measurement

### Success Metrics
- ✅ **Understanding**: User recognizes the financial problem
- ✅ **Engagement**: User voluntarily returns to Academy
- ✅ **Application**: User successfully applies learned concepts
- ✅ **Improvement**: Financial situation improves in simulation

### Scoring System
- נקודות ניסיון (XP) for completed lessons (20-40 XP)
- כסף וירטואלי for simulation modes (varies by scenario)
- דירוג פיננסי (Financial Rating) ⭐⭐⭐⭐⭐ (based on decisions)

### Achievement Tracking
- חיסכון חודשי (Monthly savings)
- צמיחת השקעות (Investment growth)
- שביעות רצון פיננסית (Financial satisfaction score)
- כסף וירטואלי for simulation modes
- דירוג פיננסי (Financial Rating) ⭐⭐⭐⭐⭐

### Success Metrics
- חיסכון חודשי (Monthly savings)
- צמיחת השקעות (Investment growth)
- שביעות רצון פיננסית (Financial satisfaction)

## 📚 Content Areas (Academy)

### Current Topics
- ✅ בניית תקציב אישי (Budget building)

### To Implement
- ריבית דריבית (Compound interest)
- קרן חירום (Emergency fund)
- מניות ואג"ח (Stocks & bonds)
- תכנון פנסיוני (Retirement planning)
- ניהול חובות (Debt management)

## 🔧 Development Workflow

### Testing
```powershell
# Open in browser to test
start cashwise_prototype.html
```

### Code Style
- Hebrew variable names for user-facing data
- English for technical functions
- Comments in Hebrew for logic explanation
- Keep calculations simple and transparent

## 🎯 Current Focus
Building modular, educational content that teaches real financial skills through interactive scenarios. Every feature should answer: "Will this help users make better financial decisions in real life?"

## 🤝 AI Agent Role
You are a development partner helping build CashWise from prototype to full application. Focus on:
1. Incremental improvements to existing modules
2. Adding educational content with real financial value
3. Making the simulation realistic and challenging
4. Keeping code clean, modular, and maintainable in Hebrew RTL environment

---
*Last updated: October 16, 2025 - Active development started*
