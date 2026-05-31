import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-bg min-h-[85vh] flex items-center">
      {/* Elemen lingkaran */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Lingkaran kiri */}
        <div className="absolute left-20 top-[55%] -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand-100 opacity-70" />
 
        {/* Lingkaran kanan */}
        <div className="absolute -right-2 top-[35%] -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-100 opacity-70" />
 
        {/* Lingkaran tengah */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full border border-brand-200/60 bg-transparent" />
      </div>

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 bg-brand-100/60 border border-brand-500/30 px-5 py-2 rounded-full mb-8">
          <span className="w-2 h-2 rounded-xl bg-brand-500 inline-block" />
          <span className="font-sans text-xs font-semibold text-brand-500 tracking-wide uppercase">
            Sistem Deteksi Risiko Depresi Berdasarkan Gaya Hidup
          </span>
        </div>

        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] max-w-3xl">
          <span className="text-black">Kenali kondisi</span>
          <br />
          <span className="text-brand-500">Mentalmu </span>
          <span className="text-black">lebih</span>
          <br />
          <span className="text-black">awal</span>
        </h1>

        <p className="mt-8 font-serif text-gray-500 text-lg md:text-xl max-w-xl leading-relaxed">
          DepreScan menggunakan kecerdasan buatan untuk membantu mendeteksi
          tanda-tanda depresi sejak dini secara mandiri dan cepat.
        </p>

        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link
            to="/screening"
            className="btn-primary text-base px-8 py-4 rounded-xl flex items-center gap-2"
          >
            Deteksi Sekarang
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
          <Link
            to="/tentang"
            className="btn-secondary text-base px-8 py-4 rounded-xl"
          >
            Lebih Lanjut
          </Link>
        </div>

        <div className="mt-9 flex flex-col items-center gap-1.5 opacity-50">
          <span className="font-sans text-[9px] uppercase tracking-widest text-gray-500">
            Scroll
          </span>

          <svg
            viewBox="0 0 32 52"
            width="22"
            height="32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-400"
          >
            <rect
              x="8"
              y="2"
              width="16"
              height="28"
              rx="8"
              stroke="currentColor"
              strokeWidth="1.5"
            />

            <rect
              x="14.5"
              y="8"
              width="3"
              height="7"
              rx="1.5"
              fill="currentColor"
              className="animate-scroll-dot"
            />

            <polyline
              points="12,34 16,39 20,34"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-arrow-1"
            />

            <polyline
              points="12,40 16,45 20,40"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-arrow-2"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
