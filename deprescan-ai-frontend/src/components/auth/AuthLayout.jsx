import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Wrapper untuk semua halaman auth (Login, ForgotPassword, ResetPassword).

export default function AuthLayout({
  children,
  rightTitle,
  rightSubtitle = 'Hi Welcome',
  rightDesc,
  rightExtra,
}) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-10">
      {/* Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-16 w-[420px] h-[420px] rounded-full bg-brand-200 opacity-45 blur-[80px]" />
        <div className="absolute -bottom-16 -left-16 w-[340px] h-[340px] rounded-full bg-brand-200 opacity-35 blur-[90px]" />
      </div>

      <div className="relative w-full max-w-[860px]">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link to="/">
            <img
              src="/Deprescan-logo.svg"
              alt="DepreScan"
              className="h-12 w-auto"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(42,72,145,0.13)] border border-brand-100">
          {/* Konten kiri*/}
          <div className="bg-white flex flex-col px-6 py-8 md:px-10">
            {children}
          </div>

          {/* Konten kanan*/}
          <div className="hidden md:flex relative bg-brand-500 flex-col justify-between overflow-hidden px-10 py-8">
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/[0.06]" />
            <div className="absolute bottom-28 -left-10 w-44 h-44 rounded-full bg-white/[0.05]" />

            <div className="relative z-10">
              <p className="text-white/60 text-sm font-medium mb-5">
                {rightSubtitle}
              </p>
              <h2 className="font-serif text-3xl text-white leading-tight mb-4">
                {rightTitle}
              </h2>
              {rightDesc && (
                <p className="text-white/80 text-sm leading-relaxed">
                  {rightDesc}
                </p>
              )}
              {rightExtra && <div className="mt-6">{rightExtra}</div>}
            </div>

            {/* logo */}
            <div className="relative z-10 flex justify-center mt-6">
              <img
                src="/Logo-Form.svg"
                alt="Illustration"
                className="w-44 opacity-90"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  rightTitle: PropTypes.string,
  rightSubtitle: PropTypes.string,
  rightDesc: PropTypes.string,
  rightExtra: PropTypes.node,
};
