# Gallery Proposal Generator MVP

A conversational AI-powered web app that helps gallery staff create professional artwork proposals through natural chat, with real-time preview and PDF export.

## Features

- **Conversational Interface**: Chat with Claude AI to select artworks
- **Real-time Preview**: See your proposal build live as you add artworks
- **Professional PDF Export**: Generate polished, client-ready proposal PDFs
- **Responsive Design**: Modern, clean UI with light theme
- **No Database Required**: Session-based (no login needed)

## Tech Stack

- **Frontend**: React 18 + Tailwind CSS + Vite
- **PDF Generation**: jsPDF
- **AI**: Anthropic Claude API
- **Styling**: Tailwind CSS with custom theme

## Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/gallery-proposal-mvp.git
cd gallery-proposal-mvp
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your Anthropic API key
# Get your key at: https://console.anthropic.com/
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

### 4. Add artwork images (optional)
Place artwork images in `public/images/` with these names:
- `01-frankenthaler.jpg`
- `02-kiefer.jpg`
- `03-rothko.jpg`
- `04-mitchell.jpg`
- `05-twombly.jpg`
- `06-motherwell.jpg`
- `07-martin.jpg`
- `08-kelly.jpg`

If no images are provided, PDFs will show placeholders.

### 5. Run development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. **Select Artworks**: Click on artwork cards to add them to your proposal
2. **View Total**: See the running total value of selected works
3. **Export PDF**: Click "Export PDF" to download a professional proposal document

## Project Structure

```
gallery-proposal-mvp/
├── src/
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   ├── index.css            # Global styles
│   ├── components/          # React components (coming soon)
│   ├── data/
│   │   └── mockData.js      # Artwork, client, gallery data
│   └── utils/
│       ├── exportPDF.js     # PDF generation logic
│       └── formatters.js    # Utility functions
├── public/
│   └── images/              # Artwork images
├── .env.example             # Environment variables template
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Environment Variables

Create a `.env` file (not included in git) with:

```
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

**Never commit your `.env` file** - it contains your API key.

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

## Roadmap

- [ ] Add chat interface with Claude API
- [ ] Build proposal preview component
- [ ] Add more customization options
- [ ] Multi-client support
- [ ] Dashboard for saved proposals

## License

MIT

## Contact

For questions or feedback, open an issue on GitHub.
