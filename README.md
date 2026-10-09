# CatchUp AI

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-kdzctniz)

**CatchUp AI** solves "The Unread Problem" — it processes long, chaotic unread group chats into structured, prioritized action items in seconds. All processing runs entirely in your browser.

## On-Device AI with Hugging Face Transformers.js

CatchUp AI uses [Transformers.js](https://huggingface.co/docs/transformers.js) (`@xenova/transformers`) to run a real machine learning model locally in the browser via WebAssembly — **no data ever leaves your device**.

### How it works

- **Model**: `Xenova/distilbert-base-uncased-finetuned-sst-2-english` — a lightweight DistilBERT model fine-tuned for sentiment analysis, quantized for efficient browser inference.
- **Runtime**: The model runs on WebAssembly (WASM) directly in the browser. No server, no API calls, no GPU required.
- **Preloading**: The model begins downloading and initializing in the background as soon as the page loads, so it's typically ready by the time you click "Analyze."
- **Sentiment-Enhanced Priority**: The model scores each message's sentiment (POSITIVE/NEGATIVE) and confidence. Messages with strong negative sentiment that also contain urgency-adjacent language (bug, issue, problem, fail, error, blocking) are upgraded to **Urgent** priority — catching critical items that pure keyword matching might miss.
- **AI Confidence Badges**: Each action item card displays the model's confidence score as a percentage badge, giving you transparency into the AI's assessment.

### Graceful Heuristic Fallback

If the model weights are still downloading, the WASM runtime fails to initialize, or inference errors occur, CatchUp AI **instantly falls back** to a robust heuristic engine that uses:

- Action verb detection (need to, please, can you, must, should, etc.)
- Deadline keyword extraction (by tomorrow, EOD, ASAP, date patterns)
- Decision phrase matching (agreed, decided, locked in, approved, etc.)
- Unanswered question tracking with reply scanning

The UI clearly indicates whether AI inference was active or heuristics were used, so you always know what powered your analysis.

## Features

- **Paste any group chat** (Slack, WhatsApp, Discord, Teams, etc.)
- **Demo conversations**: Load realistic sample Slack or WhatsApp threads with one click
- **Urgent Actions & Deadlines**: Cards with tasks, assignees, deadlines, and priority badges
- **Decisions Made**: Bullet list of conclusions reached by the group
- **TL;DR Summary**: Crisp 3-sentence overview with topic extraction
- **Direct Mentions & Unanswered Questions**: Flags questions that were never answered
- **Privacy Badge**: Visible confirmation that all processing is client-side
- **Scanning Animation**: 1-second visual scan overlay during analysis

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling
- **Lucide Icons** for UI
- **@xenova/transformers** for on-device NLP inference (WebAssembly)
- **Dark-slate dashboard** design with animated scan effects

## Development

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check + production build
npm run preview  # preview production build
```

## Privacy

CatchUp AI is **100% local-first**. Your chat logs are never sent to any server. The AI model runs in your browser via WebAssembly, and all analysis happens client-side.
