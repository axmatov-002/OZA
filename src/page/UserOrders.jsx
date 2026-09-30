import React from 'react'
import logoImg from '../assets/image.png'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { useLanguage } from '../context/LanguageContext'

const UserOrders = ({ orders, currentUser, onBackToShop, theme = 'light' }) => {
  const { t, tp, formatPrice } = useLanguage()
  const isDark = theme === 'dark'

  // Filter orders specifically belonging to the logged-in user
  const myOrders = currentUser
    ? orders.filter(
        (o) =>
          o.userId === currentUser.id ||
          o.customerName === currentUser.name ||
          (currentUser.email && o.customerEmail && o.customerEmail === currentUser.email) ||
          (currentUser.phone && o.phone && o.phone === currentUser.phone)
      )
    : orders

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors ${isDark ? 'bg-[#090d16] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header Bar */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 border-b mb-8 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="UPGRADE" className="h-9 sm:h-10 w-auto object-contain" />
            <div className={`border-l pl-3 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <h1 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {currentUser ? `${currentUser.name} — ${t('nav_my_orders', 'Buyurtmalari')}` : t('orders_title', 'Mening Buyurtmalarim')}
              </h1>
              <p className="text-xs text-slate-500">
                {currentUser?.phone ? `${currentUser.phone} · ` : ''}{t('orders_subtitle', 'Barcha xaridlaringiz va yetkazib berish holati')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher theme={theme} />
            <button
              onClick={onBackToShop}
              className="btn-pink px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span>← {t('orders_back_btn', "Do'konga Qaytish")}</span>
            </button>
          </div>
        </div>

        {/* Orders list */}
        {myOrders.length === 0 ? (
          <div className={`text-center py-20 rounded-3xl border ${isDark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="text-5xl mb-4">📦</div>
            <h3 className={`text-lg font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {t('orders_empty', "Hozircha buyurtmalaringiz yo'q")}
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              {t('orders_empty_desc', "O'zingizga yoqqan kompyuter aksessuarlarini xarid qiling.")}
            </p>
            <button onClick={onBackToShop} className="btn-pink px-6 py-2.5 rounded-xl text-sm font-bold cursor-pointer">
              {t('orders_back_btn', 'Katalogga o\'tish')}
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
                        {t('orders_order_number', 'Buyurtma Raqami')}
                      </div>
                      <div className="text-lg font-black text-pink-600 font-mono">
                        {ord.orderNumber}
                      </div>
                      <div className="text-xs text-slate-500">{t('orders_date', 'Sana:')} {ord.date}</div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                        {t('orders_total', 'Umumiy Qiymat')}
                      </div>
                      <div className="text-xl font-black text-slate-900 dark:text-white">
                        {formatPrice(ord.totalAmount)}
                      </div>
                      <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                        {t('orders_payment_status', "To'lov")}: {ord.paymentMethod} ({ord.paymentStatus || 'OK'})
                      </span>
                    </div>
                  </div>

                  {/* Tracking Progress Bar */}
                  <div className="mb-8">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-3">
                      {t('orders_subtitle', 'Yetkazib Berish Holati')}:
                    </div>
                    <div className="relative flex items-center justify-between max-w-md mx-auto">
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 -z-0"></div>
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
                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-1.5">{t('orders_status_pending', 'Qabul qilindi')}</span>
                      </div>

                      {/* Step 2 */}
                      <div className="flex flex-col items-center relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                          isShipping || isDelivered ? 'bg-pink-600 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          🚚
                        </div>
                        <span className={`text-[11px] font-bold mt-1.5 ${isShipping ? 'text-pink-600' : 'text-slate-500 dark:text-slate-400'}`}>
                          {t('orders_status_shipping', 'Yetkazilmoqda')}
                        </span>
                      </div>

                      {/* Step 3 */}
                      <div className="flex flex-col items-center relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md ${
                          isDelivered ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          ✓
                        </div>
                        <span className={`text-[11px] font-bold mt-1.5 ${isDelivered ? 'text-emerald-600' : 'text-slate-500 dark:text-slate-400'}`}>
                          {t('orders_status_delivered', 'Yetkazib berildi')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {t('nav_catalog', 'Mahsulotlar')}:
                    </div>
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-sm">
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {tp({ id: it.productId || it.id, name: it.name }).name}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-slate-500">x{it.qty}</span>
                          <span className="font-black text-pink-600 dark:text-pink-400">
                            {formatPrice(it.priceNum * it.qty)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Address */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between text-xs text-slate-500 gap-1">
                    <div>📍 <strong>{t('auth_address_label', 'Manzil:')}</strong> {ord.address}</div>
                    <div>📞 <strong>{t('auth_name_label', 'Mijoz:')}</strong> {ord.customerName} ({ord.phone})</div>
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
