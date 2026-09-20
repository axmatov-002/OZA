import React, { useState } from 'react'

const AuthModal = ({
  isOpen,
  users = [],
  onClose,
  onLoginSuccess,
  onRegisterUser
}) => {
  // Tabs: 'login' | 'register' | 'demo'
  const [activeTab, setActiveTab] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  // Login form state
  const [loginInput, setLoginInput] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register form state
  const [regForm, setRegForm] = useState({
    name: '',
    phone: '+998 ',
    email: '',
    password: '',
    address: ''
  })

  // Selected demo user state (for Demo tab)
  const [selectedDemoUser, setSelectedDemoUser] = useState(null)
  const [demoPassword, setDemoPassword] = useState('')

  if (!isOpen) return null

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  // Handle manual login (with phone, email or name)
  const handleManualLogin = (e) => {
    e.preventDefault()
    setError('')

    const cleanInput = loginInput.trim().toLowerCase().replace(/\s+/g, '')
    const cleanPass = loginPassword.trim()

    if (!cleanInput || !cleanPass) {
      setError("Iltimos, login va parolingizni kiriting!")
      triggerShake()
      return
    }

    const found = users.find((u) => {
      const uEmail = (u.email || '').toLowerCase().replace(/\s+/g, '')
      const uPhone = (u.phone || '').replace(/\s+/g, '')
      const uName = (u.name || '').toLowerCase().replace(/\s+/g, '')

      const matchIdentity =
        uEmail === cleanInput ||
        uPhone === cleanInput ||
        uName === cleanInput ||
        (cleanInput.length >= 7 && uPhone.endsWith(cleanInput))

      return matchIdentity && u.password === cleanPass
    })

    if (found) {
      onLoginSuccess(found)
    } else {
      setError("Telefon raqami/email yoki parol noto'g'ri kiritildi! Qayta tekshiring.")
      triggerShake()
    }
  }

  // Handle registration of user's OWN account
  const handleRegister = (e) => {
    e.preventDefault()
    setError('')

    const name = regForm.name.trim()
    const phone = regForm.phone.trim().replace(/\s+/g, '')
    const password = regForm.password.trim()

    if (!name || name.length < 3) {
      setError("Iltimos, to'liq ismingizni kiriting (kamida 3 ta harf)!")
      triggerShake()
      return
    }

    if (!phone || phone.length < 9) {
      setError("Iltimos, to'g'ri telefon raqamingizni kiriting!")
      triggerShake()
      return
    }

    if (!password || password.length < 4) {
      setError("Parol kamida 4 ta belgidan iborat bo'lishi kerak!")
      triggerShake()
      return
    }

    // Check if phone or name is already registered
    const existing = users.find((u) => {
      const uPhone = (u.phone || '').replace(/\s+/g, '')
      return uPhone === phone && phone.length > 7
    })

    if (existing) {
      setError("Ushbu telefon raqamli akkaunt allaqachon mavjud! 'Kirish' bo'limi orqali hisobingizga kiring.")
      triggerShake()
      return
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name: name,
      phone: regForm.phone.trim(),
      email: regForm.email.trim() || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}${Math.floor(100 + Math.random() * 900)}@upgrade.uz`,
      password: password,
      role: 'user', // regular customer
      status: 'Faol',
      address: regForm.address.trim() || 'Toshkent sh.',
      createdAt: new Date().toISOString().slice(0, 10),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ec4899&color=fff&bold=true&rounded=true`
    }

    onRegisterUser(newUser)
  }

  // Demo user 1-click login
  const handleQuickDemoLogin = (u) => {
    onLoginSuccess(u)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className={`relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 transition-all ${
          shake ? 'animate-bounce' : ''
        }`}
      >
        {/* Top Accent Gradient Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600" />

        <div className="p-5 sm:p-7">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-[11px] font-bold uppercase tracking-wider mb-1.5">
                <span>🔐</span> UPGRADE Akkaunt
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {activeTab === 'register'
                  ? 'O\'z Akkauntingizni Yarating'
                  : activeTab === 'demo'
                  ? 'Xodim & Demo Hisoblar'
                  : 'O\'z Akkauntingizga Kiring'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {activeTab === 'register'
                  ? 'Ism va telefon raqamingiz orqali shaxsiy hisob oching'
                  : activeTab === 'demo'
                  ? 'Admin yoki Menejer rejimida sinab ko\'rish'
                  : 'Buyurtmalar va xaridlaringizni boshqarish uchun kiring'}
              </p>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
                title="Yopish"
              >
                ✕
              </button>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-5 text-xs sm:text-sm font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login')
                setError('')
              }}
              className={`flex-1 py-2 sm:py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🔑</span>
              <span>Kirish</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register')
                setError('')
              }}
              className={`flex-1 py-2 sm:py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>✨</span>
              <span>Ro'yxatdan o'tish</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('demo')
                setError('')
              }}
              className={`py-2 px-3 sm:py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 text-[11px] sm:text-xs ${
                activeTab === 'demo'
                  ? 'bg-white text-pink-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Admin va Menejer demo hisoblari"
            >
              <span>⚡</span>
              <span>Demo</span>
            </button>
          </div>

          {/* ══════════════════════════════════════════
              TAB 1: PERSONAL LOGIN FORM
          ══════════════════════════════════════════ */}
          {activeTab === 'login' && (
            <form onSubmit={handleManualLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Telefon Raqam yoki Email
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-slate-400">
                    📱
                  </span>
                  <input
                    type="text"
                    value={loginInput}
                    onChange={(e) => {
                      setLoginInput(e.target.value)
                      if (error) setError('')
                    }}
                    placeholder="+998 90 123 45 67 yoki email"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-hidden focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Maxfiy Parol
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-slate-400">
                    🔒
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value)
                      if (error) setError('')
                    }}
                    placeholder="Parolingizni kiriting..."
                    className="w-full pl-10 pr-12 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-hidden focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm p-1 cursor-pointer"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full btn-pink py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-pink-500/25 cursor-pointer"
              >
                Hisobga Kirish →
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register')
                    setError('')
                  }}
                  className="text-xs text-slate-600 hover:text-pink-600 font-semibold cursor-pointer"
                >
                  Akkauntingiz yo'qmi?{' '}
                  <span className="text-pink-600 font-bold underline underline-offset-2">
                    O'zingiz uchun ro'yxatdan o'ting
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* ══════════════════════════════════════════
              TAB 2: REGISTER NEW ACCOUNT (OWN PROFILE)
          ══════════════════════════════════════════ */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Dynamic Name Avatar Preview */}
              <div className="flex items-center gap-3 p-3 bg-pink-50/60 border border-pink-100 rounded-2xl">
                <img
                  src={
                    regForm.name.trim()
                      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(regForm.name.trim())}&background=ec4899&color=fff&bold=true&rounded=true`
                      : 'https://ui-avatars.com/api/?name=Siz&background=cbd5e1&color=fff&bold=true&rounded=true'
                  }
                  alt="Avatar"
                  className="w-12 h-12 rounded-2xl shadow-sm border-2 border-white shrink-0 object-cover"
                />
                <div>
                  <h5 className="text-xs font-bold text-slate-900">
                    {regForm.name.trim() || "Ismingiz bu yerda ko'rinadi"}
                  </h5>
                  <p className="text-[11px] text-pink-600 font-medium">
                    🛒 Shaxsiy xaridor akkaunti
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Ism va Familiyangiz *
                </label>
                <input
                  type="text"
                  value={regForm.name}
                  onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                  placeholder="Masalan: Sardor Aliyev"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-hidden focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Telefon Raqam *
                  </label>
                  <input
                    type="text"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    placeholder="+998 90 123 45 67"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-hidden focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Maxfiy Parol *
                  </label>
                  <input
                    type="password"
                    value={regForm.password}
                    onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                    placeholder="Parol yarating..."
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-hidden focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Yetkazib berish manzili (Ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={regForm.address}
                  onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                  placeholder="Toshkent sh., Chilonzor tumani, 9-mavze..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-hidden focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full btn-pink py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-pink-500/25 cursor-pointer mt-1"
              >
                O'z Akkauntimni Ochish va Kirish →
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login')
                    setError('')
                  }}
                  className="text-xs text-slate-600 hover:text-pink-600 font-semibold cursor-pointer"
                >
                  Akkauntingiz bormi?{' '}
                  <span className="text-pink-600 font-bold underline underline-offset-2">
                    Hisobga kirish
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* ══════════════════════════════════════════
              TAB 3: DEMO & STAFF PROFILES (FOR TESTING)
          ══════════════════════════════════════════ */}
          {activeTab === 'demo' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Tizim imkoniyatlarini sinab ko'rish uchun quyidagi tayyor rollardan birini tanlashingiz mumkin:
              </p>

              <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                {users.map((u) => {
                  const isAdmin = u.role === 'admin'
                  const isManager = u.role === 'manager'

                  const badgeClass = isAdmin
                    ? 'bg-rose-100 text-rose-700 border-rose-200'
                    : isManager
                    ? 'bg-purple-100 text-purple-700 border-purple-200'
                    : 'bg-pink-100 text-pink-700 border-pink-200'

                  const roleTitle = isAdmin
                    ? '👑 Admin (Boshqaruv)'
                    : isManager
                    ? '👔 Menejer (Ombor)'
                    : "🛒 Xaridor (Do'kon)"

                  return (
                    <div
                      key={u.id}
                      className="p-3 sm:p-3.5 rounded-2xl border border-slate-200 hover:border-pink-300 hover:bg-pink-50/30 bg-white transition-all flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-10 h-10 rounded-2xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-slate-900 text-sm truncate">
                              {u.name}
                            </span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${badgeClass}`}>
                              {roleTitle}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 truncate mt-0.5 font-mono">
                            Parol: {u.password}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleQuickDemoLogin(u)}
                        className="btn-pink px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 shadow-sm cursor-pointer"
                        title="Tezkor kirish"
                      >
                        Kirish →
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Footer - Guest browsing option */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Har bir foydalanuvchi o'z hisobiga ega</span>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="font-bold text-slate-700 hover:text-pink-600 hover:underline cursor-pointer"
              >
                🛍️ Mehmon sifatida ko'rish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
