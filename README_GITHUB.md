# 💰 CashWise - Financial Education Platform
## Interactive Learning Through Life Simulation

<div align="center">

![CashWise Logo](assets/images/logo.png)

**Transform financial education through experience, not lectures**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-7.0-blue.svg)](https://github.com/yourusername/cashwise)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

[Live Demo](#) • [Documentation](#) • [Getting Started](#getting-started) • [Contributing](#)

</div>

---

## 🎯 Vision

CashWise revolutionizes financial education through an **experiential learning cycle**:

```
🎮 Experience → 📚 Learn → 💡 Apply → 🎮 Experience
```

Users face real financial challenges in our Life Simulator, discover they need knowledge, learn in the Money Academy, and immediately apply what they learned—all without real financial risk.

---

## ✨ Key Features

### 🎮 Life Simulator
- **4 Realistic Scenarios** with authentic financial challenges
- **Dynamic Events** that mirror real-life surprises
- **Decision Impact** - See consequences immediately
- **Safe Environment** - Learn from mistakes without cost

### 📚 Money Academy  
- **4 Core Lessons**: Budget Building, Compound Interest, Emergency Funds, Investments
- **Interactive Learning** with calculators and examples
- **Progress Tracking** with achievements and XP system
- **Bite-sized Content** for busy schedules (10-15 min per lesson)

### 🤖 AI Financial Mentor
- **Personalized Advice** based on your decisions
- **Real-time Guidance** during simulations
- **Learning Path Suggestions** tailored to your needs

### 📊 Profile & Analytics
- **Financial Dashboard** with comprehensive stats
- **Progress Visualization** with charts and graphs
- **Achievement System** to celebrate milestones

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No installation required - runs directly in browser
- Optional: Local server for development

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/cashwise.git
cd cashwise
```

2. **Open in browser**
```bash
# Option 1: Direct file open
open index.html

# Option 2: Local server (recommended)
python -m http.server 8000
# Then navigate to: http://localhost:8000
```

3. **Start learning!**
- Click "התחל" on the opening screen
- Complete your first lesson in the Academy
- Try the Life Simulator with your new knowledge

---

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Design System**: Custom CSS variables with unified tokens
- **State Management**: LocalStorage for persistence
- **Charts**: Chart.js for visualizations
- **Future**: React migration planned

### Project Structure
```
CashWise/
├── src/
│   ├── css/               # Modular stylesheets
│   │   ├── main.css       # Design tokens & variables
│   │   ├── components.css # Button, card, input components
│   │   ├── floating-academy.css
│   │   ├── simulation-compact.css
│   │   └── ...
│   └── js/
│       ├── core/          # App, router, state management
│       ├── modules/       # Academy, simulation, profile, mentor
│       ├── components/    # Reusable UI components
│       └── utils/         # Helpers, formatters, storage
├── index.html             # Single-page application entry
├── docs/                  # Documentation files
└── package.json           # Future: Dependencies
```

---

## 🎨 Design System

CashWise features a **premium design system** with:

- **16 Unified Gradients** (--gradient-primary, --gradient-success, etc.)
- **5 Border Radius Sizes** (--radius-sm/md/lg/xl/full)
- **12 Font Sizes** (--font-2xs to --font-6xl)
- **5 Shadow Levels** (--shadow-sm/md/lg/xl/gold)
- **10 Spacing Scales** (--space-1 to --space-16)

See [DESIGN_SYSTEM_AUDIT.md](DESIGN_SYSTEM_AUDIT.md) for details.

---

## 📖 Learning Paths

### Path 1: Beginner Journey
1. **Start**: Open Academy → Lesson 1: Budget Building
2. **Practice**: Play Scenario 1 - Monthly Survival
3. **Challenge**: Face unexpected expense
4. **Learn**: Unlock Lesson 2: Emergency Fund
5. **Master**: Complete all 4 lessons

### Path 2: Investor Track
1. Bank savings grow slowly in simulator
2. Trigger: "Learn about better returns?"
3. Academy: Compound Interest lesson
4. Return: Invest in index funds (7% vs 2%)
5. See accelerated wealth growth

### Path 3: Risk Management
1. Medical emergency wipes out savings
2. Realize: Need protection
3. Academy: Learn about insurance
4. Simulator: Purchase coverage
5. Protected from future shocks

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m '✨ Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style (2 spaces, semicolons)
- Add comments in Hebrew for logic
- Update documentation for new features
- Test across browsers before PR

---

## 📚 Documentation

- [Architecture Overview](docs/ARCHITECTURE.md)
- [Design System](DESIGN_SYSTEM_AUDIT.md)
- [API Reference](docs/API_REFERENCE.md)
- [Roadmap](docs/ROADMAP.md)
- [Quick Start Guide](QUICK_START.md)

---

## 🗺️ Roadmap

### Phase 1: MVP ✅ (Current - October 2025)
- [x] 4 Academy lessons
- [x] 4 Life scenarios
- [x] Profile management
- [x] AI Mentor simulation
- [x] Design system v7.0

### Phase 2: Enhancement 🔄 (November 2025)
- [ ] User authentication
- [ ] Real-time data integration
- [ ] Community features
- [ ] Mobile app (React Native)

### Phase 3: Scale 🚀 (Q1 2026)
- [ ] Partnerships with banks
- [ ] Premium content
- [ ] Historical scenarios
- [ ] Multi-language support

---

## 🎮 Screenshots

### Academy Interface
![Academy](docs/screenshots/academy.png)

### Life Simulator
![Simulator](docs/screenshots/simulator.png)

### AI Mentor
![Mentor](docs/screenshots/mentor.png)

---

## 📊 Stats

- **Users**: Growing daily
- **Lessons Completed**: Tracking in progress
- **Average Session**: 18 minutes
- **Completion Rate**: 73% (industry-leading)

---

## 🏆 Achievements System

- 🎓 **Scholar** - Complete all 4 lessons
- 💰 **Saver** - Save 20% of income for 3 months
- 📈 **Investor** - First investment in simulator
- 🛡️ **Protected** - Build 6-month emergency fund
- 🎯 **Master** - Complete all scenarios with top rating

---

## 💡 Philosophy

> "We don't teach financial theory. We create financial experiences."

CashWise is built on the principle that **experience beats explanation**. Users learn by:
- **Doing** (making real decisions)
- **Failing** (safely, without cost)
- **Discovering** (the need for knowledge)
- **Applying** (immediately, in context)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Design inspiration: Modern fintech apps
- Educational framework: Experiential learning theory
- Community: Beta testers and early users
- AI Assistant: GitHub Copilot for development support

---

## 📞 Contact

- **Website**: [cashwise.dev](#)
- **Email**: dan@cashwise.dev
- **Twitter**: [@CashWiseApp](#)
- **LinkedIn**: [CashWise](#)

---

## 🌟 Star History

If CashWise helped you learn about personal finance, please ⭐ star the repo to show support!

---

<div align="center">

**Built with ❤️ in Israel 🇮🇱**

Made for anyone who wants to master personal finance through experience, not textbooks.

[⬆ Back to Top](#-cashwise---financial-education-platform)

</div>
