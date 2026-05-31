const features = [
  {
    icon: (
      <svg
        className="w-7 h-7 text-brand-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    title: 'Didukung AI Deep Learning',
    desc: 'Model neural network terlatih pada dataset NHANES 2017–2018.',
  },
  {
    icon: (
      <svg
        className="w-7 h-7 text-brand-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    title: 'Privasi Terjaga',
    desc: 'Data user aman bersama kami dan tidak akan dibagikan ke pihak ketiga. Dengan sistem autentikasi, riwayat sesi akan tersimpan dengan aman di dalam akun dan user memegang kendali penuh untuk logout atau menghapusnya kapan saja..',
  },
  {
    icon: (
      <svg
        className="w-7 h-7 text-brand-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: 'Hanya Hitungan Menit',
    desc: 'Pertanyaan sederhana mencakup pola gaya hidup dan kesehatan mental untuk hasil yang akurat.',
  },
  {
    icon: (
      <svg
        className="w-7 h-7 text-brand-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    title: 'Hasil Terperinci',
    desc: 'Laporan lengkap meliputi skor, faktor risiko, rekomendasi tindak lanjut dan grafik yang mudah dipahami.',
  },
];

export default function Section2() {
  return (
    <section
      className="w-full bg-bg py-20 md:py-28"
      aria-labelledby="why-heading"
    >
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2
            id="why-heading"
            className="font-serif text-4xl md:text-5xl text-black mb-5"
          >
            Mengapa DepreScan?
          </h2>
          <p className="font-serif text-gray-500 text-lg max-w-lg mx-auto leading-relaxed">
            Dibangun dengan teknologi terkini untuk memberikan hasil yang dapat
            diandalkan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {features.map((f) => (
            <article
              key={f.title}
              className="card p-8 flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-white rounded-xl border border-brand-200 flex items-center justify-center flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <h3 className="font-serif text-lg font-normal text-black mb-1.5">
                  {f.title}
                </h3>
                <p className="font-serif text-gray-500 text-base leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
