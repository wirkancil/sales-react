# Barbershop MVP - Task Breakdown

## Project Overview
Build a barbershop landing page and admin dashboard by adapting existing BYD codebase. Timeline: 9 working days.

---

## Phase 1: Database & Backend Setup (2 days)

### Setup & Configuration
- [ ] Create Firestore collections structure <!-- id: 1 -->
    - [ ] Create `barbershop_settings` collection with initial document <!-- id: 2 -->
    - [ ] Create `barbershop_locations` collection <!-- id: 3 -->
    - [ ] Create `barbershop_services` collection <!-- id: 4 -->
    - [ ] Create `barbershop_products` collection <!-- id: 5 -->
    - [ ] Create `barbershop_bookings` collection <!-- id: 6 -->
    - [ ] Create `barbershop_gallery` collection <!-- id: 7 -->
    - [ ] Create `barbershop_testimonials` collection <!-- id: 8 -->

### Firestore Security Rules
- [ ] Update firestore.rules for barbershop collections <!-- id: 9 -->
    - [ ] Add public read rules for settings, locations, services, products <!-- id: 10 -->
    - [ ] Add public create rule for bookings <!-- id: 11 -->
    - [ ] Add admin-only write rules for all collections <!-- id: 12 -->
    - [ ] Deploy updated rules to Firebase <!-- id: 13 -->

### Seed Data
- [ ] Create seed data for testing <!-- id: 14 -->
    - [ ] Add sample settings (profile, branding, socials) <!-- id: 15 -->
    - [ ] Add 5 sample locations <!-- id: 16 -->
    - [ ] Add 5-7 sample services <!-- id: 17 -->
    - [ ] Add 3-5 sample products <!-- id: 18 -->
    - [ ] Add 3 sample gallery images <!-- id: 19 -->
    - [ ] Add 3 sample testimonials <!-- id: 20 -->

### Firebase Functions
- [ ] Create barbershop AI functions <!-- id: 21 -->
    - [ ] Create `barbershopChat` function (barber consultant) <!-- id: 22 -->
    - [ ] Update system prompt for barber context <!-- id: 23 -->
    - [ ] Test function locally <!-- id: 24 -->
    - [ ] Deploy to Firebase <!-- id: 25 -->

---

## Phase 2: Landing Page (3 days)

### Project Structure
- [ ] Create barbershop components folder <!-- id: 26 -->
    - [ ] Create `src/components/barbershop/` directory <!-- id: 27 -->
    - [ ] Create `src/pages/BarbershopLanding.jsx` <!-- id: 28 -->

### Hero Section
- [ ] Build hero section <!-- id: 29 -->
    - [ ] Copy hero from LandingPage.jsx <!-- id: 30 -->
    - [ ] Update profile image/logo placeholder <!-- id: 31 -->
    - [ ] Add business stats (Est. 2018, 5 Locations) <!-- id: 32 -->
    - [ ] Apply dark theme colors <!-- id: 33 -->
    - [ ] Test responsiveness <!-- id: 34 -->

### Primary Actions
- [ ] Implement CTA buttons <!-- id: 35 -->
    - [ ] Book Appointment button (opens booking modal) <!-- id: 36 -->
    - [ ] WhatsApp button with dynamic number <!-- id: 37 -->
    - [ ] Share button <!-- id: 38 -->

### Services Section
- [ ] Create ServiceCard component <!-- id: 39 -->
    - [ ] Copy from CarCard.jsx and adapt <!-- id: 40 -->
    - [ ] Update fields (name, description, price, duration) <!-- id: 41 -->
    - [ ] Add category badge <!-- id: 42 -->
    - [ ] Style with dark theme <!-- id: 43 -->
- [ ] Create ServiceDrawer component <!-- id: 44 -->
    - [ ] Copy from ProductDrawer.jsx and adapt <!-- id: 45 -->
    - [ ] Show service details (price, duration, description) <!-- id: 46 -->
    - [ ] Add "Book This Service" button <!-- id: 47 -->
- [ ] Fetch services from Firestore <!-- id: 48 -->
- [ ] Display services grid <!-- id: 49 -->

### Products Section
- [ ] Create ProductCard component <!-- id: 50 -->
    - [ ] Similar to ServiceCard <!-- id: 51 -->
    - [ ] Show product image, name, price <!-- id: 52 -->
    - [ ] Add stock indicator (optional) <!-- id: 53 -->
- [ ] Create ProductDrawer component <!-- id: 54 -->
    - [ ] Show product details and images <!-- id: 55 -->
    - [ ] Add "Order via WhatsApp" button <!-- id: 56 -->
- [ ] Fetch products from Firestore <!-- id: 57 -->
- [ ] Display products grid <!-- id: 58 -->

### Locations Section
- [ ] Create LocationAccordion component <!-- id: 59 -->
    - [ ] Collapsible list of locations <!-- id: 60 -->
    - [ ] Show name, address, phone <!-- id: 61 -->
    - [ ] Add map link <!-- id: 62 -->
- [ ] Fetch locations from Firestore <!-- id: 63 -->
- [ ] Display locations accordion <!-- id: 64 -->

### Gallery Section
- [ ] Create GalleryGrid component <!-- id: 65 -->
    - [ ] 3x3 grid layout <!-- id: 66 -->
    - [ ] Image hover effects <!-- id: 67 -->
    - [ ] "See More" overlay on last image <!-- id: 68 -->
- [ ] Fetch gallery from Firestore <!-- id: 69 -->
- [ ] Display gallery grid <!-- id: 70 -->

### Testimonials Section
- [ ] Create TestimonialCarousel component <!-- id: 71 -->
    - [ ] Horizontal scrollable cards <!-- id: 72 -->
    - [ ] Show rating stars, review, customer name <!-- id: 73 -->
    - [ ] Snap scroll behavior <!-- id: 74 -->
- [ ] Fetch testimonials from Firestore <!-- id: 75 -->
- [ ] Display testimonials carousel <!-- id: 76 -->

### Booking Modal
- [ ] Create booking modal <!-- id: 77 -->
    - [ ] Copy from test drive modal <!-- id: 78 -->
    - [ ] Update form fields (location, service, date, time, name, phone) <!-- id: 79 -->
    - [ ] Add service selection dropdown <!-- id: 80 -->
    - [ ] Add location selection dropdown <!-- id: 81 -->
    - [ ] Integrate with Firestore (save booking) <!-- id: 82 -->
    - [ ] Add success notification <!-- id: 83 -->

### AI Chatbot
- [ ] Update AI chatbot for barber consultant <!-- id: 84 -->
    - [ ] Copy chatbot from LandingPage.jsx <!-- id: 85 -->
    - [ ] Update system prompt (barber context) <!-- id: 86 -->
    - [ ] Connect to barbershopChat function <!-- id: 87 -->
    - [ ] Test AI responses <!-- id: 88 -->

### Routing & Integration
- [ ] Add barbershop route to App.jsx <!-- id: 89 -->
    - [ ] Add `/barbershop` route <!-- id: 90 -->
    - [ ] Test navigation <!-- id: 91 -->

### Styling & Theme
- [ ] Apply dark theme throughout <!-- id: 92 -->
    - [ ] Update color scheme (gold accent) <!-- id: 93 -->
    - [ ] Add fade-in animations <!-- id: 94 -->
    - [ ] Test dark mode consistency <!-- id: 95 -->

---

## Phase 3: Admin Dashboard (3 days)

### Project Structure
- [ ] Create admin page <!-- id: 96 -->
    - [ ] Create `src/pages/BarbershopAdmin.jsx` <!-- id: 97 -->
    - [ ] Copy structure from AdminDashboard.jsx <!-- id: 98 -->

### Profile Settings
- [ ] Adapt profile settings section <!-- id: 99 -->
    - [ ] Copy from AdminDashboard.jsx <!-- id: 100 -->
    - [ ] Update fields (name, tagline, logo, phone, whatsapp, email) <!-- id: 101 -->
    - [ ] Add business stats fields (established year, location count) <!-- id: 102 -->
    - [ ] Connect to barbershop_settings <!-- id: 103 -->

### Theme Settings
- [ ] Adapt theme settings section <!-- id: 104 -->
    - [ ] Copy from AdminDashboard.jsx <!-- id: 105 -->
    - [ ] Set default to dark theme preset <!-- id: 106 -->
    - [ ] Update default colors (gold accent) <!-- id: 107 -->
    - [ ] Test theme preview <!-- id: 108 -->

### Services Management
- [ ] Create ServiceFormModal component <!-- id: 109 -->
    - [ ] Copy from CarFormModal.jsx and adapt <!-- id: 110 -->
    - [ ] Update form fields (name, description, price, duration, category, image) <!-- id: 111 -->
    - [ ] Add validation <!-- id: 112 -->
    - [ ] Connect to barbershop_services <!-- id: 113 -->
- [ ] Create services list view <!-- id: 114 -->
    - [ ] Display services table <!-- id: 115 -->
    - [ ] Add/Edit/Delete actions <!-- id: 116 -->
    - [ ] Add search/filter <!-- id: 117 -->

### Products Management
- [ ] Create ProductFormModal component <!-- id: 118 -->
    - [ ] Copy from ServiceFormModal <!-- id: 119 -->
    - [ ] Update fields (name, description, price, stock, category, images) <!-- id: 120 -->
    - [ ] Support multiple images <!-- id: 121 -->
    - [ ] Connect to barbershop_products <!-- id: 122 -->
- [ ] Create products list view <!-- id: 123 -->
    - [ ] Display products table <!-- id: 124 -->
    - [ ] Add/Edit/Delete actions <!-- id: 125 -->
    - [ ] Add search/filter <!-- id: 126 -->

### Locations Management
- [ ] Create LocationFormModal component <!-- id: 127 -->
    - [ ] Simple form (name, address, phone, map URL) <!-- id: 128 -->
    - [ ] Add featured toggle <!-- id: 129 -->
    - [ ] Add order field <!-- id: 130 -->
    - [ ] Connect to barbershop_locations <!-- id: 131 -->
- [ ] Create locations list view <!-- id: 132 -->
    - [ ] Display locations table <!-- id: 133 -->
    - [ ] Add/Edit/Delete actions <!-- id: 134 -->
    - [ ] Add reorder functionality <!-- id: 135 -->

### Bookings Management
- [ ] Adapt bookings section <!-- id: 136 -->
    - [ ] Copy from appointments tab <!-- id: 137 -->
    - [ ] Update columns (service name, location, date, time, customer) <!-- id: 138 -->
    - [ ] Add status update dropdown <!-- id: 139 -->
    - [ ] Connect to barbershop_bookings <!-- id: 140 -->
    - [ ] Add filter by status <!-- id: 141 -->

### Gallery Management
- [ ] Create gallery management section <!-- id: 142 -->
    - [ ] Image upload component <!-- id: 143 -->
    - [ ] Display gallery grid <!-- id: 144 -->
    - [ ] Add reorder functionality (drag & drop or order field) <!-- id: 145 -->
    - [ ] Add delete action <!-- id: 146 -->
    - [ ] Connect to barbershop_gallery <!-- id: 147 -->

### Testimonials Management
- [ ] Create testimonials management section <!-- id: 148 -->
    - [ ] Simple form (customer name, rating, review) <!-- id: 149 -->
    - [ ] Display testimonials list <!-- id: 150 -->
    - [ ] Add/Edit/Delete actions <!-- id: 151 -->
    - [ ] Add reorder functionality <!-- id: 152 -->
    - [ ] Connect to barbershop_testimonials <!-- id: 153 -->

### AI Settings
- [ ] Adapt AI settings section <!-- id: 154 -->
    - [ ] Copy from AdminDashboard.jsx <!-- id: 155 -->
    - [ ] Update default instructions for barber context <!-- id: 156 -->
    - [ ] Test AI toggle <!-- id: 157 -->

### Routing & Protection
- [ ] Add admin route <!-- id: 158 -->
    - [ ] Add `/barbershop/admin` route <!-- id: 159 -->
    - [ ] Wrap with ProtectedRoute <!-- id: 160 -->
    - [ ] Test authentication <!-- id: 161 -->

---

## Phase 4: Testing & Polish (1 day)

### Functional Testing
- [ ] Test all CRUD operations <!-- id: 162 -->
    - [ ] Test services CRUD <!-- id: 163 -->
    - [ ] Test products CRUD <!-- id: 164 -->
    - [ ] Test locations CRUD <!-- id: 165 -->
    - [ ] Test gallery upload/delete <!-- id: 166 -->
    - [ ] Test testimonials CRUD <!-- id: 167 -->

### Booking Flow Testing
- [ ] Test booking end-to-end <!-- id: 168 -->
    - [ ] Fill booking form <!-- id: 169 -->
    - [ ] Submit booking <!-- id: 170 -->
    - [ ] Verify in Firestore <!-- id: 171 -->
    - [ ] Verify in admin bookings tab <!-- id: 172 -->
    - [ ] Test status update <!-- id: 173 -->

### AI Features Testing
- [ ] Test AI chatbot <!-- id: 174 -->
    - [ ] Ask barber consultation questions <!-- id: 175 -->
    - [ ] Verify relevant responses <!-- id: 176 -->
    - [ ] Test error handling <!-- id: 177 -->

### Responsiveness Testing
- [ ] Test mobile responsiveness <!-- id: 178 -->
    - [ ] Test landing page on mobile <!-- id: 179 -->
    - [ ] Test admin dashboard on mobile <!-- id: 180 -->
    - [ ] Fix any layout issues <!-- id: 181 -->

### Performance & Polish
- [ ] Performance optimization <!-- id: 182 -->
    - [ ] Check page load times <!-- id: 183 -->
    - [ ] Optimize images <!-- id: 184 -->
    - [ ] Check console for errors <!-- id: 185 -->
- [ ] UI polish <!-- id: 186 -->
    - [ ] Check all animations <!-- id: 187 -->
    - [ ] Verify color consistency <!-- id: 188 -->
    - [ ] Test all hover states <!-- id: 189 -->

### Deployment
- [ ] Deploy to Firebase <!-- id: 190 -->
    - [ ] Build production bundle <!-- id: 191 -->
    - [ ] Deploy hosting <!-- id: 192 -->
    - [ ] Deploy functions <!-- id: 193 -->
    - [ ] Verify production site <!-- id: 194 -->

---

## Progress Summary
- **Total Tasks**: 194
- **Completed**: 0
- **In Progress**: 0
- **Remaining**: 194

## Timeline
- Phase 1: 2 days
- Phase 2: 3 days
- Phase 3: 3 days
- Phase 4: 1 day
- **Total**: 9 days
