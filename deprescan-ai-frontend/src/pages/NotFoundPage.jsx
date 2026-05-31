import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 text-center">

      {/* 404 */}
      <div className="relative mb-6 select-none">
        <h1 className="font-serif text-[10rem] leading-none font-bold text-brand-500 tracking-tight">
          404
        </h1>
      </div>

      {/* Keterangan */}
      <h2 className="font-serif text-2xl md:text-3xl text-[#0d172f] mb-3">
        Halaman Tidak Ditemukan
      </h2>
      <p className="font-sans text-sm md:text-base text-gray-500 max-w-md mb-8 leading-relaxed">
        Halaman yang Anda cari tidak tersedia atau terjadi kesalahan lain.
        Periksa kembali URL yang Anda masukkan.
      </p>

      {/* Tombol kembali ke beranda */}
      <Link to="/" className="btn-primary inline-flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Kembali ke Beranda
      </Link>

    </div>
  );
}