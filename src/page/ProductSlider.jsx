import React, { useState, useRef, useEffect, useCallback } from 'react'

const SLIDER_VISIBLE = 4 // Nechta karta bir vaqtda ko'rinadi (desktop)

const ProductSlider = ({
  products = [],
  onAddToCart,
  onOpenProduct,
  title = 'Ommabop Mahsulotlar',
  icon = '🔥',
  theme = 'light'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [visibleCount, setVisibleCount] = useState(SLIDER_VISIBLE)
  const [addedId, setAddedId] = useState(null)
  const trackRef = useRef(null)
  const autoRef = useRef(null)

  // Responsive visible cards
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < 640) setVisibleCount(1)
      else if (w < 1024) setVisibleCount(2)
      else if (w < 1280) setVisibleCount(3)
      else setVisibleCount(4)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const maxIndex = Math.max(0, products.length - visibleCount)

  const goTo = useCallback((idx) => {
    setCurrentIndex(Math.min(Math.max(idx, 0), maxIndex))
  }, [maxIndex])

  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo])
  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo])

  // Auto-play
  useEffect(() => {
    autoRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= maxIndex) return 0
        return prev + 1
      })
    }, 4000)
    return () => clearInterval(autoRef.current)
  }, [maxIndex])

  const resetAuto = () => {
    clearInterval(autoRef.current)
    autoRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, 4000)
  }

  // Drag / swipe
  const onDragStart = (clientX) => {
    setIsDragging(true)
    setDragStart(clientX)
    setDragOffset(0)
    clearInterval(autoRef.current)
  }

  const onDragMove = (clientX) => {
    if (!isDragging) return
    setDragOffset(clientX - dragStart)
  }

  const onDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    const threshold = 60
    if (dragOffset < -threshold) goNext()
    else if (dragOffset > threshold) goPrev()
    setDragOffset(0)
    resetAuto()
  }

  const handleAddToCart = (e, product) => {
    e.stopPropagation()
    onAddToCart(product)
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  if (!products.length) return null

  const cardWidthPct = 100 / visibleCount
  const translateX = -(currentIndex * cardWidthPct) + (dragOffset / (trackRef.current?.offsetWidth || 1)) * 100

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-pink-600 mb-1.5">
            {icon} Tavsiya Etiladi
          </div>
          <h2 className={`text-2xl sm:text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {title}
          </h2>
        </div>

        {/* Nav Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { goPrev(); resetAuto() }}
            disabled={currentIndex === 0}
            className={`w-10 h-10 rounded-full border shadow-sm flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-md active:scale-95 cursor-pointer ${
              theme === 'dark'
                ? 'border-slate-700 bg-slate-800 text-slate-200 hover:border-pink-500 hover:text-pink-400'
                : 'border-slate-200 bg-white text-slate-600 hover:border-pink-400 hover:text-pink-600'
            }`}
            aria-label="Oldinga"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => { goNext(); resetAuto() }}
            disabled={currentIndex >= maxIndex}
            className="w-10 h-10 rounded-full bg-pink-600 shadow-md shadow-pink-500/25 flex items-center justify-center text-white hover:bg-pink-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:shadow-lg active:scale-95 cursor-pointer"
            aria-label="Keyingisi"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Slider track */}
      <div
        className="overflow-hidden rounded-2xl cursor-grab active:cursor-grabbing select-none"
        ref={trackRef}
        onMouseDown={(e) => onDragStart(e.clientX)}
        onMouseMove={(e) => onDragMove(e.clientX)}
        onMouseUp={onDragEnd}
        onMouseLeave={onDragEnd}
        onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
        onTouchEnd={onDragEnd}
      >
        <div
          className="flex"
          style={{
            transform: `translateX(${translateX}%)`,
            transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            willChange: 'transform',
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 px-2.5"
              style={{ width: `${cardWidthPct}%` }}
            >
              <div
                className={`rounded-3xl border overflow-hidden flex flex-col h-full group cursor-pointer transition-all duration-300 cyber-card ${
                  theme === 'dark'
                    ? 'bg-[#111827]/90 border-slate-800 hover:border-pink-500/60 shadow-lg shadow-black/30'
                    : 'bg-white border-slate-200/80 hover:border-pink-300 shadow-sm hover:shadow-xl hover:shadow-pink-500/10'
                }`}
                onClick={() => onOpenProduct && onOpenProduct(product)}
              >
                {/* Image */}
                <div className={`relative aspect-[4/3] overflow-hidden ${theme === 'dark' ? 'bg-slate-900/80' : 'bg-slate-50'}`}>
                  <img
                    loading="lazy"
                    decoding="async"
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    draggable={false}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'
                    }}
                  />
                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-pink-600 to-rose-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                      {product.badge}
                    </span>
                  )}
                  {/* Stock */}
                  <span className={`absolute bottom-3 left-3 backdrop-blur-md text-[10px] font-extrabold px-2.5 py-0.5 rounded-xl shadow-xs border ${
                    theme === 'dark' ? 'bg-slate-900/90 text-slate-200 border-white/10' : 'bg-white/90 text-slate-700 border-slate-200'
                  }`}>
                    Omborda: {product.stock || 10} dona
                  </span>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className={`font-bold px-2 py-0.5 rounded-lg text-[11px] ${
                        theme === 'dark' ? 'bg-pink-950/70 text-pink-400 border border-pink-800/40' : 'bg-pink-50 text-pink-600 border border-pink-100'
                      }`}>
                        {product.category}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400 font-black">
                        <span>★</span>
                        <span className={`text-xs ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{product.rating}</span>
                      </div>
                    </div>
                    <h3 className={`font-black text-sm leading-snug line-clamp-2 mb-2 transition-colors ${
                      theme === 'dark' ? 'text-white group-hover:text-pink-400' : 'text-slate-900 group-hover:text-pink-600'
                    }`}>
                      {product.name}
                    </h3>
                  </div>

                  <div className={`flex items-center justify-between mt-auto pt-3 border-t ${
                    theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
                  }`}>
                    <div>
                      {product.oldPrice && (
                        <div className="text-[11px] text-slate-400 line-through font-semibold">{product.oldPrice}</div>
                      )}
                      <div className="font-black text-pink-600 dark:text-pink-400 text-base leading-tight tracking-tight">{product.price}</div>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer active:scale-95 ${
                        addedId === product.id
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                          : 'btn-pink btn-vauu-shine shadow-md shadow-pink-500/20'
                      }`}
                    >
                      {addedId === product.id ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Qo'shildi</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>Savatga</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {maxIndex > 0 && (
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => { goTo(i); resetAuto() }}
              className={`rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'w-6 h-2 bg-pink-600'
                  : 'w-2 h-2 bg-slate-200 hover:bg-pink-300'
              }`}
              aria-label={`Sahifa ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default ProductSlider
