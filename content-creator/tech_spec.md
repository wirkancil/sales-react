# Technical Specification: Content Creator Admin Dashboard

This document outlines the technical requirements and implementation plan for creating a **Content Creator Admin Dashboard**, cloned and adapted from the existing `AdminDashboard.jsx`.

## 1. Overview
The goal is to build a centralized dashboard for content creators to manage their public profile (`LandingPage`), portfolio, and leads. The dashboard will replace the car-specific features (Inventory, Test Drives) with creator-specific features (Portfolio, Rate Card, AI Pitch).

## 2. Data Model (Firestore)

The data will be stored in the `users/{uid}` document (following the Multi-User architecture) or `settings/landingPage` (if single user MVP).

### Profile & Settings Structure
```json
{
  "profile": {
    "name": "Alex Creator",
    "role": "Lifestyle & Tech Creator", // Job Title
    "bio": "Helping brands tell better stories...",
    "image": "url_to_image",
    "verified": true, // New: Blue tick status
    "onlineStatus": true, // New: Green dot status
    "email": "hello@alexcreator.com"
  },
  "socials": [
    { "type": "instagram", "url": "...", "enabled": true }
    // ... other socials
  ],
  "links": [ // Replaces 'resources'
    { 
      "type": "link", // or 'locked', 'ai'
      "title": "Business Inquiries", 
      "subtitle": "Direct WhatsApp chat", 
      "url": "...", 
      "icon": "whatsapp", // Icon identifier
      "isLocked": false
    }
  ],
  "rateCard": { // Specific config for the Gated Content
    "title": "Download Rate Card 2025",
    "subtitle": "Updated Jan 2025 • PDF",
    "fileUrl": "url_to_pdf",
    "enabled": true
  },
  "portfolio": { // New Section
    "showreel": "https://youtube.com/embed/...",
    "topContent": [
      { "title": "Galaxy S24 Review", "subtitle": "1.2M Views", "image": "url", "url": "...", "platform": "instagram" }
    ],
    "gallery": [ "url1", "url2", "url3" ],
    "assets": [
      { "title": "Media Kit", "type": "pdf", "url": "..." }
    ]
  },
  "aiPitch": {
    "enabled": true,
    "customPrompt": "Act as a social media expert..." // Optional: Allow admin to tweak prompt
  },
  "theme": { ... } // Existing theme settings
}
```

### Leads Collection (New)
Replaces `appointments`. Stores data from the Rate Card download form.
**Collection:** `leads` (or `users/{uid}/leads`)
```json
{
  "name": "Brand Name",
  "email": "brand@company.com",
  "phone": "+62812...",
  "downloadedAt": "Timestamp",
  "type": "rate_card"
}
```

## 3. Dashboard Structure & Tabs

The `AdminDashboard.jsx` will be modified to have the following tabs:

### Tab 1: Home (Profile & Links)
**Focus:** Core identity and main link-in-bio buttons.
- **Profile Section:**
    - Edit Name, Role, Bio.
    - Upload Profile Image.
    - **New:** Toggle "Verified Badge".
    - **New:** Toggle "Online Status".
- **Social Media Section:** (Reuse existing).
- **Links Manager:** (Adapted from Resources).
    - List of active buttons.
    - Add/Edit/Delete buttons.
    - **Special Cards:**
        - "AI Pitch Generator" (Toggle On/Off).
        - "Rate Card" (Upload PDF, Edit Title).

### Tab 2: Portfolio (New)
**Focus:** Managing the "Media Kit" modal content.
- **Showreel:** Input field for YouTube Embed URL.
- **Top Content:**
    - List view of content items.
    - "Add Content" Modal: Upload Thumbnail, Title, Subtitle (Views), URL.
- **Gallery:**
    - Grid view of images.
    - Multi-image upload.
- **Assets:**
    - Upload downloadable assets (High-res photos, etc).

### Tab 3: Leads (Renamed from Inbox)
**Focus:** Viewing who downloaded the Rate Card.
- Table View: Name, Email, Phone, Date.
- Export to CSV (Nice to have).

## 4. Component Requirements

### Modified Components
- **`AdminDashboard.jsx`**: Main layout, tab logic, and state management.
- **`ResourceFormModal.jsx`**: Adapt to handle different link types (Standard vs Locked).

### New Components (Internal to Dashboard)
- **`PortfolioManager`**: A component to handle the complexity of the Portfolio tab.
- **`TopContentForm`**: Modal to add/edit top performing content.
- **`GalleryUploader`**: Simple drag-and-drop or file input for gallery images.

## 5. Implementation Steps

1.  **Clone & Rename:** Copy `AdminDashboard.jsx` to `ContentCreatorDashboard.jsx`.
2.  **Clean Up:** Remove Car/Inventory specific logic and state (`cars`, `fetchCars`, `CarFormModal`).
3.  **Update State:** Initialize `settings` with the new structure (portfolio, rateCard, etc.).
4.  **Implement Home Tab:**
    - Add "Verified" and "Online" toggles#### [NEW] [CreatorLandingPage.jsx](file:///Users/mac/Documents/AI%20Project/simple-landing-page/src/pages/CreatorLandingPage.jsx)
- React implementation of `content-creator/Readme.md`.
- Fetches data from Firestore (`users/{uid}` or `settings/landingPage` for MVP).

#### [NEW] [CreatorLoginPage.jsx](file:///Users/mac/Documents/AI%20Project/simple-landing-page/src/pages/CreatorLoginPage.jsx)
- Clone of `LoginPage.jsx`.
- **Adaptations:**
    - Branding: "Creator Login" instead of "Admin Login".
    - Redirect: Navigates to `/admincreator` upon successful login.
    - Styling: Use Creator branding (Purple/Pink gradients) to distinguish from Sales Admin.

#### [NEW] [PortfolioManager.jsx](file:///Users/mac/Documents/AI%20Project/simple-landing-page/src/components/PortfolioManager.jsx)
- Component to manage Showreel, Top Content, and Gallery.
- Used within `ContentCreatorDashboard`.

### 2. Routing Updates
#### [MODIFY] [App.jsx](file:///Users/mac/Documents/AI%20Project/simple-landing-page/src/App.jsx)
- Add route `/creator` -> `CreatorLandingPage`.
- Add route `/creator/login` -> `CreatorLoginPage`.
- Add route `/admincreator` -> `ContentCreatorDashboard` (Protected).

## 6. Routing & URL Structure

The application will support specific routes for the Content Creator features:

-   **Public Landing Page:** `smartsales.ai-agentic.tech/creator`
-   **Creator Login:** `smartsales.ai-agentic.tech/creator/login`
-   **Admin Dashboard:** `smartsales.ai-agentic.tech/admincreator`

### Implementation in `App.jsx`
```jsx
<Routes>
  {/* Existing Routes */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/admin" element={<AdminDashboard />} />

  {/* New Content Creator Routes */}
  <Route path="/creator" element={<CreatorLandingPage />} />
  <Route path="/creator/login" element={<CreatorLoginPage />} />
  <Route path="/admincreator" element={
    <ProtectedRoute>
      <ContentCreatorDashboard />
    </ProtectedRoute>
  } />
</Routes>
```
