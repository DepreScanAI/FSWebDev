# Deploy Frontend ke Netlify

## Prasyarat
- Akun Netlify (https://netlify.com)
- Akun GitHub (repo sudah di-push)
- Backend sudah di-deploy ke Railway dan URL-nya sudah diketahui

## Langkah Deploy

### 1. Connect ke GitHub
1. Login Netlify - **Add new site** - **Import an existing project**
2. Pilih GitHub - pilih repo frontend
3. Build settings sudah otomatis terbaca dari `netlify.toml`

### 2. Set Environment Variables
Di Netlify Dashboard - Site Settings - **Environment variables**:

| Variable | Nilai | Keterangan |
|---|---|---|
| `VITE_API_URL` | `https://your-backend.railway.app/api` | URL backend Railway + `/api` |
| `VITE_GOOGLE_CLIENT_ID` | dari Google Cloud Console | Sama dengan backend |

> Setiap perubahan env var di Netlify memerlukan **redeploy manual** agar efektif.

### 3. Build Settings (sudah ada di netlify.toml)
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 20

### 4. Konfigurasi Google OAuth
Di Google Cloud Console - APIs & Services - Credentials - OAuth 2.0 Client IDs:
- **Authorized JavaScript origins**: tambahkan `https://your-site.netlify.app`
- **Authorized redirect URIs**: tambahkan `https://your-site.netlify.app`

### 5. Custom Domain (Opsional)
Di Netlify - Domain management - tambahkan custom domain

## SPA Routing
`netlify.toml` sudah dikonfigurasi dengan redirect `/* - /index.html (200)`
sehingga React Router berfungsi dengan benar tanpa 404 saat refresh.

## Verifikasi
Setelah deploy, buka URL Netlify dan pastikan:
- Halaman beranda muncul
- Login/Register berfungsi
- Screening dan hasil prediksi berfungsi
