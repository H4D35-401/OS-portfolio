# ZarielOS - Cyberpunk Desktop Portfolio

![ZarielOS Banner](https://img.shields.io/badge/Status-Operating-red?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

> **"SYSTEM OS // V4.0 - ONLINE"**

**ZarielOS** is a high-fidelity, web-based desktop environment designed as an interactive developer portfolio. Merging functionality with a premium cyberpunk aesthetic, it features a fully dynamic theming engine, a real-time music player, and a window management system.

**[🔴 Live Demo](https://zariel.netlify.app/)**  
*(Best viewed on Desktop - 1920x1080 recommended)*

---

## ⚡ Key Features

### 🎵 Premium Music Widget
- **iTunes API Integration**: Real-time search and reliable music preview streaming.
- **Holographic Visualizer**: Custom-built frequency bars that react to playback state with physics-based animations.
- **Spinning Vinyl Animation**: 3D rotation with dynamic album art reflection.
- **Glassmorphism UI**: Advanced backdrop filters and saturation layers for a deep, premium glass look.
- **Quick Picks**: Curated playlists (Focus, Retro, Chill) for instant ambiance.

### 🎨 Dynamic Theming Engine
- **Global Variable System**: Change the primary color once (`--color-primary`), and the entire OS adapts.
- **Reactive Wallpaper**: Background grids, ambient glows, and text shadows shift color dynamically in real-time.
- **Consistent Accents**: From window borders to timeline scrubs, every UI element respects the active theme.

### 🖥️ Window Management
- **Draggable Interface**: Custom window chrome with drag-and-drop capabilities.
- **Z-Index Layering**: Active windows automatically rise to the foreground; inactive windows fade slightly.
- **Taskbar Integration**: Real-time system status, clock, and minimize/restore functionality.

---

## 🛠️ Technology Stack

- **Core**: [React 18](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom CSS Variables
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) for global audio and window state.
- **Icons**: [Lucide React](https://lucide.dev/) for consistent, crisp iconography.
- **Build Tool**: [Vite](https://vitejs.dev/) for lightning-fast HMR and bundling.

---

## 📂 Project Structure

```bash
src/
├── components/
│   ├── Desktop.jsx       # Main desktop layout and window renderer
│   ├── MusicWidget.jsx   # Advanced music player with visualizer
│   ├── Taskbar.jsx       # Bottom status bar and dock
│   ├── Wallpaper.jsx     # Dynamic background component
│   └── Window.jsx        # Draggable window wrapper
├── store/
│   └── useDesktopStore.js # Zustand store for global OS state
└── index.css             # Global styles and Tailwind imports
```

---

## 🚀 Installation & Setup

Clone the repository and ignite the engine:

```bash
# Clone the repo
git clone https://github.com/H4D35-401/OS-portfolio.git

# Enter the system directory
cd OS-portfolio

# Install neural dependencies
npm install

# Initiate launch sequence
npm run dev
```

---

## 🔧 Customization Guide

### Changing the Theme Color
To change the system's primary color, navigate to `src/index.css`:

```css
:root {
  /* Change this HSL value to update the entire OS theme */
  --color-primary: #ef4444; /* Current: Red */
}
```

### Modifying Quick Picks
In `src/components/MusicWidget.jsx`, locate the `QUICK_PICKS` array to update the default music shortcuts.

---

## ⚠️ Notes

- **Desktop First**: This interface is designed for larger screens. Mobile responsiveness is currently in legacy mode (i.e., not supported).
- **Audio Source**: Music previews are provided by the iTunes Search API.

---

## 🔮 Future Roadmap

- [ ] Mobile/Tablet responsive layout.
- [ ] Integration with Spotify Web SDK.
- [ ] More apps (Terminal-based contact form, Projects browser).
- [ ] Multiple workspace support.

---

*Made with 🔴 by [H4D35-401](https://github.com/H4D35-401)*
