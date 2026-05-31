import { Link } from 'react-router-dom';

export default function Screening() {
  return (
    <section className="mx-6 md:mx-16 lg:mx-32 mb-16 bg-brand-500 rounded-xl py-14 px-8 text-center">
      <h2 className="font-serif text-3xl text-white mb-3">
        Siap Mulai Screening?
      </h2>
      <p className="font-serif text-brand-100 text-lg mb-8">
        Kenali kondisi mentalmu sekarang. Gratis dan hanya butuh beberapa menit.
      </p>
      <Link
        to="/screening"
        className="btn-primary border border-white inline-flex items-center gap-2 text-base px-8 py-4 rounded-xl"
      >
        Deteksi Sekarang
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
            d="M9 5l7 7-7 7" 
          />
        </svg>
      </Link>
    </section>
  );
}