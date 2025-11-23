# Deploy Backend ke Cloud Run

Backend microservice ini sebaiknya di-deploy **terpisah** dari frontend (bukan via Firebase App Hosting).

## Cara Deploy Backend:

### Opsi 1: Cloud Run via gcloud CLI (Recommended)

```bash
cd backend

# Deploy ke Cloud Run
gcloud run deploy gemini-chatbot-backend \
  --source . \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
```

Setelah deploy berhasil, Anda akan mendapat URL seperti:
```
https://gemini-chatbot-backend-xxx-uc.a.run.app
```

### Opsi 2: Railway.app (Gratis & Mudah)

1. Buat akun di [Railway.app](https://railway.app)
2. Connect repository GitHub Anda
3. Pilih folder `backend` sebagai root directory
4. Add environment variable: `GEMINI_API_KEY`
5. Deploy otomatis!

### Opsi 3: Render.com (Gratis & Mudah)

1. Buat akun di [Render.com](https://render.com)
2. New Web Service → Connect repository
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add environment variable: `GEMINI_API_KEY`

## Update Frontend

Setelah backend deploy, update `.env` di root project:

```env
VITE_CHATBOT_API_URL=https://your-backend-url.com/api/chat
```

Lalu deploy ulang frontend:
```bash
npm run deploy
```

## Catatan Penting

**Jangan deploy backend via Firebase App Hosting!** Firebase App Hosting dirancang untuk frontend static hosting, bukan untuk backend API dengan dependencies kompleks seperti Gemini AI SDK.
