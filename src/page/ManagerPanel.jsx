import React, { useState } from 'react'
import logoImg from '../assets/image.png'

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

  const filteredOrders = orders.filter((ord) => {
    if (orderFilter === 'Barchasi') return true
    return ord.status === orderFilter
  })

  const pendingOrdersCount = orders.filter((o) => o.status === 'Kutilmoqda').length
  const shippingOrdersCount = orders.filter((o) => o.status === 'Yetkazilmoqda').length

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 pb-20">
      {/* Top Manager Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="ORA" className="h-9 sm:h-10 w-auto object-contain" />
              <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-100 text-purple-700 border border-purple-200">
                  👔 MENEJER PANELI
                </span>
                <span className="hidden sm:inline-block text-xs text-slate-500 font-medium">
                  Buyurtmalar & Ombor Nazorati
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Switcher Oq / Qora */}
              <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold transition-all">
                <button
                  type="button"
                  onClick={() => onSetTheme && onSetTheme('light')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'bg-white text-pink-600 shadow-xs font-black'
                      : 'text-slate-500 hover:text-slate-900'
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
                    theme === 'dark'
                      ? 'bg-slate-900 text-pink-400 shadow-xs font-black'
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
                className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-pink-600 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                🛒 Do'konga O'tish
              </button>
              <button
                onClick={() => onSwitchRole('admin')}
                className="text-xs sm:text-sm font-semibold text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-colors border border-rose-200 cursor-pointer"
              >
                👑 Admin Paneli
              </button>
              <button
                onClick={onLogout}
                className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors border border-red-200 flex items-center gap-1.5 cursor-pointer shadow-xs"
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
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Kutilayotgan Buyurtmalar
              </div>
              <div className="text-3xl font-black text-amber-600">
                {pendingOrdersCount} ta
              </div>
              <div className="text-xs text-slate-500 mt-1">Tezkor tekshirish talab qilinadi</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold">
              ⏳
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Yetkazilayotganlar
              </div>
              <div className="text-3xl font-black text-blue-600">
                {shippingOrdersCount} ta
              </div>
              <div className="text-xs text-slate-500 mt-1">Kuryer yo'lda</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold">
              🚚
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Mijoz Murojaatlari (Leads)
              </div>
              <div className="text-3xl font-black text-pink-600">
                {consultations.length} ta
              </div>
              <div className="text-xs text-slate-500 mt-1">Qo'ng'iroqlar jurnali</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center text-2xl font-bold">
              📞
            </div>
          </div>
        </div>

        {/* Manager Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-slate-200 mb-6 w-fit">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'orders'
                ? 'btn-pink shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            📋 Buyurtmalar ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'inventory'
                ? 'btn-pink shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            📦 Ombor Qoldiqlari
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'leads'
                ? 'btn-pink shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            📞 Murojaatlar ({consultations.length})
          </button>
        </div>

        {/* TAB 1: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Status Filter buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {['Barchasi', 'Kutilmoqda', 'Yetkazilmoqda', 'Yakunlandi', 'Bekor qilindi'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    orderFilter === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-extrabold uppercase text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Buyurtma №</th>
                      <th className="px-6 py-4">Mijoz & Telefon</th>
                      <th className="px-6 py-4">Manzil</th>
                      <th className="px-6 py-4">Mahsulotlar</th>
                      <th className="px-6 py-4">Summa</th>
                      <th className="px-6 py-4">Holat (Status)</th>
                      <th className="px-6 py-4 text-right">Holatni O'zgartirish</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono font-bold text-pink-600">
                            {ord.orderNumber}
                          </span>
                          <div className="text-[11px] text-slate-400">{ord.date}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{ord.customerName}</div>
                          <div className="text-xs text-slate-500">{ord.phone}</div>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-600 max-w-xs">
                          {ord.address}
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {ord.items.map((it, i) => (
                              <div key={i} className="text-xs text-slate-700 font-medium">
                                • {it.name} <span className="text-pink-600 font-bold">x{it.qty}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-black text-slate-900">
                          {ord.totalAmount.toLocaleString('uz-UZ')} so'm
                          <div className="text-[11px] text-emerald-600 font-semibold">{ord.paymentMethod}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                            ord.status === 'Yetkazilmoqda'
                              ? 'bg-blue-100 text-blue-700'
                              : ord.status === 'Yakunlandi'
                              ? 'bg-emerald-100 text-emerald-700'
                              : ord.status === 'Bekor qilindi'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <select
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-pink-500"
                          >
                            <option value="Kutilmoqda">⏳ Kutilmoqda</option>
                            <option value="Yetkazilmoqda">🚚 Yetkazilmoqda</option>
                            <option value="Yakunlandi">✅ Yakunlandi</option>
                            <option value="Bekor qilindi">❌ Bekor qilindi</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY & STOCK CONTROL */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">Aksessuarlar Ombor Qoldiqlari</h3>
              <p className="text-xs text-slate-500">Mahsulot sonini nazorat qilish va yangi partiya qabul qilish</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-extrabold uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Aksessuar</th>
                    <th className="px-6 py-4">Kategoriya</th>
                    <th className="px-6 py-4">Narxi</th>
                    <th className="px-6 py-4">Ombordagi Qoldiq</th>
                    <th className="px-6 py-4 text-right">Qoldiqni To'ldirish</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => {
                    const isLow = (p.stock || 0) < 15
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                            <div>
                              <div className="font-bold text-slate-900">{p.name}</div>
                              {isLow && (
                                <span className="text-[10px] bg-rose-100 text-rose-700 font-extrabold px-2 py-0.5 rounded-full">
                                  ⚠️ Kam qoldi
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{p.category}</td>
                        <td className="px-6 py-4 font-black text-slate-900">{p.price}</td>
                        <td className="px-6 py-4">
                          <span className={`text-base font-black ${isLow ? 'text-rose-600' : 'text-slate-900'}`}>
                            {p.stock || 0} dona
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => handleStockAdd(p.id, 5)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                          >
                            +5 dona
                          </button>
                          <button
                            onClick={() => handleStockAdd(p.id, 10)}
                            className="btn-pink px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs"
                          >
                            +10 dona
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: LEADS & CONSULTATIONS */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">Mijozlar Qo'ng'iroq Murojaatlari</h3>
              <p className="text-xs text-slate-500">Sayt orqali maslahat so'ragan mijozlar ro'yxati</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-extrabold uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Mijoz Ismi</th>
                    <th className="px-6 py-4">Telefon Raqami</th>
                    <th className="px-6 py-4">Yuborilgan Vaqt</th>
                    <th className="px-6 py-4">Holati</th>
                    <th className="px-6 py-4 text-right">Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {consultations.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">{lead.name}</td>
                      <td className="px-6 py-4 font-mono font-bold text-pink-600">{lead.phone}</td>
                      <td className="px-6 py-4 text-xs text-slate-500">{lead.createdAt}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          lead.status === 'Yangi'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleToggleLead(lead.id)}
                          className="px-4 py-1.5 rounded-xl border border-slate-200 text-xs font-bold hover:border-pink-500 hover:text-pink-600 transition-colors"
                        >
                          {lead.status === 'Yangi' ? '✓ Bog\'landim' : 'Yangi deb belgilash'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManagerPanel
