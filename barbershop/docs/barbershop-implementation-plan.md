# MVP Barbershop System - Implementation Plan

## 🎯 MVP Scope (Simple & Focused)

### Core Principle
**Reuse BYD architecture** sebanyak mungkin, hanya ganti:
- Data model (Cars → Services/Products)
- Branding (BYD → Barbershop)
- Booking flow (Test Drive → Appointment)

---

## 🏗️ Architecture Decision

### **Single Tenant MVP** (Recommended untuk Start)
**Kenapa?**
- ✅ Lebih simple untuk MVP
- ✅ Bisa scale ke multi-tenant nanti
- ✅ Faster time to market
- ✅ Reuse existing BYD codebase 90%

**URL Structure:**
```
yourdomain.com/barbershop → Landing Page
yourdomain.com/barbershop/admin → Admin Dashboard
```

**Nanti bisa upgrade ke multi-tenant:**
```
yourdomain.com/{tenantSlug} → Landing Page
yourdomain.com/{tenantSlug}/admin → Admin Dashboard
```

---

## 📊 Database Schema (Firestore) - MVP

### Collection: `barbershop_settings`
```javascript
{
  id: "main",
  profile: {
    name: "The Barbershop Co.",
    tagline: "Premium Grooming in Jakarta",
    logo: "url",
    phone: "+628115551234",
    whatsapp: "628115551234",
    email: "info@barbershop.co"
  },
  branding: {
    primaryColor: "#C5A059",
    backgroundColor: "#121212",
    textColor: "#E5E5E5",
    cardColor: "#1E1E1E"
  },
  socials: [
    { type: 'instagram', url: '#', enabled: true },
    { type: 'tiktok', url: '#', enabled: true },
    { type: 'facebook', url: '#', enabled: true },
    { type: 'youtube', url: '#', enabled: true }
  ],
  aiSettings: {
    enabled: true,
    customInstructions: "You are a master barber..."
  }
}
```

### Collection: `barbershop_locations`
```javascript
{
  id: "auto-generated",
  name: "Panglima Polim Signature",
  address: "Jl. Panglima Polim IX No. 12, JakSel",
  phone: "+6221xxx",
  mapUrl: "https://maps.google.com/...",
  featured: true,
  order: 1,
  active: true
}
```

### Collection: `barbershop_services`
```javascript
{
  id: "auto-generated",
  name: "Gentleman's Cut",
  description: "Wash, Cut, Hot Towel & Style",
  price: 85000,
  currency: "IDR",
  duration: 45,
  image: "url", // optional
  category: "haircut",
  active: true,
  order: 1
}
```

### Collection: `barbershop_products`
```javascript
{
  id: "auto-generated",
  name: "Matte Clay Pomade",
  description: "Strong hold, no shine",
  price: 150000,
  images: ["url1", "url2"],
  stock: 50, // optional for MVP
  category: "pomade",
  active: true,
  order: 1
}
```

### Collection: `barbershop_bookings`
```javascript
{
  id: "auto-generated",
  locationId: "location-id",
  serviceId: "service-id",
  customerName: "John Doe",
  customerPhone: "0812xxx",
  date: "2024-11-25",
  time: "14:00",
  status: "pending", // pending, confirmed, completed, cancelled
  notes: "",
  createdAt: timestamp,
  createdBy: "anonymous" // for MVP
}
```

### Collection: `barbershop_gallery`
```javascript
{
  id: "auto-generated",
  image: "url",
  caption: "Recent cut",
  order: 1,
  active: true
}
```

### Collection: `barbershop_testimonials`
```javascript
{
  id: "auto-generated",
  customerName: "Rizky S.",
  rating: 5,
  review: "The best shave...",
  order: 1,
  active: true
}
```

---

## 🎨 Component Mapping (BYD → Barbershop)

### Landing Page Components

| BYD Component | Barbershop Equivalent | Changes Needed |
|---------------|----------------------|----------------|
| Hero Profile | Hero Profile | ✅ Reuse, ganti data |
| Car Stats (Rating/Delivered) | Business Stats (Est. 2018, 5 Locations) | ✅ Minor change |
| WhatsApp Button | WhatsApp Button | ✅ Reuse |
| Test Drive Button | Book Appointment Button | ✅ Rename only |
| Car Inventory (CarCard) | Services Grid | 🔄 Adapt layout |
| ProductDrawer | Service/Product Drawer | 🔄 Adapt content |
| AI Chatbot | AI Barber Consultant | 🔄 Change system prompt |
| Social Media Links | Social Media Links | ✅ Reuse |
| Resources Section | Locations Section | 🔄 Adapt |

### Admin Dashboard Components

| BYD Admin | Barbershop Admin | Changes Needed |
|-----------|------------------|----------------|
| Profile Settings | Profile Settings | ✅ Reuse |
| Theme Settings | Theme Settings | ✅ Reuse |
| Car Inventory Management | Services Management | 🔄 Adapt (same CRUD) |
| - | Products Management | ➕ New (copy from Services) |
| - | Locations Management | ➕ New (simple CRUD) |
| Appointments Tab | Bookings Tab | ✅ Reuse |
| - | Gallery Management | ➕ New (simple upload) |
| - | Testimonials Management | ➕ New (simple form) |
| AI Settings | AI Settings | ✅ Reuse |

---

## 📝 MVP Task Breakdown

### Phase 1: Setup & Database (1-2 days)
- [ ] Create new route `/barbershop` in existing project
- [ ] Setup Firestore collections (barbershop_*)
- [ ] Update Firestore rules for barbershop collections
- [ ] Create seed data untuk testing
- [ ] Update Firebase Functions untuk barbershop AI

### Phase 2: Landing Page (2-3 days)
- [ ] **Copy & Adapt BYD LandingPage.jsx → BarbershopLanding.jsx**
  - [ ] Change color scheme (dark theme)
  - [ ] Update hero section (logo, tagline, stats)
  - [ ] Replace Car inventory with Services grid
  - [ ] Add Products section
  - [ ] Update booking modal (Test Drive → Appointment)
  - [ ] Add Locations accordion
  - [ ] Add Gallery grid
  - [ ] Add Testimonials carousel
  - [ ] Update AI chatbot system prompt (barber consultant)
  - [ ] Add Magic Fill feature (optional untuk MVP)

### Phase 3: Admin Dashboard (2-3 days)
- [ ] **Copy & Adapt AdminDashboard.jsx → BarbershopAdmin.jsx**
  - [ ] Reuse Profile Settings (minimal changes)
  - [ ] Reuse Theme Settings (change default colors)
  - [ ] Adapt Inventory → Services Management
    - [ ] Change form fields (car → service)
    - [ ] Update validation
  - [ ] Copy Services → Products Management
    - [ ] Similar CRUD operations
  - [ ] Add Locations Management
    - [ ] Simple list + form
    - [ ] Name, address, phone, map URL
  - [ ] Reuse Appointments → Bookings
    - [ ] Update columns (car model → service name)
  - [ ] Add Gallery Management
    - [ ] Upload images
    - [ ] Reorder, delete
  - [ ] Add Testimonials Management
    - [ ] Simple form (name, rating, review)
    - [ ] Reorder, delete
  - [ ] Reuse AI Settings

### Phase 4: Testing & Polish (1 day)
- [ ] Test all CRUD operations
- [ ] Test booking flow end-to-end
- [ ] Test AI features
- [ ] Mobile responsiveness check
- [ ] Fix bugs
- [ ] Deploy to Firebase Hosting

---

## 🎨 Design Adjustments

### Color Scheme (Dark Theme)
```javascript
theme: {
  preset: "darkMode",
  primaryColor: "#C5A059", // Gold
  backgroundColor: "#121212", // Dark
  textColor: "#E5E5E5", // Light gray
  cardColor: "#1E1E1E" // Dark card
}
```

### Font
- Keep **Plus Jakarta Sans** (modern & bold)

### Animations
- Reuse existing animations
- Add fade-in-up for sections (like barber.md)

---

## 🔧 Technical Implementation

### File Structure
```
src/
├── pages/
│   ├── LandingPage.jsx (BYD - existing)
│   ├── AdminDashboard.jsx (BYD - existing)
│   ├── BarbershopLanding.jsx (NEW - copy from LandingPage)
│   └── BarbershopAdmin.jsx (NEW - copy from AdminDashboard)
├── components/
│   ├── barbershop/ (NEW folder)
│   │   ├── ServiceCard.jsx (adapted from CarCard)
│   │   ├── ProductCard.jsx (similar to ServiceCard)
│   │   ├── ServiceDrawer.jsx (adapted from ProductDrawer)
│   │   ├── LocationAccordion.jsx (NEW)
│   │   ├── GalleryGrid.jsx (NEW)
│   │   ├── TestimonialCarousel.jsx (NEW)
│   │   ├── ServiceFormModal.jsx (adapted from CarFormModal)
│   │   ├── ProductFormModal.jsx (copy from ServiceFormModal)
│   │   └── LocationFormModal.jsx (NEW - simple)
```

### Routing
```javascript
// App.jsx
<Routes>
  {/* BYD Routes */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
  
  {/* Barbershop Routes */}
  <Route path="/barbershop" element={<BarbershopLanding />} />
  <Route path="/barbershop/admin" element={<ProtectedRoute><BarbershopAdmin /></ProtectedRoute>} />
</Routes>
```

### Firebase Functions
```javascript
// functions/index.js
exports.barbershopChat = functions.https.onRequest(async (req, res) => {
  // Similar to existing chat function
  // Different system prompt for barber consultant
});

exports.barbershopMagicFill = functions.https.onRequest(async (req, res) => {
  // Extract booking details from natural language
  // Return JSON for form auto-fill
});
```

---

## 🚫 NOT in MVP (Future Enhancements)

- ❌ Multi-tenancy (single barbershop only)
- ❌ Payment gateway
- ❌ Email notifications
- ❌ Calendar integration
- ❌ Staff management
- ❌ Inventory tracking
- ❌ Loyalty program
- ❌ Custom domain per tenant
- ❌ Advanced analytics
- ❌ Multi-language

---

## ✅ MVP Features Summary

### Landing Page
1. ✅ Hero with profile & stats
2. ✅ Book Appointment button
3. ✅ WhatsApp button
4. ✅ AI Barber Consultant chatbot
5. ✅ Locations accordion (5 locations)
6. ✅ Services grid with pricing
7. ✅ Products catalog
8. ✅ Gallery showcase (3x3 grid)
9. ✅ Testimonials carousel
10. ✅ Social media links
11. ✅ Dark theme with gold accent

### Admin Dashboard
1. ✅ Profile settings
2. ✅ Theme customization
3. ✅ Services management (CRUD)
4. ✅ Products management (CRUD)
5. ✅ Locations management (CRUD)
6. ✅ Bookings management (view, update status)
7. ✅ Gallery management (upload, reorder)
8. ✅ Testimonials management (CRUD)
9. ✅ AI settings (enable/disable, custom instructions)

---

## 📅 Timeline Estimate

| Phase | Duration | Total |
|-------|----------|-------|
| Phase 1: Setup | 1-2 days | 2 days |
| Phase 2: Landing | 2-3 days | 5 days |
| Phase 3: Admin | 2-3 days | 8 days |
| Phase 4: Testing | 1 day | 9 days |

**Total MVP: ~9 working days** (1.5-2 weeks)

---

## 💡 Key Advantages of This Approach

1. **Speed**: Reuse 70% of BYD codebase
2. **Proven**: Same architecture that works
3. **Scalable**: Easy to add multi-tenancy later
4. **Cost-effective**: Same Firebase project
5. **Maintainable**: Similar code structure

---

## 🔄 Migration Path to Multi-Tenancy (Future)

When ready to scale:

1. Add `tenantId` field to all collections
2. Update Firestore rules for tenant isolation
3. Add tenant routing (`/:tenantSlug`)
4. Create tenant registration flow
5. Add tenant management in admin
6. Migrate existing data to first tenant

**Estimated effort**: 2-3 days

---

## 🎯 Success Metrics (MVP)

- [ ] Landing page loads in <2s
- [ ] All CRUD operations work
- [ ] Booking flow completes successfully
- [ ] AI consultant responds correctly
- [ ] Mobile responsive (100%)
- [ ] No console errors
- [ ] Admin can manage all content

---

## 🚀 Recommended Next Steps

1. **Review & Approve** this MVP plan
2. **Create detailed task.md** with checklist
3. **Start Phase 1**: Database setup
4. **Daily progress updates**
5. **Deploy MVP** in 2 weeks

---

## ❓ Final Questions

1. **Branding**: Apakah "The Barbershop Co." atau nama lain?
2. **Locations**: Berapa banyak lokasi untuk MVP? (5 seperti contoh?)
3. **Services**: Berapa banyak services untuk start? (~5-10?)
4. **Products**: Perlu products di MVP atau fokus services dulu?
5. **AI Features**: Priority: Consultant chatbot atau Magic Fill booking?

Silakan confirm dan saya akan mulai create task.md detail! 🚀
