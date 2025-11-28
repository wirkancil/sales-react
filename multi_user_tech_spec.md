# Spesifikasi Teknis: Opsi Arsitektur Multi-User

Dokumen ini menguraikan dua pendekatan teknis untuk mengubah aplikasi Single-User saat ini menjadi Platform Multi-User di mana setiap pengguna memiliki dashboard dan profil publik mereka sendiri.

---

## Perubahan Inti (Wajib untuk Kedua Opsi)

Terlepas dari strategi routing yang dipilih (Path vs Subdomain), perubahan backend berikut ini bersifat wajib.

### 1. Skema Database (Firestore)
**Saat Ini:** Satu dokumen global `settings/landingPage`.
**Baru:** Koleksi berdasarkan User ID.

**Koleksi: `users`**
ID Dokumen: `{uid}` (Firebase Auth UID)
```json
{
  "username": "john_doe", // Unik, terindeks
  "email": "john@example.com",
  "createdAt": "Timestamp",
  "settings": {
    "profile": { ... },
    "theme": { ... },
    "socials": [ ... ]
  }
}
```

**Koleksi: `usernames` (Untuk cek keunikan)**
ID Dokumen: `{username}`
```json
{
  "uid": "user_123"
}
```

### 2. Autentikasi & Onboarding
- **Daftar (Sign Up):** Harus menyertakan langkah untuk memilih `username` yang unik.
- **Dashboard:** Harus mengambil data dari `users/{currentUser.uid}` bukan `settings/landingPage`.

---

## Opsi 1: Routing Berbasis Path (Rekomendasi untuk MVP)
**Format:** `domainanda.com/username` (contoh: `smart-sales.com/john`)

### Arsitektur
- **Routing:** Ditangani sepenuhnya oleh React Router di sisi klien (client-side).
- **Hosting:** Hosting Single Page Application (SPA) standar.

### Detail Implementasi

#### 1. React Router (`App.jsx`)
```jsx
<Routes>
  <Route path="/" element={<HomePage />} /> {/* Halaman Marketing */}
  <Route path="/login" element={<LoginPage />} />
  <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
  
  {/* Rute Profil User Dinamis */}
  <Route path="/:username" element={<UserProfilePage />} />
</Routes>
```

#### 2. Logika Profil (`UserProfilePage.jsx`)
1. Ambil `username` dari parameter URL: `const { username } = useParams();`
2. Query koleksi Firestore `users` di mana `username == username`.
3. Jika ditemukan -> Render `LandingPage` dengan data user tersebut.
4. Jika tidak ditemukan -> Render halaman 404 Not Found.

### Kelebihan & Kekurangan
| Kelebihan | Kekurangan |
| :--- | :--- |
| **Implementasi Paling Mudah:** Tidak perlu konfigurasi DNS atau server yang rumit. | **Kesan Kurang "Premium":** URL terlihat seperti sub-halaman biasa. |
| **Biaya Nol:** Berjalan di paket gratis Firebase Hosting standar. | **SEO:** Otoritas domain mungkin sedikit lebih lemah dibanding subdomain (masih diperdebatkan). |
| **Cepat:** Routing murni di sisi klien, transisi instan. | |

---

## Opsi 2: Routing Berbasis Subdomain
**Format:** `username.domainanda.com` (contoh: `john.smart-sales.com`)

### Arsitektur
- **DNS:** Wildcard DNS (`*.domainanda.com`) yang mengarah ke server hosting.
- **Routing:** Middleware atau logika sisi klien untuk memparsing `window.location.hostname`.
- **SSL:** Memerlukan Sertifikat SSL Wildcard.

### Detail Implementasi

#### 1. Konfigurasi DNS
- Tambahkan `A Record`: `*` -> `IP Firebase Hosting`
- **Tantangan:** Firebase Hosting **tidak** mendukung subdomain wildcard pada paket Spark (Gratis) dengan mudah. Anda biasanya perlu menambahkan setiap subdomain secara manual via API atau menggunakan solusi kustom (seperti Cloud Run atau Vercel).

#### 2. Logika Sisi Klien (`App.jsx`)
Aplikasi harus mendeteksi jika sedang berjalan di subdomain.

```jsx
const hostname = window.location.hostname; // contoh: "john.smart-sales.com"
const subdomain = hostname.split('.')[0];
const isMainDomain = subdomain === 'www' || subdomain === 'smart-sales';

if (!isMainDomain) {
  // Kita berada di subdomain -> Render Profil
  return <UserProfilePage username={subdomain} />;
}

// Jika tidak, render rute standar
return (
  <Routes>
    <Route path="/admin" ... />
  </Routes>
);
```

### Kelebihan & Kekurangan
| Kelebihan | Kekurangan |
| :--- | :--- |
| **Branding Premium:** User merasa memiliki "situs sendiri". | **Setup Rumit:** Memerlukan manajemen Wildcard DNS & SSL. |
| **Isolasi:** Cookies/Storage bisa diisolasi per subdomain. | **Keterbatasan Firebase:** Firebase Hosting butuh penambahan subdomain manual atau pindah ke Cloud Run untuk wildcard. |
| | **Biaya:** Kemungkinan butuh paket berbayar atau infrastruktur lebih kompleks (misal: Vercel/Cloudflare). |

---

## Rekomendasi

**Mulai dengan Opsi 1 (Berbasis Path)** karena alasan berikut:
1.  **Kecepatan:** Anda bisa membangun ini *hari ini* tanpa mengubah struktur codebase saat ini secara drastis.
2.  **Biaya:** Gratis di Firebase.
3.  **Kesederhanaan:** Tidak ada pusing urusan DNS.

**Jalur Upgrade:**
Anda selalu bisa bermigrasi ke Opsi 2 nanti. Anda cukup menambahkan pengalihan (redirect):
`domainanda.com/john` -> `john.domainanda.com`

---

## Implikasi Admin Dashboard (Perubahan Wajib)

Agar dashboard bisa digunakan oleh banyak orang, logika di dalam `AdminDashboard.jsx` harus diubah total.

### 1. Konteks Pengguna (User Context)
Dashboard tidak boleh lagi "buta" terhadap siapa yang sedang login.
- **Sekarang:** Menganggap hanya ada 1 admin.
- **Baru:** Harus membaca `currentUser.uid` dari Firebase Auth.

### 2. Alur Data (Data Flow)

#### Fetching (Mengambil Data)
Kode lama:
```javascript
const docRef = doc(db, "settings", "landingPage"); // HARDCODED
```

Kode baru (Multi-User):
```javascript
const { user } = useAuth();
// Ambil dari koleksi users berdasarkan UID yang login
const docRef = doc(db, "users", user.uid); 
```

#### Saving (Menyimpan Data)
Kode lama:
```javascript
await setDoc(doc(db, "settings", "landingPage"), updatedSettings);
```

Kode baru (Multi-User):
```javascript
await updateDoc(doc(db, "users", user.uid), {
  settings: updatedSettings
});
```

### 3. Onboarding (Pengguna Baru)
Saat pengguna baru mendaftar (Sign Up), dashboard mereka masih kosong.
- **Logika Baru:** Saat pertama kali login, sistem harus mengecek apakah dokumen `users/{uid}` sudah ada.
- **Jika Belum Ada:** Tampilkan modal "Selamat Datang" untuk meminta input awal (Nama, Username, dll) dan buat dokumen awal dengan nilai default.

### 4. Keamanan (Security Rules)
Pastikan user A tidak bisa mengedit dashboard user B.
```javascript
match /users/{userId} {
  // Hanya boleh baca/tulis jika UID pengirim request sama dengan userId dokumen
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

---

## Struktur URL & Navigasi (Ringkasan)

Berikut adalah bagaimana pembagian URL akan terlihat dalam praktik (menggunakan Opsi 1: Path-Based):

### 1. Admin Dashboard (Tempat Edit)
Ini adalah "dapur" tempat pengguna mengedit konten mereka. URL-nya **sama untuk semua orang**, tapi isinya berbeda tergantung siapa yang login.
- **URL:** `domainanda.com/admin`
- **Siapa yang bisa akses:** Hanya user yang sudah login.
- **Apa yang dilihat:** Form edit profil, manajemen produk, inbox pesan.
- **Koneksi ke Landing Page:** Tombol "View Site" di dashboard akan secara otomatis mengarah ke `domainanda.com/{username_anda}`.
  - *Contoh:* Jika Anda login sebagai `wirkancil`, tombol "View Site" akan membuka `domainanda.com/wirkancil`.

### 2. Landing Page User (Hasil Publik)
Ini adalah "etalase" yang dilihat oleh publik/pelanggan.
- **URL:** `domainanda.com/:username`
  - Contoh: `domainanda.com/budi_motor`
  - Contoh: `domainanda.com/susi_mobil`
- **Siapa yang bisa akses:** Siapa saja (Publik).
- **Apa yang dilihat:** Profil yang sudah didesain, daftar mobil, tombol kontak.

### 3. Halaman Utama Platform
- **URL:** `domainanda.com/`
- **Isi:** Halaman marketing untuk mengajak orang mendaftar ("Buat website dealer mobil Anda dalam 5 menit!").

---

## Analisis Kesulitan: Path vs Subdomain

Pertanyaan: *Seberapa susah pindah dari `domain.com/user` ke `user.domain.com`?*

Jawabannya: **Jauh Lebih Susah (Tingkat Kesulitan: Tinggi)**.

Berikut adalah hambatan teknis utamanya:

### 1. Masalah DNS & SSL (Paling Utama)
- **Path (`/user`):** Tidak perlu setting apa-apa. 1 Sertifikat SSL standar sudah cukup.
- **Subdomain (`user.`):**
  - **Paket Blaze:** Anda **BISA** memiliki subdomain tak terbatas (unlimited), TETAPI Firebase Hosting tidak memiliki fitur "Wildcard Mapping" (`*.domain.com`) yang tinggal klik.
  - **Konsekuensi:** Anda harus membuat **Cloud Function** yang memanggil **Firebase Hosting API** setiap kali ada user baru daftar untuk menambahkan subdomain mereka (`user.domain.com`) secara programatis.
  - **Waktu Propagasi:** Setelah user daftar, butuh waktu (bisa 5-60 menit) sampai SSL aktif dan subdomain bisa dibuka. Ini pengalaman user yang kurang baik (tidak instan).

### 2. Masalah Session & Login
- **Path:** Login di `domain.com/login` otomatis berlaku di `domain.com/user`.
- **Subdomain:** Login di `domain.com` **TIDAK** otomatis berlaku di `user.domain.com` kecuali Anda setting cookie khusus (`.domain.com`). Ini sering jadi sumber bug "tiba-tiba logout".

### 3. Kode Frontend
- Perubahan kode React-nya sendiri sebenarnya **mudah** (hanya ubah cara baca URL).
- Yang susah adalah infrastruktur server/hostingnya (Manajemen Domain Otomatis).

Saran: Tetap mulai dengan Path (`domain.com/user`) untuk MVP. Jika sukses, baru invest waktu untuk bangun sistem manajemen subdomain otomatis.

---

## Solusi Canggih: Cloudflare Workers (Untuk Subdomain)

Jika Anda **bersikeras** ingin menggunakan subdomain (`user.domain.com`) tanpa pusing dengan limitasi Firebase, solusinya adalah menggunakan **Cloudflare Workers**.

### Konsep "Topeng" (Masking)
Alih-alih mendaftarkan setiap subdomain di Firebase, kita menggunakan Cloudflare sebagai "satpam" di depan.

1.  **User** membuka `budi.domain.com`.
2.  **Cloudflare Worker** menangkap request tersebut.
3.  **Cloudflare** secara diam-diam meminta konten dari `domain.com/budi` ke Firebase.
4.  **Firebase** mengirim halaman profil Budi.
5.  **Cloudflare** menampilkannya ke User.

**Hasilnya:**
- Di mata User: Mereka ada di `budi.domain.com`.
- Di mata Firebase: Hanya melayani `domain.com/budi`.

### Langkah Implementasi
1.  **DNS:** Arahkan domain utama ke Cloudflare.
2.  **Cloudflare Worker Script:**
    ```javascript
    addEventListener('fetch', event => {
      event.respondWith(handleRequest(event.request))
    })

    async function handleRequest(request) {
      const url = new URL(request.url);
      const hostname = url.hostname; // misal: budi.domain.com
      
      // Cek apakah ini subdomain
      if (hostname !== 'domain.com' && hostname !== 'www.domain.com') {
        const subdomain = hostname.split('.')[0]; // ambil "budi"
        const newUrl = `https://domain.com/${subdomain}`; // rewrite ke path
        
        // Ambil konten dari path, tapi tetap tampilkan URL subdomain
        return fetch(newUrl, request);
      }
      
      return fetch(request);
    }
    ```
3.  **Keuntungan:**
    - **SSL Otomatis:** Cloudflare menangani Wildcard SSL.
    - **Tidak Ada Delay:** Subdomain langsung aktif detik itu juga.
    - **Bypass Limit Firebase:** Firebase tidak tahu ada subdomain, jadi tidak perlu add domain di console.

### Biaya & Keahlian
- **Biaya:** Cloudflare Workers ada paket gratis (cukup besar), lalu berbayar jika trafik sangat tinggi.
- **Keahlian:** Anda perlu mengerti sedikit coding Javascript untuk Workers dan konfigurasi DNS Cloudflare.

