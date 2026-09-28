import React from 'react'
import { useLanguage } from '../context/LanguageContext'

const BRANDS = [
  { name: 'RAZER', slogan: 'For Gamers. By Gamers.', icon: '🐍' },
  { name: 'LOGITECH G', slogan: 'Play Advanced', icon: '🎮' },
  { name: 'STEELSERIES', slogan: 'For Glory', icon: '🎯' },
  { name: 'HYPERX', slogan: 'We’re All Gamers', icon: '⚡' },
  { name: 'ASUS ROG', slogan: 'Republic of Gamers', icon: '🔥' },
  { name: 'CORSAIR', slogan: 'Precision Gaming', icon: '⛵' },
  { name: 'EDIFIER', slogan: 'A Passion for Sound', icon: '🔊' },
  { name: 'UPGRADE PRO', slogan: 'Next Level Gear', icon: '👑' }
]

const BrandsMarquee = ({ theme = 'light' }) => {
  const { lang } = useLanguage()
  const isDark = theme === 'dark'

  return (
    <div className={`py-8 border-y overflow-hidden relative transition-colors ${
      isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200/80'
    }`}>
      {/* Side fades for infinite illusion */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white dark:from-[#090d16] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white dark:from-[#090d16] to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 font-mono">
          {lang === 'ru'
            ? 'Официальные партнеры и мировые киберспортивные бренды'
            : lang === 'en'
            ? 'Official Partners & Global Esports Brands'
            : 'Rasmiy Hamkorlar va Jahon Kibersport Brendlari'}
        </span>
      </div>

      <div className="flex animate-marquee-infinite gap-8 items-center">
        {[...BRANDS, ...BRANDS].map((brand, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all shrink-0 select-none ${
              isDark
                ? 'bg-slate-900/60 border-slate-800 hover:border-pink-500/40 text-slate-200'
                : 'bg-white border-slate-200 hover:border-pink-300 text-slate-800 shadow-xs'
            }`}
          >
            <span className="text-xl">{brand.icon}</span>
            <div>
              <div className="text-sm font-black font-heading tracking-wider">{brand.name}</div>
              <div className="text-[10px] text-slate-400 font-medium">{brand.slogan}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BrandsMarquee
