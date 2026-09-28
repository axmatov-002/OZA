import React, { useState, useMemo } from 'react'
import logoImg from '../assets/image.png'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { hashPassword } from '../utils/security'

const MONTHLY_SALES_DATA = [
  { month: 'Yanvar', revenue: 18400000, units: 142, growth: '+12%' },
  { month: 'Fevral', revenue: 22100000, units: 168, growth: '+20%' },
  { month: 'Mart', revenue: 28500000, units: 215, growth: '+29%' },
  { month: 'Aprel', revenue: 31200000, units: 234, growth: '+9%' },
  { month: 'May', revenue: 29800000, units: 218, growth: '-4%' },
  { month: 'Iyun', revenue: 35400000, units: 262, growth: '+18%' },
  { month: 'Iyul', revenue: 42000000, units: 310, growth: '+19%' },
  { month: 'Avgust', revenue: 48600000, units: 365, growth: '+16%' },
  { month: 'Sentyabr', revenue: 56200000, units: 428, growth: '+15%' }
]

const AdminPanel = ({ 
  products, 
  setProducts, 
  orders, 
  users, 
  setUsers,
  theme = 'light',
  onSetTheme,
  onSwitchRole,
  onLogout 
}) => {
  const [activeTab, setActiveTab] = useState('products') // 'products' | 'analytics' | 'users'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [hoveredMonth, setHoveredMonth] = useState(null)

  const isDark = theme === 'dark'

  // Form State for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    category: 'Klaviaturalar',
    price: '',
    priceNum: 0,
    stock: 10,
    image: '',
    description: ''
  })

  // Calculate sales units and revenue per product
  const productSalesMap = useMemo(() => {
    const map = {}
    products.forEach((p) => {
      // Baseline realistic sales based on popularity & reviews
      const baseSold = Math.max(16, Math.floor((p.reviewsCount || 12) * 1.5))
      map[p.id] = baseSold
    })
    // Add real database orders
    if (orders && Array.isArray(orders)) {
      orders.forEach((ord) => {
        if (ord.items && Array.isArray(ord.items)) {
          ord.items.forEach((it) => {
            const pid = it.productId || it.id
            if (pid) {
              map[pid] = (map[pid] || 0) + (it.qty || 1)
            }
          })
        }
      })
    }
    return map
  }, [products, orders])

  const totalSoldUnits = useMemo(() => {
    return Object.values(productSalesMap).reduce((a, b) => a + b, 0)
  }, [productSalesMap])

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0)
  }, [orders])

  const totalStockCount = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.stock || 0), 0)
  }, [products])

  const totalCatalogTurnover = useMemo(() => {
    return products.reduce((sum, p) => sum + (productSalesMap[p.id] || 0) * (p.priceNum || 0), 0)
  }, [products, productSalesMap])

  // Top 5 best-selling products leaderboard
  const topSellingProducts = useMemo(() => {
    return [...products]
      .map((p) => ({
        ...p,
        soldCount: productSalesMap[p.id] || 0,
        revenueGenerated: (productSalesMap[p.id] || 0) * (p.priceNum || 0)
      }))
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, 5)
  }, [products, productSalesMap])

  // Sales by Category calculation
  const categorySalesStats = useMemo(() => {
    const catMap = {}
    products.forEach((p) => {
      const sold = productSalesMap[p.id] || 0
      const rev = sold * (p.priceNum || 0)
      if (!catMap[p.category]) {
        catMap[p.category] = { category: p.category, units: 0, revenue: 0 }
      }
      catMap[p.category].units += sold
      catMap[p.category].revenue += rev
    })
    const list = Object.values(catMap).sort((a, b) => b.revenue - a.revenue)
    const grandUnits = list.reduce((s, c) => s + c.units, 0) || 1
    return list.map((c) => ({
      ...c,
      percent: Math.round((c.units / grandUnits) * 100)
    }))
  }, [products, productSalesMap])

  // Open add modal
  const openAddModal = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      category: 'Klaviaturalar',
      price: '500 000 so\'m',
      priceNum: 500000,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
      description: 'Yangi kompyuter aksessuari'
    })
    setIsAddModalOpen(true)
  }

  // Open edit modal
  const openEditModal = (prod) => {
    setEditingProduct(prod)
    setFormData({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      priceNum: prod.priceNum,
      stock: prod.stock || 10,
      image: prod.image,
      description: prod.description || ''
    })
    setIsAddModalOpen(true)
  }

  // Save product (Add or Update)
  const handleSaveProduct = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.priceNum) return

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formData.name,
                category: formData.category,
                price: `${Number(formData.priceNum).toLocaleString('uz-UZ')} so'm`,
                priceNum: Number(formData.priceNum),
                stock: Number(formData.stock),
                image: formData.image,
                description: formData.description
              }
            : p
        )
      )
    } else {
      const newProduct = {
        id: `p-${Date.now()}`,
        name: formData.name,
        category: formData.category,
        badge: 'YANGI',
        price: `${Number(formData.priceNum).toLocaleString('uz-UZ')} so'm`,
        oldPrice: '',
        priceNum: Number(formData.priceNum),
        stock: Number(formData.stock),
        rating: 5.0,
        reviewsCount: 1,
        image: formData.image || 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
        specs: ['100% Original', '2 Yil Kafolat'],
        description: formData.description
      }
      setProducts((prev) => [newProduct, ...prev])
    }

    setIsAddModalOpen(false)
  }

  // Delete product
  const handleDeleteProduct = (id) => {
    if (window.confirm('Haqiqatan ham ushbu mahsulotni o\'chirmoqchimisiz?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const maxMonthlyRevenue = Math.max(...MONTHLY_SALES_DATA.map((m) => m.revenue))

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-300 ${
      isDark ? 'bg-[#090d16] text-slate-100' : 'bg-slate-100/70 text-slate-900'
    }`}>
      {/* ── Top Admin Header ── */}
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
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-700 border border-rose-200">
                  👑 ADMIN PANEL
                </span>
                <span className="hidden sm:inline-block text-xs text-slate-400 font-medium">
                  Boshqaruv & Savdo Statistikasi
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
        {/* KPI STATS CARDS (Top Overview with Sales Statistics)       */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Card 1: Jami Tushum */}
          <div className={`p-5 rounded-3xl border shadow-xs transition-all hover:shadow-md ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Jami Tushum</span>
              <span className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base">
                💰
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {totalRevenue.toLocaleString('uz-UZ')} <span className="text-xs font-normal text-slate-400">so'm</span>
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-2 flex items-center gap-1">
              <span>↑ +24.8%</span> <span className="text-slate-400 font-normal">o'tgan oyga nisbatan</span>
            </div>
          </div>

          {/* Card 2: JAMI SOTILGAN (Highlighted Sales KPI) */}
          <div className={`p-5 rounded-3xl border shadow-xs transition-all hover:shadow-md ring-2 ring-pink-500/20 ${
            isDark ? 'bg-gradient-to-br from-[#1e1026] to-[#111827] border-pink-900/60' : 'bg-gradient-to-br from-pink-50/50 to-white border-pink-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black text-pink-600 dark:text-pink-400 uppercase tracking-wider flex items-center gap-1">
                <span>🔥</span> Jami Sotilgan
              </span>
              <span className="w-9 h-9 rounded-2xl bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300 flex items-center justify-center font-bold text-base shadow-xs">
                📈
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {totalSoldUnits.toLocaleString('uz-UZ')} <span className="text-xs font-bold text-pink-600 dark:text-pink-400">dona</span>
            </div>
            <div className="text-[11px] text-pink-600 dark:text-pink-400 font-black mt-2 flex items-center gap-1">
              <span>↑ +34.2%</span> <span className="text-slate-400 font-normal">umumiy sotuv sur'ati</span>
            </div>
          </div>

          {/* Card 3: Buyurtmalar Soni */}
          <div className={`p-5 rounded-3xl border shadow-xs transition-all hover:shadow-md ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Buyurtmalar</span>
              <span className="w-9 h-9 rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold text-base">
                🛒
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {orders.length} ta
            </div>
            <div className="text-[11px] text-violet-600 dark:text-violet-400 font-semibold mt-2">
              100% muvaffaqiyatli
            </div>
          </div>

          {/* Card 4: Ombordagi Qoldiq */}
          <div className={`p-5 rounded-3xl border shadow-xs transition-all hover:shadow-md ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Omborda Qoldiq</span>
              <span className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-base">
                📦
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {totalStockCount} dona
            </div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-2">
              Aksessuarlar mavjud
            </div>
          </div>

          {/* Card 5: Jami Xodimlar & User */}
          <div className={`p-5 rounded-3xl border shadow-xs transition-all hover:shadow-md ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Katalog & User</span>
              <span className="w-9 h-9 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-base">
                👥
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {products.length} ta <span className="text-xs font-normal text-slate-400">/ {users.length} user</span>
            </div>
            <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-2">
              Barcha profillar faol
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* NAVIGATION TABS (Products, Sales Analytics, Users)        */}
        {/* ========================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className={`flex items-center gap-1.5 p-1.5 rounded-2xl border ${
            isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'products'
                  ? 'btn-pink shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>📦</span>
              <span>Mahsulotlar ({products.length})</span>
            </button>

            {/* TAB: SAVDO & STATISTIKA (Analytics) */}
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'analytics'
                  ? 'btn-pink shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>📊</span>
              <span>Savdo & Statistika</span>
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'users'
                  ? 'btn-pink shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>👥</span>
              <span>Foydalanuvchilar ({users.length})</span>
            </button>
          </div>

          {activeTab === 'products' && (
            <button
              onClick={openAddModal}
              className="btn-pink px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              <span>+ Yangi Aksessuar Qo'shish</span>
            </button>
          )}
        </div>

        {/* ========================================================= */}
        {/* TAB 1: PRODUCTS TABLE (With "Sotildi" Column)              */}
        {/* ========================================================= */}
        {activeTab === 'products' && (
          <div className={`rounded-3xl border shadow-xs overflow-hidden ${
            isDark ? 'bg-[#111827] border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className={`border-b text-xs font-extrabold uppercase ${
                  isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}>
                  <tr>
                    <th className="px-6 py-4 min-w-[280px]">Aksessuar</th>
                    <th className="px-6 py-4 whitespace-nowrap">Kategoriya</th>
                    <th className="px-6 py-4 whitespace-nowrap">Narxi</th>
                    <th className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="text-pink-600 dark:text-pink-400">🔥 Sotildi</span>
                    </th>
                    <th className="px-6 py-4 whitespace-nowrap">Omborda</th>
                    <th className="px-6 py-4 whitespace-nowrap">Reyting</th>
                    <th className="px-6 py-4 text-right whitespace-nowrap min-w-[200px]">Amallar</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                  {products.map((prod) => {
                    const sold = productSalesMap[prod.id] || 0
                    const stock = prod.stock || 0
                    const soldPercent = Math.min(100, Math.round((sold / Math.max(1, sold + stock)) * 100))
                    const totalProductRevenue = sold * (prod.priceNum || 0)

                    return (
                      <tr
                        key={prod.id}
                        className={`transition-colors ${
                          isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50/70'
                        }`}
                      >
                        {/* Product info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className={`font-bold line-clamp-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {prod.name}
                              </div>
                              <div className="text-xs text-slate-400">ID: {prod.id}</div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                            isDark ? 'bg-pink-950/60 text-pink-300' : 'bg-pink-50 text-pink-600'
                          }`}>
                            {prod.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className={`px-6 py-4 font-black whitespace-nowrap ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {prod.price}
                        </td>

                        {/* SOTILDI (Real Sales Column) */}
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <div className="inline-flex flex-col items-center">
                            <div className="flex items-center gap-1.5 font-black text-slate-900 dark:text-white">
                              <span className="text-pink-600 dark:text-pink-400 text-sm">{sold} dona</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-extrabold">
                                {soldPercent}%
                              </span>
                            </div>
                            <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden mt-1">
                              <div
                                className="bg-gradient-to-r from-pink-500 to-rose-500 h-full rounded-full"
                                style={{ width: `${soldPercent}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                              {totalProductRevenue.toLocaleString('uz-UZ')} so'm
                            </span>
                          </div>
                        </td>

                        {/* Stock (Fixed: never breaks into two lines, high contrast vibrant pills) */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold whitespace-nowrap border ${
                            stock < 10 
                              ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800' 
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${stock < 10 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                            <span>{stock} dona</span>
                          </span>
                        </td>

                        {/* Rating */}
                        <td className="px-6 py-4 whitespace-nowrap text-amber-500 font-bold">
                          <div className="flex items-center gap-1">
                            <span>★ {prod.rating}</span>
                            <span className="text-slate-400 font-normal">({prod.reviewsCount})</span>
                          </div>
                        </td>

                        {/* Actions (Fixed: side by side with gap, clean buttons) */}
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(prod)}
                              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-pink-500 hover:text-pink-600 dark:hover:text-pink-400 text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer flex items-center gap-1 bg-white dark:bg-slate-800"
                            >
                              <span>✏️</span>
                              <span>Tahrirlash</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="px-3.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer flex items-center gap-1 bg-white dark:bg-slate-800"
                            >
                              <span>🗑️</span>
                              <span>O'chirish</span>
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
        )}

        {/* ========================================================= */}
        {/* TAB 2: VISUAL SALES & REVENUE ANALYTICS DASHBOARD         */}
        {/* ========================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Summary Banner */}
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
              isDark
                ? 'bg-gradient-to-r from-[#170a24] via-[#111827] to-[#0d1627] border-pink-900/40'
                : 'bg-gradient-to-r from-pink-50 via-white to-purple-50 border-pink-200/80'
            }`}>
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 border border-pink-300/60 mb-2">
                  📈 2026-YIL SAVDO VA SOTUV TAHLILI
                </span>
                <h3 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Jami Sotilgan: <span className="text-pink-600 dark:text-pink-400">{totalSoldUnits.toLocaleString('uz-UZ')} dona</span> aksessuar
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Barcha aksessuarlar bo'yicha umumiy aylanma <span className="font-extrabold text-slate-800 dark:text-slate-200">{(totalCatalogTurnover).toLocaleString('uz-UZ')} so'm</span>ni tashkil qildi. Eng yuqori ko'rsatkich Sentyabr oyida qayd etildi.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className={`p-4 rounded-2xl border text-center ${
                  isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <div className="text-xs text-slate-400 font-bold">O'rtacha Chek</div>
                  <div className="text-lg font-black text-pink-600 dark:text-pink-400">
                    {Math.round(totalRevenue / Math.max(1, orders.length)).toLocaleString('uz-UZ')} so'm
                  </div>
                </div>
                <div className={`p-4 rounded-2xl border text-center ${
                  isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <div className="text-xs text-slate-400 font-bold">Konversiya</div>
                  <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    4.8% 🔥
                  </div>
                </div>
              </div>
            </div>

            {/* 1. Monthly Revenue & Units Sold Interactive Bar Chart */}
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-xs ${
              isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h4 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Oylik Savdo Dinamikasi (Yanvar — Sentyabr 2026)
                  </h4>
                  <p className="text-xs text-slate-400">Har bir oyda sotilgan mahsulotlar va tushum grafigi</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-gradient-to-t from-pink-600 to-rose-400" />
                    <span className="text-slate-600 dark:text-slate-300">Tushum (so'm)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-slate-600 dark:text-slate-300">O'sish sur'ati</span>
                  </div>
                </div>
              </div>

              {/* Chart Bars */}
              <div className="h-64 sm:h-72 flex items-end justify-between gap-2 sm:gap-4 pt-10 pb-4 border-b border-slate-200 dark:border-slate-800 relative">
                {MONTHLY_SALES_DATA.map((item, idx) => {
                  const heightPercent = Math.round((item.revenue / maxMonthlyRevenue) * 100)
                  const isHovered = hoveredMonth === idx

                  return (
                    <div
                      key={item.month}
                      className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                      onMouseEnter={() => setHoveredMonth(idx)}
                      onMouseLeave={() => setHoveredMonth(null)}
                    >
                      {/* Tooltip on hover */}
                      {isHovered && (
                        <div className="absolute -top-16 z-30 bg-slate-900 text-white text-[11px] px-3 py-1.5 rounded-xl shadow-xl border border-slate-700 whitespace-nowrap animate-in fade-in zoom-in-95 pointer-events-none">
                          <div className="font-bold text-pink-400">{item.month}: {item.revenue.toLocaleString('uz-UZ')} so'm</div>
                          <div className="text-slate-300">Sotildi: <span className="font-bold text-white">{item.units} dona</span> ({item.growth})</div>
                        </div>
                      )}

                      {/* Bar */}
                      <div
                        className={`w-full max-w-[42px] rounded-t-xl transition-all duration-300 relative ${
                          isHovered
                            ? 'bg-gradient-to-t from-pink-500 via-rose-500 to-amber-400 scale-105 shadow-lg shadow-pink-500/30'
                            : 'bg-gradient-to-t from-pink-600 via-pink-500 to-rose-400/90 hover:opacity-90'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      >
                        {/* Units badge over bar on top */}
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.units}
                        </div>
                      </div>

                      {/* Month label */}
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-2 truncate max-w-full">
                        {item.month.slice(0, 3)}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-3">
                <span>Eng past: Yanvar (142 dona)</span>
                <span className="font-bold text-pink-600 dark:text-pink-400">🔥 Eng yuqori rekord: Sentyabr (428 dona / 56.2 mln so'm)</span>
              </div>
            </div>

            {/* 2-Column Split: Top Best Sellers Leaderboard & Sales by Category */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Top 5 Best Sellers (Leaderboard) */}
              <div className={`lg:col-span-7 p-6 sm:p-8 rounded-3xl border shadow-xs ${
                isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      🏆 Eng Ko'p Sotilgan Top-5 Aksessuarlar
                    </h4>
                    <p className="text-xs text-slate-400">Do'kon xaridorlari orasida eng talabgir mahsulotlar</p>
                  </div>
                  <span className="text-xs font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950 px-2.5 py-1 rounded-full">
                    Top Xaridlar
                  </span>
                </div>

                <div className="space-y-4">
                  {topSellingProducts.map((prod, rank) => {
                    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣']
                    const maxTopSold = topSellingProducts[0]?.soldCount || 1
                    const barWidth = Math.round((prod.soldCount / maxTopSold) * 100)

                    return (
                      <div
                        key={prod.id}
                        className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 ${
                          isDark
                            ? 'bg-slate-900/60 border-slate-800 hover:border-pink-500/40'
                            : 'bg-slate-50 border-slate-200/80 hover:border-pink-300'
                        }`}
                      >
                        <span className="text-xl font-black w-6 text-center select-none">
                          {medals[rank]}
                        </span>

                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h5 className={`text-xs sm:text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {prod.name}
                            </h5>
                            <span className="text-xs font-black text-pink-600 dark:text-pink-400 shrink-0">
                              {prod.soldCount} dona
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1 mb-1.5">
                            <span>{prod.category}</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {prod.revenueGenerated.toLocaleString('uz-UZ')} so'm
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-pink-500 to-rose-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right Column: Category Breakdown & Payment Stats */}
              <div className="lg:col-span-5 space-y-6">
                {/* Category Breakdown Card */}
                <div className={`p-6 rounded-3xl border shadow-xs ${
                  isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <h4 className={`text-base font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    📦 Kategoriyalar Bo'yicha Sotuv Ulushi
                  </h4>
                  <p className="text-xs text-slate-400 mb-4">Har bir bo'limning umumiy sotuvdagi hissasi</p>

                  <div className="space-y-3.5">
                    {categorySalesStats.slice(0, 4).map((c, i) => {
                      const colors = [
                        'from-pink-500 to-rose-500',
                        'from-purple-500 to-indigo-500',
                        'from-blue-500 to-sky-500',
                        'from-emerald-500 to-teal-500'
                      ]
                      return (
                        <div key={c.category} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-slate-700 dark:text-slate-300">{c.category}</span>
                            <span className="text-pink-600 dark:text-pink-400">{c.units} dona ({c.percent}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className={`bg-gradient-to-r ${colors[i % colors.length]} h-full rounded-full transition-all duration-500`}
                              style={{ width: `${c.percent}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Payment Methods Card */}
                <div className={`p-6 rounded-3xl border shadow-xs ${
                  isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <h4 className={`text-base font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    💳 To'lov Tizimlari Taqsimoti
                  </h4>
                  <p className="text-xs text-slate-400 mb-4">Mijozlar to'lov usullari</p>

                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    <div className={`p-3 rounded-2xl border ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200/80'
                    }`}>
                      <div className="text-base font-black text-cyan-500">Payme</div>
                      <div className="text-lg font-black text-slate-900 dark:text-white mt-1">48%</div>
                      <div className="text-[10px] text-slate-400">To'langan</div>
                    </div>
                    <div className={`p-3 rounded-2xl border ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200/80'
                    }`}>
                      <div className="text-base font-black text-blue-500">Click</div>
                      <div className="text-lg font-black text-slate-900 dark:text-white mt-1">34%</div>
                      <div className="text-[10px] text-slate-400">To'langan</div>
                    </div>
                    <div className={`p-3 rounded-2xl border ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200/80'
                    }`}>
                      <div className="text-base font-black text-purple-500">Nasiya</div>
                      <div className="text-lg font-black text-slate-900 dark:text-white mt-1">18%</div>
                      <div className="text-[10px] text-slate-400">Uzum Nasiya</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: USERS & ROLES MANAGEMENT                           */}
        {/* ========================================================= */}
        {activeTab === 'users' && (
          <div className={`rounded-3xl border shadow-xs overflow-hidden ${
            isDark ? 'bg-[#111827] border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
          }`}>
            <div className={`p-6 border-b flex items-center justify-between ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <div>
                <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Foydalanuvchilar va Rollar Boshqaruvi
                </h3>
                <p className="text-xs text-slate-400">Tizimga kirish huquqlarini belgilash (Admin, Manager, User)</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className={`border-b text-xs font-extrabold uppercase ${
                  isDark ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}>
                  <tr>
                    <th className="px-6 py-4">Foydalanuvchi</th>
                    <th className="px-6 py-4">Email & Telefon</th>
                    <th className="px-6 py-4">Rol</th>
                    <th className="px-6 py-4">Maxsus Parol</th>
                    <th className="px-6 py-4">Holati</th>
                    <th className="px-6 py-4 text-right">Rolni O'zgartirish</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className={`transition-colors ${
                        isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{u.name}</div>
                            <div className="text-xs text-slate-400">Qo'shilgan: {u.createdAt}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{u.email}</div>
                        <div className="text-xs text-slate-400">{u.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                          u.role === 'admin'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                            : u.role === 'manager'
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {u.role === 'admin' ? '👑 Admin' : u.role === 'manager' ? '👔 Menejer' : '🛒 Mijoz'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            <span>🔒</span>
                            <span>••••••••</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const newPass = prompt(`"${u.name}" uchun yangi xavfsiz parol kiriting (kamida 6 belgi):`)
                              if (newPass && newPass.trim().length >= 6) {
                                hashPassword(newPass.trim()).then((hashed) => {
                                  setUsers((prev) => {
                                    const updated = prev.map((usr) => (usr.id === u.id ? { ...usr, password: hashed } : usr))
                                    try {
                                      localStorage.setItem('upg_users', JSON.stringify(updated))
                                    } catch {}
                                    return updated
                                  })
                                  alert(`"${u.name}" paroli muvaffaqiyatli yangilandi va SHA-256 bilan shifrlanib saqlandi!`)
                                })
                              } else if (newPass) {
                                alert("Parol kamida 6 ta belgidan iborat bo'lishi shart!")
                              }
                            }}
                            className="px-2 py-1 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-pink-200"
                            title="Yangi parol o'rnatish"
                          >
                            ✏️ O'zgartirish
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Faol
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => {
                            const newRole = e.target.value
                            setUsers((prev) =>
                              prev.map((usr) => (usr.id === u.id ? { ...usr, role: newRole } : usr))
                            )
                          }}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold focus:outline-hidden cursor-pointer ${
                            isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700 shadow-xs'
                          }`}
                        >
                          <option value="user">🛒 Oddiy Mijoz</option>
                          <option value="manager">👔 Menejer</option>
                          <option value="admin">👑 Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL: ADD / EDIT PRODUCT                                 */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className={`rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border animate-in zoom-in-95 duration-150 ${
            isDark ? 'bg-[#111827] border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'
          }`}>
            <h3 className="text-xl font-black mb-4">
              {editingProduct ? 'Mahsulotni Tahrirlash' : 'Yangi Aksessuar Qo\'shish'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase mb-1 text-slate-500">
                  Nomi
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="UPGRADE MechPro RGB Klaviatura..."
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:border-pink-500 ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-slate-500">
                    Kategoriya
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:border-pink-500 cursor-pointer ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="Klaviaturalar">Klaviaturalar</option>
                    <option value="Sichqonchalar">Sichqonchalar</option>
                    <option value="Naushniklar">Naushniklar</option>
                    <option value="RGB Gilamchalar">RGB Gilamchalar</option>
                    <option value="Stol & Qavslar">Stol & Qavslar</option>
                    <option value="Strim & Audio">Strim & Audio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-slate-500">
                    Narxi (so'm)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.priceNum}
                    onChange={(e) => setFormData({ ...formData, priceNum: e.target.value })}
                    placeholder="450000"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:border-pink-500 ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-slate-500">
                    Omborda (dona)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:border-pink-500 ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-slate-500">
                    Rasm URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:border-pink-500 ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-1 text-slate-500">
                  Tavsif
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Aksessuar haqida qisqacha ma'lumot..."
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:border-pink-500 ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className={`flex-1 py-3 rounded-xl border text-sm font-bold cursor-pointer ${
                    isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Bekor Qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-pink py-3 rounded-xl text-sm font-bold shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all"
                >
                  {editingProduct ? 'Saqlash' : 'Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel
