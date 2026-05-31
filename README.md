# DepreScan - Fullstack Web Developer

Aplikasi web untuk **DepreScan** sistem deteksi risiko depresi berbasis gaya hidup menggunakan kecerdasan buatan.

**Tim**: CC26-PSU066

**Stack Frontend**: React · Javascript · Vite · Tailwind CSS · Axios · React Router · Chart.js · Three.js · Google OAuth

**Stack Backend**: Node.js · Express.js · PostgreSQL · JWT · Google OAuth · Nodemailer · Docker

* **Frontend (Netlify)**: https://deprescanai.netlify.app
* **Backend API (Railway)**: https://deprescan-ai-backend-production.up.railway.app/api

---

## Struktur Repositori

* **[deprescan-ai-frontend](./deprescan-ai-frontend)**
* **[deprescan-ai-backend-api](./deprescan-ai-backend-api)**

---

## Frontend

React JS digunakan sebagai library utama untuk membangun antarmuka pengguna yang interaktif, mulai dari form screening, halaman hasil prediksi, hingga visualisasi data. Vite berperan sebagai module bundler modern yang mempercepat proses development dan menghasilkan build yang ringan siap production. Tailwind CSS digunakan untuk membangun tampilan yang responsif dan konsisten di berbagai ukuran layar secara efisien.

### Tech Stack Frontend

| Tech | Peran |
|------|-------|
| React JS | Library utama UI - komponen, hooks, context |
| Vite | Module bundler & dev server |
| Tailwind CSS | Utility-first styling, responsive layout |
| Axios | HTTP client, networking calls ke backend |
| React Router DOM | SPA routing & route protection |
| Chart.js & Recharts | Visualisasi data hasil prediksi |
| Three.js | Visualisasi otak 3D interaktif |
| Google OAuth | Login dengan akun Google |
| Netlify | Platform deployment frontend |

### Setup Frontend

```bash
cd deprescan-ai-frontend
npm install
cp .env.example .env
npm run dev
# http://localhost:5173
```

---

## Backend

Node.js digunakan sebagai runtime environment JavaScript yang menjadi fondasi utama server-side aplikasi. Express.js berperan sebagai framework untuk membangun RESTful API yang melayani seluruh permintaan dari frontend, mencakup endpoint autentikasi, screening, dan feedback, dilengkapi middleware untuk autentikasi JWT, validasi input, dan penanganan error. PostgreSQL digunakan sebagai database relasional untuk menyimpan data pengguna, hasil prediksi, riwayat sesi, dan feedback secara persisten.

### Tech Stack Backend

| Tech | Peran |
|------|-------|
| Node.js | Runtime environment server-side |
| Express.js | Framework RESTful API |
| PostgreSQL | Database utama (4 tabel) |
| node-pg-migrate | Manajemen migrasi database |
| JWT | Autentikasi berbasis token |
| Bcrypt | Hashing password |
| Joi | Validasi input request |
| Google Auth Library | Google OAuth 2.0 |
| Nodemailer | Email reset password |
| Axios | HTTP client ke Python FastAPI |
| Docker | Containerisasi untuk production |
| Railway | Platform deployment backend |

### Setup Backend

```bash
cd deprescan-ai-backend-api
npm install
cp .env.example .env
npm run migrate up
npm run dev
# http://localhost:8000
```

---

## Integrasi Sistem

```
React App (Netlify / 5173)
 Axios
 
Express REST API (Railway / 8000)
 Axios
 
Python FastAPI (Hugging Face Space / 8001)
 
 TensorFlow Model - Prediksi skor PHQ-9
 Groq API (LLaMA) - AI Insight personal (opsional)
```

---

## Skema Database

### `users`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | Primary key |
| name | VARCHAR | Nama user |
| email | VARCHAR | Unique, not null |
| password_hash | VARCHAR | bcrypt hash (null untuk Google OAuth) |
| google_id | VARCHAR | Unique (null untuk local) |
| avatar_url | TEXT | URL foto profil |
| provider | VARCHAR | `'local'` atau `'google'` |
| is_verified | BOOLEAN | Status verifikasi akun (default: false) |
| created_at | TIMESTAMPTZ | Waktu pembuatan akun |
| updated_at | TIMESTAMPTZ | Waktu pembaruan terakhir |

### `screening_sessions`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | Primary key |
| user_id | UUID | FK users (CASCADE delete) |
| session_code | VARCHAR | Kode unik `YYYYMMDD_HHMMSS_xxx`, not null |
| name_label | VARCHAR | Nama sesi (default: `'Anonim'`) |
| phq_score | NUMERIC(5,2) | Skor PHQ-9 desimal (0–27), not null |
| phq_score_int | INTEGER | Skor PHQ-9 bulat, not null |
| category | VARCHAR | `Minimal` / `Mild` / `Moderate` / `Moderately Severe` / `Severe`, not null |
| confidence_band | VARCHAR | Rentang kepercayaan prediksi (misal: `2.2 - 5.2`) |
| disclaimer | TEXT | Catatan disclaimer dari model |
| ai_insight | TEXT | Rekomendasi personal dari Groq AI (null jika tidak diaktifkan) |
| input_data | JSONB | Data form lengkap (69 fitur) |
| created_at | TIMESTAMPTZ | Waktu sesi dibuat |

### `feedbacks`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | Primary key |
| session_id | UUID | FK screening_sessions (SET NULL jika sesi dihapus) |
| user_id | UUID | FK users (SET NULL jika user dihapus) |
| is_helpful | BOOLEAN | `true` = Membantu, `false` = Tidak membantu, not null |
| name_label | VARCHAR | Nama opsional |
| created_at | TIMESTAMPTZ | Waktu feedback dikirim |

### `password_reset_tokens`
| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | UUID | Primary key |
| user_id | UUID | FK users (CASCADE delete), not null |
| token | VARCHAR | Token unik 64 karakter (hex) |
| expires_at | TIMESTAMPTZ | Kedaluwarsa 1 jam setelah dibuat |
| used_at | TIMESTAMPTZ | Diisi saat token dipakai (null = belum dipakai) |
| created_at | TIMESTAMPTZ | Waktu pembuatan token |

---