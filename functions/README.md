# Firebase Functions Deployment Guide

## Setup Gemini API Key

Firebase Functions menggunakan environment config untuk menyimpan API key secara aman.

### Set API Key:

```bash
firebase functions:config:set gemini.apikey="YOUR_GEMINI_API_KEY_HERE"
```

### Verify Config:

```bash
firebase functions:config:get
```

## Deploy Functions

### Deploy All (Hosting + Functions):

```bash
npm run deploy
```

### Deploy Functions Only:

```bash
firebase deploy --only functions
```

## Local Testing

### Start Emulator:

```bash
cd functions
npm run serve
```

Functions akan berjalan di: `http://localhost:5001/mini-apps-289ff/us-central1/api`

### Test Endpoint:

```bash
curl -X POST http://localhost:5001/mini-apps-289ff/us-central1/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","inventoryContext":"","customInstructions":""}'
```

## Production URL

Setelah deploy, function akan tersedia di:
```
https://us-central1-mini-apps-289ff.cloudfunctions.net/api/chat
```

Update `.env` dengan URL ini:
```env
VITE_CHATBOT_API_URL=https://us-central1-mini-apps-289ff.cloudfunctions.net/api/chat
```

## Monitoring

View logs:
```bash
firebase functions:log
```

View logs for specific function:
```bash
firebase functions:log --only api
```

## Troubleshooting

### Error: "Missing API Key"
Run: `firebase functions:config:set gemini.apikey="YOUR_KEY"`

### Error: "CORS"
CORS sudah dikonfigurasi dengan `cors({ origin: true })` untuk allow all origins.

### Error: "Function timeout"
Default timeout adalah 60s. Untuk extend:
```javascript
exports.api = functions.runWith({ timeoutSeconds: 300 }).https.onRequest(app);
```
