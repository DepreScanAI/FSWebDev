import PropTypes from 'prop-types';
const steps = [
  {
    num: 1,
    title: 'Isi Kuisioner',
    desc: 'Jawab PHQ-9 dan pertanyaan gaya hidup seputar pola tidur dan aktivitas fisik.',
    side: 'left',
  },
  {
    num: 2,
    title: 'Diproses AI',
    desc: 'Dianalisis model deep learning yang dilatih dari data NHANES.',
    side: 'right',
  },
  {
    num: 3,
    title: 'Lihat Hasil',
    desc: 'Dapatkan skor PHQ-9, klasifikasi tingkat, dan panduan langkah awal.',
    side: 'left',
  },
  {
    num: 4,
    title: 'Pantau Riwayat',
    desc: 'Lacak perkembangan kondisi mentalmu dari setiap sesi ke sesi.',
    side: 'right',
  },
];

function StepCard({ num, title, desc }) {
  return (
    <article className="flex items-center justify-between bg-[#eaeffa] border border-[#2a4891] rounded-[10px] px-5 py-4 gap-4 h-[100px] w-full">
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <h3 className="font-serif text-[#2a4891] text-lg leading-tight">
          {title}
        </h3>
        <p className="font-serif text-[#595959] text-sm leading-snug">{desc}</p>
      </div>
      <div className="flex-shrink-0 w-[50px] h-[50px] bg-[#2a4891] rounded-[10px] flex items-center justify-center">
        <span className="font-serif text-white text-xl">{num}</span>
      </div>
    </article>
  );
}

export default function Section3() {
  return (
    <section
      className="w-full bg-bg py-20 md:py-28 border-t border-gray-100"
      aria-labelledby="cara-heading"
    >
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2
            id="cara-heading"
            className="font-serif text-4xl md:text-5xl text-black mb-5"
          >
            Cara Kerja
          </h2>
          <p className="font-serif text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
            Berikut cara kerja DepreScan membantu memahami kondisi mental secara
            cepat dan terstruktur.
          </p>
        </div>

        <div className="hidden md:block zigzag-container max-w-4xl mx-auto">
          <div className="flex flex-col gap-8">
            {steps.map((step) => (
              <div
                key={step.num}
                className={`zigzag-step zigzag-step--${step.side} grid grid-cols-[1fr_48px_1fr] items-center`}
              >
                {step.side === 'left' ? (
                  <div className="pr-2">
                    <StepCard {...step} />
                  </div>
                ) : (
                  <div />
                )}

                <div />

                {step.side === 'right' ? (
                  <div className="pl-2">
                    <StepCard {...step} />
                  </div>
                ) : (
                  <div />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Versi mobile */}
        <div className="md:hidden flex flex-col gap-4">
          {steps.map((step) => (
            <StepCard key={step.num} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}

StepCard.propTypes = {
  num: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
};
