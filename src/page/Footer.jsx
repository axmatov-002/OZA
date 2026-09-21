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

  return (
    <footer className="relative overflow-hidden">
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
