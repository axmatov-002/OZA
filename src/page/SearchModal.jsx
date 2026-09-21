import React, { useState, useEffect, useRef } from 'react'

const SearchModal = ({
  isOpen,
  onClose,
  products = [],
  onAddToCart,
  onOpenProduct,
  theme = 'light'
}) => {
  const isDark = theme === 'dark'
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Barchasi')
  const [sortBy, setSortBy] = useState('default') // 'default' | 'price-asc' | 'price-desc' | 'rating'
  const inputRef = useRef(null)

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    } else {
      setQuery('')
      setSelectedCategory('Barchasi')
    }
  }, [isOpen])

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const categories = [
    'Barchasi',
    'Klaviaturalar',
    'Sichqonchalar',
    'Naushniklar',
    'RGB Gilamchalar',
    'Stol & Qavslar',
    'Strim & Audio'
  ]

  const popularSearches = [
    'CyberBlade',
    'Sichqoncha',
    '7.1 Naushnik',
    'RGB Gilamcha',
    'Mexanik',
    'Wireless'
  ]

  // Filter products
  let filtered = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'Barchasi' || p.category === selectedCategory
    const q = query.trim().toLowerCase()
    if (!q) return matchesCategory

    const matchesName = p.name?.toLowerCase().includes(q)
    const matchesCategoryName = p.category?.toLowerCase().includes(q)
    const matchesDesc = p.description?.toLowerCase().includes(q)
    const matchesBadge = p.badge?.toLowerCase().includes(q)

    return matchesCategory && (matchesName || matchesCategoryName || matchesDesc || matchesBadge)
  })

  // Sort products
  if (sortBy === 'price-asc') {
    filtered = [...filtered].sort((a, b) => a.priceNum - b.priceNum)
  } else if (sortBy === 'price-desc') {
    filtered = [...filtered].sort((a, b) => b.priceNum - a.priceNum)
  } else if (sortBy === 'rating') {
    filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0))
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-start justify-center animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Search Modal Box */}
      <div
        className={`relative w-full max-w-3xl rounded-3xl shadow-2xl border overflow-hidden my-6 transition-all duration-300 ${
          isDark
            ? 'bg-[#0f172a] border-slate-800 text-white shadow-black/80'
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/60'
        }`}
      >
        {/* Top Search Input Bar */}
        <div className={`p-4 sm:p-6 border-b flex items-center gap-3 ${isDark ? 'border-slate-800/80 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'}`}>
          <div className="w-10 h-10 rounded-2xl bg-pink-500/10 text-pink-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Aksessuarlar nomi, toifasi yoki xususiyatini yozing..."
            className={`flex-1 bg-transparent text-base sm:text-lg font-semibold focus:outline-none placeholder:font-normal ${
              isDark ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'
            }`}
          />

          {query && (
            <button
              onClick={() => setQuery('')}
              className={`p-1.5 rounded-xl text-xs font-bold transition-colors ${
                isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-200 text-slate-600 hover:text-slate-900'
              }`}
              title="Tozalash"
            >
              ✕
            </button>
          )}

          <button
            onClick={onClose}
            className={`p-2 rounded-2xl border text-xs font-bold transition-colors cursor-pointer ${
              isDark ? 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white' : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900'
            }`}
          >
            ESC
          </button>
        </div>

        {/* Categories Bar */}
        <div className={`px-4 sm:px-6 py-3 border-b flex items-center gap-2 overflow-x-auto no-scrollbar ${isDark ? 'border-slate-800/60 bg-slate-950/40' : 'border-slate-100 bg-slate-50/30'}`}>
          <span className="text-xs font-bold text-slate-400 shrink-0">Bo'lim:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'btn-pink shadow-xs scale-102'
                  : isDark
                  ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Bar: Popular Searches & Sort */}
        <div className={`px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b ${isDark ? 'border-slate-800/50 bg-slate-900/30 text-slate-400' : 'border-slate-100 bg-white text-slate-500'}`}>
          {/* Quick tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-pink-500">🔥 Trend:</span>
            {popularSearches.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className={`px-2 py-0.5 rounded-md hover:text-pink-500 transition-colors cursor-pointer ${
                  isDark ? 'bg-slate-800/60 hover:bg-slate-800 text-slate-300' : 'bg-slate-100 hover:bg-slate-200/70 text-slate-600'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5">
            <span>Tartiblash:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-2 py-1 rounded-lg border text-xs font-semibold focus:outline-none cursor-pointer ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <option value="default">Odatiy</option>
              <option value="price-asc">Narx: Arzondan</option>
              <option value="price-desc">Narx: Qimmatdan</option>
              <option value="rating">Reyting: Yuqori</option>
            </select>
          </div>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-pink-500/10 text-pink-500 text-2xl flex items-center justify-center mx-auto mb-3">
                🔍
              </div>
              <h3 className={`text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Hech qanday aksessuar topilmadi
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                "{query}" so'rovi bo'yicha mahsulot topilmadi. Boshqa so'z bilan qidirib ko'ring yoki barcha toifalarni tanlang.
              </p>
              <button
                onClick={() => {
                  setQuery('')
                  setSelectedCategory('Barchasi')
                }}
                className="btn-pink px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                Qidiruvni tozalash
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-slate-400 px-1 mb-1">
                <span>Topilgan aksessuarlar soni: <strong className="text-pink-500 font-bold">{filtered.length} ta</strong></span>
                <span>Ko'rish yoki savatga qo'shish uchun bosing</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filtered.map((product) => (
                  <div
                    key={product.id}
                    className={`p-3 rounded-2xl border flex items-center gap-3.5 transition-all group hover:border-pink-400/60 ${
                      isDark
                        ? 'bg-slate-900/70 border-slate-800/90 hover:bg-slate-800/80 shadow-md shadow-black/20'
                        : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div
                      className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-black/10 cursor-pointer"
                      onClick={() => {
                        onOpenProduct && onOpenProduct(product)
                        onClose()
                      }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'
                        }}
                      />
                      {product.badge && (
                        <span className="absolute top-1 left-1 bg-pink-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold text-pink-600 bg-pink-500/10 px-1.5 py-0.5 rounded-md">
                          {product.category}
                        </span>
                        <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5">
                          ★ {product.rating}
                        </span>
                      </div>

                      <h4
                        onClick={() => {
                          onOpenProduct && onOpenProduct(product)
                          onClose()
                        }}
                        className={`text-xs font-bold truncate cursor-pointer hover:text-pink-500 transition-colors mb-1 ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                        title={product.name}
                      >
                        {product.name}
                      </h4>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-pink-600">
                          {product.priceNum ? product.priceNum.toLocaleString('uz-UZ') : product.price} so'm
                        </span>

                        <button
                          onClick={() => onAddToCart && onAddToCart(product)}
                          className="btn-pink px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer active:scale-95"
                          title="Savatga qo'shish"
                        >
                          <span>+</span>
                          <span>Savat</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer info */}
        <div className={`px-6 py-3 border-t flex items-center justify-between text-xs ${isDark ? 'border-slate-800/60 bg-slate-950/40 text-slate-400' : 'border-slate-100 bg-slate-50/50 text-slate-500'}`}>
          <div className="flex items-center gap-2">
            <span>💡 Maslahat: Mahsulot ustiga bosib batafsil ma'lumot olishingiz mumkin</span>
          </div>
          <button
            onClick={onClose}
            className="text-pink-600 hover:text-pink-700 font-bold cursor-pointer"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchModal
