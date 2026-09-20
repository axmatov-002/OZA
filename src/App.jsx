import React, { useState, useEffect } from 'react'
import Header from './page/Header'
import Main from './page/Main'
import Footer from './page/Footer'
import AdminPanel from './page/AdminPanel'
import ManagerPanel from './page/ManagerPanel'
import UserOrders from './page/UserOrders'
import AuthModal from './page/AuthModal'
import initialDb from '../db.json'

const App = () => {
  // Theme State: 'light' (Oq) | 'dark' (Qora)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('upg_theme') || 'light'
    } catch {
      return 'light'
    }
  })

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

  // Active Role: 'user' | 'manager' | 'admin'
  const [currentRole, setCurrentRole] = useState(() => {
    try {
      const saved = localStorage.getItem('upg_current_user')
      return saved ? JSON.parse(saved).role : 'user'
    } catch {
      return 'user'
    }
  })

  // User sub-view: 'store' | 'orders'
  const [userView, setUserView] = useState('store')

  // Authentication & User Selection modal (opened on start if no user is logged in!)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(() => {
    try {
      return !localStorage.getItem('upg_current_user')
    } catch {
      return true
    }
  })

  // Central Database States initialized from db.json and localStorage
  const [products, setProducts] = useState(initialDb.products)
  const [orders, setOrders] = useState(initialDb.orders)
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('upg_users')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
    return initialDb.users
  })
  const [consultations, setConsultations] = useState(initialDb.consultations)

  // Cart State for User
  const [cart, setCart] = useState([
    {
      id: 'p1',
      name: 'UPGRADE CyberBlade Pro RGB Wireless Klaviatura',
      price: "890 000 so'm",
      priceNum: 890000,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
      category: 'Klaviaturalar',
      qty: 1
    }
  ])
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

    setToastMessage(`✓ "${product.name}" savatchaga qo'shildi!`)
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

    // If logged-in user already has the required role, switch directly
    if (currentUser && (currentUser.role === targetRole || currentUser.role === 'admin')) {
      setCurrentRole(targetRole)
      return
    }

    // Otherwise prompt auth modal to switch account
    setIsAuthModalOpen(true)
    setToastMessage(`ℹ️ ${targetRole === 'admin' ? 'Admin' : 'Menejer'} paneliga kirish uchun hisobni tasdiqlang`)
    setTimeout(() => setToastMessage(''), 3000)
  }

  // Login Success Callback
  const handleLoginSuccess = (user) => {
    setCurrentUser(user)
    setCurrentRole(user.role || 'user')
    setIsAuthModalOpen(false)

    try {
      localStorage.setItem('upg_current_user', JSON.stringify(user))
    } catch (e) {
      console.error(e)
    }

    const roleName =
      user.role === 'admin'
        ? '👑 Admin'
        : user.role === 'manager'
        ? '👔 Menejer'
        : '🛒 Xaridor'

    setToastMessage(`✓ Xush kelibsiz, ${user.name}! (${roleName})`)
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
      ) : currentRole === 'manager' ? (
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
      ) : userView === 'orders' ? (
        <UserOrders
          orders={orders}
          currentUser={currentUser}
          theme={theme}
          onSetTheme={setTheme}
          onBackToShop={() => setUserView('store')}
        />
      ) : (
        <>
          {/* Header with User Info, Logout, and Theme Switcher */}
          <Header
            totalItems={totalItems}
            onOpenCart={() => setCartOpen(true)}
            currentUser={currentUser}
            onLogout={handleLogout}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onSwitchRole={handleRequestRole}
            onOpenOrders={() => setUserView('orders')}
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
            />
          </main>

          {/* Footer */}
          <Footer theme={theme} />

          {/* Slide-over Cart Drawer */}
          {cartOpen && (
            <div className="fixed inset-0 z-50 overflow-hidden">
              <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={() => setCartOpen(false)}
              />

              <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
                  {/* Cart Header */}
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">🛒</span>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900">Xaridlar Savati</h2>
                        <p className="text-xs text-slate-500">{totalItems} ta aksessuar tanlandi</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Cart Items List */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cart.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto rounded-full bg-pink-50 flex items-center justify-center text-3xl mb-4 text-pink-500">
                          🛒
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">Savatchangiz bo'sh</h3>
                        <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
                          O'zingizga yoqqan zamonaviy kompyuter aksessuarlarini savatga qo'shing.
                        </p>
                        <button
                          onClick={() => setCartOpen(false)}
                          className="btn-pink px-6 py-2.5 rounded-xl text-sm cursor-pointer"
                        >
                          Katalogga qaytish
                        </button>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:border-pink-200 transition-colors"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-slate-800 truncate mb-1">
                              {item.name}
                            </h4>
                            <div className="text-xs font-bold text-pink-600 mb-2">
                              {(item.priceNum * item.qty).toLocaleString('uz-UZ')} so'm
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                                <button
                                  onClick={() => updateQty(item.id, -1)}
                                  className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 text-sm font-bold active:bg-pink-100 cursor-pointer"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center text-xs font-bold text-slate-800">
                                  {item.qty}
                                </span>
                                <button
                                  onClick={() => updateQty(item.id, 1)}
                                  className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 text-sm font-bold active:bg-pink-100 cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => updateQty(item.id, -item.qty)}
                                className="text-xs text-rose-500 hover:text-rose-700 underline font-medium cursor-pointer"
                              >
                                O'chirish
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Cart Footer */}
                  {cart.length > 0 && (
                    <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between text-slate-500">
                          <span>Yetkazib berish:</span>
                          <span className="text-emerald-600 font-bold">Bepul (Toshkent bo'yicha)</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                          <span>Jami to'lov:</span>
                          <span className="text-pink-600 text-xl font-extrabold">
                            {totalSum.toLocaleString('uz-UZ')} so'm
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleCheckout}
                        className="w-full btn-pink py-3.5 rounded-2xl text-base font-bold flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Rasmiylashtirish</span>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>

                      <p className="text-center text-xs text-slate-400">
                        🔒 Xavfsiz to'lov: Payme, Click, Uzum Nasiya, Naqd
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
      <AuthModal
        isOpen={isAuthModalOpen}
        users={users}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onRegisterUser={handleRegisterUser}
      />
    </div>
  )
}

export default App
