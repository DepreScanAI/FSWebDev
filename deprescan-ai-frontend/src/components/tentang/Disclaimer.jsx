export default function Disclaimer() {
  return (
    <section className="px-6 md:px-16 lg:px-32 pb-16">
      <div className="bg-brand-50 border border-brand-500 rounded-xl p-6
        flex items-start gap-4 hover:shadow-md transition-shadow">
        <div className="flex-shrink-0 w-9 h-9 rounded-full border-2 border-brand-500
          flex items-center justify-center mt-0.5">
          <span className="text-brand-500 font-bold text-sm">!</span>
        </div>
        <div>
          <h3 className="font-serif text-brand-500 text-lg mb-1">
            Disclaimer
          </h3>
          <p className="font-serif text-gray-500 text-base leading-relaxed">
            Hasil DepreScan adalah indikasi awal berbasis data, bukan diagnosis
            klinis. Selalu konsultasikan kondisi Anda kepada psikolog/psikiater
            untuk penanganan lebih lanjut.
          </p>
        </div>
      </div>
    </section>
  );
}