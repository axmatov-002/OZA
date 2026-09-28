import React from 'react'
import { useLanguage } from '../context/LanguageContext'

const CompareModal = ({
  isOpen,
  onClose,
  products = [],
  compareIds = [],
  onRemoveFromCompare,
  onAddToCart,
  theme = 'light'
}) => {
  const { lang, tp, formatPrice } = useLanguage()
  const isDark = theme === 'dark'

  const comparedProducts = products.filter((p) => compareIds.includes(p.id))

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚖️</span>
            <div>
              <h3 className="text-lg font-black font-heading">
                {lang === 'ru' ? 'Сравнение товаров' : lang === 'en' ? 'Product Comparison' : 'Mahsulotlarni Taqqoslash'}
              </h3>
              <p className="text-xs text-slate-400">
                {comparedProducts.length} {lang === 'ru' ? 'товара выбрано' : lang === 'en' ? 'items selected' : 'ta mahsulot tanlandi'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {comparedProducts.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <span className="text-4xl block mb-2">⚖️</span>
              <p className="text-sm font-bold">
                {lang === 'ru' ? 'Нет товаров для сравнения' : lang === 'en' ? 'No items to compare' : 'Taqqoslash uchun mahsulot tanlanmagan'}
              </p>
              <p className="text-xs mt-1 text-slate-500">
                {lang === 'ru'
                  ? 'Нажмите иконку ⚖️ на карточке любого товара в каталоге'
                  : lang === 'en'
                  ? 'Click the ⚖️ icon on any product card in the catalog'
                  : "Katalogdagi istalgan mahsulot kartochkasida ⚖️ belgisini bosing"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {comparedProducts.map((p) => {
                const localized = tp(p)
                return (
                  <div
                    key={p.id}
                    className={`p-4 rounded-2xl border flex flex-col justify-between ${
                      isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold text-pink-500 uppercase tracking-wider">
                          {p.category}
                        </span>
                        <button
                          onClick={() => onRemoveFromCompare(p.id)}
                          className="text-xs text-rose-500 hover:text-rose-400 cursor-pointer"
                          title="O'chirish"
                        >
                          ✕
                        </button>
                      </div>

                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-36 object-cover rounded-xl mb-3"
                      />

                      <h4 className="text-sm font-bold line-clamp-2 mb-2">
                        {localized.name}
                      </h4>

                      <div className="text-base font-black text-pink-500 mb-4">
                        {formatPrice(p.priceNum)}
                      </div>

                      {/* Specs Comparison Table */}
                      <div className="space-y-2 text-xs border-t border-slate-200 dark:border-slate-800 pt-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Reyting:</span>
                          <span className="font-bold text-amber-400">⭐ {p.rating || 4.9}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Ombor:</span>
                          <span className="font-bold text-emerald-500">
                            {p.stock > 0 ? `${p.stock} dona bor` : "Tugagan"}
                          </span>
                        </div>
                        <div className="pt-2">
                          <span className="text-slate-400 block mb-1">Asosiy xususiyatlar:</span>
                          <ul className="space-y-1">
                            {p.specs?.map((spec, sIdx) => (
                              <li key={sIdx} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
                                <span>{spec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (onAddToCart) onAddToCart(p)
                      }}
                      className="mt-4 w-full btn-pink py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>🛒</span>
                      <span>Savatga qo'shish</span>
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CompareModal
