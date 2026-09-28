import React, { useState, useMemo } from 'react'
import logoImg from '../assets/image.png'
import LanguageSwitcher from '../components/LanguageSwitcher'

const ManagerPanel = ({
  orders,
  setOrders,
  products,
  setProducts,
  consultations,
  setConsultations,
  theme = 'light',
  onSetTheme,
  onSwitchRole,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState('orders') // 'orders' | 'inventory' | 'leads'
  const [orderFilter, setOrderFilter] = useState('Barchasi')
  const [orderSearch, setOrderSearch] = useState('')
  const [inventorySearch, setInventorySearch] = useState('')
  const [onlyLowStock, setOnlyLowStock] = useState(false)

  const isDark = theme === 'dark'

  // Update order status
  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    )
  }

  // Stock quick increment
  const handleStockAdd = (productId, amount) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, stock: (p.stock || 0) + amount } : p
      )
    )
  }

  // Toggle lead status
  const handleToggleLead = (leadId) => {
    setConsultations((prev) =>
      prev.map((item) =>
        item.id === leadId
          ? { ...item, status: item.status === 'Yangi' ? 'Bog\'lanildi' : 'Yangi' }
          : item
      )
    )
  }

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchFilter = orderFilter === 'Barchasi' || ord.status === orderFilter
      const q = orderSearch.toLowerCase().trim()
      const matchSearch =
        !q ||
        (ord.orderNumber && ord.orderNumber.toLowerCase().includes(q)) ||
        (ord.customerName && ord.customerName.toLowerCase().includes(q)) ||
        (ord.phone && ord.phone.includes(q)) ||
        (ord.address && ord.address.toLowerCase().includes(q))
      return matchFilter && matchSearch
    })
  }, [orders, orderFilter, orderSearch])

  // Filtered inventory
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = inventorySearch.toLowerCase().trim()
      const matchSearch =
        !q ||
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      const matchLow = !onlyLowStock || (p.stock || 0) < 15
      return matchSearch && matchLow
    })
  }, [products, inventorySearch, onlyLowStock])

  const pendingOrdersCount = orders.filter((o) => o.status === 'Kutilmoqda').length
  const shippingOrdersCount = orders.filter((o) => o.status === 'Yetkazilmoqda').length
  const completedOrdersCount = orders.filter((o) => o.status === 'Yakunlandi').length
  const lowStockCount = products.filter((p) => (p.stock || 0) < 15).length
  const newLeadsCount = consultations.filter((c) => c.status === 'Yangi').length

  const totalOrdersAmount = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-300 ${
      isDark ? 'bg-[#090d16] text-slate-100' : 'bg-slate-100/70 text-slate-900'
    }`}>
      {/* ── Top Manager Header ── */}
      <div className={`border-b sticky top-0 z-30 shadow-xs transition-colors ${
        isDark ? 'bg-[#111827]/95 border-slate-800 backdrop-blur-md' : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className={isDark ? 'bg-white/95 px-2.5 py-1 rounded-xl shadow-xs' : ''}>
                <img src={logoImg} alt="UPGRADE" className="h-8 sm:h-9 w-auto object-contain" />
              </div>
              <div className={`flex items-center gap-2 border-l pl-3 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  👔 MENEJER PANELI
                </span>
                <span className="hidden sm:inline-block text-xs text-slate-400 font-medium">
                  Buyurtmalar & Ombor Operatsiyalari
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <LanguageSwitcher theme={theme} />

              {/* Theme Switcher Oq / Qora */}
              <div className={`flex items-center p-1 rounded-2xl border text-xs font-bold transition-all ${
                isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-200'
              }`}>
                <button
                  type="button"
                  onClick={() => onSetTheme && onSetTheme('light')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                    !isDark
                      ? 'bg-white text-pink-600 shadow-xs font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Oq fon"
                >
                  <span>☀️</span>
                  <span>Oq</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSetTheme && onSetTheme('dark')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                    isDark
                      ? 'bg-slate-800 text-pink-400 shadow-xs font-black'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Qora fon"
                >
                  <span>🌙</span>
                  <span>Qora</span>
                </button>
              </div>

              <button
                onClick={() => onSwitchRole('user')}
                className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-pink-600 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                🛒 Do'konga O'tish
              </button>
              <button
                onClick={onLogout}
                className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 px-3 py-1.5 rounded-xl transition-colors border border-red-200 dark:border-red-900/60 flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Sessiyani yakunlash va chiqish"
              >
                <span>🚪</span>
                <span>Chiqish</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* ========================================================= */}
        {/* KPI SUMMARY CARDS                                         */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Card 1: Kutilayotgan Buyurtmalar */}
          <div className={`p-5 rounded-3xl border shadow-xs transition-all hover:shadow-md ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kutilmoqda</span>
              <span className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-base">
                ⏳
              </span>
            </div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {pendingOrdersCount} ta
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
              Tasdiqlash kutilmoqda
            </div>
          </div>

          {/* Card 2: Yetkazilmoqda */}
          <div className={`p-5 rounded-3xl border shadow-xs transition-all hover:shadow-md ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Yetkazilmoqda</span>
              <span className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-base">
                🚚
              </span>
            </div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {shippingOrdersCount} ta
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
              Kuryer yo'lda
            </div>
          </div>

          {/* Card 3: Yakunlandi */}
          <div className={`p-5 rounded-3xl border shadow-xs transition-all hover:shadow-md ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Yakunlandi</span>
              <span className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base">
                ✅
              </span>
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {completedOrdersCount} ta
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
              Muvaffaqiyatli topshirildi
            </div>
          </div>

          {/* Card 4: Ombor Holati / Kam qolganlar */}
          <div className={`p-5 rounded-3xl border shadow-xs transition-all hover:shadow-md ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ombor Qoldig'i</span>
              <span className="w-9 h-9 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-base">
                📦
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {lowStockCount} ta
            </div>
            <div className="text-[11px] text-rose-600 dark:text-rose-400 font-bold mt-1">
              ⚠️ Kam qolgan mahsulotlar
            </div>
          </div>

          {/* Card 5: Murojaatlar (Leads) */}
          <div className={`p-5 rounded-3xl border shadow-xs transition-all hover:shadow-md ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Yangi Murojaat</span>
              <span className="w-9 h-9 rounded-2xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold text-base">
                📞
              </span>
            </div>
            <div className="text-2xl font-black text-pink-600 dark:text-pink-400">
              {newLeadsCount} ta
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
              Bog'lanish talab qilinadi
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MANAGER TABS                                              */}
        {/* ========================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className={`flex items-center gap-1.5 p-1.5 rounded-2xl border ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'btn-pink shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>📋</span>
              <span>Buyurtmalar ({orders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'inventory'
                  ? 'btn-pink shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>📦</span>
              <span>Ombor Qoldiqlari ({products.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'leads'
                  ? 'btn-pink shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>📞</span>
              <span>Murojaatlar ({consultations.length})</span>
              {newLeadsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-bold">
            Jami Buyurtmalar Hajmi: <span className="text-pink-600 dark:text-pink-400 font-black">{totalOrdersAmount.toLocaleString('uz-UZ')} so'm</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: ORDERS MANAGEMENT                                  */}
        {/* ========================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Filter Pills & Quick Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {['Barchasi', 'Kutilmoqda', 'Yetkazilmoqda', 'Yakunlandi', 'Bekor qilindi'].map((st) => {
                  const count = st === 'Barchasi' ? orders.length : orders.filter((o) => o.status === st).length
                  const isSelected = orderFilter === st

                  return (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                          : isDark
                          ? 'bg-[#111827] border border-slate-800 text-slate-300 hover:bg-slate-800'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{st}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        isSelected ? 'bg-pink-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="№, mijoz yoki telefon..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2 rounded-xl border text-xs font-medium focus:outline-hidden focus:border-pink-500 ${
                    isDark
                      ? 'bg-[#111827] border-slate-800 text-white placeholder:text-slate-500'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
                {orderSearch && (
                  <button
                    onClick={() => setOrderSearch('')}
                    className="absolute right-3 top-2 text-xs text-slate-400 hover:text-pink-500 font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Orders Table */}
            <div className={`rounded-3xl border shadow-xs overflow-hidden ${
              isDark ? 'bg-[#111827] border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1020px] text-left text-sm">
                  <thead className={`border-b text-xs font-extrabold uppercase ${
                    isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}>
                    <tr>
                      <th className="px-6 py-4 whitespace-nowrap">Buyurtma №</th>
                      <th className="px-6 py-4 whitespace-nowrap">Mijoz & Telefon</th>
                      <th className="px-6 py-4 min-w-[200px]">Yetkazish Manzili</th>
                      <th className="px-6 py-4 min-w-[220px]">Mahsulotlar</th>
                      <th className="px-6 py-4 whitespace-nowrap">Summa & To'lov</th>
                      <th className="px-6 py-4 whitespace-nowrap">Holat (Status)</th>
                      <th className="px-6 py-4 text-right whitespace-nowrap min-w-[190px]">Holatni O'zgartirish</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                          Hech qanday buyurtma topilmadi
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => {
                        const statusColors = {
                          'Kutilmoqda': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
                          'Yetkazilmoqda': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
                          'Yakunlandi': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
                          'Bekor qilindi': 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                        }

                        return (
                          <tr
                            key={ord.id}
                            className={`transition-colors ${
                              isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50/70'
                            }`}
                          >
                            {/* Order № */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono font-black text-pink-600 dark:text-pink-400">
                                  #{ord.orderNumber}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">{ord.date}</div>
                            </td>

                            {/* Customer */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {ord.customerName}
                              </div>
                              <a
                                href={`tel:${ord.phone}`}
                                className="text-xs text-pink-600 dark:text-pink-400 font-mono hover:underline flex items-center gap-1"
                              >
                                <span>📞</span> {ord.phone}
                              </a>
                            </td>

                            {/* Address */}
                            <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                              {ord.address}
                            </td>

                            {/* Items */}
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                {ord.items.map((it, i) => (
                                  <div key={i} className="text-xs font-medium flex items-center justify-between gap-2">
                                    <span className={`truncate max-w-[180px] ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                      • {it.name}
                                    </span>
                                    <span className="text-pink-600 dark:text-pink-400 font-black shrink-0">
                                      x{it.qty}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </td>

                            {/* Total Amount & Payment Method */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {ord.totalAmount.toLocaleString('uz-UZ')} so'm
                              </div>
                              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                                💳 {ord.paymentMethod}
                              </span>
                            </td>

                            {/* Status Pill */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${
                                statusColors[ord.status] || 'bg-slate-100 text-slate-700'
                              }`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                <span>{ord.status}</span>
                              </span>
                            </td>

                            {/* Status Change Selector */}
                            <td className="px-6 py-4 text-right whitespace-nowrap">
                              <select
                                value={ord.status}
                                onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                                className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-hidden cursor-pointer ${
                                  isDark
                                    ? 'bg-slate-900 border-slate-700 text-white focus:border-pink-500'
                                    : 'bg-white border-slate-200 text-slate-900 focus:border-pink-500 shadow-xs'
                                }`}
                              >
                                <option value="Kutilmoqda">⏳ Kutilmoqda</option>
                                <option value="Yetkazilmoqda">🚚 Yetkazilmoqda</option>
                                <option value="Yakunlandi">✅ Yakunlandi</option>
                                <option value="Bekor qilindi">❌ Bekor qilindi</option>
                              </select>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: INVENTORY & STOCK CONTROL                          */}
        {/* ========================================================= */}
        {activeTab === 'inventory' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setOnlyLowStock(!onlyLowStock)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                    onlyLowStock
                      ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                      : isDark
                      ? 'bg-[#111827] border-slate-800 text-slate-300 hover:bg-slate-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>⚠️</span>
                  <span>Faqat kam qolganlar (&lt;15 dona)</span>
                  {lowStockCount > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      onlyLowStock ? 'bg-white text-rose-600' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {lowStockCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Aksessuar nomi bo'yicha..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2 rounded-xl border text-xs font-medium focus:outline-hidden focus:border-pink-500 ${
                    isDark
                      ? 'bg-[#111827] border-slate-800 text-white placeholder:text-slate-500'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
                {inventorySearch && (
                  <button
                    onClick={() => setInventorySearch('')}
                    className="absolute right-3 top-2 text-xs text-slate-400 hover:text-pink-500 font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className={`rounded-3xl border shadow-xs overflow-hidden ${
              isDark ? 'bg-[#111827] border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] text-left text-sm">
                  <thead className={`border-b text-xs font-extrabold uppercase ${
                    isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}>
                    <tr>
                      <th className="px-6 py-4 min-w-[280px]">Aksessuar</th>
                      <th className="px-6 py-4 whitespace-nowrap">Kategoriya</th>
                      <th className="px-6 py-4 whitespace-nowrap">Narxi</th>
                      <th className="px-6 py-4 whitespace-nowrap">Ombordagi Qoldiq</th>
                      <th className="px-6 py-4 whitespace-nowrap">Qoldiq Darajasi</th>
                      <th className="px-6 py-4 text-right whitespace-nowrap min-w-[220px]">Qoldiqni To'ldirish</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                    {filteredProducts.map((p) => {
                      const stock = p.stock || 0
                      const isLow = stock < 15
                      const progressWidth = Math.min(100, Math.round((stock / 50) * 100))

                      return (
                        <tr
                          key={p.id}
                          className={`transition-colors ${
                            isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50/70'
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                              />
                              <div>
                                <div className={`font-bold line-clamp-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                  {p.name}
                                </div>
                                <div className="text-xs text-slate-400">ID: {p.id}</div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                              isDark ? 'bg-pink-950/60 text-pink-300' : 'bg-pink-50 text-pink-600'
                            }`}>
                              {p.category}
                            </span>
                          </td>

                          <td className={`px-6 py-4 font-black whitespace-nowrap ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {p.price}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${
                              isLow
                                ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isLow ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                              <span>{stock} dona</span>
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-28 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  isLow ? 'bg-rose-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${progressWidth}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">
                              {isLow ? 'Kam qolgan' : 'Yetarli zaxira'}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleStockAdd(p.id, 5)}
                                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 ${
                                  isDark
                                    ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                                }`}
                              >
                                +5 dona
                              </button>
                              <button
                                onClick={() => handleStockAdd(p.id, 10)}
                                className="btn-pink px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                              >
                                +10 dona
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: LEADS & CONSULTATIONS                              */}
        {/* ========================================================= */}
        {activeTab === 'leads' && (
          <div className="space-y-4 animate-fadeIn">
            <div className={`p-6 sm:p-7 rounded-3xl border shadow-xs overflow-hidden ${
              isDark ? 'bg-[#111827] border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className={`font-black text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    📞 Mijozlar Qo'ng'iroq Murojaatlari (Leads)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Sayt orqali konsultatsiya so'ragan yoki qo'ng'iroq qoldirgan xaridorlar ro'yxati
                  </p>
                </div>
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800">
                  {newLeadsCount} ta yangi murojaat
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className={`border-b text-xs font-extrabold uppercase ${
                    isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}>
                    <tr>
                      <th className="px-6 py-4">Mijoz Ismi</th>
                      <th className="px-6 py-4">Telefon Raqami</th>
                      <th className="px-6 py-4">Yuborilgan Vaqt</th>
                      <th className="px-6 py-4">Holati</th>
                      <th className="px-6 py-4 text-right">Amal</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                    {consultations.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                          Hech qanday murojaat yo'q
                        </td>
                      </tr>
                    ) : (
                      consultations.map((lead) => {
                        const isNew = lead.status === 'Yangi'

                        return (
                          <tr
                            key={lead.id}
                            className={`transition-colors ${
                              isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50/70'
                            }`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-pink-950/70 text-pink-600 dark:text-pink-300 font-black flex items-center justify-center text-sm shadow-xs">
                                  {lead.name.charAt(0)}
                                </div>
                                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                  {lead.name}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              <a
                                href={`tel:${lead.phone}`}
                                className="font-mono font-bold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1.5"
                              >
                                <span>📞</span> {lead.phone}
                              </a>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                              {lead.createdAt}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${
                                isNew
                                  ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800 animate-pulse'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isNew ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                <span>{lead.status}</span>
                              </span>
                            </td>

                            <td className="px-6 py-4 text-right whitespace-nowrap">
                              <button
                                onClick={() => handleToggleLead(lead.id)}
                                className={`px-4 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 ${
                                  isNew
                                    ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                                    : isDark
                                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                {isNew ? '✓ Bog\'landim' : 'Yangi deb belgilash'}
                              </button>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManagerPanel
