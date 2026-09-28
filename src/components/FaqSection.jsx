import React, { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

const FAQ_DATA = [
  {
    q: {
      uz: 'Mahsulotlar haqiqatdan ham 100% originalmi?',
      ru: 'Все товары действительно на 100% оригинальные?',
      en: 'Are all products 100% genuine and authentic?'
    },
    a: {
      uz: 'Ha, albatta! Biz faqat rasmiy ishlab chiqaruvchilar va jahon brendlarining vakolatli distribyutorlari bilan ishlaymiz. Har bir aksessuarga rasmiy seriya raqami va ishlab chiqaruvchi kafolati beriladi.',
      ru: 'Да, абсолютно! Мы работаем только с официальными производителями и дистрибьюторами мировых брендов. На каждый девайс предоставляется официальный серийный номер и гарантия.',
      en: 'Yes, absolutely! We partner directly with authorized distributors and official manufacturers. Each device comes with a unique serial number and factory warranty.'
    }
  },
  {
    q: {
      uz: 'Yetkazib berish qancha vaqt oladi va narxi qancha?',
      ru: 'Сколько времени занимает доставка и сколько она стоит?',
      en: 'How long does delivery take and what is the cost?'
    },
    a: {
      uz: 'Toshkent shahri bo\'yicha 200 000 so\'mdan oshgan har qanday buyurtma BEPUL yetkaziladi (2-4 soat ichida ekspress). Viloyatlar bo\'ylab BTS yoki furgon orqali 24 soat ichida yetkazib beramiz.',
      ru: 'По Ташкенту заказы от 200 000 сум доставляются БЕСПЛАТНО (экспресс от 2 до 4 часов). По регионам Узбекистана доставка занимает до 24 часов курьерской службой.',
      en: 'Free delivery within Tashkent for orders over 200,000 UZS (express within 2-4 hours). Regional delivery across Uzbekistan takes up to 24 hours.'
    }
  },
  {
    q: {
      uz: 'To\'lovni qanday usullar bilan amalga oshirish mumkin?',
      ru: 'Какие способы оплаты поддерживаются?',
      en: 'What payment methods do you support?'
    },
    a: {
      uz: 'Biz Payme, Click, Uzum Pay orqali onlayn to\'lovni, tovar qabul qilinganda naqd yoki terminal orqali to\'lovni, shuningdek Uzum Nasiya orqali bo\'lib to\'lash imkoniyatini taqdim etamiz.',
      ru: 'Поддерживаются Payme, Click, Uzum Pay, оплата наличными или картой при получении, а также беспроцентная рассрочка через Uzum Nasiya.',
      en: 'We accept Payme, Click, Uzum Pay, cash or card upon delivery, as well as installment plans via Uzum Nasiya.'
    }
  },
  {
    q: {
      uz: 'Agar mahsulot yoqmasa yoki nosoz bo\'lsa qaytarish mumkinmi?',
      ru: 'Можно ли вернуть или обменять товар в случае неполадок?',
      en: 'Can I return or exchange the product if something is wrong?'
    },
    a: {
      uz: 'Albatta! O\'zbekiston qonunchiligiga ko\'ra 14 kun ichida qadoq buzilmagan holda qaytarish yoki almashtirish kafolatlanadi. Bundan tashqari 1 yillik rasmiy servis kafolati mavjud.',
      ru: 'Конечно! В соответствии с законодательством РУз действует 14 дней на возврат при сохранении товарного вида, а также 1 год полного сервисного обслуживания.',
      en: 'Certainly! A 14-day return and exchange policy applies, backed by an official 1-year hardware warranty.'
    }
  }
]

const FaqSection = ({ theme = 'light' }) => {
  const { lang } = useLanguage()
  const [openIdx, setOpenIdx] = useState(0)
  const isDark = theme === 'dark'

  return (
    <section id="faq" className="py-16 px-4 max-w-5xl mx-auto scroll-mt-24">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-pink-500/10 text-pink-500 border border-pink-500/30 mb-3">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          <span>HELP CENTER & FAQ</span>
        </div>
        <h2 className={`text-3xl sm:text-4xl font-black font-heading ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {lang === 'ru' ? 'Часто задаваемые вопросы' : lang === 'en' ? 'Frequently Asked Questions' : "Ko'p Beriladigan Savollar"}
        </h2>
        <p className={`text-sm sm:text-base mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {lang === 'ru'
            ? 'Все, что вам нужно знать перед покупкой геймерского оборудования'
            : lang === 'en'
            ? 'Everything you need to know about purchasing gear at UPGRADE'
            : 'UPGRADE do\'konida xarid qilish bo\'yicha barcha kerakli ma\'lumotlar'}
        </p>
      </div>

      <div className="space-y-3.5">
        {FAQ_DATA.map((item, idx) => {
          const isOpen = openIdx === idx
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen
                  ? isDark
                    ? 'border-pink-500/60 bg-slate-900/90 shadow-lg shadow-pink-500/5'
                    : 'border-pink-300 bg-white shadow-md shadow-pink-500/5'
                  : isDark
                  ? 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                  : 'border-slate-200 bg-slate-50/70 hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className={`text-base font-bold ${isOpen ? 'text-pink-500' : isDark ? 'text-white' : 'text-slate-900'}`}>
                  {item.q[lang] || item.q.uz}
                </span>
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 bg-pink-500 text-white' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
                }`}>
                  ▼
                </span>
              </button>

              {isOpen && (
                <div className={`px-5 sm:px-6 pb-6 pt-1 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800/80 animate-in fade-in duration-200 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {item.a[lang] || item.a.uz}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default FaqSection
