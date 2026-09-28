import React from 'react'
import { useLanguage } from '../context/LanguageContext'

const LANGUAGES = [
  { code: 'uz', label: 'UZB', full: "O'zbekcha" },
  { code: 'ru', label: 'RUS', full: 'Русский' },
  { code: 'en', label: 'ENG', full: 'English' }
]

const LanguageSwitcher = ({ theme = 'light', isMobile = false }) => {
  const { lang, setLang } = useLanguage()
  const isDark = theme === 'dark'

  if (isMobile) {
    return (
      <div className={`p-3 rounded-2xl border mb-2 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            🌐 Til / Язык / Language:
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {LANGUAGES.map((item) => {
            const active = lang === item.code
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => setLang(item.code)}
                className={`py-2 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center transition-all cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-md shadow-pink-500/30 scale-[1.02]'
                    : isDark
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // Desktop Pill Switcher
  return (
    <div
      className={`inline-flex items-center p-0.5 sm:p-1 rounded-2xl border transition-all ${
        isDark
          ? 'bg-slate-900/90 border-slate-800/90 shadow-xs'
          : 'bg-slate-100/90 border-slate-200/90 shadow-xs'
      }`}
      role="group"
      aria-label="Language selector"
    >
      {LANGUAGES.map((item) => {
        const active = lang === item.code
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLang(item.code)}
            title={item.full}
            className={`relative px-2 sm:px-2.5 py-1 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center justify-center cursor-pointer ${
              active
                ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-sm shadow-pink-500/40 scale-[1.02]'
                : isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span className="tracking-wide">{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default LanguageSwitcher
