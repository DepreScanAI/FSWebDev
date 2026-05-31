export default function VisiMisi() {
  return (
    <section className="px-6 md:px-16 lg:px-32 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
  
        {/* visi */}
        <article className="bg-brand-50 rounded-xl border border-brand-500 p-8
          hover:shadow-md transition-shadow">
          <h2 className="font-serif text-xl text-brand-500 mb-3">Visi</h2>
          <p className="font-serif text-gray-500 text-base leading-relaxed">
            Kenali dirimu, jaga mentalmu. Mewujudkan akses skrining kesehatan
            mental yang merata, cepat, dan terpercaya bagi seluruh masyarakat
            Indonesia tanpa hambatan stigma.
          </p>
        </article>
  
        {/* misi */}
        <article className="bg-brand-50 rounded-xl border border-brand-500 p-8
          hover:shadow-md transition-shadow">
          <h2 className="font-serif text-xl text-brand-500 mb-3">Misi</h2>
          <p className="font-serif text-gray-500 text-base leading-relaxed">
            DepreScan menyediakan skrining kesehatan mental yang inklusif dan
            mudah diakses untuk mengatasi stigma. Dengan teknologi analisis
            data, kami mendeteksi risiko depresi dari gaya hidup harian secara
            cepat, aman, serta menjembatani akses layanan kesehatan mental
            demi kesejahteraan psikologis.
          </p>
        </article>
  
      </div>
    </section>
  );
}