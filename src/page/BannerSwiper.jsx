import React, { useState, useEffect, useRef } from 'react'

const SLIDES = [
  {
    id: 1,
    tag: 'Mavsumiy Yangiliklar',
    title: 'Trendli kuz',
    subtitle: 'Ommabop tovarlar',
    desc: 'Kuz mavsumi uchun eng talabgir va zamonaviy kompyuter aksessuarlari to\'plami',
    buttonText: 'Buyurtma qilish ›',
    buttonClass: 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-xl shadow-purple-900/40',
    bgGradient: 'from-[#e05328] via-[#e85d34] to-[#cb461b]',
    modelImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    gadgetImg: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=500&q=80',
    badge: 'Trend 2026',
    leafIllustration: true
  },
  {
    id: 2,
    tag: 'Maxsus Chegirma',
    title: 'Pro Gaming',
    subtitle: 'CyberBlade RGB',
    desc: 'Mexanik Hot-Swap tugmalar, 16.8M RGB chiroqlar va 120 soatlik simsiz avtonomlik',
    buttonText: 'Buyurtma qilish ›',
    buttonClass: 'bg-pink-600 hover:bg-pink-700 text-white shadow-xl shadow-pink-900/40',
    bgGradient: 'from-[#1e1b4b] via-[#312e81] to-[#4c1d95]',
    modelImg: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=800&q=80',
    gadgetImg: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=80',
    badge: '-35% Aksiya',
    leafIllustration: false
  },
  {
    id: 3,
    tag: 'Fazoviy Ovoz',
    title: 'ApexSound 7.1',
    subtitle: 'Pro Headset',
    desc: '360° fazoviy aniqlik, shovqinni bosuvchi mikrofon va qulay memory-foam yostiqchalar',
    buttonText: 'Buyurtma qilish ›',
    buttonClass: 'bg-sky-500 hover:bg-sky-600 text-white shadow-xl shadow-sky-900/40',
    bgGradient: 'from-[#082f49] via-[#0284c7] to-[#0ea5e9]',
    modelImg: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    gadgetImg: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=500&q=80',
    badge: '2 Yil Kafolat',
    leafIllustration: false
  },
  {
    id: 4,
    tag: 'Kiber Sport',
    title: 'Phantom V3',
    subtitle: 'Superlight Mouse',
    desc: 'Atigi 58 gramm, 26 000 DPI flagman sensori va lag-free simsiz ulanish',
    buttonText: 'Buyurtma qilish ›',
    buttonClass: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-900/40',
    bgGradient: 'from-[#064e3b] via-[#059669] to-[#10b981]',
    modelImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    gadgetImg: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=500&q=80',
    badge: 'Bepul Yetkazish',
    leafIllustration: false
  }
]

const BannerSwiper = ({ onAddToCart }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const autoPlayRef = useRef(null)

  const totalSlides = SLIDES.length

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  // Auto play timer
  useEffect(() => {
    if (isHovered) return

    autoPlayRef.current = setInterval(() => {
      nextSlide()
    }, 4500)

    return () => clearInterval(autoPlayRef.current)
  }, [isHovered, currentIndex])

  // Touch handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (distance > 50) {
      nextSlide()
    } else if (distance < -50) {
      prevSlide()
    }
    setTouchStart(null)
    setTouchEnd(null)
  }

  const currentSlide = SLIDES[currentIndex]

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
      {/* Main Swiper Container */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-2xl transition-all select-none group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides Track */}
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {SLIDES.map((slide) => (
            <div
              key={slide.id}
              className={`w-full flex-shrink-0 relative overflow-hidden bg-gradient-to-r ${slide.bgGradient} min-h-[360px] sm:min-h-[420px] md:min-h-[460px] lg:min-h-[480px] flex items-center`}
            >
              {/* Decorative Autumn Leaves / Cyber Contour Lines (as seen in user screenshot) */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <svg
                  className="absolute right-12 top-6 w-96 h-96 stroke-white fill-none stroke-[1.5]"
                  viewBox="0 0 200 200"
                >
                  <path d="M100 10 C120 40, 160 50, 190 70 C160 90, 150 130, 170 180 C130 160, 90 170, 70 190 C50 160, 20 150, 10 120 C40 100, 30 60, 10 30 C50 40, 80 20, 100 10 Z" />
                </svg>
                <svg
                  className="absolute left-1/3 bottom-0 w-72 h-72 stroke-white fill-none stroke-[1.2] -rotate-45"
                  viewBox="0 0 200 200"
                >
                  <path d="M100 10 C120 40, 160 50, 190 70 C160 90, 150 130, 170 180 C130 160, 90 170, 70 190 C50 160, 20 150, 10 120 C40 100, 30 60, 10 30 C50 40, 80 20, 100 10 Z" />
                </svg>
              </div>

              {/* Grid content inside slide */}
              <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-12 items-center px-6 sm:px-12 lg:px-16 py-8">
                {/* Left: Model image with decorative outline (like in screenshot) */}
                <div className="md:col-span-4 flex items-center justify-center relative mb-6 md:mb-0">
                  <div className="relative">
                    {/* Outline glow behind model */}
                    <div className="absolute -inset-2 rounded-3xl border-2 border-white/30 -rotate-3 pointer-events-none" />
                    
                    <div className="w-48 h-56 sm:w-60 sm:h-72 md:w-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/50 relative bg-black/20">
                      <img
                        loading="lazy"
                        decoding="async"
                        src={slide.modelImg}
                        alt={slide.title}
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Badge over model */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-3.5 py-1 rounded-full text-xs font-black shadow-lg uppercase tracking-wider whitespace-nowrap">
                      {slide.badge}
                    </div>
                  </div>
                </div>

                {/* Center / Right: Big Bold Typography & CTA */}
                <div className="md:col-span-5 text-center md:text-left text-white px-2 sm:px-6">
                  {/* Tag */}
                  <span className="inline-block bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 text-white border border-white/25">
                    {slide.tag}
                  </span>

                  {/* Big Headline (exact match to screenshot style: "Trendli kuz") */}
                  <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] mb-2 drop-shadow-md">
                    {slide.title}
                  </h2>

                  {/* Sub-headline (exact match to screenshot style: "Ommabop tovarlar") */}
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold opacity-95 mb-4 tracking-tight leading-snug">
                    {slide.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-white/80 max-w-md mb-6 leading-relaxed hidden sm:block">
                    {slide.desc}
                  </p>

                  {/* CTA Button */}
                  <div>
                    <a
                      href="#catalog"
                      className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-base sm:text-lg font-black transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer btn-vauu-shine ${slide.buttonClass}`}
                    >
                      <span>{slide.buttonText}</span>
                    </a>
                  </div>
                </div>

                {/* Right: Gadget / Product showcase card */}
                <div className="hidden md:flex md:col-span-3 items-center justify-center relative">
                  <div className="relative group/gadget">
                    <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl p-3 bg-white/10 backdrop-blur-xl border-2 border-white/30 shadow-2xl flex items-center justify-center transform group-hover/gadget:rotate-3 transition-transform duration-500">
                      <img
                        loading="lazy"
                        decoding="async"
                        src={slide.gadgetImg}
                        alt="Mahsulot"
                        className="w-full h-full object-contain rounded-2xl drop-shadow-2xl"
                      />
                    </div>
                    {/* Floating mini badge */}
                    <div className="absolute -top-2 -right-2 bg-pink-500 text-white px-2.5 py-1 rounded-xl text-[10px] font-black shadow-md uppercase">
                      TOP XARID
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── PREV CIRCLE BUTTON (Left Edge) ── */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md text-white border border-white/30 flex items-center justify-center transition-all duration-200 cursor-pointer z-20 shadow-lg hover:scale-105 active:scale-90"
          aria-label="Oldingi banner"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* ── NEXT CIRCLE BUTTON (Right Edge) ── */}
        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md text-white border border-white/30 flex items-center justify-center transition-all duration-200 cursor-pointer z-20 shadow-lg hover:scale-105 active:scale-90"
          aria-label="Keyingi banner"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* ── BOTTOM DOT PAGINATION ── */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx
                  ? 'w-7 bg-white'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default BannerSwiper
