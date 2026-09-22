import React, { useState, useEffect } from 'react'
import logoImg from '../assets/image.png'

const Header = ({
  totalItems = 0,
  onOpenCart,
  onOpenSearch,
  currentUser,
  onLogout,
  onOpenAuthModal,
  onSwitchRole,
  onOpenOrders,
  theme = 'light',
  onSetTheme
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isDark = theme === 'dark'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Global keyboard shortcut (Ctrl+K or / to search)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onOpenSearch && onOpenSearch()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onOpenSearch])

  const navLinks = [
    { name: 'Katalog',     href: '#catalog',   icon: '🗂️' },
    { name: 'Ommabop',     href: '#featured',  icon: '🔥' },
    { name: 'Afzalliklar', href: '#benefits',  icon: '✨' },
    { name: 'Sharhlar',    href: '#reviews',   icon: '⭐' },
    { name: 'Aloqa',       href: '#contact',   icon: '📞' },
  ]

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? isDark
            ? 'bg-[#090d16]/90 backdrop-blur-xl shadow-lg shadow-black/40 border-b border-slate-800'
            : 'bg-white/90 backdrop-blur-xl shadow-lg shadow-slate-200/60 border-b border-slate-200/70'
          : isDark
          ? 'bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800/80'
          : 'bg-white/95 backdrop-blur-md border-b border-slate-100'
      }`}
    >
      {/* ── Thin animated gradient line at very top ── */}
      <div className="h-[3px] w-full bg-gradient-to-r from-pink-500 via-violet-500 via-sky-400 to-pink-500 background-size-200 header-gradient-line" />

      {/* ── Main Navbar ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300 ${scrolled ? 'h-14' : 'h-16 sm:h-20'}`}>

          {/* Logo */}
          <a href="#" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="relative">
              <img
                src={logoImg}
                alt="UPGRADE Aksessuarlar"
                className={`w-auto object-contain transition-all duration-300 group-hover:scale-105 ${
                  scrolled ? 'h-8 sm:h-9' : 'h-9 sm:h-11'
                }`}
              />
              {/* Glow under logo on hover */}
              <div className="absolute -inset-2 rounded-xl bg-pink-400/0 group-hover:bg-pink-400/10 transition-all duration-300 blur-md -z-10" />
            </div>
            <div className={`hidden 2xl:flex flex-col border-l pl-3 ml-1 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest leading-none">
                Aksessuarlar
              </span>
              <span className="text-[9px] text-slate-400 font-medium tracking-wide">
                Gaming · Pro · RGB
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links (xl+) */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`relative px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 group ${
                  isDark
                    ? 'text-slate-300 hover:text-pink-400 hover:bg-slate-800/60'
                    : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50/80'
                }`}
              >
                {link.name}
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-pink-500 rounded-full group-hover:w-4/5 transition-all duration-300" />
              </a>
            ))}

            <button
              onClick={onOpenOrders}
              className={`relative px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 flex items-center gap-1.5 group cursor-pointer ${
                isDark
                  ? 'text-slate-300 hover:text-pink-400 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50/80'
              }`}
            >
              <span>📦</span>
              <span>Buyurtmalarim</span>
              <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-pink-500 rounded-full group-hover:w-4/5 transition-all duration-300" />
            </button>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">

            {/* Quick Search Button */}
            <button
              onClick={onOpenSearch}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800 shadow-xs'
                  : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 border-slate-200/80 shadow-xs'
              }`}
              title="Aksessuarlarni qidirish (Ctrl + K)"
            >
              <svg className="w-4 h-4 text-pink-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden md:inline text-xs sm:text-sm">Qidirish</span>
              <kbd className={`hidden 2xl:inline-block px-1.5 py-0.5 text-[9px] font-mono font-bold rounded-md border ${
                isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-slate-400 border-slate-200'
              }`}>
                Ctrl K
              </kbd>
            </button>

            {/* Oq / Qora Theme Toggle Switcher */}
            <button
              type="button"
              onClick={() => onSetTheme && onSetTheme(isDark ? 'light' : 'dark')}
              className={`p-2 sm:px-2.5 sm:py-1.5 rounded-2xl border transition-all flex items-center gap-1.5 cursor-pointer text-xs font-bold ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-yellow-400 hover:bg-slate-800'
                  : 'bg-slate-100/90 border-slate-200/80 text-slate-700 hover:bg-slate-200/80'
              }`}
              title={isDark ? "Kunduzgi (Oq) rejimga o'tish" : "Tungi (Qora) rejimga o'tish"}
              aria-label="Mavzuni almashtirish"
            >
              <span className="text-sm select-none">{isDark ? '☀️' : '🌙'}</span>
              <span className="hidden 2xl:inline">{isDark ? 'Oq' : 'Qora'}</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className={`relative px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 border transition-all active:scale-95 cursor-pointer shrink-0 ${
                isDark
                  ? 'bg-pink-950/40 hover:bg-pink-950/70 text-pink-300 border-pink-800/40 hover:shadow-md hover:shadow-pink-950/40'
                  : 'bg-pink-50 hover:bg-pink-100/80 text-pink-600 border-pink-200/80 hover:shadow-md hover:shadow-pink-100'
              }`}
              aria-label="Savatchani ochish"
            >
              <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-pink-500 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="hidden sm:inline font-bold">Savat</span>
              {totalItems > 0 && (
                <span className="w-5 h-5 rounded-full bg-pink-600 text-white text-[10px] flex items-center justify-center font-black shadow-md shadow-pink-500/40">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Profile Chip OR Primary Login Button */}
            {currentUser ? (
              <div
                className={`flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 sm:pr-2 rounded-2xl border transition-all shrink-0 ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 text-white'
                    : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200/80 shadow-xs'
                }`}
              >
                <img
                  src={
                    currentUser.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=ec4899&color=fff&bold=true&rounded=true`
                  }
                  alt={currentUser.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover border border-pink-300 shrink-0"
                />
                <div className="hidden sm:flex flex-col text-left">
                  <span className={`text-xs font-bold leading-tight truncate max-w-[75px] md:max-w-[90px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] font-bold text-pink-600 leading-none truncate max-w-[75px] md:max-w-[90px]">
                    {currentUser.role === 'admin'
                      ? '👑 Admin'
                      : currentUser.role === 'manager'
                      ? '👔 Menejer'
                      : '🛒 Xaridor'}
                  </span>
                </div>

                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => onSwitchRole('admin')}
                    className="hidden lg:inline-flex px-2 py-1 rounded-lg text-[11px] font-bold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors cursor-pointer"
                    title="Admin boshqaruv paneliga o'tish"
                  >
                    Admin
                  </button>
                )}

                {currentUser.role === 'manager' && (
                  <button
                    onClick={() => onSwitchRole('manager')}
                    className="hidden lg:inline-flex px-2 py-1 rounded-lg text-[11px] font-bold bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 border border-purple-500/30 transition-colors cursor-pointer"
                    title="Menejer paneliga o'tish"
                  >
                    Menejer
                  </button>
                )}

                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 p-1 sm:p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer font-bold text-xs"
                  title="Hisobdan chiqish"
                >
                  <span className="text-sm">🚪</span>
                  <span className="hidden 2xl:inline text-[11px] text-rose-500">Chiqish</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="btn-pink px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md shadow-pink-500/25 hover:shadow-pink-500/40 cursor-pointer shrink-0"
              >
                <span>👤</span>
                <span className="hidden sm:inline">Kirish</span>
              </button>
            )}

            {/* Mobile / Tablet menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 sm:p-2.5 rounded-xl transition-all duration-200 xl:hidden cursor-pointer shrink-0 ${
                mobileMenuOpen
                  ? 'bg-pink-50 text-pink-600 rotate-90'
                  : isDark
                  ? 'text-slate-300 hover:bg-slate-800'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              style={{ transition: 'transform 0.3s ease, background 0.2s' }}
              aria-label="Menyu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile & Tablet Menu Drawer ── */}
      <div
        className={`xl:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-[550px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div
          className={`border-t px-4 pt-3 pb-5 space-y-2 shadow-xl ${
            isDark
              ? 'border-slate-800 bg-[#090d16]/98 text-white'
              : 'border-slate-100 bg-white/98 text-slate-900'
          }`}
        >
          {/* Quick Search in Mobile Menu */}
          <button
            onClick={() => {
              setMobileMenuOpen(false)
              onOpenSearch && onOpenSearch()
            }}
            className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left mb-3 cursor-pointer ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-pink-500/50'
                : 'bg-slate-100/90 border-slate-200 text-slate-700 hover:border-pink-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base text-pink-500">🔍</span>
              <span className="text-xs font-bold">Aksessuarlarni qidirish...</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-pink-500/10 text-pink-500">
              Qidiruv
            </span>
          </button>
          {/* User profile inside mobile menu */}
          {currentUser ? (
            <div
              className={`flex items-center justify-between p-3 rounded-2xl border mb-2 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-xl object-cover border border-pink-200"
                />
                <div>
                  <div className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {currentUser.name}
                  </div>
                  <div className="text-xs font-semibold text-pink-600">
                    {currentUser.role === 'admin'
                      ? '👑 Admin'
                      : currentUser.role === 'manager'
                      ? '👔 Menejer'
                      : '🛒 Xaridor'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      onSwitchRole('admin')
                    }}
                    className="px-2.5 py-1 text-xs font-bold bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/30"
                  >
                    Admin
                  </button>
                )}
                {currentUser.role === 'manager' && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      onSwitchRole('manager')
                    }}
                    className="px-2.5 py-1 text-xs font-bold bg-purple-500/10 text-purple-300 rounded-lg border border-purple-500/30"
                  >
                    Menejer
                  </button>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onLogout()
                  }}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl font-bold text-xs border border-rose-200 flex items-center gap-1 cursor-pointer"
                  title="Chiqish"
                >
                  <span>🚪</span> Chiqish
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                onOpenAuthModal()
              }}
              className="w-full mb-2 btn-pink py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>👤</span>
              <span>Kirish / Ro'yxatdan o'tish</span>
            </button>
          )}

          {/* Mobile Theme Toggle */}
          <div
            className={`flex items-center justify-between p-3 rounded-2xl border mb-2 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Fon rejimi:
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onSetTheme && onSetTheme('light')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  !isDark
                    ? 'bg-white text-pink-600 shadow-sm font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ☀️ Oq
              </button>
              <button
                type="button"
                onClick={() => onSetTheme && onSetTheme('dark')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isDark
                    ? 'bg-slate-800 text-pink-400 shadow-sm font-black'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                🌙 Qora
              </button>
            </div>
          </div>

          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                isDark
                  ? 'text-slate-200 hover:bg-slate-800 hover:text-pink-400'
                  : 'text-slate-700 hover:bg-pink-50 hover:text-pink-600'
              }`}
            >
              <span className="text-base">{link.icon}</span>
              {link.name}
            </a>
          ))}

          <button
            onClick={() => {
              setMobileMenuOpen(false)
              onOpenOrders()
            }}
            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${
              isDark
                ? 'text-slate-200 hover:bg-slate-800 hover:text-pink-400'
                : 'text-slate-700 hover:bg-pink-50 hover:text-pink-600'
            }`}
          >
            <span className="text-base">📦</span>
            Mening Buyurtmalarim
          </button>

          <div className={`pt-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                onOpenCart()
              }}
              className="w-full btn-pink py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Savatni Ko'rish ({totalItems})
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
