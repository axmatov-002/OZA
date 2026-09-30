import React, { useState, useEffect, lazy, Suspense } from 'react'
import Header from './page/Header'
import Main from './page/Main'
import Footer from './page/Footer'
import initialDb from '../db.json'
import { useLanguage } from './context/LanguageContext'
import { sanitizeUserForSession } from './utils/security'

// Lazy-loaded heavy components for lightning-fast initial load
const AdminPanel = lazy(() => import('./page/AdminPanel'))
const ManagerPanel = lazy(() => import('./page/ManagerPanel'))
const UserOrders = lazy(() => import('./page/UserOrders'))
const AuthModal = lazy(() => import('./page/AuthModal'))
const SearchModal = lazy(() => import('./page/SearchModal'))

const App = () => {
  const { t, tp, formatPrice } = useLanguage()
  // Global Search Modal State
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeModalProduct, setActiveModalProduct] = useState(null)
  // Theme State: 'light' (Oq) | 'dark' (Qora)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('upg_theme') || 'light'
    } catch {
      return 'light'
    }
  })
  const isDark = theme === 'dark'

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    try {
      localStorage.setItem('upg_theme', theme)
    } catch (e) {
      console.error(e)
    }
  }, [theme])

  // Current logged in user object (null if guest / not logged in)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('upg_current_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // Synchronize currentUser to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('upg_current_user', JSON.stringify(currentUser))
      } else {
        localStorage.removeItem('upg_current_user')
      }
    } catch (e) {
      console.error(e)
    }
  }, [currentUser])

  // Active Role: 'user' | 'manager' | 'admin'
  const [currentRole, setCurrentRole] = useState(() => {
    try {
      const savedRole = localStorage.getItem('upg_current_role')
      if (savedRole) return savedRole
      const saved = localStorage.getItem('upg_current_user')
      return saved ? JSON.parse(saved).role : 'user'
    } catch {
      return 'user'
    }
  })

  // Synchronize currentRole to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('upg_current_role', currentRole)
    } catch (e) {
      console.error(e)
    }
  }, [currentRole])

  // User sub-view: 'store' | 'orders'
  const [userView, setUserView] = useState(() => {
    try {
      return localStorage.getItem('upg_user_view') || 'store'
    } catch {
      return 'store'
    }
  })

  // Synchronize userView to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('upg_user_view', userView)
    } catch (e) {
      console.error(e)
    }
  }, [userView])

  // Authentication modal: opened on start if no user is logged in and not previously dismissed
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(() => {
    try {
      if (localStorage.getItem('upg_current_user')) return false
      if (localStorage.getItem('upg_auth_dismissed') === 'true') return false
      return true
    } catch {
      return false
    }
  })

  // Central Database States initialized from localStorage and fallback to db.json
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('upg_products')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
    return initialDb.products || []
  })

  useEffect(() => {
    try {
      localStorage.setItem('upg_products', JSON.stringify(products))
    } catch (e) {
      console.error(e)
    }
  }, [products])

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('upg_orders')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      }
    } catch {}
    return initialDb.orders || []
  })

  useEffect(() => {
    try {
      localStorage.setItem('upg_orders', JSON.stringify(orders))
    } catch (e) {
      console.error(e)
    }
  }, [orders])

  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('upg_users')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Sync seed admin email and role in case initialDb was updated
          return parsed.map((u) => {
            const seed = (initialDb.users || []).find((su) => su.id === u.id)
            if (seed && seed.role === 'admin' && seed.email) {
              return { ...u, email: seed.email, role: 'admin', avatar: seed.avatar || u.avatar }
            }
            return u
          })
        }
      }
    } catch {}
    return initialDb.users || []
  })

  useEffect(() => {
    try {
      localStorage.setItem('upg_users', JSON.stringify(users))
    } catch (e) {
      console.error(e)
    }
  }, [users])

  const [consultations, setConsultations] = useState(() => {
    try {
      const saved = localStorage.getItem('upg_consultations')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      }
    } catch {}
    return initialDb.consultations || []
  })

  useEffect(() => {
    try {
      localStorage.setItem('upg_consultations', JSON.stringify(consultations))
    } catch (e) {
      console.error(e)
    }
  }, [consultations])

  // Wishlist Favorites State
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('upg_wishlist')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('upg_wishlist', JSON.stringify(wishlist))
    } catch (e) {
      console.error(e)
    }
  }, [wishlist])

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const exists = prev.includes(id)
      return exists ? prev.filter((item) => item !== id) : [...prev, id]
    })
  }

  // Cart State for User (Saved in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('upg_cart')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) return parsed
      }
    } catch {}
    return [
      {
        id: 'p1',
        name: 'UPGRADE CyberBlade Pro RGB Wireless Klaviatura',
        price: "890 000 so'm",
        priceNum: 890000,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
        category: 'Klaviaturalar',
        qty: 1
      }
    ]
  })

  useEffect(() => {
    try {
      localStorage.setItem('upg_cart', JSON.stringify(cart))
    } catch (e) {
      console.error(e)
    }
  }, [cart])

  const [cartOpen, setCartOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Add to cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id)
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      }
      return [...prevCart, { ...product, qty: 1 }]
    })

    setToastMessage(`✓ "${tp(product).name}" ${t('cart_added_toast', "savatchaga qo'shildi!")}`)
    setTimeout(() => {
      setToastMessage('')
    }, 3000)
  }

  // Update cart item quantity
  const updateQty = (id, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta
            return newQty > 0 ? { ...item, qty: newQty } : null
          }
          return item
        })
        .filter(Boolean)
    )
  }

  // Execute Checkout
  const executeCheckout = () => {
    if (cart.length === 0) return

    const totalSum = cart.reduce((sum, item) => sum + item.priceNum * item.qty, 0)
    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `UPG-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: currentUser?.id || `usr-${Date.now()}`,
      customerName: currentUser?.name || 'Mijoz',
      customerEmail: currentUser?.email || '',
      phone: currentUser?.phone || '',
      address: currentUser?.address || "Toshkent sh.",
      items: cart.map((it) => ({
        productId: it.id,
        name: it.name,
        priceNum: it.priceNum,
        qty: it.qty
      })),
      totalAmount: totalSum,
      status: 'Kutilmoqda',
      paymentMethod: 'Payme',
      paymentStatus: "To'langan",
      date: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    // Update orders in central state (so Manager & Admin see it immediately!)
    setOrders((prev) => [newOrder, ...prev])

    // Decrement stock in products
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = cart.find((it) => it.id === p.id)
        if (cartItem) {
          return { ...p, stock: Math.max(0, (p.stock || 10) - cartItem.qty) }
        }
        return p
      })
    )

    setCart([])
    setCartOpen(false)
    setToastMessage(`🎉 Buyurtma ${newOrder.orderNumber} muvaffaqiyatli qabul qilindi!`)
    setTimeout(() => {
      setToastMessage('')
    }, 4000)

    // Switch to orders view
    setUserView('orders')
  }

  // Handle Checkout Click
  const handleCheckout = () => {
    if (cart.length === 0) return

    // If user not logged in yet, prompt for login
    if (!currentUser) {
      setIsAuthModalOpen(true)
      setToastMessage("Iltimos, buyurtma berish uchun avval hisobingizga kiring!")
      setTimeout(() => setToastMessage(''), 3000)
      return
    }

    executeCheckout()
  }

  // Add Consultation Lead from contact form
  const handleAddConsultation = (newLead) => {
    setConsultations((prev) => [newLead, ...prev])
  }

  // Request Role Change
  const handleRequestRole = (targetRole) => {
    if (targetRole === 'user') {
      setCurrentRole('user')
      setUserView('store')
      return
    }

    // Strict role check: user can only switch to target role if currentUser strictly has that role
    if (currentUser && currentUser.role === targetRole) {
      setCurrentRole(targetRole)
      return
    }

    // Otherwise prompt auth modal to switch/log into the specific required account
    setIsAuthModalOpen(true)
    setToastMessage(`ℹ️ ${targetRole === 'admin' ? 'Admin' : 'Menejer'} bo'limiga kirish uchun tegishli hisobga kiring`)
    setTimeout(() => setToastMessage(''), 3000)
  }

  // Login Success Callback (Session Sanitized)
  const handleLoginSuccess = (user) => {
    const safeUser = sanitizeUserForSession(user)
    setCurrentUser(safeUser)
    setCurrentRole(safeUser.role || 'user')
    setIsAuthModalOpen(false)

    try {
      localStorage.setItem('upg_current_user', JSON.stringify(safeUser))
      localStorage.setItem('upg_current_role', safeUser.role || 'user')
      localStorage.removeItem('upg_auth_dismissed')
    } catch (e) {
      console.error(e)
    }

    const roleName =
      safeUser.role === 'admin'
        ? '👑 Admin'
        : safeUser.role === 'manager'
        ? '👔 Menejer'
        : '🛒 Xaridor'

    setToastMessage(`✓ Xush kelibsiz, ${safeUser.name}! (${roleName})`)
    setTimeout(() => {
      setToastMessage('')
    }, 3500)
  }

  // Register New User Callback
  const handleRegisterUser = (newUser) => {
    setUsers((prev) => {
      const updated = [...prev, newUser]
      try {
        localStorage.setItem('upg_users', JSON.stringify(updated))
      } catch (e) {
        console.error(e)
      }
      return updated
    })
    handleLoginSuccess(newUser)
  }

  // Logout Callback
  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentRole('user')
    setUserView('store')

    try {
      localStorage.removeItem('upg_current_user')
      localStorage.removeItem('upg_current_role')
      localStorage.removeItem('upg_user_view')
      localStorage.removeItem('upg_auth_dismissed')
    } catch (e) {
      console.error(e)
    }

    setIsAuthModalOpen(true)
    setToastMessage("🚪 Tizimdan chiqildi. Boshqa hisobni tanlang.")
    setTimeout(() => {
      setToastMessage('')
    }, 3000)
  }

  const totalSum = cart.reduce((sum, item) => sum + item.priceNum * item.qty, 0)
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0)

  return (
    <div className={`min-h-screen flex flex-col selection:bg-pink-500 selection:text-white transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#090d16] text-slate-100' : 'bg-white text-slate-900'
    }`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-pink-500/50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping"></span>
          <span className="text-sm font-semibold text-pink-200">{toastMessage}</span>
        </div>
      )}

      {/* RENDER VIEW BASED ON ACTIVE ROLE */}
      {currentRole === 'admin' ? (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-pink-600 text-lg">👑 Admin Paneli Yuklanmoqda...</div>}>
          <AdminPanel
            products={products}
            setProducts={setProducts}
            orders={orders}
            users={users}
            setUsers={setUsers}
            theme={theme}
            onSetTheme={setTheme}
            onSwitchRole={handleRequestRole}
            onLogout={handleLogout}
          />
        </Suspense>
      ) : currentRole === 'manager' ? (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-pink-600 text-lg">👔 Menejer Paneli Yuklanmoqda...</div>}>
          <ManagerPanel
            orders={orders}
            setOrders={setOrders}
            products={products}
            setProducts={setProducts}
            consultations={consultations}
            setConsultations={setConsultations}
            theme={theme}
            onSetTheme={setTheme}
            onSwitchRole={handleRequestRole}
            onLogout={handleLogout}
          />
        </Suspense>
      ) : userView === 'orders' && currentUser ? (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-pink-600 text-lg">📦 Buyurtmalar Yuklanmoqda...</div>}>
          <UserOrders
            orders={orders}
            currentUser={currentUser}
            theme={theme}
            onSetTheme={setTheme}
            onBackToShop={() => setUserView('store')}
          />
        </Suspense>
      ) : (
        <>
          {/* Header with User Info, Logout, and Theme Switcher */}
          <Header
            totalItems={totalItems}
            wishlistCount={wishlist.length}
            onOpenCart={() => setCartOpen(true)}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenWishlist={() => {
              const el = document.getElementById('catalog')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
            currentUser={currentUser}
            onLogout={handleLogout}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onSwitchRole={handleRequestRole}
            onOpenOrders={() => (currentUser ? setUserView('orders') : setIsAuthModalOpen(true))}
            theme={theme}
            onSetTheme={setTheme}
          />

          {/* Main Content */}
          <main className="flex-grow">
            <Main
              products={products}
              onAddToCart={addToCart}
              onAddConsultation={handleAddConsultation}
              theme={theme}
              activeModalProduct={activeModalProduct}
              setActiveModalProduct={setActiveModalProduct}
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
            />
          </main>

          {/* Footer */}
          <Footer theme={theme} />

          {/* Sleek Floating Cyber Toast Notification */}
          {toastMessage && (
            <div className="fixed top-24 right-4 sm:right-6 z-50 animate-bounce-in-up flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900/95 dark:bg-slate-900/98 text-white border border-pink-500/50 shadow-2xl shadow-pink-500/30 backdrop-blur-xl max-w-md">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-400 flex items-center justify-center text-white shrink-0 font-black text-sm shadow-md shadow-pink-500/30">
                ✓
              </div>
              <p className="text-xs sm:text-sm font-semibold truncate flex-1 text-slate-100">
                {toastMessage}
              </p>
              <button
                onClick={() => {
                  setCartOpen(true)
                  setToastMessage('')
                }}
                className="text-xs font-black text-pink-400 hover:text-pink-300 underline cursor-pointer shrink-0 ml-1.5"
              >
                {t('cart_title', 'Savat')} →
              </button>
            </div>
          )}

          {/* Slide-over Cart Drawer (Dark/Light Cyber Theme) */}
          {cartOpen && (
            <div className="fixed inset-0 z-50 overflow-hidden">
              <div
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
                onClick={() => setCartOpen(false)}
              />

              <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                <div className={`w-screen max-w-md shadow-2xl flex flex-col transition-colors duration-300 ${
                  isDark ? 'bg-[#0f172a] text-white border-l border-slate-800' : 'bg-white text-slate-900'
                }`}>
                  {/* Cart Header */}
                  <div className={`p-6 border-b flex items-center justify-between transition-colors ${
                    isDark ? 'border-slate-800 bg-slate-900/80' : 'border-slate-100 bg-slate-50/60'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">🛒</span>
                      <div>
                        <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('cart_title', 'Xaridlar Savati')}</h2>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{totalItems} {t('cart_items_count', 'ta aksessuar tanlandi')}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setCartOpen(false)}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Cart Items List */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cart.length === 0 ? (
                      <div className="text-center py-16">
                        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl mb-4 ${
                          isDark ? 'bg-pink-950/40 text-pink-400' : 'bg-pink-50 text-pink-500'
                        }`}>
                          🛒
                        </div>
                        <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>{t('cart_empty_title', "Savatchangiz bo'sh")}</h3>
                        <p className={`text-sm mb-6 max-w-xs mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {t('cart_empty_desc', "O'zingizga yoqqan zamonaviy kompyuter aksessuarlarini savatga qo'shing.")}
                        </p>
                        <button
                          onClick={() => setCartOpen(false)}
                          className="btn-pink px-6 py-2.5 rounded-xl text-sm cursor-pointer"
                        >
                          {t('cart_back_to_shop', 'Katalogga qaytish')}
                        </button>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center gap-4 p-3.5 rounded-2xl border transition-all duration-200 ${
                            isDark
                              ? 'border-slate-800 bg-slate-900/60 hover:border-pink-500/40'
                              : 'border-slate-100 bg-slate-50/70 hover:border-pink-200'
                          }`}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className={`w-16 h-16 rounded-xl object-cover border ${
                              isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-bold truncate mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                              {tp(item).name}
                            </h4>
                            <div className="text-xs font-bold text-pink-500 mb-2">
                              {formatPrice(item.priceNum * item.qty)}
                            </div>
                            <div className="flex items-center gap-3">
                              <div className={`flex items-center border rounded-lg overflow-hidden ${
                                isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
                              }`}>
                                <button
                                  onClick={() => updateQty(item.id, -1)}
                                  className={`w-7 h-7 flex items-center justify-center text-sm font-bold cursor-pointer ${
                                    isDark ? 'text-slate-300 hover:bg-slate-700 active:bg-pink-900' : 'text-slate-600 hover:bg-slate-100 active:bg-pink-100'
                                  }`}
                                >
                                  -
                                </button>
                                <span className={`w-8 text-center text-xs font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                  {item.qty}
                                </span>
                                <button
                                  onClick={() => updateQty(item.id, 1)}
                                  className={`w-7 h-7 flex items-center justify-center text-sm font-bold cursor-pointer ${
                                    isDark ? 'text-slate-300 hover:bg-slate-700 active:bg-pink-900' : 'text-slate-600 hover:bg-slate-100 active:bg-pink-100'
                                  }`}
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => updateQty(item.id, -item.qty)}
                                className="text-xs text-rose-500 hover:text-rose-400 underline font-medium cursor-pointer"
                              >
                                {t('cart_remove', "O'chirish")}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Cart Footer */}
                  {cart.length > 0 && (
                    <div className={`p-6 border-t space-y-4 ${
                      isDark ? 'border-slate-800 bg-[#0b0f19]' : 'border-slate-100 bg-slate-50/50'
                    }`}>
                      <div className="space-y-1.5 text-sm">
                        <div className={`flex justify-between ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          <span>{t('cart_delivery', 'Yetkazib berish:')}</span>
                          <span className="text-emerald-500 font-bold">{t('cart_free_delivery', "Bepul (Toshkent bo'yicha)")}</span>
                        </div>
                        <div className={`flex justify-between text-base font-bold pt-2 border-t ${
                          isDark ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-900'
                        }`}>
                          <span>{t('cart_total', "Jami to'lov:")}</span>
                          <span className="text-pink-500 text-xl font-black">
                            {formatPrice(totalSum)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleCheckout}
                        className="w-full btn-pink btn-vauu-shine py-3.5 rounded-2xl text-base font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-pink-500/25"
                      >
                        <span>{t('cart_checkout', 'Rasmiylashtirish')}</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>

                      <p className={`text-center text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {t('cart_security_notice', '🔒 Xavfsiz to\'lov: Payme, Click, Uzum Nasiya, Naqd')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Startup & Role Selection Auth Modal */}
      <Suspense fallback={null}>
        {isAuthModalOpen && (
          <AuthModal
            isOpen={isAuthModalOpen}
            users={users}
            onClose={() => {
              setIsAuthModalOpen(false)
              try {
                localStorage.setItem('upg_auth_dismissed', 'true')
              } catch {}
            }}
            onLoginSuccess={handleLoginSuccess}
            onRegisterUser={handleRegisterUser}
          />
        )}
      </Suspense>

      {/* Global Instant Search Modal */}
      <Suspense fallback={null}>
        {isSearchOpen && (
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            products={products}
            onAddToCart={addToCart}
            onOpenProduct={(p) => setActiveModalProduct(p)}
            theme={theme}
          />
        )}
      </Suspense>
    </div>
  )
}

export default App
