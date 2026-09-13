import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Map,
  HelpCircle,
  Scale,
  Heart,
  Sparkles,
  Menu,
  X,
  Search,
  Music,
  Gamepad2,
  Trophy,
} from 'lucide-react';
import { SurpriseMeModal } from './SurpriseMeModal.tsx';
import { useFavorites } from '../hooks/useFavorites.ts';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [surpriseModalOpen, setSurpriseModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/instruments?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Compass },
    { to: '/village', label: '3D Village', icon: Sparkles, badge: 'STORY' },
    { to: '/instruments', label: 'Explore', icon: Music },
    { to: '/games', label: 'Games', icon: Gamepad2, badge: 'NEW' },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/map', label: 'Sound Map', icon: Map },
    { to: '/quiz', label: 'Quiz', icon: HelpCircle },
    { to: '/compare', label: 'Compare', icon: Scale },
    {
      to: '/favorites',
      label: 'Favorites',
      icon: Heart,
      badge: favorites.length > 0 ? favorites.length : undefined,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-amber-900/10 transition-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-700 via-amber-800 to-amber-950 flex items-center justify-center text-white shadow-md shadow-amber-900/15 group-hover:scale-105 transition-transform">
              <span className="font-serif font-black text-xl tracking-tight text-amber-200">
                IX
              </span>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-amber-950 block leading-none">
                Itihaas<span className="text-amber-700">X</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-widest text-amber-800/80 block mt-1 font-sans">
                Musical Heritage of India
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `relative px-3.5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-amber-800 text-white shadow-xs'
                        : 'text-stone-700 hover:text-amber-900 hover:bg-amber-100/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action Icons & Surprise Me */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Search Toggle / Inline Form */}
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search instruments..."
                  autoFocus
                  className="w-48 xl:w-60 pl-8 pr-8 py-1.5 bg-white border border-amber-300 rounded-full text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-700/20"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-2.5 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full text-stone-600 hover:text-amber-900 hover:bg-amber-100/60 transition-colors cursor-pointer"
                title="Search instruments"
                aria-label="Search instruments"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Surprise Me Button */}
            <button
              onClick={() => setSurpriseModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Surprise Me</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setSurpriseModalOpen(true)}
              className="p-2 rounded-full bg-amber-100 text-amber-900 cursor-pointer"
              title="Surprise Me"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FDFBF7] border-b border-amber-900/10 px-4 pt-2 pb-6 space-y-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search instruments or states..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-amber-800"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
            </form>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                        isActive
                          ? 'bg-amber-800 text-white'
                          : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="ml-auto px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Surprise Me Modal */}
      <SurpriseMeModal
        isOpen={surpriseModalOpen}
        onClose={() => setSurpriseModalOpen(false)}
      />
    </>
  );
};
