<div align="center">

<img src="https://raw.githubusercontent.com/Miroslav-Novotny64/simple-impostor-game/127513b4ba2e176278712b1686d5331f03697ab9/public/favicon.svg" width="80">

# Simple Impostor Game

Modern PWA implementation of the classic "Impostor" social deduction game.  
*Didn't want to pay for an app, so I built my own.*

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-latest-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-009688?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)

</div>

---

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS (Custom Cream & Yellow Theme)
- **Animations**: Framer Motion (3D Card Flips & Micro-interactions)
- **Icons**: Lucide React
- **State**: React Hooks + LocalStorage Persistence

## Functionalities

- **Dark Mode**: Full support for dark mode with a native-feeling toggle.
- **PWA Ready**: Installable on iOS and Android for a full-screen experience.
- **Persistent State**: Your players and category selections stay saved between sessions.
- **Modularity**: Easily extensible category system.
- **Strategic Hints**: Unique hints for the impostor to keep the game balanced.

## Project Structure

```text
src/
├── components/          # Extracted, reusable UI components
├── data/
│   └── categories/      # Category logic and word definitions
├── lib/                 # Utility functions (clsx, tailwind-merge)
├── App.jsx              # Application shell and state orchestration
└── index.css            # Design system and HSL theme tokens
```

## How to add custom words

The game uses a modular category system. To contribute your own wordlists:

### 1. Locally
1. Open `src/data/categories/`.
2. Add a new `.csv` file or edit existing ones.
3. Format: `Word,Hint` (e.g., `Paris,Baguette`).
4. Open a pull request.

### 2. Suggest a New Wordlist
If you have a great idea for a category but don't want to code, you can **[open a GitHub Issue](https://github.com/Miroslav-Novotny64/simple-impostor-game/issues/new)** and paste your words there. I'll be happy to add them to the official game!

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Build for production
npm run build
```

---

<div align="center">

### Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated. Whether it's a bug fix, a new feature, or a new wordlist, feel free to open a Pull Request or an Issue.

*Built with passion by Miroslav Novotny*

</div>
