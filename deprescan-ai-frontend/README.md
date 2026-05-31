# DepreScan Fullstack Web Developer - Frontend

Aplikasi web React untuk **DepreScan** sistem deteksi risiko depresi berbasis gaya hidup menggunakan kecerdasan buatan.

**Stack**: React · Javascript · Vite · Tailwind CSS · Axios · React Router · Chart.js · Three.js · Google OAuth

* **Main Domain Netlify :** https://deprescanai.netlify.app

---

# Checklist Tech Stack Aplikasi DepreScan - Frontend

Dibawah ini merangkum pemenuhan kriteria Main Quest, Side Quest yang telah diterapkan pada sisi **Frontend** proyek DepreScan.

## Main Quest

| No | List Main Quest | Status | Implementasi |
|---|----------|--------|--------------|
| 1 | Menggunakan networking calls untuk berinteraksi dengan API pada Proyek | Selesai | Frontend menggunakan Axios (`services/api.js`) untuk melakukan HTTP calls ke backend Express yang meneruskan data ke Python FastAPI |
| 2 | Menggunakan module bundler (`seperti webpack, Vite, dan sejenisnya`) untuk membangun proyek aplikasi web | Selesai | Frontend dibuat dengan Vite sebagai build tool dan dev server (`vite.config.js`) |
| 3 | Mengintegrasikan kemampuan AI/ML sebagai fitur utama aplikasi | Selesai | Frontend mengakses hasil prediksi model AI (TensorFlow/FastAPI) melalui endpoint backend Express, serta mengaktifkan AI Insight via Groq secara opsional |
| 4 | Memastikan implementasi fitur utama yang dikembangkan dalam proyek berjalan dengan baik tanpa menyebabkan aplikasi crash | Selesai | Menerapkan error state di seluruh komponen frontend dan try/catch pada setiap API calls ke backend |

---

## Side Quest

| No | List Side Quest | Status | Implementasi |
|---|----------|--------|--------------|
| 1 | Membuat mockup aplikasi sebagai representasi visual dari desain dan antarmuka pengguna (UI) | Selesai | Merancang desain UI aplikasi web untuk implementasi frontend menggunakan Figma [Mockup Figma](https://www.figma.com/design/cyIJxDoBXJO3MJnPHb6ATI/Deprescan-UI?node-id=2025-196&t=wDPcNKiEncPQ7ay6-1) |
| 2 | Membangun layout aplikasi web responsif agar dapat berjalan dengan baik pada berbagai ukuran layar perangkat | Selesai | Menggunakan CSS native media query dan Tailwind CSS untuk responsive seperti (`sm:`, `md:`, `lg:`) diterapkan di seluruh halaman frontend |
| 4 | Rekomendasi tools untuk meningkatkan proses pengembangan aplikasi web: Boostrap / Tailwind CSS, Axios | Selesai | Tailwind CSS digunakan sebagai styling utama frontend dengan custom design color, typography, komponen reusable dan Axios digunakan di frontend (`services/api.js`) dengan instance terkonfigurasi, interceptors request & response, dan auto-attach Authorization |
| 5 | Melakukan deployment aplikasi web ke server | Selesai | Deploy Frontend ke layanan hosting **Netlify** sesuai panduan yang tersedia di `DEPLOY.md` |
| 6 | Rekomendasi layanan hosting: Github Pages, Netlify, atau Vercel | Selesai | Membuat `DEPLOY.md` sebagai panduan deploy Frontend ke **Netlify** |

---

### Progres Status

| Bagian | Progress | Status |
|--------|----------|--------|
| **Frontend** | `100%` | Selesai |

---

## Struktur Folder

```
deprescan-frontend/
- node_modules
- public/
-- Deprescan-logo.svg
-- Logo-form.svg
- src/
-- components/
--- auth/
---- AuthLayout.jsx         # Layout splitscreen halaman auth
---- RequireAuth.jsx        # Guard route protected
--- beranda/                # Component section dari halaman beranda
---- Hero.jsx
---- Section2.jsx
---- Section3.jsx
--- chart/                  # Component visualisasi chart hasil prediksi
---- AIInsight.jsx
---- Brain3D.jsx
---- CompareModels.jsx
---- FaktorRisiko.jsx
---- KonsensusModel.jsx
---- LifestyleRadar.jsx
---- ModelResultsTable.jsx
---- ScoreHero.jsx
---- ScoreInterpretasi.jsx
--- label/
---- ChartLabel.jsx         # Label judul reusable untuk tiap chart
--- layout/
---- Navbar.jsx             # Navigasi utama, CTA pakai Link, profile dropdown
---- Footer.jsx             # Footer
---- Layout.jsx             # Wrapper Navbar + main + Footer
--- loading/
---- LoadingSpinner.jsx     # Loading screen animasi step prediksi
--- modal/
---- FeedbackModal.jsx      # Modal feedback setelah hasil prediksi
--- screening/              # Component form 7 step screening PHQ-9 & gaya hidup
---- ScreeningShared.jsx    # Style slider, header dan templating form
---- StepAktivitas.jsx
---- StepAlkohol.jsx
---- StepDemografi.jsx
---- StepEkonomi.jsx
---- StepPHQ9.jsx
---- StepReview.jsx
---- StepTidur.jsx
--- tentang/                # Component section dari halaman tentang
---- Alasan.jsx
---- Disclaimer.jsx
---- Header.jsx
---- Screening.jsx
---- VisiMisi.jsx
-- context/
--- AuthContext.jsx         # Global auth state user, login & logout
-- pages/
--- Beranda.jsx             # Landing page hero + why + cara kerja
--- ForgotPassword.jsx      # Lupa password
--- Hasil.jsx               # Hasil prediksi dan charts
--- Login.jsx               # Login/Register Google OAuth
--- NotFoundPage.jsx        # Halaman 404
--- ResetPassword.jsx       # Verifikasi link reset password
--- Riwayat.jsx             # History screening list
--- RiwayatDetail.jsx       # Detail riwayat hasil screening
--- Screening.jsx           # Form screening 7 step + preview PHQ-9 dan gaya hidup
--- Tentang.jsx             # About page
-- services/
--- api.js                  # Axios instance + all API calls
-- utils/
--- helpers.js              # PHQ helpers, date format, computeDerivedFeatures
--- hasilConstants.js       # CAT_META, CATEGORIES, CAT_MID, computeCategoryRows
-- App.jsx                  # AppContent routing dan App providers wrapper
-- main.jsx                 # Entry point: BrowserRouter + StrictMode + App
-- index.css                # Tailwind + custom css styles
- .env                      # Environment lokal
- .env.example              # Environment reference
- .gitignore
- DEPLOY.md
- eslint.config.js
- index.html
- netlify.toml              # Netlify deploy config + SPA redirects
- package-lock.json
- package.json
- postcss.config.js
- README.md
- tailwind.config.js
- vite.config.js
```

---

## Setup Lokal

### 1. Install Dependencies

```bash
npm install
```

### 2. Konfigurasi `.env`

```bash
cp .env.example .env
```

Edit `.env` sesuai kebutuhan:

```env
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### 3. Jalankan Dev Server

```bash
npm run dev
# http://localhost:5173
```

### 4. Build Production (Opsional)

```bash
npm run build
# Output: dist/
```

---

## Halaman & Fitur

Dokumentasi menjelaskan terkait halaman, route dan deskripsi dari tiap tiap page.

### Beranda

### Route `/`
Landing page, mengapa? dan cara kerja.

### Route `/login`
Form halaman login/register opsi lupa password.

### Route `/screening`
Form 7 langkah pertanyaan PHQ-9 + lifestyle. Terdapat opsi centang **Sertakan Rekomendasi AI Insight** di step terakhir sebelum submit - jika tidak dicentang, AI Insight tetap bisa diaktifkan nanti dari halaman hasil atau riwayat.

### Route `/hasil/:id`
Halaman hasil langsung setelah screening. Menampilkan skor, AI Insight, charts visualisasi, dan tombol feedback. Parameter `:id` menggunakan `session_code` (format `YYYYMMDD_HHMMSS_xxxxx`), bukan UUID, sehingga tidak bisa diakses menggunakan ID dari `/riwayat/:id`.

### Route `/riwayat`
List riwayat screening dan kelola atau tinjau untuk lihat detail riwayat screening.

### Route `/riwayat/:id`
Detail lengkap satu sesi riwayat hasil prediksi. Layout identik dengan `/hasil/:id` dengan tambahan tombol "Kembali ke Riwayat". Parameter `:id` menggunakan UUID dari database, berbeda dengan `/hasil/:id` yang menggunakan `session_code`.

### Route `/tentang`
Halaman about yang berisikan visi misi serta disclaimer.

---

## Integrasi Backend

Frontend ke Node.js backend via Axios:

```
React App (Vite:5173) → axios → Express API (8000) → axios → Python FastAPI (8001)
```

Semua request melalui `src/services/api.js`:
- `authAPI.*` - `register`, `login`, `googleAuth`, `getMe`, `updateMe`, `forgotPassword`, `verifyResetToken`, `resetPassword`
- `screeningAPI.*` - `predict`, `getSessions`, `getSession`, `getSessionByCode`, `requestAiInsight`, `deleteSession`, `deleteAllSessions`, `mlHealth`
- `feedbackAPI.*` - `create`, `getAll`

Token JWT disimpan di `localStorage` dan otomatis dilampirkan ke setiap request.

---

## Color & Style

* Brand primary `#2a4891`
* Background `#f3f3f8`
* Font serif DM Serif Display
* Font sans Plus Jakarta Sans

---

## Visualisasi Hasil

1. **AIInsight** - Teks rekomendasi personal dari Groq AI. Jika belum diaktifkan, menampilkan tombol **Aktifkan AI Insight** yang mengirim request ke backend tanpa harus screening ulang.
2. **Brain3D** - Visualisasi Three.js dengan 9 region otak, warna berdasarkan skor risiko.
3. **CompareModels** - Bar chart vertikal estimasi PHQ-9 untuk setiap kategori, kategori aktif di-highlight.
4. **FaktorRisiko** - Horizontal bar chart 6 faktor risiko utama (sedentary, aktivitas, PHQ-9, social jetlag, composite).
5. **KonsensusModel** - Konsensus kategori dari backend beserta distribusi confidence tiap kategori dalam bentuk progress bar.
6. **LifestyleRadar** - Profil risiko 6 dimensi (Tidur, Alkohol, Aktivitas, Sedentary, Sosial, Ekonomi) dengan Chart.js.
7. **ModelResultsTable** - Tabel rincian distribusi confidence tiap kategori prediksi, baris kategori aktif di-highlight dengan status **Aktif**.
8. **ScoreHero** - Lingkaran progress skor PHQ-9, warna berdasarkan kategori.
9. **ScoreInterpretasi** - Rincian rentang skor dari standar PHQ-9 beserta interpretasi kecenderungan kondisi mental.

---

## Fitur Derived Features

`computeDerivedFeatures()` di `utils/helpers.js` menghitung fitur turunan dari input form secara otomatis sebelum dikirim ke `POST /api/screening/predict`:

- `AVG_SLEEP_HOURS` - Rata-rata jam tidur
- `SEDENTARY_HOURS` - Jam duduk/berbaring per hari
- `TOTAL_MET_MIN` - Total menit aktivitas fisik terbobot MET
- `SLEEP_RISK_SCORE` - Skor risiko gangguan tidur
- `ALCOHOL_RISK_SCORE` - Skor risiko konsumsi alkohol
- `TOTAL_RISK_COMPOSITE` - Komposit risiko keseluruhan
- `PHYSICALLY_INACTIVE` - Flag tidak aktif secara fisik
- `N_SEVERE_ITEMS` - Jumlah item PHQ-9 dengan skor ≥ 2

---

## Step Deploy ke Netlify

1. Push ke GitHub
2. Connect repo di Netlify (https://netlify.com)
3. Build settings otomatis dari `netlify.toml`:
   - Build command: `npm run build`
   - Publish: `dist/`
4. Set environment variables di Netlify:
   - `VITE_API_URL` = URL Railway backend (`https://deprescan-ai-backend-production.up.railway.app/api`)
   - `VITE_GOOGLE_CLIENT_ID` = Google OAuth Client ID dari Console
5. `netlify.toml` sudah meng-handle SPA routing (`/*` ke `index.html`)

---