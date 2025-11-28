# Technical Specification & Style Guide
**Project:** Simple Landing Page & Admin Dashboard
**Version:** 1.0
**Last Updated:** 2025-11-24

## 1. Technology Stack

### Core Frameworks & Libraries
- **Frontend Framework:** React 18 (via Vite)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 3.4
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Routing:** React Router DOM

### Backend & Services (Firebase)
- **Authentication:** Firebase Auth (Anonymous & Email/Password)
- **Database:** Cloud Firestore
- **Storage:** Firebase Storage (Image uploads)

---

## 2. Design System & Style Guide

### Typography
- **Font Family:** 'Plus Jakarta Sans', sans-serif
- **Headings:** `font-bold text-gray-900`
- **Body Text:** `text-gray-700`
- **Labels/Meta:** `text-xs font-bold text-gray-500 uppercase`

### Color Palette
#### Primary Colors
- **Teal (Brand):**
  - Primary: `#0D9488` (`text-teal-600`, `bg-teal-600`)
  - Gradient: `from-teal-500 to-teal-700`
  - Light Accent: `bg-teal-50`

#### Neutral Colors
- **Background:** `#f3f4f6` (`bg-gray-50`, `bg-gray-100`)
- **Cards:** `#ffffff` (`bg-white`)
- **Borders:** `#e5e7eb` (`border-gray-200`)
- **Text:**
  - Primary: `#111827` (`text-gray-900`)
  - Secondary: `#6b7280` (`text-gray-500`)

#### Special Effects
- **Glassmorphism:** `.glass-card` (`bg-white/95 backdrop-blur-sm border border-white/20`)
- **AI Gradient:** `.ai-gradient` (`linear-gradient(135deg, #0095A8 0%, #6366f1 100%)`)

### UI Components

#### Buttons
- **Primary Action:** `bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors`
- **Secondary Action:** `bg-white text-gray-700 border border-gray-200 hover:bg-gray-50`
- **Icon Button:** `p-2 rounded-full hover:bg-gray-100 text-gray-500`

#### Cards & Containers
- **Standard Card:** `bg-white rounded-2xl p-6 shadow-sm border border-gray-100`
- **Modal Container:** `bg-white rounded-2xl shadow-2xl w-full max-w-4xl`

#### Inputs
- **Text Field:** `w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all`

---

## 3. Component Architecture

### Admin Dashboard (`AdminDashboard.jsx`)
The dashboard is organized into tabs for better content management.

#### Layout Structure
- **Header:** Logo, Dashboard Title, "View Site" Link, User Dropdown.
- **Main Content Area:** Tabbed interface.

#### Tabs
1.  **Home (Default):**
    -   **Profile Settings:** Name, Role, Bio, Image.
    -   **Links & Resources:** Manage external links (PDFs, URLs).
    -   **Social Media:** Add/Edit/Delete social platforms.
    -   **Appointment Widget:** Configure "Book a Test Drive" widget text.
2.  **Inventory:**
    -   CRUD operations for Car listings.
    -   Image upload with WebP conversion.
3.  **Inbox:**
    -   View appointment requests.
    -   Status management (New, Contacted, Completed).

### Landing Page (`LandingPage.jsx`)
Dynamically renders content based on Firestore settings.

- **Hero Section:** Profile info (Name, Role, Bio, Image).
- **Action Buttons:** WhatsApp, Copy Link.
- **Resources Section:** List of configured links/files.
- **Social Media:** Icons for enabled platforms.
- **Inventory Grid:** Display cars fetched from DB.
- **Floating Action Buttons:** Test Drive Modal, AI Chatbot.

### Modals
- **SettingsModal:** Global app settings (Theme, AI Chatbot config).
- **CarFormModal:** Add/Edit vehicle details.
- **ResourceFormModal:** Add/Edit resource links.

---

## 4. Data Model (Firestore)

### Collection: `settings`
**Document:** `landingPage`
```json
{
  "profile": {
    "name": "String",
    "role": "String",
    "bio": "String",
    "image": "String (URL)",
    "phone": "String",
    "whatsapp": "String"
  },
  "socials": [
    { "type": "instagram", "url": "String", "enabled": "Boolean" }
  ],
  "resources": [
    { "type": "link|pdf", "title": "String", "subtitle": "String", "url": "String" }
  ],
  "testDrive": {
    "title": "String",
    "subtitle": "String",
    "enabled": "Boolean"
  },
  "chatbot": {
    "enabled": "Boolean",
    "customInstructions": "String"
  },
  "theme": {
    "primaryColor": "String",
    "backgroundColor": "String",
    "textColor": "String",
    "cardColor": "String"
  }
}
```

### Collection: `cars`
```json
{
  "name": "String",
  "price": "String",
  "tagline": "String",
  "image": "String (URL)",
  "specs": [
    { "label": "String", "value": "String" }
  ]
}
```

### Collection: `appointments`
```json
{
  "name": "String",
  "phone": "String",
  "model": "String",
  "date": "ISO String",
  "status": "new|contacted|completed"
}
```

---

## 5. Key Features & Implementation Details

### Image Optimization
- Client-side conversion to **WebP** format before upload.
- Quality set to `0.95` for optimal balance.

### AI Chatbot
- Context-aware: Injects inventory data into the system prompt.
- Custom Instructions: Admin can define specific knowledge base in Settings.

### Theme Engine
- Supports Preset Themes (Modern Teal, Ocean Blue, etc.).
- Custom Theme Builder: Admin can override primary, background, text, and card colors.
