# Deploy Backend ke Railway

## Syarat
- Akun Railway (https://railway.app)
- Akun GitHub (repo sudah di-push)
- ML service (deprescan-ai) sudah di-deploy terlebih dahulu

## Langkah Deploy

### 1. Buat Project di Railway
1. Login ke Railway - **New Project**
2. Pilih **Deploy from GitHub repo** - pilih repo backend
3. Railway otomatis mendeteksi `Dockerfile` dan menggunakan Docker builder

### 2. Tambahkan PostgreSQL Plugin
1. Di dalam project - **+ New** - **Database** - **PostgreSQL**
2. `PGUSER`, `PGHOST`, `PGPASSWORD`, `PGDATABASE`, `PGPORT` akan otomatis tersedia sebagai env var

### 3. Migrasi Database
- Migrasi otomatis berjalan setiap deploy via `startCommand` di `railway.json`
- Tidak perlu menjalankan migrasi secara manual

### 4. Set Environment Variables
Di Railway Dashboard - Settings - **Variables**, tambahkan semua var berikut:

| Variable | Nilai | Keterangan |
|---|---|---|
| `NODE_ENV` | `production` | Wajib |
| `PGUSER` | *(auto dari plugin)* | Otomatis terisi |
| `PGHOST` | *(auto dari plugin)* | Otomatis terisi |
| `PGPASSWORD` | *(auto dari plugin)* | Otomatis terisi |
| `PGDATABASE` | *(auto dari plugin)* | Otomatis terisi |
| `PGPORT` | *(auto dari plugin)* | Otomatis terisi |
| `JWT_SECRET` | string random ≥32 char | Wajib - generate dengan `openssl rand -hex 32` |
| `JWT_EXPIRES_IN` | `7d` | Opsional, default 7 hari |
| `GOOGLE_CLIENT_ID` | dari Google Cloud Console | Untuk Google OAuth |
| `ML_API_URL` | URL service deprescan-ai | Wajib untuk prediksi |
| `FRONTEND_URL` | URL Netlify frontend | Untuk CORS |
| `EMAIL_HOST` | `smtp.gmail.com` | Untuk reset password |
| `EMAIL_PORT` | `587` | Untuk reset password |
| `EMAIL_SECURE` | `false` | Untuk reset password |
| `EMAIL_USER` | email Gmail Anda | Untuk reset password |
| `EMAIL_PASS` | Gmail App Password | Untuk reset password |
| `EMAIL_FROM` | `DepreScan <email@gmail.com>` | Untuk reset password |

### 5. Konfigurasi Google OAuth
Di Google Cloud Console - APIs & Services - Credentials:
- **Authorized JavaScript origins**: tambahkan domain Railway + domain Netlify
- **Authorized redirect URIs**: tambahkan `https://your-backend.railway.app`

### 6. Health Check
Setelah deploy, akses: `https://your-backend.railway.app/health`
Harus mengembalikan `{ status: 'ok' }`

## Tips
- Generate JWT_SECRET: `openssl rand -hex 32`
- Jika `ML_API_URL` belum ada, endpoint `/api/screening/predict` akan return 503
- Check logs di Railway Dashboard jika ada error
- Setiap `git push` ke branch `main` akan otomatis trigger deploy ulang