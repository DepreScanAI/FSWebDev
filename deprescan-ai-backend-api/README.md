# DepreScan Fullstack Web Developer - Backend

REST API untuk aplikasi DepreScan sistem deteksi risiko depresi berbasis gaya hidup.

**Stack**: Javascript · Node.js · Express.js · PostgreSQL · Google OAuth · JWT · Joi · Docker

* **Main Domain Railway :** https://deprescan-ai-backend-production.up.railway.app
* **API Base URL Railway :** https://deprescan-ai-backend-production.up.railway.app/api

**Catatan:** Semua *request* untuk endpoints harus menggunakan **API Base URL** sebagai *prefix* (Contoh: `/api/auth/login`)

---

## Checklist Tech Stack Aplikasi DepreScan - Backend

Dibawah ini merangkum pemenuhan kriteria Main Quest, Side Quest yang telah diterapkan pada sisi **Backend** proyek DepreScan.

## Main Quest

| No | List Main Quest | Status | Implementasi |
|---|----------|--------|--------------|
| 1 | Menggunakan networking calls untuk berinteraksi dengan API pada Proyek | Selesai | Backend Express menerima request dari frontend melalui Axios dan meneruskan data ke Python FastAPI untuk inferensi model AI |
| 2 | Membangun RESTful API untuk mendukung aplikasi Front-End | Selesai | Backend Express menyediakan REST API lengkap: auth, screening, feedback dikonsumsi di sisi frontend |
| 3 | RESTful API dapat menyimpan data dengan atau tanpa menggunakan database | Selesai | Data tersimpan ke PostgreSQL (`users`, `screening_sessions`, `feedbacks`, `password_reset_tokens`) |
| 4 | Membuat RESTful API dengan URL mengikuti standar konvensi RESTful | Selesai | URL menggunakan resource-based naming + HTTP method yang sesuai (`GET /api/screening/sessions/:id`, `DELETE /api/screening/sessions`) |
| 5 | Mengintegrasikan kemampuan AI/ML sebagai fitur utama aplikasi | Selesai | Model AI deep learning (TensorFlow) di Python FastAPI diakses frontend melalui backend Express via `mlService.js` + GROQ API untuk AI Insight |
| 6 | Memastikan implementasi fitur utama yang dikembangkan dalam proyek berjalan dengan baik tanpa menyebabkan aplikasi crash | Selesai | try/catch di seluruh controller, global error handler, ML error terisolasi (tidak crash jika FastAPI tidak tersedia), graceful shutdown SIGTERM/SIGINT |

---

## Side Quest

| No | List Side Quest | Status | Implementasi |
|---|----------|--------|--------------|
| 1 | RESTful API dapat menyimpan data ke dalam database PostgreSQL | Selesai | Data pengguna, hasil prediksi screening, riwayat sesi, dan feedback tersimpan ke dalam **PostgreSQL** melalui 4 tabel terstruktur: `users`, `screening_sessions`, `feedbacks`, dan `password_reset_tokens` - dikelola menggunakan **node-pg-migrate** |
| 2 | RESTful API dibangun menggunakan framework Express | Selesai | Backend menggunakan Express.js v4 dengan struktur service-based (authentications, users, screening, feedback) |
| 3 | Rekomendasi tools: Tailwind CSS, Axios | Selesai | **Axios** digunakan di `mlService.js` sebagai HTTP client ke Python FastAPI - Tailwind diterapkan di Frontend |
| 4 | Melakukan deployment aplikasi web ke server | Selesai | Deploy Backend ke layanan hosting **Railway** menggunakan Docker - panduan lengkap tersedia di `DEPLOY.md` |

---

### Progres Status

| Bagian | Progress | Status |
|--------|----------|--------|
| **Backend** | `100%` | Selesai |

---

## Struktur Folder

```

deprescan-backend/
- migrations/
-- {timestamp}_create-table-users.js
-- {timestamp}_create-table-screening-sessions.js
-- {timestamp}_create-table-feedbacks.js
-- {timestamp}_create-table-password-reset-tokens.js
- src/
-- config/
--- db.js                              # PostgreSQL Pool
-- exceptions/
--- index.js                           # export semua exceptions
--- client-error.js                    # base error (400)
--- invariant-error.js                 # 400
--- not-found-error.js                 # 404
--- authentication-error.js            # 401
--- authorization-error.js             # 403
-- middlewares/
--- auth.js                            # JWT authenticate middleware
--- error.js                           # global error handler + notFound
--- validate.js                        # Joi schema validator runner
-- routes/
--- index.js                           # global router
-- security/
--- token-manager.js                   # JWT generate & verify
-- server/
--- index.js                           # express setup (CORS, helmet, rate limit, routes)
-- services/
--- authentications/
---- controllers/authentication-controller.js  # register, login, google, forgot & reset password
---- repositories/authentication-repositories.js # password_reset_tokens queries
---- routes/index.js
---- validator/schema.js               # Joi schemas (register, login, forgot, reset password)
--- users/
---- controllers/user-controller.js    # getMe, updateMe
---- repositories/user-repositories.js # users table queries + bcrypt
---- validator/schema.js               # Joi schemas (updateMe)
--- screening/
---- controllers/screening-controller.js
---- repositories/screening-repositories.js
---- routes/index.js
---- validator/schema.js
--- feedback/
---- controllers/feedback-controller.js
---- repositories/feedback-repositories.js
---- routes/index.js
---- validator/schema.js
--- emailService.js                    # kirim email reset password
--- mlService.js                       # Axios client, Python FastAPI
-- utils/
--- response.js                        # standard response helpers
-- server.js                           # entry point: dotenv + listen + graceful shutdown
- .dockerignore
- .env
- .env.example
- .gitignore
- .npmrc
- DEPLOY.md
- Dockerfile
- eslint.config.js
- package-lock.json
- package.json
- railway.json
- README.md

```

---

## Setup Lokal

### 1. Install dependencies

```bash
npm install
```

### 2. Konfigurasi .env

```bash
cp .env.example .env
# Edit .env sesuai konfigurasi lokal
```

Variable .env wajib:
- `PGUSER` = username PostgreSQL
- `PGHOST` = host database (default: localhost)
- `PGPASSWORD` = password PostgreSQL
- `PGDATABASE` = nama database (pastikan sudah dibuat di pgAdmin)
- `PGPORT` = port PostgreSQL (default: 5432)
- `JWT_SECRET` = min 32 karakter, random string
- `GOOGLE_CLIENT_ID` = dari Google Cloud Console (opsional, hanya untuk Google OAuth)
- `ML_API_URL` = URL Python FastAPI lokal (default: http://localhost:8001)
- `FRONTEND_URL` = URL frontend (default: http://localhost:5173)

Variable .env untuk fitur Lupa Password (opsional jika tidak diisi, link dicetak di console):
- `OAUTH_CLIENT_ID` = Client ID dari Google Cloud Console > Credentials > OAuth 2.0 Client IDs
- `OAUTH_CLIENT_SECRET` = Client Secret dari Google Cloud Console > Credentials > OAuth 2.0 Client IDs
- `OAUTH_REFRESH_TOKEN` = Refresh Token dari https://developers.google.com/oauthplayground (scope: https://mail.google.com/)
- `OAUTH_EMAIL` = Gmail yang digunakan untuk mengirim email (contoh: deprescan@gmail.com)
- `EMAIL_FROM` = Nama & alamat pengirim (contoh: DepreScan <deprescan@gmail.com>)

### 3. Jalankan migrasi database PostgreSQL

```bash
npm run migrate up    # jalankan semua migration (pastikan database sudah dibuat di pgAdmin)
npm run migrate down  # rollback 1 step jika diperlukan
```

### 4. Jalankan server

```bash
npm run dev    # development (nodemon)
npm start      # production
```

Server berjalan di: `http://localhost:8000`
AI FastAPI : `http://localhost:8001`

### Alternatif: Jalankan dengan Docker Compose

```bash
docker compose up --build
```

PostgreSQL dan backend akan otomatis berjalan bersama. Migrasi dijalankan otomatis sebelum server start.

---

## REST API Endpoints Documentation

Dokumentasi berikut menjelaskan daftar endpoint yang tersedia pada bagian backend.

### Info & Health

### GET `http://localhost:8000/`
Info lengkap aplikasi beserta daftar semua endpoint yang tersedia.

- Auth: Tidak diperlukan

### GET `http://localhost:8000/health`
Health check server, memastikan server dan koneksi berjalan normal.

- Auth: Tidak diperlukan

### GET `http://localhost:8000/api`
Info singkat API Gateway.

- Auth: Tidak diperlukan

### Auth Method

### POST `http://localhost:8000/api/auth/register`
Registrasi dengan nama, email & password.

- Auth: Tidak diperlukan
- Content-Type: application/json

```json
Content-Type: application/json

{
  "name": "Dicoding Indonesia",
  "email": "dicoding@example.com",
  "password": "dicoding123"
}
```

### POST `http://localhost:8000/api/auth/login`
Login dengan email & password.

- Auth: Tidak diperlukan
- Content-Type: application/json

```json
Content-Type: application/json

{
  "email": "dicoding@example.com",
  "password": "dicoding123"
}
```

### POST `http://localhost:8000/api/auth/google`
Login atau register menggunakan Google OAuth.

- Auth: Tidak diperlukan
- Content-Type: application/json

```json

{
  "id_token": "google_id_token_from_frontend"
}
```

### GET `http://localhost:8000/api/auth/me`
Mendapatkan profil user yang telah terautentikasi.

- Auth: Login/auth diperlukan

### PUT `http://localhost:8000/api/auth/me`
Update nama profil user yang telah terautentikasi.

- Auth: Login/auth diperlukan

### POST `http://localhost:8000/api/auth/forgot-password`
Kirim link reset password ke email user. Selalu mengembalikan respons sukses untuk keamanan (tidak membocorkan apakah email terdaftar atau tidak).

- Auth: Tidak diperlukan
- Content-Type: application/json

```json
Content-Type: application/json

{
  "email": "dicoding@example.com"
}
```

### GET `http://localhost:8000/api/auth/reset-password/verify?token=xxx`
Verifikasi apakah token reset password masih valid (belum dipakai & belum kedaluwarsa). Digunakan frontend sebelum menampilkan form reset.

- Auth: Tidak diperlukan

### POST `http://localhost:8000/api/auth/reset-password`
Reset password menggunakan token dari email. Token hanya bisa digunakan sekali dan berlaku 1 jam.

- Auth: Tidak diperlukan
- Content-Type: application/json

```json
Content-Type: application/json

{
  "token": "token_dari_link_email",
  "password": "password_baru_minimal6"
}
```

### Screening Method

### POST `http://localhost:8000/api/screening/predict`
Prediksi PHQ, gaya hidup sehat + simpan sesi. Otomatis menyimpan hasil ke riwayat user.

- Auth: Login/auth diperlukan
- Authorization: Bearer Token
- Content-Type: application/json

Payload dikirim frontend berupa gabungan field mentah dari form skrining dan fitur turunan yang dihitung otomatis (`computeDerivedFeatures`). Semua field bersifat opsional kecuali `include_ai_insight`.

```json
Content-Type: application/json

{
  "name_label": "",   // nama bisa kosong

  // demografi
  "GENDER": 2,        // 1=Laki-laki, 2=Perempuan
  "AGE": 25,          // usia dalam tahun
  "RACE": 0,          // 1-6 (4=Non-Hispanik Asia)
  "EDUCATION": 0,     // 1=SD 2=SMP 3=SMA 4=D3/S1 5=S2+
  "MARITAL": 0,       // 1=Menikah 3=Belum menikah dst

  // ekonomi
  "INCOME_CAT": 0,    // kategori pendapatan 1-15
  "PIR": 0,         // rasio kemiskinan 1.0-5.0

  // tidur
  "SLD012": 0,        // jam tidur malam hari kerja 2-14
  "SLD013": 0,        // jam tidur malam akhir pekan 2-14
  "SLQ030": 0,        // frekuensi mendengkur 1-4
  "SLQ040": 0,        // berhenti napas saat tidur 1-4
  "SLQ050": 0,        // terdiagnosis gangguan tidur 1=Ya 2=Tidak
  "SLQ120": 0,        // tidak segar saat bangun 0-4

  // aktivitas fisik
  "PAQ605": 0,        // aktivitas berat saat kerja 1=Ya 2=Tidak
  "PAD615": 0,        // menit aktivitas berat saat kerja 0-480
  "PAQ620": 0,        // aktivitas sedang saat kerja 1=Ya 2=Tidak
  "PAD630": 0,        // menit aktivitas sedang saat kerja 0-480
  "PAQ635": 0,        // transportasi jalan kaki/bersepeda 1=Ya 2=Tidak
  "PAD645": 0,       // menit jalan kaki/bersepeda 0-480
  "PAQ650": 0,        // olahraga/rekreasi berat 1=Ya 2=Tidak
  "PAD660": 0,       // menit olahraga/rekreasi berat 0-480
  "PAQ665": 0,        // olahraga/rekreasi sedang 1=Ya 2=Tidak
  "PAD675": 0,       // menit olahraga/rekreasi sedang 0-480
  "PAD680": 0,      // total duduk/berbaring per hari dalam menit 0-1320

  // alkohol
  "ALQ111": 0,        // pernah minum alkohol >=12x seumur hidup 1=Ya 2=Tidak
  "ALQ121": 0,        // frekuensi minum setahun terakhir 0-10
  "ALQ130": 0,        // rata-rata gelas per hari 1-15
  "ALQ151": 0,        // pernah minum >=5 gelas dalam satu hari 1=Ya 2=Tidak

  // PHQ-9 (0=Tidak sama sekali 1=Beberapa hari 2=Lebih dari separuh hari 3=Hampir setiap hari)
  "DPQ010": 0,        // kurang tertarik melakukan hal apapun
  "DPQ020": 0,        // merasa sedih atau putus asa
  "DPQ030": 0,        // susah tidur atau terlalu banyak tidur
  "DPQ040": 0,        // merasa lelah atau kurang tenaga
  "DPQ050": 0,        // nafsu makan buruk atau makan berlebihan
  "DPQ060": 0,        // merasa buruk tentang diri sendiri
  "DPQ070": 0,        // sulit berkonsentrasi
  "DPQ080": 0,        // bergerak lambat atau gelisah
  "DPQ090": 0,        // pikiran untuk menyakiti diri sendiri

  //   Jika sudah memakai 9 variable dpq maka N_SEVERE_ITEMS tidak perlu
  //   "N_SEVERE_ITEMS": 9,

  // Fitur turunan bisa di timpa
  // "AVG_SLEEP_HOURS": 7.0,
  // "SEDENTARY_HOURS": 8.0,
  // "TOTAL_MET_MIN": 1020,
  // "SLEEP_RISK_SCORE": 1,
  // "ALCOHOL_RISK_SCORE": 2,
  // "TOTAL_RISK_COMPOSITE": 3,
  // "PHYSICALLY_INACTIVE": 0,

  // kontrol AI Insight
  "include_ai_insight": false // true untuk aktifkan AI Insight via Groq
}
```

**Format respons:**

```json
{
    "status": "success",
    "message": "Prediksi berhasil dan tersimpan di riwayat",
    "data": {
        "prediction": {
            "phq_score": 3.66,
            "phq_score_int": 4,
            "category": "Minimal",
            "confidence_band": "2.2 - 5.2",
            "disclaimer": "Hasil ini adalah indikasi awal berdasarkan skrining PHQ-9, bukan diagnosis klinis. Konsultasikan dengan profesional kesehatan mental.",
            "ai_insight": null
        },
        "session": {
            "id": "a6f4efc0-3ff0-4472-b35f-45e05c3793cf",
            "session_code": "20260525_055544_JEF7FU",
            "category": "Minimal",
            "phq_score": "3.66",
            "phq_score_int": 4,
            "created_at": "2026-05-25T05:55:44.150Z"
        }
    }
}
```

### GET `http://localhost:8000/api/screening/sessions`
Daftar riwayat prediksi.

- Auth: Login/auth diperlukan
- Authorization: Bearer Token

### GET `http://localhost:8000/api/screening/sessions/code/:session_code`
Lihat detail sesi prediksi berdasarkan session_code (format `YYYYMMDD_HHMMSS_xxxxx`). Digunakan khusus untuk halaman `/hasil/:session_code` agar ID sesi hasil berbeda format dengan `/riwayat/:id` dan tidak bisa saling dipertukarkan.

- Auth: Login/auth diperlukan
- Authorization: Bearer Token

### POST `http://localhost:8000/api/screening/sessions/:id/ai-insight`
Aktifkan AI Insight untuk sesi yang sudah ada. Berguna ketika user tidak memilih opsi AI Insight saat proses screening, dan ingin mengaktifkannya nanti dari halaman hasil atau riwayat detail. Jika AI Insight sudah tersedia, mengembalikan nilai yang ada tanpa memproses ulang.

- Auth: Login/auth diperlukan
- Authorization: Bearer Token

**Format respons:**

```json
{
    "status": "success",
    "message": "AI Insight berhasil diaktifkan.",
    "data": {
        "ai_insight": "Berdasarkan hasil screening Anda..."
    }
}
```

### GET `http://localhost:8000/api/screening/sessions/:id`
Lihat detail riwayat prediksi berdasarkan id (UUID). Digunakan khusus untuk halaman `/riwayat/:id`.

- Auth: Login/auth diperlukan
- Authorization: Bearer Token

### DELETE `http://localhost:8000/api/screening/sessions`
Hapus semua riwayat prediksi.

- Auth: Login/auth diperlukan
- Authorization: Bearer Token

### DELETE `http://localhost:8000/api/screening/sessions/:id`
Hapus satu sesi berdasarkan id.

- Auth: Login/auth diperlukan
- Authorization: Bearer Token

### GET `http://localhost:8000/api/screening/health`
Informasi status AI backend.

- Auth: Tidak diperlukan

### Feedback Method

### POST `http://localhost:8000/api/feedback`
Kirim feedback prediksi. Hanya bisa dikirim 1 kali per sesi.

- Auth: Login/auth diperlukan
- Authorization: Bearer Token

```json

{
  "session_id": "", // bisa isi session_id prediksi
  "is_helpful": true, // false untuk tidak membantu
  "name_label": "Dicoding" // opsional boleh kosong
}
```

### GET `http://localhost:8000/api/feedback`
Lihat semua feedback.

- Auth: Login/auth diperlukan
- Authorization: Bearer Token

---

## Deploy ke Railway

1. Push ke GitHub repo (pastikan `Dockerfile` dan `railway.json` sudah ada)
2. Buat project baru di Railway (https://railway.app)
3. Pilih **Deploy from GitHub repo** - Railway otomatis detect `Dockerfile`
4. Add **PostgreSQL** plugin - Railway otomatis generate variable `PGUSER`, `PGHOST`, `PGPASSWORD`, `PGDATABASE`, `PGPORT`
5. Set environment variables di Railway Dashboard - Variables:
   - `PGUSER` (otomatis dari Railway PostgreSQL)
   - `PGHOST` (otomatis dari Railway PostgreSQL)
   - `PGPASSWORD` (otomatis dari Railway PostgreSQL)
   - `PGDATABASE` (otomatis dari Railway PostgreSQL)
   - `PGPORT` (otomatis dari Railway PostgreSQL)
   - `DATABASE_URL` (otomatis dari Railway PostgreSQL)
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN` (contoh: `7d`)
   - `GOOGLE_CLIENT_ID`
   - `ML_API_URL`
   - `FRONTEND_URL` (Netlify URL atau ngrok URL)
   - `NODE_ENV=production`
   - `OAUTH_CLIENT_ID` dari Google Cloud Console > Credentials > OAuth 2.0 Client IDs
   - `OAUTH_CLIENT_SECRET` dari Google Cloud Console > Credentials > OAuth 2.0 Client IDs
   - `OAUTH_REFRESH_TOKEN` dari https://developers.google.com/oauthplayground (gunakan custom credentials, pilih scope https://mail.google.com/)
   - `OAUTH_EMAIL` Gmail yang digunakan untuk mengirim email (contoh: deprescan@gmail.com)
   - `EMAIL_FROM` nama pengirim (contoh: `DepreScan <deprescan@gmail.com>`)
6. Railway otomatis build Docker image dan deploy
7. Setiap `git push` ke `main` akan trigger deploy ulang otomatis

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