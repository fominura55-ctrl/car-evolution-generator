# Car Evolution Generator

A small web generator that creates a car evolution video prompt using the `veo-3.1` model.

## Setup

1. Open the `car-evolution-generator` folder.
2. Run `npm install`.
3. Create a `.env` file containing:

```env
GEMINI_API_KEY=your_api_key_here
```

4. Start the app:

```bash
npm start
```

5. Open `http://localhost:5173` in your browser.

## How it works

- `index.html` provides a UI for title, length, style, and description.
- `server.js` sends the request to Google's Generative AI using model `veo-3.1`.
- If the API returns a video URL, the UI embeds it.

## Notes

- This app expects Veo 3.1 to return a playable video URL or text instructions.
- For production, keep your API key secure and do not expose it in the browser.
