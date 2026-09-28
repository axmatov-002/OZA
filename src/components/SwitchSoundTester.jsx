import React, { useState, useEffect, useRef } from 'react'
import { soundFx } from '../utils/soundEffects'
import { useLanguage } from '../context/LanguageContext'

const SWITCHES = [
  {
    id: 'blue',
    name: 'Clicky Blue Switch',
    titleBadge: 'Clicky & Crisp',
    color: '#3b82f6',
    stemColor: '#2563eb',
    housingColor: 'rgba(59, 130, 246, 0.15)',
    border: 'border-blue-500',
    glow: 'rgba(59, 130, 246, 0.45)',
    type: 'blue',
    profile: 'Jarangdor Klik & Clack (High Pitch 3.6 kHz)',
    specs: {
      force: '50g',
      actuation: '2.0mm',
      totalTravel: '4.0mm',
      feel: 'Aniq taktil klik'
    },
    desc: {
      uz: "Aniq metall klik bargchasi (click leaf) va jarangdor akustika. Matn terish, dasturlash va aniq sezgi talab qiluvchilar uchun ideal.",
      ru: "Чёткий металлический клик и звонкая акустика. Идеально для набора текста, программирования и максимального тактильного контроля.",
      en: "Crisp metallic click-leaf tactile snap with high-pitched acoustic clack. Perfect for high-speed typing and precision feedback."
    }
  },
  {
    id: 'red',
    name: 'Linear Red Switch',
    titleBadge: 'Creamy Thock',
    color: '#ef4444',
    stemColor: '#dc2626',
    housingColor: 'rgba(239, 68, 68, 0.15)',
    border: 'border-rose-500',
    glow: 'rgba(239, 68, 68, 0.45)',
    type: 'red',
    profile: 'Chuqur Quyuq Thock (Low Pitch 220 Hz)',
    specs: {
      force: '45g',
      actuation: '1.8mm',
      totalTravel: '3.6mm',
      feel: 'Mayin va tekis'
    },
    desc: {
      uz: "To'siqsiz, ultra-tezkor va mayin harakat. Past chastotali chuqur 'Thock' ovozi — CS2, Valorant va kiber-o'yinlar uchun maxsus tanlov.",
      ru: "Плавный линейный ход без сопротивления. Глубокий басовитый «Thock» звук — лучший выбор для киберспорта (CS2, Apex, Valorant).",
      en: "Ultra-smooth linear actuation with zero tactile bump. Deep, creamy low-frequency 'Thock' sound optimized for competitive gaming."
    }
  },
  {
    id: 'brown',
    name: 'Tactile Brown Switch',
    titleBadge: 'Silent Tactile',
    color: '#f59e0b',
    stemColor: '#d97706',
    housingColor: 'rgba(245, 158, 11, 0.15)',
    border: 'border-amber-500',
    glow: 'rgba(245, 158, 11, 0.45)',
    type: 'brown',
    profile: 'Yumshoq Taktil (Mid Pitch 1.6 kHz)',
    specs: {
      force: '55g',
      actuation: '2.0mm',
      totalTravel: '4.0mm',
      feel: 'Yengil to\'siq'
    },
    desc: {
      uz: "Kliksiz yengil taktil to'siq. Kechasi ishlash, ofis va o'yinlar uchun universal balanslashgan sokin mexanik tovush.",
      ru: "Мягкий тактильный бугорок без громкого щелчка. Идеальный баланс тишины и тактильности для ночной работы и игр.",
      en: "Gentle tactile bump without loud auditory click. Universally balanced acoustic dampening for quiet offices and late-night gaming."
    }
  }
]

// Realistic SVG rendering of a Mechanical Keyboard Switch with MX Cross-Stem and Spring
const MechanicalSwitchVisual = ({ sw, isPressed }) => {
  return (
    <div className="relative w-28 h-28 mx-auto flex items-center justify-center select-none pointer-events-none">
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
        {/* Outer Switch Housing Base */}
        <rect
          x="15"
          y="42"
          width="90"
          height="62"
          rx="12"
          fill="#1e293b"
          stroke="#475569"
          strokeWidth="3"
        />

        {/* Translucent Upper Polycarbonate Housing */}
        <path
          d="M 22 42 L 32 20 L 88 20 L 98 42 Z"
          fill={sw.housingColor}
          stroke={sw.color}
          strokeWidth="2"
          strokeOpacity="0.6"
        />

        {/* Internal Golden Spring */}
        <g opacity="0.85">
          <path
            d={
              isPressed
                ? "M 52 48 Q 68 52 52 56 Q 68 60 52 64 Q 68 68 52 72 Q 68 76 60 80"
                : "M 52 38 Q 68 44 52 50 Q 68 56 52 62 Q 68 68 52 74 Q 68 80 52 86 Q 68 90 60 94"
            }
            fill="none"
            stroke="#fbbf24"
            strokeWidth="3"
            strokeLinecap="round"
            className="transition-all duration-75"
          />
        </g>

        {/* Cross MX Stem (Moves physically downward upon keypress) */}
        <g
          className="transition-transform duration-75 ease-out"
          style={{
            transform: isPressed ? 'translateY(16px)' : 'translateY(0px)',
            transformOrigin: 'center top'
          }}
        >
          {/* Stem Base Block */}
          <rect
            x="42"
            y="18"
            width="36"
            height="30"
            rx="4"
            fill={sw.stemColor}
            stroke="#ffffff"
            strokeWidth="1"
            strokeOpacity="0.3"
          />

          {/* Cherry MX Cross Mount (+) */}
          {/* Vertical Bar */}
          <rect
            x="54"
            y="6"
            width="12"
            height="26"
            rx="2"
            fill={sw.color}
            stroke="#ffffff"
            strokeWidth="1.2"
          />
          {/* Horizontal Bar */}
          <rect
            x="46"
            y="12"
            width="28"
            height="10"
            rx="2"
            fill={sw.color}
            stroke="#ffffff"
            strokeWidth="1.2"
          />
          {/* Stem Center Cross Dot */}
          <circle cx="60" cy="17" r="2" fill="#ffffff" opacity="0.8" />
        </g>

        {/* LED Backlight Glow Dot */}
        <circle
          cx="60"
          cy="92"
          r="4"
          fill={sw.color}
          filter="drop-shadow(0 0 6px currentColor)"
          className="animate-pulse"
        />
      </svg>

      {/* Ripple Soundwave Animation on click */}
      {isPressed && (
        <span
          className="absolute inset-0 rounded-full border-2 animate-ping pointer-events-none"
          style={{ borderColor: sw.color }}
        />
      )}
    </div>
  )
}

const SwitchSoundTester = ({ theme = 'light' }) => {
  const { lang } = useLanguage()
  const isDark = theme === 'dark'
  const [activeSwitch, setActiveSwitch] = useState('blue')
  const [pressedKey, setPressedKey] = useState(null)
  const [clickCount, setClickCount] = useState(0)
  const [typingText, setTypingText] = useState('')
  const [lastKeyPressed, setLastKeyPressed] = useState(null)
  const [isAudioActive, setIsAudioActive] = useState(false)
  const audioTimeoutRef = useRef(null)

  const currentSw = SWITCHES.find((s) => s.id === activeSwitch) || SWITCHES[0]

  const triggerSound = (swId, isRelease = false) => {
    const sw = SWITCHES.find((s) => s.id === swId) || currentSw
    soundFx.playSwitchClick(sw.type, isRelease)

    if (!isRelease) {
      setClickCount((c) => c + 1)
      setIsAudioActive(true)
      if (audioTimeoutRef.current) clearTimeout(audioTimeoutRef.current)
      audioTimeoutRef.current = setTimeout(() => setIsAudioActive(false), 220)
    }
  }

  const handleTestClick = (sw) => {
    setActiveSwitch(sw.id)
    setPressedKey(sw.id)
    triggerSound(sw.id, false)
    setTimeout(() => {
      triggerSound(sw.id, true)
      setPressedKey(null)
    }, 120)
  }

  // Handle typing test input so user can type naturally and hear every keystroke
  const handleTypingKeyDown = (e) => {
    setLastKeyPressed(e.key.length === 1 ? e.key.toUpperCase() : e.code)
    setPressedKey(activeSwitch)
    triggerSound(activeSwitch, false)
  }

  const handleTypingKeyUp = () => {
    triggerSound(activeSwitch, true)
    setTimeout(() => setPressedKey(null), 80)
  }

  useEffect(() => {
    return () => {
      if (audioTimeoutRef.current) clearTimeout(audioTimeoutRef.current)
    }
  }, [])

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div
        className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
          isDark
            ? 'bg-gradient-to-br from-slate-900/95 via-[#0c1220] to-slate-900/95 border-slate-800 shadow-2xl shadow-pink-500/5'
            : 'bg-gradient-to-br from-slate-50 via-white to-pink-50/40 border-slate-200/90 shadow-xl'
        }`}
      >
        {/* Cyber Neon Ambient Glow */}
        <div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-500 opacity-20"
          style={{ backgroundColor: currentSw.color }}
        />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-pink-500/10 text-pink-500 border border-pink-500/30 mb-2">
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                <span>INTERACTIVE ACOUSTIC LAB 2026</span>
              </div>
              <h3 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {lang === 'ru'
                  ? 'Лаборатория звука переключателей (Switch Sound Lab)'
                  : lang === 'en'
                  ? 'Mechanical Switch Acoustic Lab (Real Physical Audio)'
                  : 'Mexanik Switch Ovozini Sinash (Switch Sound Lab)'}
              </h3>
              <p className={`text-xs sm:text-sm mt-1 max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {lang === 'ru'
                  ? 'Реалистичное физическое моделирование механики: клик-пластина, демпферы и акустический резонанс корпуса.'
                  : lang === 'en'
                  ? 'Authentic mechanical acoustic modeling: contact click-leaf, bottom-out plate resonance, and keycap thock.'
                  : "Haqiqiy mexanik akustika: kontakt bargi kliki, korpus rezonansi va past chastotali 'thock' tovushlari bilan modellashtirilgan."}
              </p>
            </div>

            {/* Top Right Counter & Live Audio Meter */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              {/* Equalizer Visualizer */}
              <div
                className={`flex items-end gap-1 h-8 px-3 py-1 rounded-xl border ${
                  isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200'
                }`}
                title="Jonli ovoz chastotasi"
              >
                {[40, 75, 95, 60, 85, 50, 90, 65].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 rounded-full transition-all duration-100"
                    style={{
                      height: isAudioActive ? `${Math.min(100, h * (0.8 + Math.random() * 0.4))}%` : '20%',
                      backgroundColor: isAudioActive ? currentSw.color : isDark ? '#475569' : '#cbd5e1'
                    }}
                  />
                ))}
              </div>

              <div
                className={`px-3.5 py-2 rounded-2xl border text-xs font-mono flex items-center gap-2 ${
                  isDark ? 'bg-slate-950/70 border-slate-800 text-pink-400' : 'bg-white border-slate-200 text-pink-600'
                }`}
              >
                <span>⚡ Kliklar: <strong className="text-sm font-black">{clickCount}</strong></span>
                <span className="text-slate-500">•</span>
                <span className="text-[11px] font-bold text-emerald-500">Hi-Fi Audio Synth</span>
              </div>
            </div>
          </div>

          {/* Switch Interactive Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-8">
            {SWITCHES.map((sw) => {
              const isSelected = activeSwitch === sw.id
              const isBeingPressed = pressedKey === sw.id

              return (
                <div
                  key={sw.id}
                  onClick={() => handleTestClick(sw)}
                  className={`p-6 rounded-3xl border transition-all duration-200 cursor-pointer select-none relative group flex flex-col justify-between ${
                    isSelected
                      ? isDark
                        ? 'border-pink-500 bg-slate-800/90 shadow-2xl shadow-pink-500/10 ring-2 ring-pink-500/30'
                        : 'border-pink-500 bg-white shadow-xl shadow-pink-500/15 ring-2 ring-pink-500/20'
                      : isDark
                      ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
                      : 'border-slate-200 bg-white/80 hover:border-slate-300 hover:bg-white'
                  } ${isBeingPressed ? 'scale-[0.97]' : 'hover:-translate-y-1'}`}
                >
                  <div>
                    {/* Header of Card */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-sm"
                        style={{ backgroundColor: sw.color }}
                      >
                        {sw.titleBadge}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        {sw.specs.force} • {sw.specs.actuation}
                      </span>
                    </div>

                    {/* Realistic 3D Switch Visual */}
                    <div className="py-2">
                      <MechanicalSwitchVisual sw={sw} isPressed={isBeingPressed} />
                    </div>

                    <h4 className={`text-lg font-black text-center mt-2 mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {sw.name}
                    </h4>

                    {/* Audio profile tag */}
                    <p className="text-center text-[11px] font-bold text-pink-600 dark:text-pink-400 mb-3 font-mono">
                      🎵 {sw.profile}
                    </p>

                    <p className={`text-xs mb-4 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {sw.desc[lang] || sw.desc.uz}
                    </p>

                    {/* Specs micro-grid */}
                    <div className={`grid grid-cols-2 gap-2 p-2.5 rounded-2xl mb-4 text-[11px] border ${
                      isDark ? 'bg-slate-950/60 border-slate-800/80 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-700'
                    }`}>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Bosim kuchi:</span>
                        <strong className="font-mono">{sw.specs.force}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Kontakt yo'li:</span>
                        <strong className="font-mono">{sw.specs.actuation}</strong>
                      </div>
                    </div>
                  </div>

                  {/* 3D Realistic Keycap Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleTestClick(sw)
                    }}
                    className={`w-full py-3.5 rounded-2xl border font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-100 ${
                      isBeingPressed
                        ? 'translate-y-1 bg-pink-600 text-white shadow-inner border-pink-700'
                        : isSelected
                        ? 'btn-pink text-white shadow-lg shadow-pink-500/30'
                        : isDark
                        ? 'bg-slate-950 text-slate-200 border-slate-800 hover:border-pink-500 hover:text-white'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-pink-500 hover:text-white'
                    }`}
                  >
                    <span className="text-base">🔊</span>
                    <span>
                      {lang === 'ru'
                        ? 'Нажать клавишу'
                        : lang === 'en'
                        ? 'Press Switch'
                        : 'Ovozini Eshitish'}
                    </span>
                  </button>
                </div>
              )
            })}
          </div>

          {/* Interactive Keyboard Typing Playground */}
          <div
            className={`p-5 sm:p-6 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
              isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">⌨️</span>
                <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {lang === 'ru'
                    ? 'Протестируйте печать на клавиатуре прямо сейчас:'
                    : lang === 'en'
                    ? 'Test typing on your own keyboard in real-time:'
                    : 'Klaviaturangizda yozib sinab ko\'ring:'}
                </h4>
                {lastKeyPressed && (
                  <span className="ml-auto font-mono text-xs px-2 py-0.5 rounded bg-pink-500/20 text-pink-500 font-bold border border-pink-500/30">
                    Tugma: {lastKeyPressed}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mb-3">
                {lang === 'ru'
                  ? 'Печатайте в поле ниже — каждый символ воспроизводит реалистичный механический звук выбранного свитча.'
                  : lang === 'en'
                  ? 'Type anything in the box below — every keystroke produces real-time mechanical acoustics.'
                  : "Quyidagi maydonga matn yozing — har bir tugma bosilishi tanlangan switch ovozini real vaqtda yangratadi."}
              </p>

              <input
                type="text"
                value={typingText}
                onChange={(e) => setTypingText(e.target.value)}
                onKeyDown={handleTypingKeyDown}
                onKeyUp={handleTypingKeyUp}
                placeholder="Bu yerga istalgan matn yozing (masalan: UPGRADE GAMING)..."
                className={`w-full px-4 py-3 rounded-2xl text-sm font-mono border focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setTypingText('')}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                  isDark
                    ? 'border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white'
                    : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                }`}
              >
                🗑️ {lang === 'ru' ? 'Очистить' : lang === 'en' ? 'Clear' : 'Tozalash'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SwitchSoundTester

