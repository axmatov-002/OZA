import React, { useState } from 'react'
import logoImg from '../assets/image.png'

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
  const [activeTab, setActiveTab] = useState('products') // 'products' | 'users' | 'analytics'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

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
      // Update
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
      // Create
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

  // Calculate stats
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.totalAmount, 0)
  const totalStockCount = products.reduce((sum, p) => sum + (p.stock || 0), 0)

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 pb-20">
      {/* Top Admin Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="ORA" className="h-9 sm:h-10 w-auto object-contain" />
              <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-700 border border-rose-200">
                  👑 ADMIN PANEL
                </span>
                <span className="hidden sm:inline-block text-xs text-slate-500 font-medium">
                  To'liq Boshqaruv Markazi
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
                onClick={() => onSwitchRole('manager')}
                className="text-xs sm:text-sm font-semibold text-purple-700 hover:bg-purple-50 px-3 py-1.5 rounded-xl transition-colors border border-purple-200 cursor-pointer"
              >
                👔 Menejer Paneli
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
        {/* KPI Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jami Tushum</span>
              <span className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
                💰
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {totalRevenue.toLocaleString('uz-UZ')} <span className="text-sm font-normal text-slate-500">so'm</span>
            </div>
            <div className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
              <span>↑ +24.8%</span> <span className="text-slate-400 font-normal">o'tgan oyga nisbatan</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mahsulot Turlari</span>
              <span className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold text-lg">
                📦
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {products.length} ta
            </div>
            <div className="text-xs text-pink-600 font-semibold mt-2">
              Barcha kategoriyalar faol
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ombordagi Qoldiq</span>
              <span className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                📊
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {totalStockCount} dona
            </div>
            <div className="text-xs text-blue-600 font-semibold mt-2">
              Aksessuarlar mavjud
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jami Xodimlar & User</span>
              <span className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg">
                👥
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {users.length} nafar
            </div>
            <div className="text-xs text-purple-600 font-semibold mt-2">
              Admin, Manager va Mijozlar
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-slate-200">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'products'
                  ? 'btn-pink shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              📦 Mahsulotlar ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'users'
                  ? 'btn-pink shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              👥 Foydalanuvchilar & Rollar ({users.length})
            </button>
          </div>

          {activeTab === 'products' && (
            <button
              onClick={openAddModal}
              className="btn-pink px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md"
            >
              <span>+ Yangi Aksessuar Qo'shish</span>
            </button>
          )}
        </div>

        {/* Tab 1: Products Management Table */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-extrabold uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Aksessuar</th>
                    <th className="px-6 py-4">Kategoriya</th>
                    <th className="px-6 py-4">Narxi</th>
                    <th className="px-6 py-4">Omborda</th>
                    <th className="px-6 py-4">Reyting</th>
                    <th className="px-6 py-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1">{prod.name}</div>
                            <div className="text-xs text-slate-400">ID: {prod.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-pink-50 text-pink-600">
                          {prod.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900">
                        {prod.price}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          (prod.stock || 0) < 10 
                            ? 'bg-rose-100 text-rose-700' 
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {prod.stock || 0} dona
                        </span>
                      </td>
                      <td className="px-6 py-4 text-amber-500 font-bold">
                        ★ {prod.rating} <span className="text-slate-400 font-normal">({prod.reviewsCount})</span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-pink-500 hover:text-pink-600 text-xs font-bold transition-colors"
                        >
                          Tahrirlash
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
                        >
                          O'chirish
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Users & Roles Management */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Foydalanuvchilar va Rollar Boshqaruvi</h3>
                <p className="text-xs text-slate-500">Tizimga kirish huquqlarini belgilash (Admin, Manager, User)</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-extrabold uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Foydalanuvchi</th>
                    <th className="px-6 py-4">Email & Telefon</th>
                    <th className="px-6 py-4">Rol</th>
                    <th className="px-6 py-4">Maxsus Parol</th>
                    <th className="px-6 py-4">Holati</th>
                    <th className="px-6 py-4 text-right">Rolni O'zgartirish</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{u.name}</div>
                            <div className="text-xs text-slate-400">Qo'shilgan: {u.createdAt}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">{u.email}</div>
                        <div className="text-xs text-slate-500">{u.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                          u.role === 'admin'
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : u.role === 'manager'
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {u.role === 'admin' ? '👑 Admin' : u.role === 'manager' ? '👔 Menejer' : '🛒 Mijoz'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={u.password || ''}
                            placeholder="Parol yo'q"
                            onChange={(e) => {
                              const newPass = e.target.value
                              setUsers((prev) =>
                                prev.map((usr) => (usr.id === u.id ? { ...usr, password: newPass } : usr))
                              )
                            }}
                            className="font-mono text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-rose-500 focus:outline-hidden w-28 sm:w-32 transition-colors shadow-xs"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
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
                          className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-pink-500"
                        >
                          <option value="user">Mijoz (User)</option>
                          <option value="manager">Menejer (Manager)</option>
                          <option value="admin">Admin</option>
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

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-xl font-black text-slate-900">
                {editingProduct ? 'Aksessuarni Tahrirlash' : 'Yangi Aksessuar Qo\'shish'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Aksessuar Nomi
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masalan: UPGRADE Wireless RGB Klaviatura"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Kategoriya
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-pink-500 bg-white"
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
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Narxi (so'm)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.priceNum}
                    onChange={(e) => setFormData({ ...formData, priceNum: e.target.value })}
                    placeholder="450000"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Omborda (dona)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Rasm URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tavsif
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Aksessuar haqida qisqacha ma'lumot..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Bekor Qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-pink py-3 rounded-xl text-sm font-bold shadow-md"
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
