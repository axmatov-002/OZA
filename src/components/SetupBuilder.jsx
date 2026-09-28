import React, { useState, useMemo } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { soundFx } from '../utils/soundEffects'

const PRESET_SETUPS = [
  {
    id: 'esports',
    name: {
      uz: '🏆 Kiber-Sport PRO (FPS & CS2)',
      ru: '🏆 Киберспорт PRO (FPS & CS2)',
      en: '🏆 Esports PRO (FPS & CS2)'
    },
    icon: '⚡',
    badge: '8000Hz Ultra-Fast',
    desc: {
      uz: '1ms ultra past kechikish, yengil vaznli optik sichqoncha va Red switchlar.',
      ru: '1мс отклик, сверхлегкая оптическая мышь и тихие переключатели Red.',
      en: '1ms ultra-low latency, featherlight optical mouse and swift Red switches.'
    },
    items: [
      {
        id: 'sb-p1',
        name: 'UPGRADE CyberBlade Pro RGB Wireless Klaviatura',
        category: 'Klaviaturalar',
        priceNum: 890000,
        image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'sb-p2',
        name: 'UPGRADE Phantom V3 Ultralight Sichqoncha',
        category: 'Sichqonchalar',
        priceNum: 450000,
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'sb-p3',
        name: 'UPGRADE ApexSound 7.1 Fazoviy Audio Naushnik',
        category: 'Naushniklar',
        priceNum: 620000,
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'sb-p4',
        name: 'UPGRADE CyberMat XXL RGB Gilamcha 900x400',
        category: 'RGB Gilamchalar',
        priceNum: 240000,
        image: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&w=600&q=80'
      }
    ],
    discountPct: 15
  },
  {
    id: 'developer',
    name: {
      uz: '💻 Dasturchi & Ergonomik Setup',
      ru: '💻 Для Программистов & Эргономика',
      en: '💻 Developer & Ergonomic Studio'
    },
    icon: '☕',
    badge: 'Taktil & Ergonomik',
    desc: {
      uz: 'Uzoq vaqt charchamasdan ishlash uchun taktil klaviatura va ergonomik tutqich.',
      ru: 'Для многочасового комфортного написания кода без усталости рук.',
      en: 'Tactile typing feedback and natural wrist ergonomics for long hours.'
    },
    items: [
      {
        id: 'sb-p5',
        name: 'UPGRADE MechMaster TKL Brown Switch',
        category: 'Klaviaturalar',
        priceNum: 750000,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'sb-p6',
        name: 'UPGRADE Ergonomic Vertical Wireless Sichqoncha',
        category: 'Sichqonchalar',
        priceNum: 380000,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'sb-p7',
        name: 'UPGRADE Studio ANC Shovqinni To\'suvchi Naushnik',
        category: 'Naushniklar',
        priceNum: 890000,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
      }
    ],
    discountPct: 12
  },
  {
    id: 'streamer',
    name: {
      uz: '🎙️ Striming & Kontent Meyker',
      ru: '🎙️ Стриминг & Создание Контента',
      en: '🎙️ Streaming & Content Creator'
    },
    icon: '🎥',
    badge: 'Broadcast Studio',
    desc: {
      uz: 'Kristall tiniq ovoz yozuvchi mikrofon, 4K veb-kamera va RGB chiroqlar.',
      ru: 'Студийный микрофон, 4K веб-камера и объемный стриминговый свет.',
      en: 'Studio condenser microphone, ultra-sharp webcam and dynamic RGB.'
    },
    items: [
      {
        id: 'sb-p8',
        name: 'UPGRADE VoiceMaster Kondensator Mikrofon + Pantograf',
        category: 'Strim & Audio',
        priceNum: 790000,
        image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'sb-p9',
        name: 'UPGRADE StreamCam 4K 60FPS AI Veb-kamera',
        category: 'Strim & Audio',
        priceNum: 850000,
        image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'sb-p10',
        name: 'UPGRADE NeonHalo RGB Monitor Lightbar',
        category: 'Stol & Qavslar',
        priceNum: 390000,
        image: 'https://images.unsplash.com/photo-1517055729445-fa7d27394b48?auto=format&fit=crop&w=600&q=80'
      }
    ],
    discountPct: 15
  }
]

const SetupBuilder = ({ onAddToCart, theme = 'light' }) => {
  const { lang, formatPrice } = useLanguage()
  const isDark = theme === 'dark'
  const [selectedSetupId, setSelectedSetupId] = useState('esports')
  const [addedSuccess, setAddedSuccess] = useState(false)

  const currentSetup = useMemo(() => {
    return PRESET_SETUPS.find((s) => s.id === selectedSetupId) || PRESET_SETUPS[0]
  }, [selectedSetupId])

  const originalTotal = useMemo(() => {
    return currentSetup.items.reduce((sum, item) => sum + item.priceNum, 0)
  }, [currentSetup])

  const bundleTotal = useMemo(() => {
    return Math.round(originalTotal * (1 - currentSetup.discountPct / 100))
  }, [originalTotal, currentSetup.discountPct])

  const savingsAmount = originalTotal - bundleTotal

  const handleAddAllToCart = () => {
    soundFx.playCartSuccess()
    // Add each item with bundle discount indicator
    currentSetup.items.forEach((item) => {
      if (onAddToCart) {
        onAddToCart({
          ...item,
          price: formatPrice(item.priceNum),
          priceNum: item.priceNum,
          badge: `${currentSetup.badge} (-${currentSetup.discountPct}%)`
        })
      }
    })
    setAddedSuccess(true)
    setTimeout(() => setAddedSuccess(false), 3000)
  }

  return (
    <section id="setup-builder" className="py-16 px-4 max-w-7xl mx-auto scroll-mt-24">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-pink-500/10 text-pink-500 border border-pink-500/30 mb-3">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          <span>CYBER SETUP BUILDER 2026</span>
        </div>
        <h2 className={`text-3xl sm:text-4xl font-black font-heading ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {lang === 'ru'
            ? 'Интерактивный конструктор сетапа'
            : lang === 'en'
            ? 'Interactive Cyber Setup Builder'
            : "Tayyor Kiber-Setup Konstruktori"}
        </h2>
        <p className={`text-sm sm:text-base mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {lang === 'ru'
            ? 'Выберите свой профиль: получите идеально подобранный комплект со скидкой до 15% в один клик!'
            : lang === 'en'
            ? 'Pick your gaming or work discipline: get an expertly matched gear bundle with up to 15% off in one click!'
            : "O'yin yoki ish yo'nalishingizni tanlang: bir-biriga 100% mos to'plamni 15% gacha chegirma bilan oling!"}
        </p>
      </div>

      {/* Profile Selector Pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {PRESET_SETUPS.map((setup) => {
          const isSelected = selectedSetupId === setup.id
          return (
            <button
              key={setup.id}
              onClick={() => {
                setSelectedSetupId(setup.id)
                soundFx.playTap()
              }}
              className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2.5 transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white border-pink-500 shadow-lg shadow-pink-500/30 scale-105'
                  : isDark
                  ? 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-pink-300 shadow-xs'
              }`}
            >
              <span className="text-lg">{setup.icon}</span>
              <span>{setup.name[lang] || setup.name.uz}</span>
            </button>
          )
        })}
      </div>

      {/* Main Bundle Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
        isDark
          ? 'bg-slate-900/80 border-slate-800 shadow-2xl'
          : 'bg-white/90 border-slate-200/80 shadow-xl'
      }`}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-block px-3 py-1 rounded-xl bg-pink-500/15 text-pink-500 text-xs font-bold font-mono mb-2">
              ⭐ {currentSetup.badge} • -{currentSetup.discountPct}% BUNDLE DISCOUNT
            </div>
            <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {currentSetup.name[lang] || currentSetup.name.uz}
            </h3>
            <p className={`text-sm mt-1 max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {currentSetup.desc[lang] || currentSetup.desc.uz}
            </p>
          </div>

          {/* Pricing & Add All Button */}
          <div className="flex flex-col sm:flex-row items-center gap-5 text-right w-full lg:w-auto shrink-0 justify-end">
            <div>
              <div className="text-xs line-through text-slate-400 font-bold">
                {formatPrice(originalTotal)}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-pink-500 font-heading">
                {formatPrice(bundleTotal)}
              </div>
              <div className="text-[11px] text-emerald-500 font-extrabold">
                {lang === 'ru' ? 'Вы экономите:' : lang === 'en' ? 'You save:' : 'Tejov:'} {formatPrice(savingsAmount)}
              </div>
            </div>

            <button
              onClick={handleAddAllToCart}
              className={`w-full sm:w-auto px-6 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer shadow-xl ${
                addedSuccess
                  ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 text-white shadow-pink-500/30 hover:shadow-pink-500/50'
              }`}
            >
              <span>{addedSuccess ? '✓' : '🛒'}</span>
              <span>
                {addedSuccess
                  ? (lang === 'ru' ? 'Комплект в корзине!' : lang === 'en' ? 'Bundle in Cart!' : "To'plam savatga qo'shildi!")
                  : (lang === 'ru' ? 'Забрать весь комплект (-15%)' : lang === 'en' ? 'Get Entire Bundle (-15%)' : "To'liq to'plamni olish (-15%)")}
              </span>
            </button>
          </div>
        </div>

        {/* Included Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {currentSetup.items.map((item, idx) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between transition-all group ${
                isDark
                  ? 'bg-slate-950/60 border-slate-800 hover:border-pink-500/50'
                  : 'bg-slate-50/80 border-slate-200/80 hover:border-pink-300'
              }`}
            >
              <div>
                <div className="relative mb-3 rounded-xl overflow-hidden aspect-video bg-black/10">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-mono">
                    #{idx + 1}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-pink-500 uppercase tracking-wider">
                  {item.category}
                </span>
                <h4 className={`text-xs sm:text-sm font-bold mt-1 line-clamp-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {item.name}
                </h4>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-black text-pink-500">
                  {formatPrice(item.priceNum)}
                </span>
                <span className="text-[10px] font-bold text-emerald-500">
                  ✓ Qism
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SetupBuilder
