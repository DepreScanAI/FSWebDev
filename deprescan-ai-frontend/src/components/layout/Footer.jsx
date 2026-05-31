import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:justify-between gap-8">
          {/* Logo */}
          <div className="flex flex-col gap-3 md:max-w-xs">
            <Link to="/">
              <img
                src="/Deprescan-logo.svg"
                alt="DepreScan Logo"
                className="h-14 w-auto"
              />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Alat bantu screening depresi berbasis AI. Selalu konsultasikan
              kondisi Anda kepada profesional kesehatan mental.
            </p>
          </div>

          {/* Kontak */}
          <address className="not-italic flex flex-col gap-1.5">
            <h3 className="font-sans font-bold text-gray-600 text-base mb-2">
              Kontak Kami
            </h3>
            <a
              href="mailto:deprescan@gmail.com"
              className="text-gray-500 text-sm hover:text-brand-500 transition-colors w-fit"
            >
              deprescan@gmail.com
            </a>
          </address>

          {/* Menu */}
          <nav aria-label="Footer menu" className="flex flex-col gap-1.5">
            <h3 className="font-sans font-bold text-gray-600 text-base mb-2">
              Menu
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Beranda', to: '/' },
                { label: 'Riwayat', to: '/riwayat' },
                { label: 'Tentang', to: '/tentang' },
                { label: 'Mulai Screening', to: '/screening' },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="text-gray-500 text-sm hover:text-brand-500 transition-colors w-fit"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-5 text-center">
          <p className="text-gray-400 text-xs">Copyright © 2026 Deprescan</p>
        </div>
      </div>
    </footer>
  );
}
