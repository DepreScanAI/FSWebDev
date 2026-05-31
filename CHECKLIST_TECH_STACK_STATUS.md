# Checklist Tech Stack Aplikasi DepreScan - Fullstack Web Developer

`Tim CC26-PSU066`

Dokumen ini merangkum pemenuhan kriteria Main Quest, Side Quest, dan tech stack yang digunakan pada proyek DepreScan.

---

## Main Quest

| No | List Main Quest | Status | Implementasi |
|---|----------|--------|--------------|
| 1 | Menggunakan networking calls untuk berinterkasi dengan API pada Proyek | Selesai | Frontend menggunakan Axios (`services/api.js`) untuk melakukan HTTP calls ke backend Express dan meneruskan data ke Python FastAPI |
| 2 | Menggunakan module bundler (`seperti  webpack, Vite, dan sejenisnya`) untuk membangun proyek aplikasi web | Selesai | Frontend dibuat dengan Vite sebagai build tool dan dev server (`vite.config.js`) |
| 3 | Membangun RESTful API untuk mendukung aplikasi Front-End | Selesai | Backend Express menyediakan REST API lengkap: auth, screening, feedback dikonsumsi di sisi frontend|
| 4 | RESTful API dapat menyimpan data dengan atau tanpa menggunakan database | Selesai | Data tersimpan ke PostgreSQL (users, screening_sessions, feedbacks, password_reset_tokens) |
| 5 | Membuat RESTful API dengan URL mengikuti standar konvensi RESTful | Selesai | URL menggunakan resource-based naming + HTTP method yang sesuai (`GET /api/screening/sessions/:id`, `DELETE /api/screening/sessions`) |
| 6 | Mengintegrasikan kemampuan AI/ML sebagai fitur utama aplikasi | Selesai | Model  AI deep learning (TensorFlow) di Python FastAPI diakses frontend melalui backend Express |
| 7 | Memastikan implementasi fitur utama yang dikembangkan dalam proyek berjalan dengan baik tanpa menyebabkan aplikasi crash | Selesai | Menerapkan try/catch di seluruh controller & API calls, global error handler di backend, dan error state di frontend |

---

## Side Quest

| No | List Side Quest | Status | Implementasi |
|---|----------|--------|--------------|
| 1 | Membuat mockup aplikasi sebagai representasi visual dari desain dan antarmuka pengguna (UI) | Selesai | Merancang desain UI aplikasi web untuk implementasi frontend menggunakan Figma [Mockup Figma](https://www.figma.com/design/cyIJxDoBXJO3MJnPHb6ATI/Deprescan-UI?node-id=2025-196&t=wDPcNKiEncPQ7ay6-1)|
| 2 | Membangun layout aplikasi web responsif agar dapat berjalan dengan baik pada berbagai ukuran layar perangkat| Selesai | Menggunakan CSS native media query dan Tailwind CSS untuk responsive seperti (`sm:`, `md:`, `lg:`) diterapkan di seluruh halaman frontend |
| 3 | RESTful API dapat menyimpan data ke dalam database | Selesai | Data pengguna, hasil prediksi screening, riwayat sesi, dan feedback tersimpan ke dalam database melalui 4 tabel terstruktur: `users`, `screening_sessions`, `feedbacks`, dan `password_reset_tokens` |
| 4 | RESTful API dibangun menggunakan framework Express | Selesai | Backend menggunakan Express.js dengan struktur service-based |
| 5 | Rekomendasi tools untuk meningkatkan proses pengembangan aplikasi web: Boostrap / Tailwind CSS, Axios | Selesai | Digunakan sebagai styling utama frontend dengan custom design bcolor, typography, komponen reusable dan Axios digunakan di frontend (`services/api.js`) dengan instance terkonfigurasi, interceptors request & response, dan auto-attach Authorization|
| 6 | Melakukan deployment aplikasi web ke server | Selesai | Deploy masing masing dari lingkup frontend dan juga backend ke rekomendasi layanan hosting yang tersedia|
| 7 | Rekomendasi layanan hosting: Github Pages, Netlify, atau Vercel | Selesai | Membuat DEPLOY.md untuk guide Frontend ke `Netlify`, Backend ke `Railway`|

---

### Progres Status

| Bagian | Progress | Status |
|--------|----------|--------|
| Frontend | `100%` | Selesai |
| Backend | `100%` | Selesai |
