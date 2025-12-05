# Setup Instructions

## 1. Install Dependencies

```bash
cd ~/Desktop/Ceqnce/gallery-proposal-mvp
npm install
```

## 2. Set Up Claude API Key (Optional)

The app works with simulated data by default, but you can connect a real Claude API for enhanced AI responses.

### Get Your API Key
1. Go to https://console.anthropic.com/
2. Sign in or create an account
3. Navigate to API Keys section
4. Create a new API key

### Add to Your Project
1. In the `gallery-proposal-mvp` folder, create a `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and add your API key:
   ```
   VITE_ANTHROPIC_API_KEY=sk-ant-api03-...your-key-here...
   ```

3. **Important:** The `.env` file is already in `.gitignore` so your API key won't be committed to git.

## 3. Run the App

```bash
npm run dev
```

The app will open at http://localhost:5173

## 4. Using the Chat

The chat now responds to real queries! Try:

### Ask About Buyers for an Artwork
```
"Show me buyers for Yayoi Kusama's Infinity Net"
"Who should I follow up with about the Kapoor piece?"
"Buyers for the Warhol Silver Car Crash"
```

### Ask About a Client
```
"Tell me about Jennifer Park"
"What's Marcus Chen's buying history?"
"Show me details on Sophie Dubois"
```

### Get Recommendations
```
"Recommend objects for Jennifer Park"
"What should I show Sophie Dubois?"
```

## 5. Navigate the App

### Specialist Selector
- Use the dropdown in the top-right to switch between specialists
- Objects and clients filter automatically by specialist

### Objects Tab
- **On Sale:** Current auction items
- **Known Works:** Historical pieces
- Click an object to see potential buyers

### Clients Tab
- **Overview:** Profile, interests, recommended objects
- **Notes:** Add manual notes or view auto-generated notes
- **History:** Buying, bidding, consignment, and digital engagement

## Troubleshooting

### Chat not showing buyer lists?
Make sure you've pulled the latest changes:
```bash
git pull origin claude/clone-gallery-repo-01GXofEcj5V5dCcvS4rDgyzs
npm install
npm run dev
```

### API key not working?
- Check that your `.env` file has `VITE_ANTHROPIC_API_KEY=` (not `ANTHROPIC_API_KEY=`)
- Make sure there are no spaces around the `=` sign
- Restart the dev server after adding the API key

### Build errors?
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```
