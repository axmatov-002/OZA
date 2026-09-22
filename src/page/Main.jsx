import React, { useState, useEffect, useMemo, memo } from 'react'
import heroVideo from '../assets/manshu_yerne_o_zgartir_va_na.mp4'
import logoImg from '../assets/image.png'
import reklamaBanner from '../assets/reklama_banner.jpg'
import ProductSlider from './ProductSlider'
import BannerSwiper from './BannerSwiper'

// High-Performance Independent Countdown Timer Component
// Does not trigger re-render of the parent Main component!
const PromoCountdownTimer = memo(() => {
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 35, seconds: 48 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 }
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        if (prev.days > 0) return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        return { days: 2, hours: 14, minutes: 35, seconds: 59 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-black/60 border border-white/15 p-4 rounded-2xl backdrop-blur-xl inline-block max-w-md w-full shadow-xl">
      <div className="flex items-center justify-between text-xs text-pink-300 font-black mb-2.5">
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
          Aksiya yakunlanishiga qoldi:
        </span>
        <span className="text-[11px] text-amber-400 font-extrabold">Cheklangan: faqat 7 ta</span>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-white/10 border border-white/15 rounded-xl py-2.5">
          <div className="text-xl sm:text-2xl font-black text-white font-mono">{String(timeLeft.days).padStart(2, '0')}</div>
          <div className="text-[9px] uppercase tracking-wider text-slate-300 font-bold">Kun</div>
        </div>
        <div className="bg-white/10 border border-white/15 rounded-xl py-2.5">
          <div className="text-xl sm:text-2xl font-black text-white font-mono">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="text-[9px] uppercase tracking-wider text-slate-300 font-bold">Soat</div>
        </div>
        <div className="bg-white/10 border border-white/15 rounded-xl py-2.5">
          <div className="text-xl sm:text-2xl font-black text-white font-mono">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="text-[9px] uppercase tracking-wider text-slate-300 font-bold">Daqiqa</div>
        </div>
        <div className="bg-pink-600/40 border border-pink-500/60 rounded-xl py-2.5 shadow-inner">
          <div className="text-xl sm:text-2xl font-black text-pink-300 font-mono animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="text-[9px] uppercase tracking-wider text-pink-200 font-bold">Soniya</div>
        </div>
      </div>
    </div>
  )
})

// Isolated Live Purchase Ticker (Doesn't re-render entire page)
const LivePurchaseTicker = memo(() => {
  const [liveSale, setLiveSale] = useState(null)
  const [hideLiveSale, setHideLiveSale] = useState(false)

  useEffect(() => {
    if (hideLiveSale) return
    const fakeSales = [
      { name: 'Sarvarbek', city: 'Toshkent', item: 'CyberBlade Pro RGB Klaviatura', time: '1 daqiqa oldin', icon: '⌨️' },
      { name: 'Jasur', city: 'Samarqand', item: 'Phantom V3 26000 DPI Sichqoncha', time: 'Hozirgina', icon: '🖱️' },
      { name: 'Malika', city: "Farg'ona", item: 'ApexSound 7.1 Fazoviy Naushnik', time: '3 daqiqa oldin', icon: '🎧' },
      { name: 'Aziz', city: 'Buxoro', item: 'PRO Kiber Gaming 4-in-1 Komplekt', time: '5 daqiqa oldin', icon: '🔥' }
    ]
    let idx = 0
    const interval = setInterval(() => {
      setLiveSale(fakeSales[idx % fakeSales.length])
      idx++
      setTimeout(() => setLiveSale(null), 4500)
    }, 12000)

    const initialTimeout = setTimeout(() => {
      setLiveSale(fakeSales[0])
      setTimeout(() => setLiveSale(null), 4500)
    }, 3500)

    return () => {
      clearInterval(interval)
      clearTimeout(initialTimeout)
    }
  }, [hideLiveSale])

  if (!liveSale || hideLiveSale) return null

  return (
    <div className="fixed bottom-5 left-5 z-40 max-w-sm animate-live-ticker hidden sm:flex items-center gap-3 p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-pink-500/30 shadow-2xl shadow-pink-500/20 text-slate-900 dark:text-white">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center text-lg shrink-0 shadow-md">
        {liveSale.icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-pink-600 dark:text-pink-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Yangi xarid amalga oshirildi!</span>
        </div>
        <p className="text-xs font-bold truncate mt-0.5">
          <span className="text-slate-900 dark:text-white">{liveSale.name}</span> ({liveSale.city}): {liveSale.item}
        </p>
        <span className="text-[10px] text-slate-400 font-medium">{liveSale.time}</span>
      </div>
      <button
        onClick={() => setHideLiveSale(true)}
        className="text-slate-400 hover:text-slate-600 p-1 text-xs cursor-pointer ml-1"
        title="Yopish"
      >
        ✕
      </button>
    </div>
  )
})

const Main = ({
  products = [],
  onAddToCart,
  onAddConsultation,
  theme = 'light',
  activeModalProduct: externalActiveModalProduct,
  setActiveModalProduct: externalSetActiveModalProduct
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Barchasi')
  const [searchQuery, setSearchQuery] = useState('')
  const [catalogSort, setCatalogSort] = useState('default')
  const [localActiveModalProduct, setLocalActiveModalProduct] = useState(null)
  const activeModalProduct = externalActiveModalProduct !== undefined ? externalActiveModalProduct : localActiveModalProduct
  const setActiveModalProduct = externalSetActiveModalProduct || setLocalActiveModalProduct
  const [leadForm, setLeadForm] = useState({ name: '', phone: '' })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [promoCopied, setPromoCopied] = useState(false)
  const [bundleAdded, setBundleAdded] = useState(false)

  const handleCopyPromo = () => {
    navigator.clipboard?.writeText('UPGRADE2026')
    setPromoCopied(true)
    setTimeout(() => setPromoCopied(false), 2500)
  }

  const handleAddBundleToCart = () => {
    onAddToCart({
      id: `bundle-promo-4in1`,
      name: 'PRO Cyber Gaming 4-in-1 Komplekt (Aksiya)',
      price: "1 390 000 so'm",
      priceNum: 1390000,
      image: reklamaBanner,
      category: 'Klaviaturalar',
      badge: '-35% AKSIYA',
      stock: 7
    })
    setBundleAdded(true)
    setTimeout(() => setBundleAdded(false), 2000)
  }

  const isDark = theme === 'dark'

  const categories = useMemo(() => [
    { name: 'Barchasi', icon: '⚡' },
    { name: 'Klaviaturalar', icon: '⌨️' },
    { name: 'Sichqonchalar', icon: '🖱️' },
    { name: 'Naushniklar', icon: '🎧' },
    { name: 'RGB Gilamchalar', icon: '🌈' },
    { name: 'Stol & Qavslar', icon: '🪑' },
    { name: 'Strim & Audio', icon: '🎙️' }
  ], [])

  // Optimized Filter and Sort with useMemo (Eliminates redundant CPU loops!)
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let result = products.filter((p) => {
      const matchesCategory = selectedCategory === 'Barchasi' || p.category === selectedCategory
      if (!matchesCategory) return false
      if (!q) return true
      return (
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      )
    })

    if (catalogSort === 'price-asc') {
      result = [...result].sort((a, b) => (a.priceNum || 0) - (b.priceNum || 0))
    } else if (catalogSort === 'price-desc') {
      result = [...result].sort((a, b) => (b.priceNum || 0) - (a.priceNum || 0))
    } else if (catalogSort === 'rating') {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    return result
  }, [products, selectedCategory, searchQuery, catalogSort])

  // Featured products memoized
  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.badge === 'Bestseller' || p.badge === 'Yangi' || (p.rating || 0) >= 4.8).slice(0, 8)
  }, [products])

  const handleLeadSubmit = (e) => {
    e.preventDefault()
    if (leadForm.name && leadForm.phone) {
      if (onAddConsultation) {
        onAddConsultation({
          id: `cs-${Date.now()}`,
          name: leadForm.name,
          phone: leadForm.phone,
          status: 'Yangi',
          createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
        })
      }
      setFormSubmitted(true)
      setTimeout(() => {
        setFormSubmitted(false)
        setLeadForm({ name: '', phone: '' })
      }, 5000)
    }
  }

  return (
    <div className={`transition-colors duration-300 relative ${isDark ? 'bg-[#090d16] text-slate-100' : 'bg-white text-slate-900'}`}>
      
      {/* Live purchase ticker (Self-contained) */}
      <LivePurchaseTicker />

      {/* ========================================================= */}
      {/* 1. HERO SECTION                                           */}
      {/* ========================================================= */}
      <section
        className={`relative overflow-hidden pt-8 pb-16 sm:pt-16 sm:pb-28 border-b transition-colors duration-300 ${
          isDark
            ? 'bg-gradient-to-b from-[#0f172a] via-[#090d16] to-[#090d16] border-slate-800/80'
            : 'bg-aurora-mesh border-slate-100'
        }`}
      >
        {/* Floating Neon Lights */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[300px] bg-pink-500/15 dark:bg-pink-600/20 rounded-full blur-[130px] pointer-events-none -z-10 animate-float-gentle" />
        <div className="absolute top-28 right-10 w-[450px] h-[350px] bg-purple-500/15 dark:bg-purple-600/20 rounded-full blur-[140px] pointer-events-none -z-10 animate-float-reverse" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold mb-6 shadow-sm border transition-transform hover:scale-105 ${
                  isDark
                    ? 'bg-pink-950/70 border-pink-700/60 text-pink-300 shadow-pink-950/50'
                    : 'bg-white/90 border-pink-200 text-pink-700 shadow-pink-100 backdrop-blur-md'
                }`}
              >
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-600"></span>
                </span>
                <span className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent font-black">
                  🔥 2026 PRO GAMING & SETUP LINEUP
                </span>
                <span className="hidden sm:inline text-[10px] bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300 px-2 py-0.5 rounded-full font-black">
                  NEW
                </span>
              </div>

              <h1
                className={`text-4xl sm:text-6xl lg:text-[4.2rem] font-black tracking-tight mb-6 leading-[1.1] ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Kompyuteringiz Uchun Eng Kuchli Aksessuarlar Bilan{' '}
                <span className="text-gradient-animated inline-block transform hover:scale-105 transition-transform cursor-pointer">
                  UPGRADE
                </span>{' '}
                Qiling
              </h1>

              <p
                className={`text-base sm:text-lg mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Yuqori sezuvchan mexanik klaviaturalar, ultra-yengil kiber sport sichqonchalari, 7.1 fazoviy naushniklar va professional ish stoli aksessuarlari. Butun O'zbekiston bo'yicha 24 soatda tezkor yetkazib berish va 2 yil rasmiy kafolat.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href="#catalog"
                  className="w-full sm:w-auto btn-pink btn-vauu-shine px-8 py-4 rounded-2xl text-base font-black shadow-xl shadow-pink-500/30 flex items-center justify-center gap-2.5 group cursor-pointer"
                >
                  <span>🛒 Aksessuarlar Katalogi</span>
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
                <a
                  href="#featured"
                  className={`w-full sm:w-auto px-7 py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md ${
                    isDark
                      ? 'bg-slate-900/90 hover:bg-slate-800 text-pink-400 border border-slate-700 shadow-black/40'
                      : 'bg-white hover:bg-pink-50/70 text-slate-800 border border-pink-200/90 shadow-pink-500/10'
                  }`}
                >
                  <span className="text-pink-500">⚡</span>
                  <span>4-in-1 Super Aksiya (-35%)</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-10 mt-8 border-t border-slate-200/60 dark:border-slate-800/80 max-w-xl mx-auto lg:mx-0 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="grid grid-cols-3 gap-6 text-left">
                  <div>
                    <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>50,000+</div>
                    <div className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Mamnun mijoz</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-pink-600 dark:text-pink-400">2 YIL</div>
                    <div className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>To'liq kafolat</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>24 SOAT</div>
                    <div className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Tez yetkazish</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pl-0 sm:pl-4 sm:border-l border-slate-200 dark:border-slate-800">
                  <div className="flex -space-x-2.5 overflow-hidden">
                    <img loading="lazy" decoding="async" className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" alt="Customer" />
                    <img loading="lazy" decoding="async" className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" alt="Customer" />
                    <img loading="lazy" decoding="async" className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80" alt="Customer" />
                  </div>
                  <div className="text-left leading-tight">
                    <div className="flex items-center text-amber-400 text-xs font-bold">
                      ★★★★★ <span className="ml-1 text-slate-800 dark:text-slate-200">4.9/5</span>
                    </div>
                    <span className="text-[11px] text-slate-400">10,000+ fikr</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Showcase Video with Preload Optimization */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div
                className={`absolute w-80 h-80 rounded-full -z-10 blur-3xl ${
                  isDark ? 'bg-pink-600/25' : 'bg-pink-300/40'
                }`}
              />

              <div
                className={`relative w-full max-w-md backdrop-blur-xl rounded-3xl p-6 sm:p-7 border shadow-2xl text-center cyber-card ${
                  isDark
                    ? 'bg-[#111827]/90 border-slate-700/80 shadow-black/70'
                    : 'bg-white/90 border-slate-200 shadow-pink-500/10'
                }`}
              >
                <div className="flex items-center justify-between text-xs pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Jonli namoyish
                  </span>
                  <span className="text-[11px] font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/60 px-2 py-0.5 rounded-full">
                    ⚡ 43 kishi ko'rmoqda
                  </span>
                </div>

                {/* Optimized Video: preload="metadata" saves bandwidth & ensures instant loading */}
                <div className="relative my-2 overflow-hidden rounded-2xl shadow-2xl border-2 border-pink-500/30 bg-slate-950 group">
                  <video
                    src={heroVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-auto aspect-video object-cover rounded-2xl group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
                  
                  <span className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-md text-[10px] text-white px-2 py-0.5 rounded-md font-mono border border-white/20">
                    4K Ultra HD
                  </span>
                </div>

                {/* Floating Widgets */}
                <div
                  className={`absolute -top-5 -left-4 sm:-left-6 px-4 py-2.5 rounded-2xl border shadow-xl flex items-center gap-2.5 text-xs font-bold animate-float-gentle z-20 ${
                    isDark
                      ? 'bg-slate-900/95 border-pink-500/40 text-white shadow-pink-950/40 backdrop-blur-md'
                      : 'bg-white/95 border-pink-200 text-slate-800 shadow-slate-300 backdrop-blur-md'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 ${
                    isDark ? 'bg-pink-950 text-pink-400' : 'bg-pink-100 text-pink-600'
                  }`}>
                    ⌨️
                  </span>
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400 font-normal">Switch turi</div>
                    <div className="text-pink-600 font-black">Hot-Swap Red</div>
                  </div>
                </div>

                <div
                  className={`absolute -bottom-4 -right-3 sm:-right-6 px-4 py-2.5 rounded-2xl border shadow-xl flex items-center gap-2.5 text-xs font-bold animate-float-reverse z-20 ${
                    isDark
                      ? 'bg-slate-900/95 border-pink-500/40 text-white shadow-pink-950/40 backdrop-blur-md'
                      : 'bg-white/95 border-pink-200 text-slate-800 shadow-slate-300 backdrop-blur-md'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 ${
                    isDark ? 'bg-pink-950 text-pink-400' : 'bg-pink-100 text-pink-600'
                  }`}>
                    ⚡
                  </span>
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400 font-normal">Sezuvchanlik</div>
                    <div className="text-pink-600 font-black">26000 DPI • 1ms</div>
                  </div>
                </div>

                <div
                  className={`mt-4 pt-4 border-t flex items-center justify-between text-xs font-medium ${
                    isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
                  }`}
                >
                  <span className="flex items-center gap-1.5 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-emerald-600 dark:text-emerald-400">100% Original Sifat</span>
                  </span>
                  <span className="font-extrabold text-pink-600 dark:text-pink-400">2 Yillik Kafolat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 1.5. INTERACTIVE HERO PROMO SWIPER BANNER                 */}
      {/* ========================================================= */}
      <div className="pt-3 pb-6">
        <BannerSwiper onAddToCart={onAddToCart} />
      </div>

      {/* ========================================================= */}
      {/* 2. PRODUCT SLIDER — FEATURED & POPULAR                    */}
      {/* ========================================================= */}
      <div
        className={`border-y transition-colors duration-300 ${
          isDark
            ? 'bg-[#0b0f19] border-slate-800'
            : 'bg-gradient-to-b from-pink-50/40 via-white to-pink-50/20 border-pink-100/60'
        }`}
      >
        <ProductSlider
          products={featuredProducts}
          onAddToCart={onAddToCart}
          onOpenProduct={setActiveModalProduct}
          title="Ommabop & Trend Mahsulotlar"
          icon="🔥"
          theme={theme}
        />
      </div>

      {/* ========================================================= */}
      {/* 3. CATEGORY FILTERS & SEARCH BAR                          */}
      {/* ========================================================= */}
      <section id="catalog" className="pt-16 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800/60 text-xs font-black uppercase tracking-widest text-pink-600 dark:text-pink-400 mb-2.5">
              <span>✨</span> BIZNING TO'PLAM
            </div>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Kompyuter Aksessuarlari Katalogi
            </h2>
            <p className={`text-sm sm:text-base mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Setupingizni yangilash uchun eng sara, yuqori sifatli va sinovdan o'tgan uskunalar
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-80 group">
              <input
                type="text"
                placeholder="Aksessuar nomi yoki brendi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-9 py-3 rounded-2xl border text-sm transition-all focus:outline-hidden ${
                  isDark
                    ? 'bg-[#111827] border-slate-700 text-white placeholder:text-slate-500 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/15'
                    : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10'
                }`}
              />
              <svg className="w-4 h-4 text-pink-500 absolute left-3.5 top-3.5 group-focus-within:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-xs text-slate-400 hover:text-pink-500 font-bold p-1 cursor-pointer"
                  title="Tozalash"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <select
              value={catalogSort}
              onChange={(e) => setCatalogSort(e.target.value)}
              className={`px-4 py-3 rounded-2xl border text-xs sm:text-sm font-bold focus:outline-hidden cursor-pointer transition-all ${
                isDark
                  ? 'bg-[#111827] border-slate-700 text-slate-200 focus:border-pink-500'
                  : 'bg-white border-slate-200 text-slate-700 focus:border-pink-500 shadow-xs'
              }`}
            >
              <option value="default">📊 Saralash: Odatiy</option>
              <option value="price-asc">💵 Narx: Arzondan qimmatga</option>
              <option value="price-desc">💎 Narx: Qimmatdan arzonga</option>
              <option value="rating">⭐ Reyting: Eng yuqori</option>
            </select>
          </div>
        </div>

        {/* Results Counter & Category Pills with Icons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                  selectedCategory === cat.name
                    ? 'btn-pink shadow-lg shadow-pink-500/25 scale-[1.03]'
                    : isDark
                    ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          <div className="text-xs font-bold text-slate-500 shrink-0">
            Topildi: <span className="text-pink-600 dark:text-pink-400 font-extrabold">{filteredProducts.length} ta aksessuar</span>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. PRODUCT CARDS GRID                                     */}
      {/* ========================================================= */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {filteredProducts.length === 0 ? (
          <div
            className={`text-center py-20 rounded-3xl border ${
              isDark ? 'bg-[#111827] border-slate-800' : 'bg-slate-50 border-slate-100'
            }`}
          >
            <div className="text-5xl mb-3 animate-bounce">🔍</div>
            <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Hech qanday aksessuar topilmadi
            </h3>
            <p className="text-sm text-slate-500 mt-1 mb-5">
              Qidiruv so'zini o'zgartiring yoki boshqa toifani tanlang.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Barchasi')
                setSearchQuery('')
              }}
              className="btn-pink px-6 py-2.5 rounded-2xl text-xs font-bold cursor-pointer shadow-md"
            >
              Barcha mahsulotlarni ko'rsatish
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isLowStock = (product.stock || 10) <= 5

              return (
                <div
                  key={product.id}
                  className={`rounded-3xl border overflow-hidden flex flex-col justify-between group transition-all duration-300 cyber-card ${
                    isDark
                      ? 'bg-[#111827]/90 border-slate-800 hover:border-pink-500/60 shadow-lg shadow-black/30'
                      : 'bg-white border-slate-200/80 hover:border-pink-300 shadow-sm hover:shadow-xl hover:shadow-pink-500/10'
                  }`}
                >
                  {/* Product Image & Badges */}
                  <div
                    className={`relative aspect-[4/3] overflow-hidden cursor-pointer ${
                      isDark ? 'bg-slate-900/80' : 'bg-slate-50'
                    }`}
                    onClick={() => setActiveModalProduct(product)}
                  >
                    <img
                      loading="lazy"
                      decoding="async"
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <span className="absolute top-3 left-3 bg-gradient-to-r from-pink-600 to-rose-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                      {product.badge}
                    </span>

                    <span
                      className={`absolute bottom-3 left-3 backdrop-blur-md text-[10px] font-extrabold px-2.5 py-1 rounded-xl shadow-md border ${
                        isLowStock
                          ? 'bg-rose-500/90 text-white border-rose-400 animate-pulse'
                          : isDark
                          ? 'bg-slate-900/90 text-slate-200 border-white/10'
                          : 'bg-white/95 text-slate-800 border-slate-200'
                      }`}
                    >
                      {isLowStock ? `🔥 Faqat ${product.stock} dona qoldi!` : `Omborda: ${product.stock || 10} dona`}
                    </span>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <span
                        className={`text-xs font-black px-4 py-2 rounded-2xl shadow-xl transform group-hover:scale-105 transition-all ${
                          isDark
                            ? 'bg-slate-900/95 text-white border border-pink-500/40'
                            : 'bg-white/95 text-slate-900 border border-pink-200'
                        }`}
                      >
                        👁️ Tezkor Ko'rish
                      </span>
                    </div>
                  </div>

                  {/* Product Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span
                          className={`font-bold px-2.5 py-0.5 rounded-lg text-[11px] ${
                            isDark ? 'bg-pink-950/70 text-pink-400 border border-pink-800/40' : 'bg-pink-50 text-pink-600 border border-pink-100'
                          }`}
                        >
                          {product.category}
                        </span>
                        <div className="flex items-center gap-1 text-amber-400 font-black">
                          <span>★</span>
                          <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>{product.rating}</span>
                          <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
                        </div>
                      </div>

                      <h3
                        onClick={() => setActiveModalProduct(product)}
                        className={`font-black text-sm sm:text-base leading-snug line-clamp-2 transition-colors cursor-pointer mb-2.5 ${
                          isDark ? 'text-white hover:text-pink-400' : 'text-slate-900 hover:text-pink-600'
                        }`}
                      >
                        {product.name}
                      </h3>

                      <ul className="space-y-1 mb-4">
                        {(product.specs || []).slice(0, 2).map((spec, sIdx) => (
                          <li
                            key={sIdx}
                            className={`text-[11px] font-medium flex items-center gap-2 ${
                              isDark ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0"></span>
                            <span className="truncate">{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className={`pt-3.5 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                      <div className="flex items-baseline justify-between mb-3">
                        <div className="flex items-baseline gap-2">
                          <span className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {product.price}
                          </span>
                          {product.oldPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              {product.oldPrice}
                            </span>
                          )}
                        </div>
                        {product.oldPrice && (
                          <span className="text-[10px] font-black text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded-md">
                            Chegirma
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => onAddToCart(product)}
                        className="w-full btn-pink btn-vauu-shine py-3 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-pink-500/20 group/btn"
                      >
                        <svg className="w-4 h-4 group-hover/btn:scale-115 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Savatga Qo'shish</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* 4. REKLAMA & MAXSUS AKSIYA BANNERI                        */}
      {/* ========================================================= */}
      <section id="featured" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div
          className={`relative rounded-3xl overflow-hidden border-2 transition-all duration-300 shadow-2xl group ${
            isDark
              ? 'bg-slate-950 border-pink-500/40 shadow-pink-950/50 text-white'
              : 'bg-slate-950 border-pink-500/50 shadow-slate-900/50 text-white'
          }`}
        >
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              loading="lazy"
              decoding="async"
              src={reklamaBanner}
              alt="Pro Gaming Setup Aksiyasi"
              className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-1000 opacity-40 sm:opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/92 to-purple-950/85" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70" />
          </div>

          <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl pointer-events-none z-0 animate-pulse" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none z-0" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-10 lg:p-14">
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-pink-600 text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg shadow-pink-600/40 animate-pulse">
                  <span>📢</span> MAXSUS AKSIYA · FLAME DEAL
                </span>
                <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 text-[11px] font-black px-3.5 py-1.5 rounded-full shadow-sm">
                  <span>🔥</span> -35% CHEGIRMA
                </span>
                <span className="inline-flex items-center gap-1 bg-white/15 text-pink-200 border border-white/20 text-[11px] font-bold px-3 py-1.5 rounded-full backdrop-blur-md">
                  🎁 Bepul XXL Sovg'a
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                PRO Kiber Gaming <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-pink-400 via-fuchsia-300 to-rose-400 bg-clip-text text-transparent">
                  4-in-1 Komplektiga
                </span>{' '}
                35% Chegirma!
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
                CyberBlade RGB mexanik klaviatura, ultra-yengil Phantom V3 sichqoncha, ApexSound 7.1 fazoviy naushnik va XXL RGB gilamcha — bitta to'liq geyming setup to'plamida. Bepul kuryer va 2 yillik rasmiy kafolat bilan xarid qiling!
              </p>

              {/* High-speed isolated countdown timer */}
              <PromoCountdownTimer />

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <div>
                  <div className="text-xs text-slate-400 line-through font-bold">2 150 000 so'm</div>
                  <div className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                    <span className="text-pink-400">1 390 000</span>
                    <span className="text-xs font-bold text-slate-300">so'm</span>
                  </div>
                </div>

                <div className="h-8 w-px bg-white/15 hidden sm:block" />

                <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-3.5 py-2 rounded-xl backdrop-blur-md">
                  <span className="text-xs text-slate-300 font-medium">Promokod:</span>
                  <code className="text-sm font-mono font-black text-amber-300 tracking-wider">UPGRADE2026</code>
                  <button
                    type="button"
                    onClick={handleCopyPromo}
                    className="text-xs font-bold text-pink-400 hover:text-white transition-colors cursor-pointer ml-1 underline"
                  >
                    {promoCopied ? '✓ Nusxalandi' : 'Nusxa olish'}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddBundleToCart}
                  className="btn-pink btn-vauu-shine px-8 py-4 rounded-2xl text-sm sm:text-base font-black shadow-xl shadow-pink-600/40 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-103 active:scale-95"
                >
                  {bundleAdded ? (
                    <>
                      <span>✓</span>
                      <span>Savatga Muvaffaqiyatli Qo'shildi!</span>
                    </>
                  ) : (
                    <>
                      <span>🛒</span>
                      <span>Komplektni Xarid Qilish</span>
                    </>
                  )}
                </button>
                <a
                  href="#catalog"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-7 py-4 rounded-2xl text-sm sm:text-base text-center transition-all flex items-center justify-center gap-2"
                >
                  <span>Katalogdagi Aksiyalar →</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="w-full max-w-md rounded-3xl backdrop-blur-2xl bg-black/50 border border-white/20 p-6 sm:p-7 shadow-2xl shadow-black/80 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="bg-pink-600 text-white px-3.5 py-1 rounded-xl font-black text-xs shadow-lg flex items-center gap-1.5">
                    <span>⚡</span> 35% TEJAB QOLING
                  </div>
                  <div className="bg-white/10 backdrop-blur-md text-amber-300 px-3 py-1 rounded-xl font-bold text-xs border border-white/10 flex items-center gap-1">
                    <span>★</span> 4.9 (128 ta baho)
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-black text-white flex items-center justify-between">
                    <span>4-in-1 Komplekt Tarkibi:</span>
                    <span className="text-[11px] text-pink-400 font-extrabold">24s Yetkazish</span>
                  </div>

                  <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                    <li className="flex items-center gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                      <span className="text-pink-400 font-bold text-base">⌨️</span>
                      <span className="font-semibold">CyberBlade RGB Mexanik Klaviatura</span>
                    </li>
                    <li className="flex items-center gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                      <span className="text-pink-400 font-bold text-base">🖱️</span>
                      <span className="font-semibold">Phantom V3 26000 DPI Sichqoncha</span>
                    </li>
                    <li className="flex items-center gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                      <span className="text-pink-400 font-bold text-base">🎧</span>
                      <span className="font-semibold">ApexSound 7.1 Fazoviy Gaming Naushnik</span>
                    </li>
                    <li className="flex items-center gap-2.5 bg-pink-500/20 p-3 rounded-2xl border border-pink-500/50 text-pink-200 font-extrabold">
                      <span className="text-base">🎁</span>
                      <span>Maxsus Sovg'a: XXL RGB Gaming Kovrik</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Omborda 7 ta qoldi
                  </span>
                  <span className="text-emerald-400 font-extrabold">✓ 2 Yillik Kafolat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. BENEFITS (Optimized content-visibility)                 */}
      {/* ========================================================= */}
      <section
        id="benefits"
        style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 400px' }}
        className={`py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t transition-colors ${
          isDark ? 'border-slate-800' : 'border-slate-100'
        }`}
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800/60 text-xs font-black uppercase tracking-widest text-pink-600 dark:text-pink-400 mb-3">
            <span>🛡️</span> AFZALLIKLARIMIZ
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-4 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Nega Minglab Foydalanuvchilar <span className="text-gradient-animated">UPGRADE</span> Aksessuarlarini Tanlaydi?
          </h2>
          <p className={`text-sm sm:text-base font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Biz faqatgina sifatli va ishonchli uskunalar bilan kompyuter qarshisidagi vaqtingizni maksimal darajada qulay qilamiz.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {[
            {
              icon: '🚚',
              title: 'Tezkor Yetkazish',
              sub: "Butun O'zbekiston bo'ylab 24 soat ichida eshikkacha",
              badge: '24S ICHIDA',
              tagColor: isDark ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200',
              iconBg: isDark ? 'from-blue-500/25 to-sky-500/15 border-blue-500/30 text-blue-400' : 'from-blue-100 to-sky-50 border-blue-200/80 text-blue-600',
              cardBorder: isDark ? 'border-slate-800/90 hover:border-blue-500/60' : 'border-slate-200/80 hover:border-blue-300',
              hoverGlow: isDark ? 'hover:shadow-blue-500/10' : 'hover:shadow-blue-500/15',
              lineGradient: 'from-blue-500 via-sky-400 to-cyan-400',
              iconMotion: 'group-hover:translate-x-1.5 transition-transform duration-300 ease-out',
            },
            {
              icon: '🛡️',
              title: '2 Yillik Kafolat',
              sub: '100% original uskunalar va servis kafolati',
              badge: 'RASMIY KAFOLAT',
              tagColor: isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
              iconBg: isDark ? 'from-emerald-500/25 to-teal-500/15 border-emerald-500/30 text-emerald-400' : 'from-emerald-100 to-teal-50 border-emerald-200/80 text-emerald-600',
              cardBorder: isDark ? 'border-slate-800/90 hover:border-emerald-500/60' : 'border-slate-200/80 hover:border-emerald-300',
              hoverGlow: isDark ? 'hover:shadow-emerald-500/10' : 'hover:shadow-emerald-500/15',
              lineGradient: 'from-emerald-500 via-teal-400 to-green-400',
              iconMotion: 'group-hover:scale-115 transition-transform duration-300 ease-out',
            },
            {
              icon: '💳',
              title: "Qulay To'lov",
              sub: 'Click, Payme, Uzum Nasiya orqali qulay to\'lov',
              badge: "0% BO'LIB TO'LASH",
              tagColor: isDark ? 'bg-violet-500/20 text-violet-300 border-violet-500/30' : 'bg-violet-50 text-violet-700 border-violet-200',
              iconBg: isDark ? 'from-violet-500/25 to-purple-500/15 border-violet-500/30 text-violet-400' : 'from-violet-100 to-purple-50 border-violet-200/80 text-violet-600',
              cardBorder: isDark ? 'border-slate-800/90 hover:border-violet-500/60' : 'border-slate-200/80 hover:border-violet-300',
              hoverGlow: isDark ? 'hover:shadow-violet-500/10' : 'hover:shadow-violet-500/15',
              lineGradient: 'from-violet-500 via-purple-400 to-indigo-400',
              iconMotion: 'group-hover:-rotate-6 group-hover:scale-115 transition-transform duration-300 ease-out',
            },
            {
              icon: '🔄',
              title: '14 Kun Almashtirish',
              sub: "Xavfsiz xarid va to'liq qaytarib berish kafolati",
              badge: '100% XAVFSIZ',
              tagColor: isDark ? 'bg-pink-500/20 text-pink-300 border-pink-500/30' : 'bg-pink-50 text-pink-700 border-pink-200',
              iconBg: isDark ? 'from-pink-500/25 to-rose-500/15 border-pink-500/30 text-pink-400' : 'from-pink-100 to-rose-50 border-pink-200/80 text-pink-600',
              cardBorder: isDark ? 'border-slate-800/90 hover:border-pink-500/60' : 'border-slate-200/80 hover:border-pink-300',
              hoverGlow: isDark ? 'hover:shadow-pink-500/10' : 'hover:shadow-pink-500/15',
              lineGradient: 'from-pink-500 via-rose-400 to-fuchsia-400',
              iconMotion: 'group-hover:rotate-180 transition-transform duration-700 ease-out',
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-3xl p-6 transition-all duration-300 cyber-card
                hover:-translate-y-2 hover:shadow-2xl ${item.hoverGlow}
                border ${item.cardBorder}
                ${isDark 
                  ? 'bg-slate-900/90 shadow-md shadow-black/40' 
                  : 'bg-white shadow-sm shadow-slate-200/60 hover:bg-white'}
              `}
            >
              <div
                className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br ${item.lineGradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 pointer-events-none`}
              />

              <div className="relative flex items-center sm:items-start gap-4 z-10">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border bg-gradient-to-br ${item.iconBg} shadow-inner transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}
                >
                  <span className={`text-2xl sm:text-3xl select-none inline-block ${item.iconMotion}`}>
                    {item.icon}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                    <h4 className={`text-sm sm:text-base font-black tracking-tight transition-colors duration-200 ${
                      isDark ? 'text-white group-hover:text-pink-300' : 'text-slate-900 group-hover:text-pink-600'
                    }`}>
                      {item.title}
                    </h4>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border tracking-wide uppercase ${item.tagColor}`}>
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

              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full w-12 group-hover:w-full bg-gradient-to-r ${item.lineGradient} transition-all duration-500 ease-out`}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. TESTIMONIALS / REVIEWS (Optimized content-visibility)   */}
      {/* ========================================================= */}
      <section
        id="reviews"
        style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 350px' }}
        className={`py-20 px-4 sm:px-6 lg:px-8 border-y transition-colors ${
          isDark ? 'bg-[#0c101c] border-slate-800' : 'bg-slate-50/70 border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800/60 text-xs font-black uppercase tracking-widest text-pink-600 dark:text-pink-400 mb-2.5">
              <span>💬</span> MIJOZLAR FIKRLARI
            </div>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black mb-2 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Dasturchilar va Geymerlar Bahosi
            </h2>
            <p className={`text-sm sm:text-base font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Minglab mamnun mijozlarimiz UPGRADE aksessuarlari haqida nima deyishadi?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Bobur Mirzayev',
                role: 'Senior Frontend Developer',
                text: 'CyberBlade Pro klaviaturasi shunchaki ajoyib! Switchlarning ovozi va sezgirligi kod yozishda boshqacha rohat bag\'ishlaydi. Simsiz ulanishi juda tez va sifatli.',
                rating: 5,
                product: 'CyberBlade Pro RGB',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
              },
              {
                name: 'Shahzod Karimov',
                role: 'CS2 & Valorant Kiber Sportchisi',
                text: 'Phantom V3 sichqonchasi bilan o\'yindagi natijalarim sezilarli darajada oshdi. Og\'irligi 58 gramm, qo\'lda deyarli sezilmaydi, sensor aniqligi 10/10.',
                rating: 5,
                product: 'Phantom V3 Ultralight',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
              },
              {
                name: 'Dildora Alimova',
                role: 'UI/UX Dizayner',
                text: 'ApexSound 7.1 naushniklarini kun bo\'yi taqib o\'tiraman, quloqni mutlaqo charchatmaydi. Tovush fazoviy toza va mikrofon sifati juda yuqori darajada.',
                rating: 5,
                product: 'ApexSound 7.1 Spatial',
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80'
              }
            ].map((rev, rIdx) => (
              <div
                key={rIdx}
                className={`p-6 sm:p-7 rounded-3xl border transition-all duration-300 cyber-card hover:-translate-y-2 ${
                  isDark
                    ? 'bg-[#111827] border-slate-800 text-white shadow-lg'
                    : 'bg-white border-slate-100 text-slate-900 shadow-sm hover:shadow-xl'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400 text-sm">
                    {'★'.repeat(rev.rating)}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    <span>✓</span> Tasdiqlangan xarid
                  </span>
                </div>

                <p className={`text-sm mb-6 leading-relaxed italic ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  "{rev.text}"
                </p>

                <div className={`pt-4 border-t flex items-center justify-between gap-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <div className="flex items-center gap-3">
                    <img
                      loading="lazy"
                      decoding="async"
                      src={rev.avatar}
                      alt={rev.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-pink-500/40"
                    />
                    <div>
                      <h4 className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{rev.name}</h4>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{rev.role}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-xl ${
                      isDark ? 'bg-pink-950/70 text-pink-400 border border-pink-800/40' : 'bg-pink-50 text-pink-600 border border-pink-100'
                    }`}
                  >
                    {rev.product}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. PRE-FOOTER: CONTACT & CONSULTATION FORM                */}
      {/* ========================================================= */}
      <section
        id="contact"
        style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 300px' }}
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
      >
        <div
          className={`rounded-3xl p-8 sm:p-12 border-2 text-center shadow-2xl transition-colors relative overflow-hidden ${
            isDark
              ? 'bg-gradient-to-br from-[#111827] via-[#0f172a] to-[#111827] border-pink-500/40 shadow-pink-950/30'
              : 'bg-gradient-to-br from-pink-50 via-white to-pink-50/80 border-pink-300/80 shadow-pink-500/15'
          }`}
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-xl mx-auto relative z-10">
            <img loading="lazy" decoding="async" src={logoImg} alt="UPGRADE" className="h-12 sm:h-14 w-auto mx-auto mb-4 object-contain" />
            <h2 className={`text-2xl sm:text-4xl font-black mb-3 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Qaysi Aksessuar Sizga Mos Kelishini Bilmayapsizmi?
            </h2>
            <p className={`text-sm sm:text-base mb-8 font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Telefon raqamingizni qoldiring, mutaxassisimiz 10 daqiqa ichida siz bilan bog'lanib, kompyuteringiz uchun eng maqbul aksessuarni tanlashda bepul maslahat beradi.
            </p>

            {formSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold animate-in fade-in flex items-center justify-center gap-2">
                <span>🎉</span>
                <span>Rahmat! So'rovingiz qabul qilindi. Menejerimiz tez orada sizga qo'ng'iroq qiladi.</span>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  placeholder="Ismingiz..."
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  className={`flex-1 px-5 py-3.5 rounded-2xl border text-sm font-medium focus:outline-hidden transition-all shadow-xs ${
                    isDark
                      ? 'bg-[#1a2333] border-slate-700 text-white placeholder:text-slate-500 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/15'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10'
                  }`}
                />
                <input
                  type="tel"
                  required
                  placeholder="+998 (__) ___-__-__"
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                  className={`flex-1 px-5 py-3.5 rounded-2xl border text-sm font-medium focus:outline-hidden transition-all shadow-xs ${
                    isDark
                      ? 'bg-[#1a2333] border-slate-700 text-white placeholder:text-slate-500 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/15'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10'
                  }`}
                />
                <button
                  type="submit"
                  className="btn-pink btn-vauu-shine px-8 py-3.5 rounded-2xl text-sm font-extrabold shrink-0 shadow-lg shadow-pink-500/30 cursor-pointer"
                >
                  Maslahat Olish
                </button>
              </form>
            )}

            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs text-slate-500 font-bold">
              <span>🔒 Ma'lumotlaringiz xavfsiz</span>
              <span>•</span>
              <span>📞 Bepul qo'ng'iroq</span>
              <span>•</span>
              <span>⚡ 10 daqiqada javob</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* QUICK VIEW PRODUCT MODAL                                  */}
      {/* ========================================================= */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
          <div
            className={`rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border relative max-h-[90vh] overflow-y-auto ${
              isDark ? 'bg-[#111827] border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-900'
            }`}
          >
            <button
              onClick={() => setActiveModalProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-2xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Yopish"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <img
                loading="lazy"
                decoding="async"
                src={activeModalProduct.image}
                alt={activeModalProduct.name}
                className={`w-full aspect-square rounded-2xl object-cover border shadow-md ${
                  isDark ? 'border-slate-800' : 'border-slate-100'
                }`}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'
                }}
              />
              <div className="space-y-3">
                <span className="text-xs font-black text-pink-600 bg-pink-50 dark:bg-pink-950/70 dark:text-pink-400 px-3 py-1 rounded-xl">
                  {activeModalProduct.category}
                </span>
                <h3 className={`text-xl sm:text-2xl font-black leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {activeModalProduct.name}
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                  {activeModalProduct.description}
                </p>

                <div className="space-y-1.5 pt-2">
                  <div className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    Texnik xususiyatlar:
                  </div>
                  {(activeModalProduct.specs || []).map((spec, i) => (
                    <div
                      key={i}
                      className={`text-xs font-medium flex items-center gap-2 ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      <span className="text-pink-600 font-bold">✓</span> {spec}
                    </div>
                  ))}
                </div>

                <div
                  className={`pt-4 border-t flex items-baseline gap-2 ${
                    isDark ? 'border-slate-800' : 'border-slate-100'
                  }`}
                >
                  <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {activeModalProduct.price}
                  </span>
                  {activeModalProduct.oldPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      {activeModalProduct.oldPrice}
                    </span>
                  )}
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => {
                      onAddToCart(activeModalProduct)
                      setActiveModalProduct(null)
                    }}
                    className="flex-1 btn-pink btn-vauu-shine py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-pink-500/25"
                  >
                    <span>🛒 Savatga Qo'shish</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Main
