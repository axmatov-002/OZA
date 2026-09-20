import React, { useState, useEffect, useRef } from 'react'
import logoImg from '../assets/image.png'

/* ─── Floating particle component ─── */
const Particle = ({ style }) => (
  <span className="footer-particle" style={style} />
)

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  style: {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${2 + Math.random() * 4}px`,
    height: `${2 + Math.random() * 4}px`,
    animationDelay: `${Math.random() * 6}s`,
    animationDuration: `${4 + Math.random() * 6}s`,
    opacity: 0.15 + Math.random() * 0.3,
    background: i % 3 === 0
      ? '#ec4899'
      : i % 3 === 1
      ? '#a855f7'
      : '#38bdf8',
  },
}))

/* ─── Scrolling marquee brands ─── */
const BRANDS = [
  '⌨️ Mexanik Klaviaturalar',
  '🖱️ Gaming Sichqonchalar',
  '🎧 Surround Headsetlar',
  '🖥️ Monitor Qavslar',
  '🎙️ Strim Mikrofonlari',
  '💡 Monitor Chiroqlari',
  '🎮 RGB Gilamchalar',
  '📷 4K Veb-Kameralar',
]

/* ─── Animated counter ─── */
const Counter = ({ end, suffix = '', label }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          let start = 0
          const step = Math.ceil(end / 60)
          const timer = setInterval(() => {
            start += step
            if (start >= end) { setCount(end); clearInterval(timer) }
            else setCount(start)
          }, 20)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end])

  return (
    <div ref={ref} className="text-center group">
      <div className="text-3xl sm:text-4xl font-black text-white tabular-nums group-hover:scale-110 transition-transform duration-300">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-xs text-pink-300/70 font-semibold mt-1 uppercase tracking-wider">{label}</div>
    </div>
  )
}

/* ─── Main Footer ─── */
const Footer = ({ theme = 'light' }) => {
  const isDark = theme === 'dark'
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setTimeout(() => { setSubscribed(false); setEmail('') }, 4000)
    }
  }

  const VALUE_FEATURES = [
    {
      icon: '🚚',
      title: 'Tezkor Yetkazish',
      sub: "Butun O'zbekiston bo'ylab",
      badge: '24s ichida',
      tagColor: isDark ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: isDark ? 'from-blue-500/25 to-sky-500/15 border-blue-500/30 text-blue-400' : 'from-blue-100 to-sky-50 border-blue-200/80 text-blue-600',
      cardBorder: isDark ? 'hover:border-blue-500/60' : 'hover:border-blue-300',
      hoverGlow: isDark ? 'hover:shadow-blue-500/10' : 'hover:shadow-blue-500/15',
      lineGradient: 'from-blue-500 via-sky-400 to-cyan-400',
      iconMotion: 'group-hover:translate-x-1.5 transition-transform duration-300 ease-out',
    },
    {
      icon: '🛡️',
      title: '2 Yillik Kafolat',
      sub: '100% original uskunalar',
      badge: 'Rasmiy kafolat',
      tagColor: isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconBg: isDark ? 'from-emerald-500/25 to-teal-500/15 border-emerald-500/30 text-emerald-400' : 'from-emerald-100 to-teal-50 border-emerald-200/80 text-emerald-600',
      cardBorder: isDark ? 'hover:border-emerald-500/60' : 'hover:border-emerald-300',
      hoverGlow: isDark ? 'hover:shadow-emerald-500/10' : 'hover:shadow-emerald-500/15',
      lineGradient: 'from-emerald-500 via-teal-400 to-green-400',
      iconMotion: 'group-hover:scale-120 transition-transform duration-300 ease-out',
    },
    {
      icon: '💳',
      title: "Qulay To'lov",
      sub: 'Click, Payme, Uzum Nasiya',
      badge: "0% Bo'lib to'lash",
      tagColor: isDark ? 'bg-violet-500/20 text-violet-300 border-violet-500/30' : 'bg-violet-50 text-violet-700 border-violet-200',
      iconBg: isDark ? 'from-violet-500/25 to-purple-500/15 border-violet-500/30 text-violet-400' : 'from-violet-100 to-purple-50 border-violet-200/80 text-violet-600',
      cardBorder: isDark ? 'hover:border-violet-500/60' : 'hover:border-violet-300',
      hoverGlow: isDark ? 'hover:shadow-violet-500/10' : 'hover:shadow-violet-500/15',
      lineGradient: 'from-violet-500 via-purple-400 to-indigo-400',
      iconMotion: 'group-hover:-rotate-6 group-hover:scale-110 transition-transform duration-300 ease-out',
    },
    {
      icon: '🔄',
      title: '14 Kun Almashtirish',
      sub: 'Xavfsiz xarid kafolati',
      badge: '100% Xavfsiz',
      tagColor: isDark ? 'bg-pink-500/20 text-pink-300 border-pink-500/30' : 'bg-pink-50 text-pink-700 border-pink-200',
      iconBg: isDark ? 'from-pink-500/25 to-rose-500/15 border-pink-500/30 text-pink-400' : 'from-pink-100 to-rose-50 border-pink-200/80 text-pink-600',
      cardBorder: isDark ? 'hover:border-pink-500/60' : 'hover:border-pink-300',
      hoverGlow: isDark ? 'hover:shadow-pink-500/10' : 'hover:shadow-pink-500/15',
      lineGradient: 'from-pink-500 via-rose-400 to-fuchsia-400',
      iconMotion: 'group-hover:rotate-180 transition-transform duration-700 ease-out',
    },
  ]

  return (
    <footer className="relative overflow-hidden">

      {/* ══════════════════════════════════════════
          TOP VALUE BANNER — animated shimmer cards
      ══════════════════════════════════════════ */}
      <div className={`relative border-t overflow-hidden transition-colors duration-300 ${
        isDark 
          ? 'bg-[#0b0f19] border-slate-800/80' 
          : 'bg-gradient-to-b from-slate-50/90 via-white to-slate-50/50 border-slate-200/70'
      }`}>
        {/* Soft atmospheric ambient light glows */}
        <div className="absolute top-0 left-1/4 w-80 h-28 bg-pink-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-28 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {VALUE_FEATURES.map((item, i) => (
              <div
                key={i}
                className={`group relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-300 
                  hover:-translate-y-1.5 hover:shadow-xl ${item.hoverGlow}
                  border ${item.cardBorder}
                  ${isDark 
                    ? 'bg-slate-900/90 border-slate-800/90 shadow-md shadow-black/40' 
                    : 'bg-white/95 border-slate-200/80 shadow-sm shadow-slate-200/60 hover:bg-white'}
                `}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Light shine beam swept across on hover */}
                <div className="feature-shine-beam" />

                {/* Subtle corner glow on hover */}
                <div
                  className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br ${item.lineGradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 pointer-events-none`}
                />

                <div className="relative flex items-center sm:items-start gap-3.5 sm:gap-4 z-10">
                  {/* Animated Icon Pedestal */}
                  <div
                    className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center shrink-0 border bg-gradient-to-br ${item.iconBg} shadow-inner transition-all duration-300 group-hover:scale-105 group-hover:shadow-md`}
                  >
                    <span className={`text-2xl sm:text-3xl select-none inline-block ${item.iconMotion}`}>
                      {item.icon}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <h4 className={`text-sm sm:text-base font-extrabold tracking-tight transition-colors duration-200 ${
                        isDark ? 'text-white group-hover:text-pink-300' : 'text-slate-900 group-hover:text-pink-600'
                      }`}>
                        {item.title}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border tracking-wide uppercase ${item.tagColor}`}>
                        {item.badge}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed font-medium transition-colors ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {item.sub}
                    </p>
                  </div>
                </div>

                {/* Bottom animated accent highlight line */}
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full w-10 group-hover:w-full bg-gradient-to-r ${item.lineGradient} transition-all duration-500 ease-out`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MARQUEE SCROLLING STRIP
      ══════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 py-3 overflow-hidden">
        <div className="footer-marquee flex gap-10 whitespace-nowrap">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span key={i} className="text-white/90 text-xs font-bold tracking-wide flex-shrink-0">
              {b} <span className="text-pink-200 mx-2">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          DARK MAIN FOOTER BODY
      ══════════════════════════════════════════ */}
      <div className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-[#0b0f1a] text-slate-300">

        {/* Ambient glow orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-600/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-600/8 rounded-full blur-[100px] pointer-events-none" />

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {PARTICLES.map((p) => (
            <Particle key={p.id} style={p.style} />
          ))}
        </div>

        {/* ── Stats bar ── */}
        <div className="relative border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <Counter end={50000} suffix="+" label="Mamnun Mijoz" />
              <Counter end={20} suffix="+" label="Mahsulot Toifa" />
              <Counter end={2} suffix=" YIL" label="To'liq Kafolat" />
              <Counter end={99} suffix="%" label="Ijobiy Sharh" />
            </div>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

            {/* Brand column */}
            <div className="lg:col-span-2 space-y-5">
              <a href="#" className="inline-block group">
                <div className="bg-white/95 hover:bg-white px-3 py-2 rounded-2xl inline-block shadow-lg shadow-pink-500/10 transition-all duration-300 group-hover:scale-105">
                  <img
                    src={logoImg}
                    alt="ORA"
                    className="h-10 sm:h-11 w-auto object-contain"
                  />
                </div>
              </a>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                O'zbekistondagi eng zamonaviy kompyuter aksessuarlari va geyming jihozlari do'koni.
                Ish va o'yin uchun eng sara uskunalar.
              </p>

              <div className="space-y-2 text-sm text-slate-400">
                <p className="flex items-center gap-2 hover:text-pink-400 transition-colors cursor-default">
                  <span className="text-pink-500">📍</span>
                  <span>Toshkent sh., Chilonzor tumani, 9-mavze, 14-uy</span>
                </p>
                <p className="flex items-center gap-2 hover:text-pink-400 transition-colors cursor-default">
                  <span className="text-pink-500">📞</span>
                  <span>+998 (71) 200-00-55</span>
                </p>
                <p className="flex items-center gap-2 hover:text-pink-400 transition-colors cursor-default">
                  <span className="text-pink-500">⏰</span>
                  <span>Har kuni 09:00 — 21:00</span>
                </p>
              </div>

              {/* Newsletter */}
              <div className="pt-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  🔔 Aksiya & Chegirmalar:
                </div>
                {subscribed ? (
                  <div className="text-xs font-bold text-emerald-400 bg-emerald-400/10 py-2.5 px-4 rounded-xl border border-emerald-400/20 inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Rahmat! Siz obuna bo'ldingiz.
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                    <input
                      type="email"
                      required
                      placeholder="Email manzilingiz..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-white/10 focus:outline-none focus:border-pink-500 bg-white/5 text-white placeholder-slate-500 transition-colors"
                    />
                    <button
                      type="submit"
                      className="btn-pink px-4 py-2.5 rounded-xl text-xs font-bold shrink-0"
                    >
                      Obuna
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Katalog links */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold text-white tracking-widest uppercase flex items-center gap-2">
                <span className="w-5 h-0.5 bg-pink-500 rounded-full" />
                Katalog
              </h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  'Mexanik Klaviaturalar',
                  'Geymer Sichqonchalari',
                  '7.1 Surround Headsetlar',
                  'RGB Katta Gilamchalar',
                  'Strim Mikrofonlari',
                  'Monitor Arm & Qavslar',
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#catalog"
                      className="text-slate-400 hover:text-pink-400 transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-pink-600/50 group-hover:bg-pink-400 group-hover:scale-150 transition-all" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Xaridorlarga links */}
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold text-white tracking-widest uppercase flex items-center gap-2">
                <span className="w-5 h-0.5 bg-pink-500 rounded-full" />
                Xaridorlarga
              </h4>
              <ul className="space-y-2.5 text-sm">
                {[
                  'Yetkazib berish shartlari',
                  'Kafolat va servis markazi',
                  "Bo'lib to'lash (Uzum Nasiya)",
                  'Mijozlar sharhlari',
                  'Tez-tez beriladigan savollar',
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#benefits"
                      className="text-slate-400 hover:text-pink-400 transition-colors duration-200 flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-pink-600/50 group-hover:bg-pink-400 group-hover:scale-150 transition-all" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social + Payment */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-white tracking-widest uppercase flex items-center gap-2">
                  <span className="w-5 h-0.5 bg-pink-500 rounded-full" />
                  Ijtimoiy Tarmoqlar
                </h4>
                <div className="flex items-center gap-2.5">
                  {[
                    { icon: '✈️', label: 'Telegram', href: 'https://t.me', color: 'hover:bg-sky-500' },
                    { icon: '📷', label: 'Instagram', href: 'https://instagram.com', color: 'hover:bg-gradient-to-br hover:from-pink-500 hover:to-orange-400' },
                    { icon: '▶️', label: 'YouTube', href: 'https://youtube.com', color: 'hover:bg-red-600' },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      title={s.label}
                      className={`w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center text-sm ${s.color} hover:border-transparent transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/20`}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-white tracking-widest uppercase flex items-center gap-2">
                  <span className="w-5 h-0.5 bg-pink-500 rounded-full" />
                  To'lov Usullari
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['Payme', 'Click', 'Uzum', 'Visa', 'Naqd'].map((p) => (
                    <span
                      key={p}
                      className="footer-payment-badge text-xs font-bold text-slate-300 border border-white/10 bg-white/5 px-3 py-1.5 rounded-lg hover:border-pink-500/50 hover:text-pink-400 hover:bg-pink-500/5 transition-all duration-200 cursor-default"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Live indicator */}
              <div className="flex items-center gap-2.5 bg-emerald-400/8 border border-emerald-400/15 rounded-xl px-3 py-2.5">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-xs text-emerald-400 font-semibold">Do'kon ochiq — 09:00 / 21:00</span>
              </div>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="pt-10 mt-10 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-600 animate-pulse" />
              © {currentYear} UPGRADE Aksessuarlar. Barcha huquqlar himoyalangan.
            </div>
            <div className="flex items-center gap-4">
              <span className="hover:text-pink-400 transition-colors cursor-pointer">Maxfiylik siyosati</span>
              <span className="text-white/10">•</span>
              <span className="hover:text-pink-400 transition-colors cursor-pointer">Foydalanish qoidalari</span>
              <span className="text-white/10">•</span>
              <span className="footer-love text-pink-500 font-bold">Made with ❤️ for gamers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
