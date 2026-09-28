import React, { useState, useMemo } from 'react'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { useLanguage } from '../context/LanguageContext'
import { 
  hashPassword, 
  verifyPassword, 
  sanitizeInput, 
  getLoginAttemptsInfo, 
  recordFailedAttempt, 
  resetLoginAttempts 
} from '../utils/security'

const AuthModal = ({
  isOpen,
  users = [],
  onClose,
  onLoginSuccess,
  onRegisterUser
}) => {
  const { lang, t } = useLanguage()
  // Tabs: 'login' | 'register'
  const [activeTab, setActiveTab] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)

  // Register form state (ONLY Email and Password as requested)
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  // Calculate password strength for visual feedback
  const passwordStrength = useMemo(() => {
    const p = regPassword
    if (!p) return { score: 0, label: '', color: 'bg-slate-200', text: '' }
    if (p.length < 4) {
      return { 
        score: 1, 
        label: lang === 'ru' ? 'Слишком короткий' : lang === 'en' ? 'Too short' : 'Juda qisqa', 
        color: 'bg-rose-500', 
        text: 'text-rose-500' 
      }
    }
    if (p.length < 6) {
      return { 
        score: 2, 
        label: lang === 'ru' ? 'Простой' : lang === 'en' ? 'Simple' : 'Oddiy', 
        color: 'bg-amber-500', 
        text: 'text-amber-500' 
      }
    }
    const hasNumber = /\d/.test(p)
    const hasUpperOrSpecial = /[A-Z!@#$%^&*]/.test(p)
    if (p.length >= 8 && hasNumber && hasUpperOrSpecial) {
      return { 
        score: 4, 
        label: lang === 'ru' ? 'Очень надежный' : lang === 'en' ? 'Very strong' : 'Juda kuchli', 
        color: 'bg-emerald-500', 
        text: 'text-emerald-600' 
      }
    }
    if (p.length >= 6 && (hasNumber || hasUpperOrSpecial)) {
      return { 
        score: 3, 
        label: lang === 'ru' ? 'Хороший' : lang === 'en' ? 'Good' : 'Yaxshi', 
        color: 'bg-blue-500', 
        text: 'text-blue-500' 
      }
    }
    return { 
      score: 2, 
      label: lang === 'ru' ? 'Средний' : lang === 'en' ? 'Medium' : "O'rtacha", 
      color: 'bg-amber-500', 
      text: 'text-amber-500' 
    }
  }, [regPassword, lang])

  if (!isOpen) return null

  // Handle manual login with rate limiting & async SHA-256 verification
  const handleManualLogin = async (e) => {
    e.preventDefault()
    setError('')

    // 1. Check Rate Limiter / Lockout
    const attemptInfo = getLoginAttemptsInfo()
    if (attemptInfo.lockedUntil && Date.now() < attemptInfo.lockedUntil) {
      const waitSeconds = Math.ceil((attemptInfo.lockedUntil - Date.now()) / 1000)
      setError(
        lang === 'ru'
          ? `Слишком много неудачных попыток. Пожалуйста, подождите ${waitSeconds} сек.`
          : lang === 'en'
          ? `Too many failed login attempts. Please wait ${waitSeconds} seconds.`
          : `Xavfsizlik tizimi: Ko'p marta xato urinish bo'ldi. Iltimos, ${waitSeconds} soniya kuting.`
      )
      triggerShake()
      return
    }

    const cleanInput = sanitizeInput(loginEmail).toLowerCase().trim()
    const cleanPass = loginPassword.trim()

    if (!cleanInput || !cleanPass) {
      setError(
        lang === 'ru' 
          ? 'Пожалуйста, введите ваш email и пароль полностью!' 
          : lang === 'en' 
          ? 'Please enter your email and password completely!' 
          : "Iltimos, email va parolingizni to'liq kiriting!"
      )
      triggerShake()
      return
    }

    let foundUser = null
    for (const u of users) {
      const uEmail = (u.email || '').toLowerCase().trim()
      const uPhone = (u.phone || '').replace(/\s+/g, '')
      const uName = (u.name || '').toLowerCase().trim()

      const matchIdentity =
        uEmail === cleanInput ||
        uPhone === cleanInput.replace(/\s+/g, '') ||
        uName === cleanInput

      if (matchIdentity) {
        const isMatch = await verifyPassword(cleanPass, u.password)
        if (isMatch) {
          foundUser = u
          break
        }
      }
    }

    if (foundUser) {
      resetLoginAttempts()
      onLoginSuccess(foundUser)
    } else {
      const newInfo = recordFailedAttempt()
      if (newInfo.lockedUntil) {
        setError(
          lang === 'ru'
            ? 'Лимит попыток превышен! Доступ временно заблокирован на 30 секунд.'
            : lang === 'en'
            ? 'Login attempt limit exceeded! Access temporarily locked for 30 seconds.'
            : "Xavfsizlik cheklovi: Urinishlar chegarasidan oshildi! Tizim 30 soniyaga bloklandi."
        )
      } else {
        const remaining = 5 - (newInfo.count || 0)
        setError(
          lang === 'ru'
            ? `Неверный email или пароль! Осталось попыток: ${remaining}`
            : lang === 'en'
            ? `Incorrect email or password! Remaining attempts: ${remaining}`
            : `Email yoki parol noto'g'ri! Qolgan urinishlar: ${remaining}`
        )
      }
      triggerShake()
    }
  }

  // Handle registration with password hashing & input sanitization
  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    const email = sanitizeInput(regEmail).toLowerCase().trim()
    const password = regPassword.trim()

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      setError(
        lang === 'ru'
          ? 'Пожалуйста, введите корректный адрес электронной почты!'
          : lang === 'en'
          ? 'Please enter a valid email address!'
          : "Iltimos, to'g'ri email manzilini kiriting (masalan: misol@gmail.com)!"
      )
      triggerShake()
      return
    }

    // Validate password (minimum 6 characters for security)
    if (!password || password.length < 6) {
      setError(
        lang === 'ru'
          ? 'Пароль должен содержать не менее 6 символов!'
          : lang === 'en'
          ? 'Password must be at least 6 characters!'
          : "Xavfsizlik talabi: Parol kamida 6 ta belgidan iborat bo'lishi kerak!"
      )
      triggerShake()
      return
    }

    // Check if email is already registered
    const existing = users.find((u) => (u.email || '').toLowerCase().trim() === email)
    if (existing) {
      setError(
        lang === 'ru'
          ? 'Аккаунт с таким email уже существует! Пожалуйста, войдите в систему.'
          : lang === 'en'
          ? 'An account with this email already exists! Please log in.'
          : "Ushbu email bilan hisob allaqachon mavjud! 'Kirish' bo'limi orqali hisobingizga kiring."
      )
      triggerShake()
      return
    }

    // Cryptographic SHA-256 Hash before saving
    const hashedPassword = await hashPassword(password)

    // Auto-generate clean friendly display name from email
    const rawUsername = email.split('@')[0].replace(/[._-]/g, ' ')
    const autoName =
      sanitizeInput(rawUsername.charAt(0).toUpperCase() + rawUsername.slice(1)) || 'Foydalanuvchi'

    const newUser = {
      id: `u-${Date.now()}`,
      name: autoName,
      email: email,
      phone: '',
      password: hashedPassword,
      role: 'user', // customer
      status: 'Faol',
      address: 'Toshkent sh.',
      createdAt: new Date().toISOString().slice(0, 10),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(autoName)}&background=ec4899&color=fff&bold=true&rounded=true`
    }

    onRegisterUser(newUser)
  }



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Modal Card */}
      <div
        className={`relative w-full max-w-[460px] bg-white rounded-3xl shadow-2xl border border-slate-100/80 overflow-hidden z-10 transition-all transform ${
          shake ? 'animate-bounce' : ''
        }`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(236, 72, 153, 0.15), 0 0 0 1px rgba(0,0,0,0.04)'
        }}
      >
        {/* Glow Header Accent */}
        <div className="relative h-28 bg-gradient-to-tr from-pink-600 via-rose-500 to-fuchsia-600 p-5 flex flex-col justify-between text-white overflow-hidden">
          {/* Subtle Decorative Background Circles */}
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute bottom-0 right-16 w-20 h-20 bg-pink-300/20 rounded-full blur-md pointer-events-none" />

          {/* Top Row with Brand, Language Switcher & Close Button */}
          <div className="relative flex items-center justify-between z-10 gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-white text-[11px] font-extrabold tracking-wider uppercase">
              <span className="animate-pulse">✨</span> UPGRADE
            </div>

            <div className="flex items-center gap-2">
              <LanguageSwitcher theme="dark" />
              {onClose && (
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 hover:scale-105 active:scale-95"
                  title={t('cart_remove', 'Yopish')}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Title in Header */}
          <div className="relative z-10">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              {activeTab === 'register' && t('auth_tab_register', "Ro'yxatdan o'tish")}
              {activeTab === 'login' && t('auth_welcome', 'Hisobga kirish')}
            </h3>
            <p className="text-xs text-pink-100 font-medium opacity-90">
              {activeTab === 'register' && (lang === 'ru' ? 'Введите email и пароль для создания аккаунта' : lang === 'en' ? 'Enter email and password to create an account' : "Email va parolingizni kiritib yangi hisob oching")}
              {activeTab === 'login' && (lang === 'ru' ? 'Войдите для продолжения покупок' : lang === 'en' ? 'Sign in to continue your shopping' : "Xaridlaringizni davom ettirish uchun kiring")}
            </p>
          </div>
        </div>

        {/* Inner Content Area */}
        <div className="p-5 sm:p-6 pt-5">
          {/* Modern Tab Selector */}
          <div className="flex p-1 bg-slate-100/90 rounded-2xl mb-5 text-xs font-bold border border-slate-200/60 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login')
                setError('')
              }}
              className={`flex-1 py-2.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-white text-pink-600 shadow-sm font-extrabold scale-[1.02]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>{t('auth_tab_login', 'Kirish')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('register')
                setError('')
              }}
              className={`flex-1 py-2.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-white text-pink-600 shadow-sm font-extrabold scale-[1.02]'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>{t('auth_tab_register', "Ro'yxatdan o'tish")}</span>
            </button>
          </div>

          {/* Error Message Box */}
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in duration-150">
              <div className="w-5 h-5 rounded-full bg-rose-200/80 text-rose-800 flex items-center justify-center shrink-0 text-xs font-black">
                !
              </div>
              <span className="flex-1 leading-snug">{error}</span>
            </div>
          )}

          {/* ══════════════════════════════════════════
              TAB 1: LOGIN FORM
          ══════════════════════════════════════════ */}
          {activeTab === 'login' && (
            <form onSubmit={handleManualLogin} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>{t('auth_email', 'Email manzil')}</span>
                </label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors pointer-events-none">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value)
                      if (error) setError('')
                    }}
                    placeholder={lang === 'ru' ? 'email@example.com' : lang === 'en' ? 'email@example.com' : 'email@misol.uz'}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-hidden focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10 transition-all placeholder:text-slate-400"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    {t('auth_password', 'Maxfiy parol')}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      alert(lang === 'ru' ? 'Для восстановления пароля свяжитесь с поддержкой: +998 71 200-00-55' : lang === 'en' ? 'Contact support to recover password: +998 71 200-00-55' : "Parolni tiklash uchun qo'llab-quvvatlash xizmati bilan bog'laning: +998 71 200-00-55")
                    }}
                    className="text-[11px] text-pink-600 hover:text-pink-700 font-semibold cursor-pointer hover:underline"
                  >
                    {lang === 'ru' ? 'Забыли пароль?' : lang === 'en' ? 'Forgot password?' : 'Parolni unutdingizmi?'}
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors pointer-events-none">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value)
                      if (error) setError('')
                    }}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-hidden focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10 transition-all placeholder:text-slate-400 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
                    title={showPassword ? (lang === 'ru' ? 'Скрыть' : lang === 'en' ? 'Hide' : 'Yashirish') : (lang === 'ru' ? 'Показать' : lang === 'en' ? 'Show' : "Ko'rsatish")}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 border-slate-300 cursor-pointer accent-pink-600"
                  />
                  <span>{lang === 'ru' ? 'Запомнить меня' : lang === 'en' ? 'Remember me' : 'Meni eslab qolish'}</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {lang === 'ru' ? 'Безопасное соединение 🔒' : lang === 'en' ? 'Secure connection 🔒' : 'Xavfsiz ulanish 🔒'}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full btn-pink py-3.5 rounded-2xl text-sm font-extrabold shadow-lg shadow-pink-500/25 cursor-pointer mt-2 flex items-center justify-center gap-2 group"
              >
                <span>{t('auth_submit_login', 'Hisobga kirish')}</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              {/* Switch to Register */}
              <div className="text-center pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  {lang === 'ru' ? 'Нет аккаунта?' : lang === 'en' ? "Don't have an account?" : "Akkauntingiz yo'qmi?"}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('register')
                      setError('')
                    }}
                    className="text-pink-600 hover:text-pink-700 font-bold hover:underline cursor-pointer ml-1"
                  >
                    {t('auth_tab_register', "Ro'yxatdan o'tish")} →
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ══════════════════════════════════════════
              TAB 2: REGISTER FORM (ONLY EMAIL & PASSWORD)
          ══════════════════════════════════════════ */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>{t('auth_email', 'Email manzil')}</span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    {lang === 'ru' ? 'например: name@example.com' : lang === 'en' ? 'e.g.: name@example.com' : 'masalan: sizning_email@gmail.com'}
                  </span>
                </label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors pointer-events-none">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => {
                      setRegEmail(e.target.value)
                      if (error) setError('')
                    }}
                    placeholder={lang === 'ru' ? 'vash_email@gmail.com' : lang === 'en' ? 'your_email@gmail.com' : 'sizning_email@gmail.com'}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-hidden focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10 transition-all placeholder:text-slate-400"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>{lang === 'ru' ? 'Новый пароль' : lang === 'en' ? 'New password' : 'Yangi maxfiy parol'}</span>
                  {passwordStrength.label && (
                    <span className={`text-[11px] font-bold ${passwordStrength.text}`}>
                      {passwordStrength.label}
                    </span>
                  )}
                </label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors pointer-events-none">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => {
                      setRegPassword(e.target.value)
                      if (error) setError('')
                    }}
                    placeholder={lang === 'ru' ? 'Не менее 4 символов' : lang === 'en' ? 'At least 4 characters' : 'Kamida 4 ta belgi'}
                    className="w-full pl-10 pr-11 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-hidden focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10 transition-all placeholder:text-slate-400 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
                    title={showPassword ? (lang === 'ru' ? 'Скрыть' : lang === 'en' ? 'Hide' : 'Yashirish') : (lang === 'ru' ? 'Показать' : lang === 'en' ? 'Show' : "Ko'rsatish")}
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator Bars */}
                {regPassword.length > 0 && (
                  <div className="mt-2 flex items-center gap-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          passwordStrength.score >= step
                            ? passwordStrength.color
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Info Badge */}
              <div className="p-3 rounded-2xl bg-pink-50/70 border border-pink-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                  ⚡
                </div>
                <div className="text-[11px] text-slate-600 leading-tight">
                  <span className="font-bold text-slate-900 block mb-0.5">
                    {lang === 'ru' ? 'Быстрая и простая регистрация' : lang === 'en' ? 'Fast and easy registration' : "Tezkor va oson ro'yxatdan o'tish"}
                  </span>
                  {lang === 'ru' 
                    ? 'Никаких лишних данных. Только email и пароль!' 
                    : lang === 'en' 
                    ? 'No unnecessary data needed. Just email and password!' 
                    : "Ortiqcha ma'lumotlar talab qilinmaydi. Faqat email va parol kifoya!"}
                </div>
              </div>

              {/* Submit Register Button */}
              <button
                type="submit"
                className="w-full btn-pink py-3.5 rounded-2xl text-sm font-extrabold shadow-lg shadow-pink-500/25 cursor-pointer mt-2 flex items-center justify-center gap-2 group"
              >
                <span>{t('auth_submit_register', "Akkaunt yaratish va kirish")}</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              {/* Switch to Login */}
              <div className="text-center pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  {lang === 'ru' ? 'Уже есть аккаунт?' : lang === 'en' ? 'Already have an account?' : 'Akkauntingiz bormi?'}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('login')
                      setError('')
                    }}
                    className="text-pink-600 hover:text-pink-700 font-bold hover:underline cursor-pointer ml-1"
                  >
                    {t('auth_tab_login', 'Hisobga kirish')} →
                  </button>
                </p>
              </div>
            </form>
          )}



          {/* Footer Guest Browsing */}
          <div className="mt-5 pt-3.5 border-t border-slate-100/90 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span>🛡️</span> {lang === 'ru' ? 'Конфиденциальность защищена' : lang === 'en' ? 'Privacy guaranteed' : 'Maxfiylik kafolatlangan'}
            </span>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="font-bold text-slate-600 hover:text-pink-600 hover:underline cursor-pointer"
              >
                {lang === 'ru' ? 'Продолжить как гость →' : lang === 'en' ? 'Continue as guest →' : "Mehmon sifatida ko'rish →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
