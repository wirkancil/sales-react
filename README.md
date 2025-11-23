# Smart Landing Page with Gemini AI

A modern, dynamic landing page system with AI-powered chatbot integration. Built with React, Firebase, and Google Gemini AI.

## 🌟 Features

### Frontend
- **Dynamic Content Management**: All content managed through Admin Dashboard
- **Theme Customization**: Multiple theme templates with custom color overrides
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **File Uploads**: Profile images and PDF brochures via Firebase Storage
- **Real-time Updates**: Content changes reflect immediately

### AI Chatbot
- **Gemini 1.5 Flash**: Multimodal AI with PDF processing capabilities
- **PDF Knowledge Base**: Automatically reads uploaded brochures
- **Context-Aware**: Uses inventory data and custom instructions
- **Multilingual**: Responds in Indonesian or English based on user input
- **Microservice Architecture**: Secure backend API for AI processing

### Admin Dashboard
- **Inventory Management**: CRUD operations for products/components
- **Content Editor**: Manage profile, hero section, contact info
- **Theme Builder**: Visual theme customization with live preview
- **Analytics**: Track stats and ratings
- **Secure Authentication**: Firebase Auth integration

## 🚀 Tech Stack

**Frontend:**
- React 19
- Vite
- Tailwind CSS
- Firebase (Firestore, Auth, Storage)
- Lucide React (icons)

**Backend:**
- Node.js + Express
- Google Gemini AI SDK
- CORS enabled
- Environment-based configuration

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project
- Google Gemini API key

## 🛠️ Installation

### 1. Clone Repository
```bash
git clone https://github.com/antigravity-agentic/byd-sales.git
cd byd-sales
```

### 2. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
cd ..
```

### 3. Configure Environment Variables

**Frontend (`.env` in root):**
```bash
cp .env.example .env
```
Edit `.env` and add your Firebase configuration.

**Backend (`backend/.env`):**
```bash
cp backend/.env.example backend/.env
```
Edit `backend/.env` and add your Gemini API key.

### 4. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Firestore Database**
3. Enable **Authentication** (Email/Password)
4. Enable **Storage**
5. Set Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cars/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /settings/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

6. Set Storage Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 5. Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add it to `backend/.env`

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Frontend will run on `http://localhost:5173`

**Terminal 2 - Backend:**
```bash
cd backend
node server.js
```
Backend will run on `http://localhost:3000`

### Production Build

```bash
npm run build
npm run preview
```

## 🚀 Deployment

### Firebase Hosting

This project is configured for Firebase Hosting deployment.

#### First Time Setup

1. **Login to Firebase:**
```bash
npx firebase login
```

2. **Initialize Firebase (if not already done):**
```bash
npx firebase init hosting
```
Select your Firebase project (`mini-apps-289ff`) and use `dist` as the public directory.

#### Deploy Frontend

```bash
npm run deploy
```

This will:
1. Build the production bundle (`npm run build`)
2. Deploy to Firebase Hosting (`firebase deploy --only hosting`)

Your site will be available at: `https://mini-apps-289ff.web.app`

#### Deploy Backend

The backend microservice needs to be deployed separately. Options:

**Option 1: Google Cloud Run (Recommended)**
```bash
cd backend
gcloud run deploy gemini-chatbot \
  --source . \
  --platform managed \
  --region asia-southeast1 \
  --allow-unauthenticated
```

**Option 2: Railway.app**
1. Push backend to separate Git repository
2. Connect to Railway
3. Add environment variables
4. Deploy automatically

**Option 3: Render.com**
1. Create new Web Service
2. Connect your repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && node server.js`
5. Add environment variables

After deploying backend, update `.env`:
```
VITE_CHATBOT_API_URL=https://your-backend-url.com/api/chat
```

Then redeploy frontend: `npm run deploy`

### Custom Domain (Optional)

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow DNS configuration steps


## 📁 Project Structure

```
.
├── backend/
│   ├── server.js          # Express server with Gemini AI
│   ├── package.json
│   └── .env.example
├── src/
│   ├── components/        # React components
│   ├── context/           # Auth context
│   ├── lib/              # Firebase config
│   ├── pages/            # Main pages
│   └── main.jsx
├── public/               # Static assets
├── .env.example          # Frontend env template
├── package.json
└── README.md
```

## 🔐 Security

- **Environment Variables**: All sensitive keys stored in `.env` files (not committed to git)
- **Firebase Rules**: Read access public, write access authenticated only
- **Backend API**: Gemini API key secured on server-side
- **CORS**: Configured for localhost development

## 🎨 Customization

### Admin Dashboard Access

1. Navigate to `/admin`
2. Login with Firebase credentials
3. Access two main tabs:
   - **Component Inventory**: Manage products
   - **Landing Page Settings**: Customize content and theme

### Theme Templates

- Modern Dark
- Ocean Blue
- Classic Light
- Custom (with color picker)

## 📝 Environment Variables

See `.env.example` and `backend/.env.example` for required variables.

## 🐛 Troubleshooting

**CORS Error on File Upload:**
- Ensure Firebase Storage rules allow public read access
- Check that Storage is enabled in Firebase Console

**Chatbot Not Responding:**
- Verify `GEMINI_API_KEY` in `backend/.env`
- Check that backend server is running
- Ensure `VITE_CHATBOT_API_URL` points to correct backend URL

**Build Errors:**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be v18+)

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

## 📧 Support

For issues and questions, please open a GitHub issue.
