import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navLinks = [
    { label: 'Beranda', path: '/' },
    { label: 'Riwayat', path: '/riwayat' },
    { label: 'Tentang', path: '/tentang' },
  ];

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setDropdownOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="w-full border-b border-gray-200 bg-white/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-6 h-[72px] md:h-[90px] flex items-center justify-between gap-8">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <img
            src="/Deprescan-logo.svg"
            alt="DepreScan Logo"
            className="h-14 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`font-sans font-medium text-base transition-colors whitespace-nowrap ${
                isActive(item.path)
                  ? 'text-brand-500 underline underline-offset-4'
                  : 'text-gray-800 hover:text-brand-500'
              }`}
            >
              {item.label}
            </Link>
          ))}

          <Link
            to="/screening"
            className="border border-brand-500 text-brand-500 font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-600 hover:text-white transition-colors text-sm whitespace-nowrap"
          >
            Mulai Screening
          </Link>
        </nav>

        {/* Desktop profile / login */}
        <div className="hidden md:flex items-center shrink-0">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="focus:outline-none"
                aria-label="User menu"
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full border-2 border-brand-400 object-cover hover:ring-2 hover:ring-brand-300 transition-all"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-brand-500 text-white flex items-center justify-center text-sm font-bold border-2 border-brand-400 hover:ring-2 hover:ring-brand-300 transition-all cursor-pointer">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-brand-100 py-2 animate-fade-in">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-500 font-medium hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-brand-500 font-semibold text-sm hover:underline whitespace-nowrap"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-brand-50 shrink-0"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-b border-gray-200 bg-white/30 backdrop-blur-sm px-6 py-4 flex flex-col gap-3 animate-fade-in">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={`font-medium text-base ${
                isActive(item.path) ? 'text-brand-500' : 'text-gray-800'
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* CTA mobile — Link ke /screening */}
          <Link
            to="/screening"
            onClick={() => setMenuOpen(false)}
            className="self-start border border-brand-500 text-brand-500 font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-600 hover:text-white transition-colors text-sm whitespace-nowrap"
          >
            Mulai Screening
          </Link>

          <div className="pt-2 border-t border-gray-100">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full border-2 border-brand-400 object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-brand-500 text-white flex items-center justify-center text-sm font-bold">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 truncate max-w-[180px]">
                      {user.name}
                    </span>
                    <span className="text-xs text-gray-500 truncate max-w-[180px]">
                      {user.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="self-start text-red-500 font-medium text-sm"
                >
                  Keluar Sesi
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-brand-500 font-semibold text-sm"
              >
                Masuk
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}