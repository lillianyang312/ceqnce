# File Structure & Setup

## Complete Directory Structure

```
gallery-proposal-mvp/
├── .env
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── README.md
├── docs/
│   ├── 01-executive-summary.md
│   ├── 02-core-concept.md
│   ├── 03-whats-included.md
│   ├── 04-mock-data.md
│   ├── 05-pdf-output-spec.md
│   ├── 06-conversation-flow.md
│   ├── 07-ai-system-prompt.md
│   ├── 08-file-structure.md
│   └── 09-success-checklist.md
├── public/
│   └── (empty for now)
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── ChatPanel.jsx
    │   ├── ScreenPanel.jsx
    │   ├── ArtworkGrid.jsx
    │   ├── ArtworkCard.jsx
    │   ├── ProposalPreview.jsx
    │   └── MessageBubble.jsx
    ├── data/
    │   └── mockData.js
    └── utils/
        ├── claude.js
        ├── exportPDF.js
        └── formatters.js
```

---

## package.json

```json
{
  "name": "gallery-proposal-mvp",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.27.0",
    "jspdf": "^2.5.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "vite": "^5.0.8"
  }
}
```

---

## Configuration Files

### vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### postcss.config.js

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### .env

```
VITE_ANTHROPIC_API_KEY=your_key_here
```

### .gitignore

```
node_modules
dist
.env
.DS_Store
```

---

## Quick Start Commands

```bash
# Create project
npm create vite@latest gallery-proposal-mvp -- --template react
cd gallery-proposal-mvp

# Install dependencies
npm install
npm install @anthropic-ai/sdk jspdf
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p

# Create .env file
echo "VITE_ANTHROPIC_API_KEY=your_key_here" > .env

# Run development server
npm run dev

# Build for production
npm run build
```

---

## Key Files Overview

| File | Purpose |
|------|---------|
| `App.jsx` | Main component, state management, layout |
| `ChatPanel.jsx` | Left 40% - chat interface |
| `ScreenPanel.jsx` | Right 60% - artwork grid or preview |
| `ArtworkGrid.jsx` | Display 8 artworks in grid |
| `ArtworkCard.jsx` | Individual artwork card with click handler |
| `ProposalPreview.jsx` | Preview of selected artworks |
| `MessageBubble.jsx` | Individual chat message |
| `mockData.js` | All hardcoded data (client, artworks, gallery) |
| `claude.js` | Claude API integration |
| `exportPDF.js` | PDF generation with jsPDF |
| `formatters.js` | Price formatting utilities |
