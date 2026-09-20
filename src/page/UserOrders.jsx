import React from 'react'
import logoImg from '../assets/image.png'

const UserOrders = ({ orders, currentUser, onBackToShop, theme = 'light' }) => {
  const isDark = theme === 'dark'

  // Filter orders specifically belonging to the logged-in user
  const myOrders = currentUser
    ? orders.filter(
        (o) => o.userId === currentUser.id || o.customerName === currentUser.name
      )
    : orders

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors ${isDark ? 'bg-[#090d16] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header Bar */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 border-b mb-8 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="ORA" className="h-9 sm:h-10 w-auto object-contain" />
            <div className={`border-l pl-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <h1 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {currentUser ? `${currentUser.name} - Buyurtmalari` : 'Mening Buyurtmalarim'}
              </h1>
              <p className="text-xs text-slate-500">
                {currentUser?.phone ? `${currentUser.phone} · ` : ''}Barcha xaridlaringiz va yetkazib berish holati
              </p>
            </div>
          </div>

          <button
            onClick={onBackToShop}
            className="btn-pink px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm"
          >
            <span>← Do'konga Qaytish</span>
          </button>
        </div>

        {/* Orders list */}
        {myOrders.length === 0 ? (
          <div className={`text-center py-20 rounded-3xl border ${isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="text-5xl mb-4">📦</div>
            <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>Hozircha buyurtmalaringiz yo'q</h3>
            <p className="text-sm text-slate-500 mb-6">
              O'zingizga yoqqan kompyuter aksessuarlarini xarid qiling.
            </p>
            <button onClick={onBackToShop} className="btn-pink px-6 py-2.5 rounded-xl text-sm font-bold cursor-pointer">
              Katalogga o'tish
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {myOrders.map((ord) => {
              const isDelivered = ord.status === 'Yakunlandi'
              const isShipping = ord.status === 'Yetkazilmoqda'

              return (
                <div key={ord.id} className={`rounded-3xl border shadow-sm p-6 sm:p-8 ${isDark ? 'bg-[#111827] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                  {/* Order Top Line */}
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b mb-6 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                    <div>
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                        Buyurtma Raqami
                      </div>
                      <div className="text-lg font-black text-pink-600 font-mono">
                        {ord.orderNumber}
                      </div>
                      <div className="text-xs text-slate-500">Sana: {ord.date}</div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                        Umumiy Qiymat
                      </div>
                      <div className="text-xl font-black text-slate-900">
                        {ord.totalAmount.toLocaleString('uz-UZ')} so'm
                      </div>
                      <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                        To'lov: {ord.paymentMethod} ({ord.paymentStatus || 'Qabul qilindi'})
                      </span>
                    </div>
                  </div>

                  {/* Tracking Progress Bar */}
                  <div className="mb-8">
                    <div className="text-xs font-bold text-slate-700 uppercase mb-3">
                      Yetkazib Berish Holati:
                    </div>
                    <div className="relative flex items-center justify-between max-w-md mx-auto">
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 -z-0"></div>
                      <div 
                        className={`absolute top-1/2 left-0 h-1 bg-pink-600 -translate-y-1/2 -z-0 transition-all duration-500 ${
                          isDelivered ? 'w-full' : isShipping ? 'w-1/2' : 'w-1/6'
                        }`}
                      ></div>

                      {/* Step 1 */}
                      <div className="flex flex-col items-center relative z-10">
                        <div className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                          ✓
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 mt-1.5">Qabul qilindi</span>
                      </div>

                      {/* Step 2 */}
                      <div className="flex flex-col items-center relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                          isShipping || isDelivered ? 'bg-pink-600 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                          🚚
                        </div>
                        <span className={`text-[11px] font-bold mt-1.5 ${isShipping ? 'text-pink-600' : 'text-slate-500'}`}>
                          Yetkazilmoqda
                        </span>
                      </div>

                      {/* Step 3 */}
                      <div className="flex flex-col items-center relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                          isDelivered ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                          ✓
                        </div>
                        <span className={`text-[11px] font-bold mt-1.5 ${isDelivered ? 'text-emerald-600' : 'text-slate-500'}`}>
                          Yetkazib berildi
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Mahsulotlar:
                    </div>
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-sm">
                        <div className="font-bold text-slate-800">
                          {it.name}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-slate-500">Miqdor: <strong>{it.qty} dona</strong></span>
                          <span className="font-black text-pink-600">
                            {(it.priceNum * it.qty).toLocaleString('uz-UZ')} so'm
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Address */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row justify-between text-xs text-slate-500 gap-1">
                    <div>📍 <strong>Manzil:</strong> {ord.address}</div>
                    <div>📞 <strong>Qabul qiluvchi:</strong> {ord.customerName} ({ord.phone})</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserOrders
