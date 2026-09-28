import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useLanguage } from '../context/LanguageContext'

// Official promotional banner slides directly from UPGRADE (https://upg.uz/)
// Includes both Dark and Light theme high-resolution variants!
const UPG_BANNERS = [
  {
    id: 1,
    title: {
      uz: 'Edifier — Koinot Ritmida',
      ru: 'Edifier — В ритме космоса',
      en: 'Edifier — In Space Rhythm'
    },
    tag: {
      uz: '🔊 Akustika & Kolonkalar',
      ru: '🔊 Акустика и Колонки',
      en: '🔊 Acoustics & Speakers'
    },
    darkImage: '/banners/slide_1_dark.png',
    lightImage: '/banners/slide_1_light.png',
    cdnDark: 'https://files.ox-sys.com/cache/original/image/b3/22/29/b32229676d29f237430153aad68d3b7102d6d4b9055a808d8c5579bb04a357c0.png',
    cdnLight: 'https://files.ox-sys.com/cache/original/image/18/4a/4c/184a4c68dee1ef2615a82159e2a9b8a2961ee4872813d7a6f608bc0d322d1662.png',
    alt: 'Edifier koinot ritmida',
    link: '#catalog'
  },
  {
    id: 2,
    title: {
      uz: 'SteelSeries CS2 Dragon Lore Edition',
      ru: 'SteelSeries CS2 Dragon Lore Edition',
      en: 'SteelSeries CS2 Dragon Lore Edition'
    },
    tag: {
      uz: '🐉 Eksklyuziv Gaming To\'plam',
      ru: '🐉 Эксклюзивный Гейминг Набор',
      en: '🐉 Exclusive Gaming Bundle'
    },
    darkImage: '/banners/slide_2_dark.png',
    lightImage: '/banners/slide_2_light.png',
    cdnDark: 'https://files.ox-sys.com/cache/original/image/f3/c9/52/f3c952892851a0b94384c31056c0112f62104393f11dd0ef318295b60150aad9.png',
    cdnLight: 'https://files.ox-sys.com/cache/original/image/7b/0e/82/7b0e824e27d3c824a43dc9b86694ba1f43c49cc9071bf4ff28cef89e76d86f22.png',
    alt: 'SteelSeries Dragon Lore',
    link: '#catalog'
  },
  {
    id: 3,
    title: {
      uz: 'Myth Professional Gaming Chairs',
      ru: 'Myth Игровые Кресла',
      en: 'Myth Professional Gaming Chairs'
    },
    tag: {
      uz: '💺 Ergonomik O\'rindiqlar',
      ru: '💺 Эргономичные Кресла',
      en: '💺 Ergonomic Gaming Chairs'
    },
    darkImage: '/banners/slide_3_dark.png',
    lightImage: '/banners/slide_3_light.png',
    cdnDark: 'https://files.ox-sys.com/cache/original/image/97/77/e0/9777e038d8c2025b6926ddd06c2d7ec087e4317a89793d5b9cdd794a280a2af2.png',
    cdnLight: 'https://files.ox-sys.com/cache/original/image/3d/de/1a/3dde1a56fbec1af5789f1a337548132de34a23d324d797890620c3d3569837d7.png',
    alt: 'Myth Gaming Chairs',
    link: '#catalog'
  },
  {
    id: 4,
    title: {
      uz: '007 First Light Special Bundle',
      ru: '007 First Light Специальный Набор',
      en: '007 First Light Bundle'
    },
    tag: {
      uz: '⚡ Cheklangan Nashr',
      ru: '⚡ Лимитированная Серия',
      en: '⚡ Limited Edition'
    },
    darkImage: '/banners/slide_4_dark.png',
    lightImage: '/banners/slide_4_light.png',
    cdnDark: 'https://files.ox-sys.com/cache/original/image/fa/0b/05/fa0b05e10227423a74b11d19a443c109173c5cd9fd4977277f0937fb5fb83dab.png',
    cdnLight: 'https://files.ox-sys.com/cache/original/image/66/74/a7/6674a7edfd625258ff84f744f79c01603becc7791327485bacd9f90f53df2a9b.png',
    alt: '007 First Light Bundle',
    link: '#catalog'
  },
  {
    id: 5,
    title: {
      uz: 'Cloud Jet Dual Wireless Quloqchinlari',
      ru: 'Наушники Cloud Jet Dual Wireless',
      en: 'Cloud Jet Dual Wireless Headset'
    },
    tag: {
      uz: '🎧 Simsiz Yuqori Sifatli Audio',
      ru: '🎧 Беспроводное Премиум Аудио',
      en: '🎧 Wireless Spatial Audio'
    },
    darkImage: '/banners/slide_5_dark.png',
    lightImage: '/banners/slide_5_light.png',
    cdnDark: 'https://files.ox-sys.com/cache/original/image/36/57/52/3657525e7115ea822d43754e533f6b1edf91653b3899b659a583b0474fd94043.png',
    cdnLight: 'https://files.ox-sys.com/cache/original/image/5e/99/c4/5e99c46e72e42778e39fcc471b18c469c651a4c7756220fae545b060d23a99e9.png',
    alt: 'Cloud Jet Dual Wireless',
    link: '#catalog'
  },
  {
    id: 6,
    title: {
      uz: 'Pulsefire Haste 2 Pro Wireless Sichqonchasi',
      ru: 'Мышь Pulsefire Haste 2 Pro Wireless',
      en: 'Pulsefire Haste 2 Pro Wireless Mouse'
    },
    tag: {
      uz: '🖱️ Ultra-Yengil Esports Sichqoncha',
      ru: '🖱️ Ультралегкая Киберспорт Мышь',
      en: '🖱️ Ultra-Light Esports Mouse'
    },
    darkImage: '/banners/slide_6_dark.png',
    lightImage: '/banners/slide_6_light.png',
    cdnDark: 'https://files.ox-sys.com/cache/original/image/a5/4a/00/a54a00b67e52ee9938807633f124738ed1df77f24a27926e8fb672a4022bb098.png',
    cdnLight: 'https://files.ox-sys.com/cache/original/image/21/8c/14/218c14310a8c45f193105290929db1ae5783505c8d1679f803091dbc6173c0c4.png',
    alt: 'Pulsefire Haste 2 Pro Wireless',
    link: '#catalog'
  },
  {
    id: 7,
    title: {
      uz: 'Gravastar Cyberpunk Mech Akustika',
      ru: 'Gravastar Cyberpunk Мех-Акустика',
      en: 'Gravastar Cyberpunk Mech Speaker'
    },
    tag: {
      uz: '🤖 Sci-Fi Cyberpunk Dizayn',
      ru: '🤖 Sci-Fi Киберпанк Дизайн',
      en: '🤖 Sci-Fi Cyberpunk Speaker'
    },
    darkImage: '/banners/slide_7_dark.png',
    lightImage: '/banners/slide_7_light.png',
    cdnDark: 'https://files.ox-sys.com/cache/original/image/da/c2/b3/dac2b38a7ac1ede98f50ab1615b8141efa05d7cbc2f1020ee71e1fcfb2b9469c.png',
    cdnLight: 'https://files.ox-sys.com/cache/original/image/49/88/cb/4988cbe167770c59cf236fd1da634dabc3524e33aaffde031bb87e496b154e08.png',
    alt: 'Gravastar Mech Cyberpunk',
    link: '#catalog'
  }
]

const SLIDE_DURATION = 5000 // 5 seconds per slide

const BannerSwiper = ({ onAddToCart: _onAddToCart, theme = 'dark' }) => {
  const { lang } = useLanguage()
  const isDark = theme === 'dark'
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [progress, setProgress] = useState(0)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  const progressIntervalRef = useRef(null)
  const totalSlides = UPG_BANNERS.length

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
    setProgress(0)
  }, [totalSlides])

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
    setProgress(0)
  }

  const goToSlide = (idx) => {
    setCurrentIndex(idx)
    setProgress(0)
  }

  // Smooth progress bar and slide timer
  useEffect(() => {
    if (isHovered) return

    const stepMs = 50
    const increment = (stepMs / SLIDE_DURATION) * 100

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide()
          return 0
        }
        return prev + increment
      })
    }, stepMs)

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
  }, [isHovered, currentIndex, nextSlide])

  // Touch swipe support
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const diff = touchStart - touchEnd
    if (diff > 45) nextSlide()
    else if (diff < -45) prevSlide()
    setTouchStart(null)
    setTouchEnd(null)
  }

  const currentBanner = UPG_BANNERS[currentIndex]

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-4">
      {/* ========================================================= */}
      {/* OFFICIAL UPG.UZ SWIPER BANNER CONTAINER                   */}
      {/* ========================================================= */}
      <div
        className="relative rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-[0_15px_45px_-10px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.65)] ring-1 ring-slate-900/10 dark:ring-white/10 select-none group transition-all duration-300 bg-slate-950"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* ── TOP DYNAMIC AUTOPLAY PROGRESS LINE ── */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/20 z-30 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 transition-all duration-75 ease-linear shadow-[0_0_10px_rgba(236,72,153,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ── TOP BADGES (Glassmorphism) ── */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-5 z-30 flex items-center gap-2">
          {/* Active Banner Category Pill */}
          <div
            key={currentIndex}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white/90 bg-black/40 backdrop-blur-md border border-white/20 shadow-xs animate-fade-in-down"
          >
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            <span>{currentBanner.tag[lang] || currentBanner.tag.uz}</span>
          </div>

          {/* UPG Official Badge */}
          <div className="text-[10px] sm:text-xs font-extrabold text-white/95 border border-white/30 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md shadow-xs tracking-wider">
            UPGRADE 2026
          </div>
        </div>

        {/* ── SLIDE COUNTER (Top Left) ── */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-5 z-30 flex items-center gap-1 text-[11px] font-black text-white/90 bg-black/40 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full shadow-xs">
          <span className="text-pink-400">{currentIndex + 1}</span>
          <span className="text-white/40">/</span>
          <span>{totalSlides}</span>
        </div>

        {/* ── SLIDES TRACK ── */}
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {UPG_BANNERS.map((banner, sIdx) => {
            const currentImg = isDark ? banner.darkImage : banner.lightImage
            const fallbackImg = isDark ? banner.cdnDark : banner.cdnLight

            return (
              <a
                key={banner.id}
                href={banner.link}
                className="w-full flex-shrink-0 relative block cursor-pointer overflow-hidden focus:outline-none"
                title={banner.title[lang] || banner.title.uz}
              >
                {/* 
                  Widescreen banner presentation:
                  Matches upg.uz widescreen aspect ratio with full sharpness
                */}
                <div className="relative w-full aspect-[21/9] sm:aspect-[24/9] md:aspect-[27/9] min-h-[170px] sm:min-h-[250px] md:min-h-[320px] lg:min-h-[380px] xl:min-h-[430px] flex items-center justify-center bg-black/90">
                  <picture className="w-full h-full block">
                    {/* Dark mode image source */}
                    {isDark && (
                      <source
                        srcSet={`${banner.darkImage}, ${banner.cdnDark}`}
                        type="image/png"
                      />
                    )}
                    {/* Light mode image source */}
                    {!isDark && (
                      <source
                        srcSet={`${banner.lightImage}, ${banner.cdnLight}`}
                        type="image/png"
                      />
                    )}
                    <img
                      key={`${banner.id}-${isDark ? 'dark' : 'light'}-${currentIndex === sIdx ? 'active' : 'idle'}`}
                      src={currentImg}
                      alt={banner.alt}
                      onError={(e) => {
                        // Fallback to official CDN if local file fails
                        if (e.target.src !== fallbackImg) {
                          e.target.src = fallbackImg
                        }
                      }}
                      className={`w-full h-full object-cover sm:object-fill object-center transition-all duration-700 ease-out group-hover:scale-[1.02] ${
                        currentIndex === sIdx ? 'scale-100 opacity-100 animate-kenburns' : 'scale-[1.04] opacity-85'
                      }`}
                      loading={sIdx === 0 ? 'eager' : 'lazy'}
                    />
                  </picture>

                  {/* Subtle bottom shadow overlay to enhance contrast for dots */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                </div>
              </a>
            )
          })}
        </div>

        {/* ── PREV CIRCLE BUTTON (Left Edge - Glassmorphism) ── */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            prevSlide()
          }}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-pink-600 text-white backdrop-blur-xl flex items-center justify-center border border-white/20 hover:border-pink-500 transition-all duration-300 cursor-pointer z-30 shadow-xl hover:scale-110 active:scale-95 group/arrow opacity-80 sm:opacity-0 group-hover:opacity-100"
          aria-label="Oldingi reklama"
        >
          <svg className="w-4 h-4 sm:w-6 sm:h-6 transition-transform group-hover/arrow:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* ── NEXT CIRCLE BUTTON (Right Edge - Glassmorphism) ── */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            nextSlide()
          }}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-pink-600 text-white backdrop-blur-xl flex items-center justify-center border border-white/20 hover:border-pink-500 transition-all duration-300 cursor-pointer z-30 shadow-xl hover:scale-110 active:scale-95 group/arrow opacity-80 sm:opacity-0 group-hover:opacity-100"
          aria-label="Keyingi reklama"
        >
          <svg className="w-4 h-4 sm:w-6 sm:h-6 transition-transform group-hover/arrow:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* ── BOTTOM DOTS CAPSULE PAGINATION ── */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2 bg-black/45 backdrop-blur-xl px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/20 shadow-xl">
          {UPG_BANNERS.map((b, idx) => (
            <button
              key={b.id}
              onClick={(e) => {
                e.stopPropagation()
                goToSlide(idx)
              }}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx
                  ? 'w-6 sm:w-8 h-2 sm:h-2.5 bg-gradient-to-r from-pink-500 to-purple-400 shadow-[0_0_10px_rgba(236,72,153,0.9)]'
                  : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/40 hover:bg-white/90 hover:scale-125'
              }`}
              title={b.title[lang] || b.title.uz}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default BannerSwiper
