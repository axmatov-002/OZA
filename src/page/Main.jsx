import React, { useState, useEffect } from 'react'
import heroVideo from '../assets/manshu_yerne_o_zgartir_va_na.mp4'
import logoImg from '../assets/image.png'
import reklamaBanner from '../assets/reklama_banner.jpg'
import ProductSlider from './ProductSlider'

const Main = ({ products = [], onAddToCart, onAddConsultation, theme = 'light' }) => {
  const [selectedCategory, setSelectedCategory] = useState('Barchasi')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeModalProduct, setActiveModalProduct] = useState(null)
  const [leadForm, setLeadForm] = useState({ name: '', phone: '' })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [promoCopied, setPromoCopied] = useState(false)
  const [bundleAdded, setBundleAdded] = useState(false)
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

  const categories = [
    'Barchasi',
    'Klaviaturalar',
    'Sichqonchalar',
    'Naushniklar',
    'RGB Gilamchalar',
    'Stol & Qavslar',
    'Strim & Audio'
  ]

  // Filter products by category and search
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'Barchasi' || p.category === selectedCategory
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

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
    <div className={`transition-colors duration-300 ${isDark ? 'bg-[#090d16] text-slate-100' : 'bg-white text-slate-900'}`}>
      {/* ========================================================= */}
      {/* 1. HERO SECTION                                           */}
      {/* ========================================================= */}
      <section
        className={`relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 border-b transition-colors duration-300 ${
          isDark
            ? 'bg-gradient-to-b from-[#0f172a] via-[#090d16] to-[#090d16] border-slate-800/80'
            : 'bg-gradient-to-b from-pink-50/40 via-white to-white border-slate-100'
        }`}
      >
        {/* Soft pink glow spots */}
        <div
          className={`absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-[120px] pointer-events-none -z-10 ${
            isDark ? 'bg-pink-900/25' : 'bg-pink-100/60'
          }`}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-7 text-center lg:text-left">
              {/* Badge */}
              <div
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold mb-6 shadow-xs ${
                  isDark
                    ? 'bg-pink-950/60 border border-pink-700/50 text-pink-300'
                    : 'bg-pink-50 border border-pink-200 text-pink-700'
                }`}
              >
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-600"></span>
                </span>
                <span>🔥 2026 Yilgi Yangi Kompyuter Aksessuarlari To'plami</span>
              </div>

              {/* Title */}
              <h1
                className={`text-4xl sm:text-6xl lg:text-6xl font-black tracking-tight mb-6 leading-[1.15] ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Kompyuteringiz Uchun Eng Kuchli Aksessuarlar Bilan{' '}
                <span className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent underline decoration-pink-300 decoration-wavy underline-offset-8">
                  UPGRADE
                </span>{' '}
                Qiling
              </h1>

              {/* Subtitle */}
              <p
                className={`text-base sm:text-lg mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Yuqori sezuvchan mexanik klaviaturalar, yengil kiber sport sichqonchalari, 7.1 fazoviy naushniklar va qulay ish stoli aksessuarlari. Tezkor yetkazib berish va 2 yil rasmiy kafolat.
              </p>

              {/* Juicy Pink Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href="#catalog"
                  className="w-full sm:w-auto btn-pink px-8 py-4 rounded-2xl text-base font-bold shadow-xl shadow-pink-500/25 flex items-center justify-center gap-2 group"
                >
                  <span>🛒 Aksessuarlar Katalogi</span>
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
                <a
                  href="#featured"
                  className={`w-full sm:w-auto px-7 py-3.5 rounded-2xl text-base font-semibold flex items-center justify-center gap-2 transition-all ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-pink-400 border border-slate-700'
                      : 'btn-pink-outline'
                  }`}
                >
                  <span>⚡ Ommabop To'plam</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div
                className={`grid grid-cols-3 gap-4 pt-10 mt-8 border-t max-w-lg mx-auto lg:mx-0 text-left ${
                  isDark ? 'border-slate-800' : 'border-slate-100'
                }`}
              >
                <div>
                  <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>50,000+</div>
                  <div className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Mamnun mijozlar</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-pink-600">2 YIL</div>
                  <div className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>To'liq kafolat</div>
                </div>
                <div>
                  <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>24 SOAT</div>
                  <div className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Tezkor yetkazish</div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual 3D Showcase with Video */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div
                className={`absolute w-72 h-72 rounded-full -z-10 blur-2xl ${
                  isDark ? 'bg-pink-900/30' : 'bg-pink-100/80'
                }`}
              ></div>

              {/* Hero Image Showcase Card */}
              <div
                className={`relative w-full max-w-md backdrop-blur-md rounded-3xl p-6 sm:p-8 border shadow-2xl text-center ${
                  isDark
                    ? 'bg-[#111827]/90 border-slate-800 shadow-black/50'
                    : 'bg-white/80 border-slate-200/80 shadow-slate-200/60'
                }`}
              >
                {/* Hero Showcase Video */}
                <div className="relative my-4 overflow-hidden rounded-2xl shadow-xl border border-pink-500/20 bg-slate-950 group">
                  <video
                    src={heroVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto aspect-video object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
                </div>

                {/* Floating Interactive Badges around pedestal */}
                <div
                  className={`absolute -top-4 -left-4 sm:-left-6 px-4 py-2.5 rounded-2xl border shadow-lg flex items-center gap-2.5 text-xs font-bold animate-pulse-glow z-10 ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white shadow-black/40'
                      : 'bg-white border-pink-200 text-slate-800'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-base ${
                    isDark ? 'bg-pink-950 text-pink-400' : 'bg-pink-100 text-pink-600'
                  }`}>
                    ⌨️
                  </span>
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400 font-normal">Switch turi</div>
                    <div>Hot-Swap Red</div>
                  </div>
                </div>

                <div
                  className={`absolute -bottom-3 -right-3 sm:-right-5 px-4 py-2.5 rounded-2xl border shadow-lg flex items-center gap-2.5 text-xs font-bold z-10 ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 text-white shadow-black/40'
                      : 'bg-white border-pink-200 text-slate-800'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-base ${
                    isDark ? 'bg-pink-950 text-pink-400' : 'bg-pink-100 text-pink-600'
                  }`}>
                    ⚡
                  </span>
                  <div className="text-left">
                    <div className="text-[10px] text-slate-400 font-normal">Sezuvchanlik</div>
                    <div className="text-pink-600 font-black">26000 DPI</div>
                  </div>
                </div>

                <div
                  className={`mt-4 pt-4 border-t flex items-center justify-between text-xs font-medium ${
                    isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Omborimizda mavjud
                  </span>
                  <span className="font-bold text-pink-600">100% Original Sifat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. PRODUCT SLIDER — FEATURED & POPULAR                    */}
      {/* ========================================================= */}
      <div
        className={`border-y transition-colors duration-300 ${
          isDark
            ? 'bg-[#0b0f19] border-slate-800'
            : 'bg-gradient-to-b from-pink-50/30 to-white border-pink-100/60'
        }`}
      >
        <ProductSlider
          products={products.filter((p) => p.badge === 'Bestseller' || p.badge === 'Yangi' || p.rating >= 4.8).slice(0, 8)}
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
            <div className="text-xs font-bold uppercase tracking-widest text-pink-600 mb-2">
              Bizning To'plam
            </div>
            <h2 className={`text-3xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Kompyuter Aksessuarlari Katalogi
            </h2>
            <p className={`text-sm sm:text-base mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Setupingizni yangilash uchun eng sara va sinovdan o'tgan aksessuarlar
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Aksessuar nomi bo'yicha qidiring..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-2xl border text-sm transition-all focus:outline-none focus:border-pink-500 ${
                isDark
                  ? 'bg-[#111827] border-slate-700 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-pink-500/20'
                  : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-pink-100'
              }`}
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 ${
                selectedCategory === cat
                  ? 'btn-pink shadow-md'
                  : isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. PRODUCT CARDS GRID                                     */}
      {/* ========================================================= */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {filteredProducts.length === 0 ? (
          <div
            className={`text-center py-20 rounded-3xl border ${
              isDark ? 'bg-[#111827] border-slate-800' : 'bg-slate-50 border-slate-100'
            }`}
          >
            <div className="text-4xl mb-3">🔍</div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Hech qanday aksessuar topilmadi
            </h3>
            <p className="text-sm text-slate-500 mt-1 mb-4">
              Qidiruv so'zini o'zgartiring yoki boshqa toifani tanlang.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Barchasi')
                setSearchQuery('')
              }}
              className="btn-pink px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
            >
              Barcha mahsulotlarni ko'rsatish
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`rounded-3xl border overflow-hidden flex flex-col justify-between group transition-all duration-300 ${
                  isDark
                    ? 'bg-[#111827] border-slate-800 hover:border-pink-500/60 shadow-lg shadow-black/20'
                    : 'bg-white border-slate-200/80 hover:border-pink-300 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Product Image & Badge */}
                <div
                  className={`relative aspect-[4/3] overflow-hidden cursor-pointer ${
                    isDark ? 'bg-slate-900/80' : 'bg-slate-50'
                  }`}
                  onClick={() => setActiveModalProduct(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badge */}
                  <span className="absolute top-3 left-3 bg-pink-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                    {product.badge}
                  </span>

                  {/* Stock tag */}
                  <span
                    className={`absolute bottom-3 left-3 backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs ${
                      isDark ? 'bg-slate-900/90 text-slate-200' : 'bg-white/90 text-slate-700'
                    }`}
                  >
                    Omborda: {product.stock || 10} dona
                  </span>

                  {/* Quick view button on hover */}
                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span
                      className={`text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg transition-colors ${
                        isDark ? 'bg-slate-800 text-white border border-slate-700 hover:bg-slate-700' : 'bg-white/95 text-slate-900 hover:bg-white'
                      }`}
                    >
                      Batafsil Ko'rish
                    </span>
                  </div>
                </div>

                {/* Product Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded-md ${
                          isDark ? 'bg-pink-950/60 text-pink-400' : 'bg-pink-50 text-pink-600'
                        }`}
                      >
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <span>★</span>
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{product.rating}</span>
                        <span className="text-slate-500">({product.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Name */}
                    <h3
                      onClick={() => setActiveModalProduct(product)}
                      className={`font-bold text-sm sm:text-base leading-snug line-clamp-2 transition-colors cursor-pointer mb-2.5 ${
                        isDark ? 'text-white hover:text-pink-400' : 'text-slate-900 hover:text-pink-600'
                      }`}
                    >
                      {product.name}
                    </h3>

                    {/* Specs snippets */}
                    <ul className="space-y-1 mb-4">
                      {(product.specs || []).slice(0, 2).map((spec, sIdx) => (
                        <li
                          key={sIdx}
                          className={`text-[11px] flex items-center gap-1.5 ${
                            isDark ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                          <span className="truncate">{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price and Cart Button */}
                  <div className={`pt-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {product.price}
                      </span>
                      {product.oldPrice && (
                        <span className="text-xs text-slate-500 line-through">
                          {product.oldPrice}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onAddToCart(product)}
                      className="w-full btn-pink py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Savatga Qo'shish</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* 4. REKLAMA & MAXSUS AKSIYA BANNERI                        */}
      {/* ========================================================= */}
      <section id="featured" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div
          className={`relative rounded-3xl overflow-hidden border transition-all duration-300 shadow-2xl ${
            isDark
              ? 'bg-gradient-to-br from-[#121829] via-[#0e1424] to-[#150f24] border-pink-500/30 shadow-pink-950/40'
              : 'bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border-pink-500/40 shadow-slate-900/30 text-white'
          }`}
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-10 lg:p-14">
            {/* Left Col: Advertising Info & Offer */}
            <div className="lg:col-span-7 space-y-5 text-left">
              {/* Top Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-pink-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md shadow-pink-600/30 animate-pulse">
                  <span>📢</span> REKLAMA · MAXSUS AKSIYA
                </span>
                <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-sm">
                  <span>🔥</span> -35% CHEGIRMA
                </span>
                <span className="inline-flex items-center gap-1 bg-white/10 text-pink-200 border border-white/10 text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs">
                  🎁 Bepul XXL Sovg'a
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                PRO Kiber Gaming <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-pink-400 via-fuchsia-300 to-rose-400 bg-clip-text text-transparent">
                  4-in-1 Komplektiga
                </span>{' '}
                35% Chegirma!
              </h2>

              {/* Description */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                CyberBlade RGB mexanik klaviatura, ultra-yengil Phantom V3 sichqoncha, ApexSound 7.1 fazoviy naushnik va XXL RGB gilamcha — bitta to'liq setup to'plamida. Bepul kuryer va 2 yillik kafolat bilan xarid qiling!
              </p>

              {/* Countdown Timer */}
              <div className="bg-black/40 border border-white/10 p-3.5 sm:p-4 rounded-2xl backdrop-blur-md inline-block max-w-md w-full">
                <div className="flex items-center justify-between text-xs text-pink-300 font-bold mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                    Aksiya yakunlanishiga qoldi:
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">Cheklangan soni: 7 ta</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white/5 border border-white/10 rounded-xl py-2">
                    <div className="text-lg sm:text-xl font-black text-white font-mono">{String(timeLeft.days).padStart(2, '0')}</div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Kun</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl py-2">
                    <div className="text-lg sm:text-xl font-black text-white font-mono">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Soat</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl py-2">
                    <div className="text-lg sm:text-xl font-black text-white font-mono">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Daqiqa</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl py-2 bg-pink-900/40 border-pink-500/40">
                    <div className="text-lg sm:text-xl font-black text-pink-400 font-mono">{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <div className="text-[9px] uppercase tracking-wider text-pink-300 font-semibold">Soniya</div>
                  </div>
                </div>
              </div>

              {/* Price & Promo Code Row */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <div>
                  <div className="text-xs text-slate-400 line-through font-semibold">2 150 000 so'm</div>
                  <div className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                    <span className="text-pink-400">1 390 000</span>
                    <span className="text-xs font-normal text-slate-300">so'm</span>
                  </div>
                </div>

                <div className="h-8 w-px bg-white/10 hidden sm:block" />

                {/* Promo Code Pill */}
                <div className="flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-1.5 rounded-xl">
                  <span className="text-[11px] text-slate-300">Promokod:</span>
                  <code className="text-xs font-mono font-black text-amber-300">UPGRADE2026</code>
                  <button
                    type="button"
                    onClick={handleCopyPromo}
                    className="text-[11px] font-bold text-pink-400 hover:text-white transition-colors cursor-pointer ml-1"
                  >
                    {promoCopied ? '✓ Nusxalandi' : 'Nusxa olish'}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddBundleToCart}
                  className="btn-pink px-7 py-3.5 rounded-2xl text-sm sm:text-base font-black shadow-xl shadow-pink-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-102 active:scale-95"
                >
                  {bundleAdded ? (
                    <>
                      <span>✓</span>
                      <span>Savatga Qo'shildi!</span>
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
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-6 py-3.5 rounded-2xl text-sm sm:text-base text-center transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Katalogdagi Aksiyalar →</span>
                </a>
              </div>
            </div>

            {/* Right Col: Eye-Popping Visual Showcase */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full rounded-3xl overflow-hidden border-2 border-pink-500/40 shadow-2xl shadow-pink-500/20 group">
                <img
                  src={reklamaBanner}
                  alt="Pro Gaming Setup Aksiyasi"
                  className="w-full h-auto object-cover rounded-3xl group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                {/* Floating Badge Top Left */}
                <div className="absolute top-4 left-4 bg-pink-600 text-white px-3 py-1.5 rounded-xl font-black text-xs shadow-lg flex items-center gap-1.5">
                  <span>⚡</span> 35% TEJAB QOLING
                </div>

                {/* Floating Badge Top Right */}
                <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-amber-400 px-3 py-1.5 rounded-xl font-bold text-xs border border-white/10 shadow-lg flex items-center gap-1">
                  <span>★</span> 4.9 (128 ta baho)
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-left">
                  <div className="text-xs font-bold text-white mb-0.5 flex items-center justify-between">
                    <span>4-in-1 Komplekt tarkibi:</span>
                    <span className="text-[11px] text-pink-400 font-black">Tezkor yetkazish 24s</span>
                  </div>
                  <div className="text-[11px] text-slate-300 flex items-center gap-2 flex-wrap">
                    <span>• Klaviatura</span>
                    <span>• Sichqoncha</span>
                    <span>• Naushnik</span>
                    <span className="text-emerald-400 font-bold">• Sovg'a: XXL RGB Pad</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. BENEFITS                                               */}
      {/* ========================================================= */}
      <section
        id="benefits"
        className={`py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t ${
          isDark ? 'border-slate-800' : 'border-slate-100'
        }`}
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-bold uppercase tracking-widest text-pink-600 mb-2">
            Afzalliklarimiz
          </div>
          <h2 className={`text-3xl sm:text-4xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Nega Minglab Foydalanuvchilar <span className="text-pink-600">UPGRADE</span> Aksessuarlarini Tanlaydi?
          </h2>
          <p className={`text-sm sm:text-base ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Biz faqatgina sifatli va ishonchli uskunalar bilan kompyuter qarshisidagi vaqtingizni maksimal darajada qulay qilamiz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: '🚀',
              title: 'Tezkor Kuryer Yetkazishi',
              desc: 'Toshkent bo\'yicha bir necha soatda, butun O\'zbekiston bo\'ylab 24 soat ichida eshigingizgacha xavfsiz yetkazib beramiz.'
            },
            {
              icon: '🛡️',
              title: '2 Yillik Rasmiy Kafolat',
              desc: 'Har bir aksessuar rasmiy kafolat taloniga ega. Muammo yuzaga kelsa, servis markazimiz orqali darhol almashtirib beramiz.'
            },
            {
              icon: '💎',
              title: '100% Original Mahsulotlar',
              desc: 'Hech qanday nusxa yoki sifatsiz xomashyo yo\'q. Faqat xalqaro standartlarga javob beruvchi original brend modellari.'
            },
            {
              icon: '💳',
              title: 'Qulay To\'lov & Bo\'lib To\'lash',
              desc: 'Payme, Click, Uzum Nasiya orqali ortiqcha hujjatlarsiz muddatli to\'lovga xarid qilish imkoniyati.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-3xl text-center border transition-all ${
                isDark
                  ? 'bg-[#111827] border-slate-800 text-white'
                  : 'bg-white border-slate-100 text-slate-900 shadow-xs'
              }`}
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5 ${
                  isDark ? 'bg-slate-800 text-pink-400' : 'bg-pink-50 text-pink-600'
                }`}
              >
                {item.icon}
              </div>
              <h3 className={`text-lg font-bold mb-2.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. TESTIMONIALS / REVIEWS                                 */}
      {/* ========================================================= */}
      <section
        id="reviews"
        className={`py-16 px-4 sm:px-6 lg:px-8 border-y transition-colors ${
          isDark ? 'bg-[#0c101c] border-slate-800' : 'bg-slate-50/60 border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-bold uppercase tracking-widest text-pink-600 mb-2">
              Mijozlar Fikrlari
            </div>
            <h2 className={`text-3xl sm:text-4xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Dasturchilar va Geymerlar Bahosi
            </h2>
            <p className={`text-sm sm:text-base ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Minglab mamnun mijozlarimiz UPGRADE aksessuarlari haqida nima deyishadi?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Bobur Mirzayev',
                role: 'Senior Frontend Developer',
                text: 'CyberBlade Pro klaviaturasi shunchaki ajoyib! Switchlarning ovozi va sezgirligi kod yozishda boshqacha rohat bag\'ishlaydi. Simsiz ulanishi juda tez.',
                rating: 5,
                product: 'CyberBlade Pro RGB'
              },
              {
                name: 'Shahzod Karimov',
                role: 'CS2 & Valorant Kiber Sportchisi',
                text: 'Phantom V3 sichqonchasi bilan o\'yindagi natijalarim sezilarli darajada oshdi. Og\'irligi 58 gramm, qo\'lda deyarli sezilmaydi, sensor aniqligi 10/10.',
                rating: 5,
                product: 'Phantom V3 Ultralight'
              },
              {
                name: 'Dildora Alimova',
                role: 'UI/UX Dizayner',
                text: 'ApexSound 7.1 naushniklarini kun bo\'yi taqib o\'tiraman, quloqni mutlaqo charchatmaydi. Tovush sifati va mikrofon tozaligi juda yuqori darajada.',
                rating: 5,
                product: 'ApexSound 7.1 Spatial'
              }
            ].map((rev, rIdx) => (
              <div
                key={rIdx}
                className={`p-6 rounded-3xl border transition-all ${
                  isDark
                    ? 'bg-[#111827] border-slate-800 text-white'
                    : 'bg-white border-slate-100 text-slate-900 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-1 text-amber-400 mb-3 text-sm">
                  {'★'.repeat(rev.rating)}
                </div>
                <p className={`text-sm mb-6 leading-relaxed italic ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  "{rev.text}"
                </p>
                <div className={`pt-4 border-t flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <div>
                    <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{rev.name}</h4>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{rev.role}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                      isDark ? 'bg-pink-950/60 text-pink-400' : 'bg-pink-50 text-pink-600'
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
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div
          className={`rounded-3xl p-8 sm:p-12 border-2 text-center shadow-xl transition-colors ${
            isDark
              ? 'bg-gradient-to-br from-[#111827] via-[#0f172a] to-[#111827] border-pink-900/60 shadow-pink-950/20'
              : 'bg-gradient-to-br from-pink-50 via-white to-pink-50/70 border-pink-200 shadow-pink-500/10'
          }`}
        >
          <div className="max-w-xl mx-auto">
            <img src={logoImg} alt="ORA" className="h-12 sm:h-14 w-auto mx-auto mb-4 object-contain" />
            <h2 className={`text-2xl sm:text-4xl font-black mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Qaysi Aksessuar Sizga Mos Kelishini Bilmayapsizmi?
            </h2>
            <p className={`text-sm sm:text-base mb-8 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Telefon raqamingizni qoldiring, mutaxassisimiz 10 daqiqa ichida siz bilan bog'lanib, kompyuteringiz uchun eng maqbul aksessuarni tanlashda bepul maslahat beradi.
            </p>

            {formSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold animate-in fade-in">
                🎉 Rahmat! So'rovingiz qabul qilindi. Menejerimiz tez orada sizga qo'ng'iroq qiladi.
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  placeholder="Ismingiz..."
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  className={`flex-1 px-5 py-3.5 rounded-2xl border text-sm focus:outline-none focus:border-pink-500 transition-colors shadow-xs ${
                    isDark
                      ? 'bg-[#1a2333] border-slate-700 text-white placeholder:text-slate-500'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
                <input
                  type="tel"
                  required
                  placeholder="+998 (__) ___-__-__"
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                  className={`flex-1 px-5 py-3.5 rounded-2xl border text-sm focus:outline-none focus:border-pink-500 transition-colors shadow-xs ${
                    isDark
                      ? 'bg-[#1a2333] border-slate-700 text-white placeholder:text-slate-500'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
                <button
                  type="submit"
                  className="btn-pink px-7 py-3.5 rounded-2xl text-sm font-bold shrink-0 shadow-lg shadow-pink-500/30 cursor-pointer"
                >
                  Maslahat Olish
                </button>
              </form>
            )}

            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-xs text-slate-500 font-medium">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div
            className={`rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border relative max-h-[90vh] overflow-y-auto ${
              isDark ? 'bg-[#111827] border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'
            }`}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <img
                src={activeModalProduct.image}
                alt={activeModalProduct.name}
                className={`w-full aspect-square rounded-2xl object-cover border ${
                  isDark ? 'border-slate-800' : 'border-slate-100'
                }`}
              />
              <div className="space-y-3">
                <span className="text-xs font-bold text-pink-600 bg-pink-50 dark:bg-pink-950/60 dark:text-pink-400 px-2.5 py-1 rounded-md">
                  {activeModalProduct.category}
                </span>
                <h3 className={`text-xl font-black leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
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
                      className={`text-xs flex items-center gap-2 ${
                        isDark ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      <span className="text-pink-600">✓</span> {spec}
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
                    <span className="text-sm text-slate-500 line-through">
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
                    className="flex-1 btn-pink py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
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
