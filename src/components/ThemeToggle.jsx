import React from 'react'
import { useLanguage } from '../context/LanguageContext'

/**
 * Modern, Cyber-Glassmorphic Theme Toggle Button
 * Features:
 * - Glowing icon capsule with dynamic aura
 * - Rotating SVG Sun / rocking Crescent Moon
 * - Smooth light sweep effect on hover
 * - Pulsing neon indicator dot
 * - Interactive active click feedback
 */
const ThemeToggle = ({ theme = 'light', onSetTheme, className = '' }) => {
  const { t } = useLanguage()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={() => onSetTheme && onSetTheme(isDark ? 'light' : 'dark')}
      className={`group relative inline-flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1 rounded-2xl border transition-all duration-300 cursor-pointer active:scale-95 overflow-hidden select-none shadow-xs hover:scale-[1.03] ${
        isDark
          ? 'bg-gradient-to-r from-slate-900/95 via-slate-800/90 to-slate-900/95 border-amber-500/30 text-amber-300 hover:border-amber-400/70 hover:shadow-lg hover:shadow-amber-500/20'
          : 'bg-gradient-to-r from-white/95 via-slate-50/90 to-indigo-50/40 border-slate-200/90 text-slate-700 hover:text-slate-900 hover:border-indigo-400/60 hover:shadow-lg hover:shadow-indigo-500/15'
      } ${className}`}
      title={isDark ? "Kunduzgi (Oq) rejimga o'tish" : "Tungi (Qora) rejimga o'tish"}
      aria-label="Mavzuni almashtirish"
    >
      {/* Light sweep animation on hover */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 dark:via-white/10 to-transparent pointer-events-none" />

      {/* Icon Capsule with ambient neon glow */}
      <span
        className={`relative w-6 h-6 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 ${
          isDark
            ? 'bg-gradient-to-tr from-amber-500/20 to-yellow-400/20 text-amber-300 ring-1 ring-amber-400/40 shadow-[0_0_10px_rgba(251,191,36,0.35)] group-hover:shadow-[0_0_14px_rgba(251,191,36,0.55)]'
            : 'bg-gradient-to-tr from-indigo-500/15 to-purple-500/15 text-indigo-600 ring-1 ring-indigo-400/40 shadow-[0_0_10px_rgba(99,102,241,0.25)] group-hover:shadow-[0_0_14px_rgba(99,102,241,0.45)]'
        }`}
      >
        {isDark ? (
          // Radiant Sun SVG with rotating rays on hover
          <svg
            className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-90"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.25" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        ) : (
          // Crescent Moon SVG with starry tilt
          <svg
            className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-105"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </span>

      {/* Label Text */}
      <span className="text-xs font-black tracking-wide">
        {isDark ? t('nav_theme_light', 'Oq') : t('nav_theme_dark', 'Qora')}
      </span>

      {/* Pulsing Status Dot */}
      <span
        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
          isDark
            ? 'bg-amber-400 shadow-[0_0_6px_#fbbf24] animate-pulse'
            : 'bg-indigo-500 shadow-[0_0_6px_#6366f1]'
        }`}
      />
    </button>
  )
}

export default ThemeToggle
