import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { getLocalizedProduct } from '../data/productTranslations'

const LanguageContext = createContext()

export const translations = {
  uz: {
    // Nav & General
    nav_catalog: 'Katalog',
    nav_featured: 'Ommabop',
    nav_benefits: 'Afzalliklar',
    nav_reviews: 'Sharhlar',
    nav_contact: 'Aloqa',
    nav_my_orders: 'Buyurtmalarim',
    nav_search: 'Qidirish',
    nav_search_placeholder: 'Aksessuarlarni qidirish...',
    nav_search_shortcut: 'Ctrl K',
    nav_cart: 'Savat',
    nav_login: 'Kirish',
    nav_login_register: "Kirish / Ro'yxatdan o'tish",
    nav_logout: 'Chiqish',
    nav_admin: 'Admin',
    nav_manager: 'Menejer',
    nav_theme_light: 'Oq',
    nav_theme_dark: 'Qora',
    nav_theme_label: 'Fon rejimi:',
    currency: "so'm",

    // Roles
    role_admin: '👑 Admin',
    role_manager: '👔 Menejer',
    role_user: '🛒 Xaridor',

    // Hero Section
    hero_badge: 'Eksklyuziv Gaming & Ishchi Aksessuarlar 2026',
    hero_title_1: 'KOMPYUTER SETUPINGIZNI',
    hero_title_2: 'KEYINGI BOSQICHGA',
    hero_title_3: 'OLIB CHIQING',
    hero_desc: 'Professional kiber-sportchilar va dasturchilar uchun premium mexanik klaviaturalar, yuqori aniqlikdagi optik sichqonchalar va immersiv fazoviy audio naushniklar.',
    hero_btn_catalog: "Katalogni ko'rish ›",
    hero_btn_promo: 'Aksiyadagi tovarlar 🔥',
    hero_stat_clients: 'Mamnun mijozlar',
    hero_stat_original: 'Original aksessuarlar',
    hero_stat_warranty: 'Rasmiy kafolat',

    // Countdown Timer
    timer_ends_in: 'Aksiya yakunlanishiga qoldi:',
    timer_limited: 'Cheklangan: faqat 7 ta',
    timer_days: 'Kun',
    timer_hours: 'Soat',
    timer_minutes: 'Daqiqa',
    timer_seconds: 'Soniya',

    // Live Ticker
    ticker_new_purchase: 'Yangi xarid amalga oshirildi!',
    ticker_just_now: 'Hozirgina',
    ticker_min_ago: 'daqiqa oldin',

    // Trust Features
    feature_delivery_title: 'Tezkor yetkazib berish',
    feature_delivery_desc: "Toshkent bo'yicha 3 soat ichida, viloyatlarga 24 soatda",
    feature_warranty_title: '2 Yillik rasmiy kafolat',
    feature_warranty_desc: "100% almashtirish va servis xizmati kafolati",
    feature_original_title: '100% Original brendlar',
    feature_original_desc: "Faqat sertifikatlangan zavod uskunalari",
    feature_support_title: "24/7 Qo'llab-quvvatlash",
    feature_support_desc: "Har qanday masalada mutaxassis bepul konsultatsiyasi",

    // Banner Swiper
    banner_order_btn: 'Buyurtma qilish ›',
    banner_trend: 'Trend 2026',
    banner_discount: '-35% Aksiya',
    banner_warranty: '2 Yil Kafolat',
    banner_free_delivery: 'Bepul Yetkazish',

    // Catalog & Filter
    catalog_title: 'Mahsulotlar Katalogi',
    catalog_subtitle: 'O\'zingizga mos eng so\'nggi modeldagi kompyuter jihozlarini tanlang',
    category_all: 'Barchasi',
    category_keyboards: 'Klaviaturalar',
    category_mice: 'Sichqonchalar',
    category_headphones: 'Naushniklar',
    category_mousepads: 'RGB Gilamchalar',
    category_desks: 'Stol & Qavslar',
    category_stream: 'Strim & Audio',

    filter_search_placeholder: 'Nom yoki xususiyat bo\'yicha qidiruv...',
    filter_all_categories: 'Barcha kategoriyalar',
    filter_sort_default: 'Saralash: Standart',
    filter_sort_price_asc: 'Narx: Arzonroqdan',
    filter_sort_price_desc: 'Narx: Qimmatroqdan',
    filter_sort_rating: 'Reyting: Yuqoridan',
    filter_sort_newest: 'Eng yangilari',
    filter_in_stock: 'Faqat mavjudlari',
    filter_clear: 'Tozalash',
    filter_found_products: 'ta mahsulot topildi',
    filter_not_found: 'Hech qanday mahsulot topilmadi',
    filter_not_found_desc: 'Qidiruv so\'zini o\'zgartirib ko\'ring yoki filtrlarni tozalang.',

    // Product Card
    product_in_stock: 'Sotuvda mavjud',
    product_out_of_stock: 'Qolmagan',
    product_add_to_cart: "Savatga qo'shish",
    addToCart: "Savatga qo'shish",
    product_added: "Savatga qo'shildi",
    product_buy_now: 'Tezkor xarid',
    product_details: 'Batafsil',
    product_reviews_count: 'ta sharh',
    product_compare: 'Taqqoslash',

    // Cart Drawer
    cart_title: 'Xaridlar Savati',
    cart_items_count: 'ta aksessuar tanlandi',
    cart_empty_title: 'Savatchangiz bo\'sh',
    cart_empty_desc: 'O\'zingizga yoqqan zamonaviy kompyuter aksessuarlarini savatga qo\'shing.',
    cart_back_to_shop: 'Katalogga qaytish',
    cart_remove: 'O\'chirish',
    cart_delivery: 'Yetkazib berish:',
    cart_free_delivery: 'Bepul (Toshkent bo\'yicha)',
    cart_total: 'Jami to\'lov:',
    cart_checkout: 'Rasmiylashtirish',
    cart_security_notice: '🔒 Xavfsiz to\'lov: Payme, Click, Uzum Nasiya, Naqd',
    cart_added_toast: 'savatchaga qo\'shildi!',

    // Product Slider
    slider_popular_title: 'Ommabop Mahsulotlar',
    slider_prev: 'Oldingi',
    slider_next: 'Keyingi',

    // Reviews & Testimonials
    reviews_title: 'Mijozlarimiz fikrlari',
    reviews_subtitle: 'Minglab mamnun geymerlar va IT mutaxassislari bizga ishonishadi',

    // Consultation Section
    consult_title: 'Qaysi aksessuarni tanlashni bilmayapsizmi?',
    consult_subtitle: 'Telefon raqamingizni qoldiring, mutaxassisimiz 5 daqiqada sizga mos variantni bepul tanlab beradi.',
    consult_name_placeholder: 'Ismingiz',
    consult_phone_placeholder: '+998 (90) 123-45-67',
    consult_select_help: 'Sizga nima kerak?',
    consult_option_setup: 'To\'liq geyming setup yig\'ish',
    consult_option_keyboard: 'Mexanik klaviatura tanlash',
    consult_option_mouse: 'Kiber-sport sichqonchasi',
    consult_option_audio: 'Fazoviy ovoz naushniklari',
    consult_submit: 'Bepul konsultatsiya olish ›',
    consult_success: 'Rahmat! Tez orada mutaxassisimiz siz bilan bog\'lanadi.',

    // Footer
    footer_desc: 'O\'zbekistondagi eng so\'nggi rusumdagi original geyming va professional kompyuter aksessuarlari yetakchi do\'koni.',
    footer_sections: 'Bo\'limlar',
    footer_categories: 'Kategoriyalar',
    footer_contacts: 'Aloqa & Manzil',
    footer_address: 'Toshkent sh., Yunusobod tumani, Amir Temur shox ko\'chasi, 129-uy',
    footer_work_hours: 'Dushanba - Yakshanba: 09:00 - 22:00',
    footer_rights: 'Barcha huquqlar himoyalangan.',

    // Search Modal
    search_modal_title: 'Aksessuarlar qidiruvi',
    search_modal_popular: 'Ommabop so\'rovlar:',
    search_modal_no_results: 'Hech narsa topilmadi',
    search_modal_press_esc: 'Yopish uchun ESC bosing',

    // Auth Modal
    auth_welcome: 'Tizimga kirish',
    auth_welcome_desc: 'O\'z hisobingizga kiring yoki ro\'yxatdan o\'ting',
    auth_tab_login: 'Kirish',
    auth_tab_register: 'Ro\'yxatdan o\'tish',
    auth_demo_title: 'Tezkor kirish (Demo akkauntlar):',
    auth_name_label: 'F.I.SH (Ism familiyangiz):',
    auth_phone_label: 'Telefon raqam:',
    auth_password_label: 'Parol:',
    auth_address_label: 'Yetkazib berish manzili:',
    auth_btn_login: 'Tizimga kirish',
    auth_btn_register: 'Ro\'yxatdan o\'tish',
    auth_user_switch: 'Hisobni almashtirish',

    // User Orders
    orders_title: 'Mening Buyurtmalarim',
    orders_subtitle: 'Barcha rasmiylashtirilgan buyurtmalaringiz tarixi va ularning holati',
    orders_empty: 'Sizda hali buyurtmalar mavjud emas',
    orders_empty_desc: 'Do\'konimizdan o\'zingizga ma\'qul zamonaviy aksessuarlarni buyurtma qiling.',
    orders_back_btn: 'Katalogga qaytish',
    orders_status_pending: 'Kutilmoqda',
    orders_status_processing: 'Jarayonda',
    orders_status_shipping: 'Yetkazilmoqda',
    orders_status_delivered: 'Yetkazildi',
    orders_status_cancelled: 'Bekor qilindi',
    orders_order_number: 'Buyurtma raqami:',
    orders_date: 'Sana:',
    orders_total: 'Umumiy summa:',
    orders_payment_status: 'To\'lov holati:'
  },

  ru: {
    // Nav & General
    nav_catalog: 'Каталог',
    nav_featured: 'Популярное',
    nav_benefits: 'Преимущества',
    nav_reviews: 'Отзывы',
    nav_contact: 'Контакты',
    nav_my_orders: 'Мои заказы',
    nav_search: 'Поиск',
    nav_search_placeholder: 'Поиск аксессуаров...',
    nav_search_shortcut: 'Ctrl K',
    nav_cart: 'Корзина',
    nav_login: 'Войти',
    nav_login_register: 'Войти / Регистрация',
    nav_logout: 'Выйти',
    nav_admin: 'Админ',
    nav_manager: 'Менеджер',
    nav_theme_light: 'Светлая',
    nav_theme_dark: 'Тёмная',
    nav_theme_label: 'Режим фона:',
    currency: 'сум',

    // Roles
    role_admin: '👑 Админ',
    role_manager: '👔 Менеджер',
    role_user: '🛒 Покупатель',

    // Hero Section
    hero_badge: 'Эксклюзивные Гейминг & Рабочие Аксессуары 2026',
    hero_title_1: 'ВЫВЕДИТЕ ВАШ ПК СЕТАП',
    hero_title_2: 'НА СЛЕДУЮЩИЙ',
    hero_title_3: 'УРОВЕНЬ',
    hero_desc: 'Премиальные механические клавиатуры, сверхточные оптические мыши и иммерсивные пространственные гарнитуры для профессиональных киберспортсменов и разработчиков.',
    hero_btn_catalog: 'Смотреть каталог ›',
    hero_btn_promo: 'Товары по акции 🔥',
    hero_stat_clients: 'Довольных клиентов',
    hero_stat_original: 'Оригинальных товаров',
    hero_stat_warranty: 'Официальная гарантия',

    // Countdown Timer
    timer_ends_in: 'До окончания акции осталось:',
    timer_limited: 'Ограничено: всего 7 шт',
    timer_days: 'Дней',
    timer_hours: 'Часов',
    timer_minutes: 'Минут',
    timer_seconds: 'Секунд',

    // Live Ticker
    ticker_new_purchase: 'Совершена новая покупка!',
    ticker_just_now: 'Только что',
    ticker_min_ago: 'мин назад',

    // Trust Features
    feature_delivery_title: 'Быстрая доставка',
    feature_delivery_desc: 'По Ташкенту за 3 часа, в регионы за 24 часа',
    feature_warranty_title: '2 Года гарантии',
    feature_warranty_desc: '100% замена и официальный сервисный центр',
    feature_original_title: '100% Оригинальные бренды',
    feature_original_desc: 'Только сертифицированное заводское оборудование',
    feature_support_title: 'Поддержка 24/7',
    feature_support_desc: 'Бесплатная консультация экспертов по любым вопросам',

    // Banner Swiper
    banner_order_btn: 'Заказать сейчас ›',
    banner_trend: 'Тренд 2026',
    banner_discount: '-35% Скидка',
    banner_warranty: '2 Года Гарантии',
    banner_free_delivery: 'Бесплатная Доставка',

    // Catalog & Filter
    catalog_title: 'Каталог Товаров',
    catalog_subtitle: 'Выберите новейшие компьютерные аксессуары под свои задачи',
    category_all: 'Все',
    category_keyboards: 'Клавиатуры',
    category_mice: 'Мыши',
    category_headphones: 'Наушники',
    category_mousepads: 'RGB Коврики',
    category_desks: 'Столы и кронштейны',
    category_stream: 'Стрим и аудио',

    filter_search_placeholder: 'Поиск по названию или характеристикам...',
    filter_all_categories: 'Все категории',
    filter_sort_default: 'Сортировка: По умолчанию',
    filter_sort_price_asc: 'Цена: Сначала дешевле',
    filter_sort_price_desc: 'Цена: Сначала дороже',
    filter_sort_rating: 'Рейтинг: По убыванию',
    filter_sort_newest: 'Сначала новинки',
    filter_in_stock: 'Только в наличии',
    filter_clear: 'Сбросить',
    filter_found_products: 'товаров найдено',
    filter_not_found: 'Ничего не найдено',
    filter_not_found_desc: 'Попробуйте изменить поисковый запрос или сбросить фильтры.',

    // Product Card
    product_in_stock: 'В наличии',
    product_out_of_stock: 'Нет в наличии',
    product_add_to_cart: 'В корзину',
    addToCart: 'В корзину',
    product_added: 'Добавлено',
    product_buy_now: 'Купить сразу',
    product_details: 'Подробнее',
    product_reviews_count: 'отзывов',
    product_compare: 'Сравнить',

    // Cart Drawer
    cart_title: 'Корзина Покупок',
    cart_items_count: 'аксессуаров выбрано',
    cart_empty_title: 'Ваша корзина пуста',
    cart_empty_desc: 'Добавьте современные компьютерные аксессуары в корзину.',
    cart_back_to_shop: 'Вернуться в каталог',
    cart_remove: 'Удалить',
    cart_delivery: 'Доставка:',
    cart_free_delivery: 'Бесплатно (по Ташкенту)',
    cart_total: 'Итого к оплате:',
    cart_checkout: 'Оформить заказ',
    cart_security_notice: '🔒 Безопасная оплата: Payme, Click, Uzum Nasiya, Наличные',
    cart_added_toast: 'добавлен в корзину!',

    // Product Slider
    slider_popular_title: 'Популярные Товары',
    slider_prev: 'Назад',
    slider_next: 'Вперед',

    // Reviews & Testimonials
    reviews_title: 'Отзывы наших клиентов',
    reviews_subtitle: 'Тысячи довольных геймеров и IT-специалистов доверяют нам',

    // Consultation Section
    consult_title: 'Не знаете, какой аксессуар выбрать?',
    consult_subtitle: 'Оставьте номер телефона, наш эксперт бесплатно подберет идеальный вариант за 5 минут.',
    consult_name_placeholder: 'Ваше имя',
    consult_phone_placeholder: '+998 (90) 123-45-67',
    consult_select_help: 'Что вас интересует?',
    consult_option_setup: 'Собрать полный игровой сетап',
    consult_option_keyboard: 'Выбрать механическую клавиатуру',
    consult_option_mouse: 'Киберспортивная мышь',
    consult_option_audio: 'Наушники с объемным звуком',
    consult_submit: 'Получить консультацию ›',
    consult_success: 'Спасибо! Наш специалист свяжется с вами в ближайшее время.',

    // Footer
    footer_desc: 'Ведущий магазин новейших оригинальных гейминг и профессиональных компьютерных аксессуаров в Узбекистане.',
    footer_sections: 'Разделы',
    footer_categories: 'Категории',
    footer_contacts: 'Контакты и адрес',
    footer_address: 'г. Ташкент, Юнусабадский р-н, проспект Амира Темура, 129',
    footer_work_hours: 'Понедельник - Воскресенье: 09:00 - 22:00',
    footer_rights: 'Все права защищены.',

    // Search Modal
    search_modal_title: 'Поиск аксессуаров',
    search_modal_popular: 'Популярные запросы:',
    search_modal_no_results: 'Ничего не найдено',
    search_modal_press_esc: 'Нажмите ESC для закрытия',

    // Auth Modal
    auth_welcome: 'Вход в систему',
    auth_welcome_desc: 'Войдите в свой аккаунт или зарегистрируйтесь',
    auth_tab_login: 'Вход',
    auth_tab_register: 'Регистрация',
    auth_demo_title: 'Быстрый вход (Демо аккаунты):',
    auth_name_label: 'Ф.И.О (Имя и фамилия):',
    auth_phone_label: 'Номер телефона:',
    auth_password_label: 'Пароль:',
    auth_address_label: 'Адрес доставки:',
    auth_btn_login: 'Войти в аккаунт',
    auth_btn_register: 'Зарегистрироваться',
    auth_user_switch: 'Сменить пользователя',

    // User Orders
    orders_title: 'Мои Заказы',
    orders_subtitle: 'История всех оформленных заказов и их текущий статус',
    orders_empty: 'У вас пока нет заказов',
    orders_empty_desc: 'Выберите понравившиеся аксессуары в нашем каталоге и оформите заказ.',
    orders_back_btn: 'Вернуться в магазин',
    orders_status_pending: 'Ожидает',
    orders_status_processing: 'В обработке',
    orders_status_shipping: 'В пути',
    orders_status_delivered: 'Доставлен',
    orders_status_cancelled: 'Отменён',
    orders_order_number: 'Номер заказа:',
    orders_date: 'Дата:',
    orders_total: 'Общая сумма:',
    orders_payment_status: 'Статус оплаты:'
  },

  en: {
    // Nav & General
    nav_catalog: 'Catalog',
    nav_featured: 'Featured',
    nav_benefits: 'Benefits',
    nav_reviews: 'Reviews',
    nav_contact: 'Contact',
    nav_my_orders: 'My Orders',
    nav_search: 'Search',
    nav_search_placeholder: 'Search accessories...',
    nav_search_shortcut: 'Ctrl K',
    nav_cart: 'Cart',
    nav_login: 'Sign In',
    nav_login_register: 'Sign In / Register',
    nav_logout: 'Logout',
    nav_admin: 'Admin',
    nav_manager: 'Manager',
    nav_theme_light: 'Light',
    nav_theme_dark: 'Dark',
    nav_theme_label: 'Theme mode:',
    currency: 'UZS',

    // Roles
    role_admin: '👑 Admin',
    role_manager: '👔 Manager',
    role_user: '🛒 Customer',

    // Hero Section
    hero_badge: 'Exclusive Gaming & Pro Work Accessories 2026',
    hero_title_1: 'ELEVATE YOUR PC SETUP',
    hero_title_2: 'TO THE NEXT',
    hero_title_3: 'LEVEL',
    hero_desc: 'Premium mechanical keyboards, ultra-accurate optical mice, and immersive spatial headsets designed for pro gamers and software engineers.',
    hero_btn_catalog: 'Explore Catalog ›',
    hero_btn_promo: 'Special Deals 🔥',
    hero_stat_clients: 'Happy Customers',
    hero_stat_original: 'Original Gear',
    hero_stat_warranty: 'Official Warranty',

    // Countdown Timer
    timer_ends_in: 'Deal ends in:',
    timer_limited: 'Limited: Only 7 left',
    timer_days: 'Days',
    timer_hours: 'Hours',
    timer_minutes: 'Mins',
    timer_seconds: 'Secs',

    // Live Ticker
    ticker_new_purchase: 'New purchase just made!',
    ticker_just_now: 'Just now',
    ticker_min_ago: 'mins ago',

    // Trust Features
    feature_delivery_title: 'Fast Delivery',
    feature_delivery_desc: 'Within 3 hours in Tashkent, 24 hours nationwide',
    feature_warranty_title: '2-Year Official Warranty',
    feature_warranty_desc: '100% replacement and dedicated service guarantee',
    feature_original_title: '100% Genuine Brands',
    feature_original_desc: 'Certified authentic factory accessories only',
    feature_support_title: '24/7 Expert Support',
    feature_support_desc: 'Free consultations from gear specialists anytime',

    // Banner Swiper
    banner_order_btn: 'Order Now ›',
    banner_trend: 'Trend 2026',
    banner_discount: '-35% Off',
    banner_warranty: '2-Yr Warranty',
    banner_free_delivery: 'Free Shipping',

    // Catalog & Filter
    catalog_title: 'Product Catalog',
    catalog_subtitle: 'Choose state-of-the-art computer accessories for your workstation',
    category_all: 'All',
    category_keyboards: 'Keyboards',
    category_mice: 'Mice',
    category_headphones: 'Headphones',
    category_mousepads: 'RGB Mousepads',
    category_desks: 'Desks & Mounts',
    category_stream: 'Stream & Audio',

    filter_search_placeholder: 'Search by title or specs...',
    filter_all_categories: 'All Categories',
    filter_sort_default: 'Sort: Default',
    filter_sort_price_asc: 'Price: Low to High',
    filter_sort_price_desc: 'Price: High to Low',
    filter_sort_rating: 'Rating: Highest',
    filter_sort_newest: 'Newest Arrivals',
    filter_in_stock: 'In Stock Only',
    filter_clear: 'Reset',
    filter_found_products: 'products found',
    filter_not_found: 'No products found',
    filter_not_found_desc: 'Try adjusting your search query or reset the filters.',

    // Product Card
    product_in_stock: 'In Stock',
    product_out_of_stock: 'Out of Stock',
    product_add_to_cart: 'Add to Cart',
    addToCart: 'Add to Cart',
    product_added: 'Added',
    product_buy_now: 'Buy Now',
    product_details: 'Details',
    product_reviews_count: 'reviews',
    product_compare: 'Compare',

    // Cart Drawer
    cart_title: 'Shopping Cart',
    cart_items_count: 'accessories selected',
    cart_empty_title: 'Your cart is empty',
    cart_empty_desc: 'Add cutting-edge computer accessories to your cart.',
    cart_back_to_shop: 'Back to Catalog',
    cart_remove: 'Remove',
    cart_delivery: 'Delivery:',
    cart_free_delivery: 'Free (Within Tashkent)',
    cart_total: 'Total Payment:',
    cart_checkout: 'Proceed to Checkout',
    cart_security_notice: '🔒 Secure payment: Payme, Click, Uzum Nasiya, Cash',
    cart_added_toast: 'added to cart!',

    // Product Slider
    slider_popular_title: 'Popular Accessories',
    slider_prev: 'Prev',
    slider_next: 'Next',

    // Reviews & Testimonials
    reviews_title: 'Customer Testimonials',
    reviews_subtitle: 'Thousands of passionate gamers and developers trust UPGRADE',

    // Consultation Section
    consult_title: 'Not sure which gear to choose?',
    consult_subtitle: 'Leave your phone number, and our gear consultant will assist you in 5 minutes for free.',
    consult_name_placeholder: 'Your name',
    consult_phone_placeholder: '+998 (90) 123-45-67',
    consult_select_help: 'What are you looking for?',
    consult_option_setup: 'Build complete gaming setup',
    consult_option_keyboard: 'Select mechanical keyboard',
    consult_option_mouse: 'High-precision esports mouse',
    consult_option_audio: 'Spatial surround audio headset',
    consult_submit: 'Get Free Advice ›',
    consult_success: 'Thank you! Our specialist will contact you shortly.',

    // Footer
    footer_desc: 'Leading online destination in Uzbekistan for authentic pro gaming and computer accessories.',
    footer_sections: 'Navigation',
    footer_categories: 'Categories',
    footer_contacts: 'Contact & Location',
    footer_address: 'Tashkent city, Yunusabad dist., Amir Temur Ave, 129',
    footer_work_hours: 'Monday - Sunday: 09:00 - 22:00',
    footer_rights: 'All rights reserved.',

    // Search Modal
    search_modal_title: 'Accessories Search',
    search_modal_popular: 'Popular searches:',
    search_modal_no_results: 'No accessories found',
    search_modal_press_esc: 'Press ESC to close',

    // Auth Modal
    auth_welcome: 'Welcome Back',
    auth_welcome_desc: 'Log in to your account or register a new one',
    auth_tab_login: 'Login',
    auth_tab_register: 'Register',
    auth_demo_title: 'Quick Access (Demo Accounts):',
    auth_name_label: 'Full Name:',
    auth_phone_label: 'Phone Number:',
    auth_password_label: 'Password:',
    auth_address_label: 'Delivery Address:',
    auth_btn_login: 'Sign In',
    auth_btn_register: 'Create Account',
    auth_user_switch: 'Switch Account',

    // User Orders
    orders_title: 'My Orders',
    orders_subtitle: 'Order history, tracking, and details',
    orders_empty: 'No orders placed yet',
    orders_empty_desc: 'Explore our catalog and place your first order today.',
    orders_back_btn: 'Back to Store',
    orders_status_pending: 'Pending',
    orders_status_processing: 'Processing',
    orders_status_shipping: 'Shipping',
    orders_status_delivered: 'Delivered',
    orders_status_cancelled: 'Cancelled',
    orders_order_number: 'Order number:',
    orders_date: 'Date:',
    orders_total: 'Total amount:',
    orders_payment_status: 'Payment status:'
  }
}

// Category mappings between database stored names and target language
const CATEGORY_MAP = {
  'Barchasi': { uz: 'Barchasi', ru: 'Все', en: 'All' },
  'Klaviaturalar': { uz: 'Klaviaturalar', ru: 'Клавиатуры', en: 'Keyboards' },
  'Sichqonchalar': { uz: 'Sichqonchalar', ru: 'Мыши', en: 'Mice' },
  'Naushniklar': { uz: 'Naushniklar', ru: 'Наушники', en: 'Headphones' },
  'RGB Gilamchalar': { uz: 'RGB Gilamchalar', ru: 'RGB Коврики', en: 'RGB Mousepads' },
  'Stol & Qavslar': { uz: 'Stol & Qavslar', ru: 'Столы и кронштейны', en: 'Desks & Mounts' },
  'Strim & Audio': { uz: 'Strim & Audio', ru: 'Стрим и аудио', en: 'Stream & Audio' },
}

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem('upg_lang') || 'uz'
    } catch {
      return 'uz'
    }
  })

  const setLang = (newLang) => {
    if (['uz', 'ru', 'en'].includes(newLang)) {
      setLangState(newLang)
      try {
        localStorage.setItem('upg_lang', newLang)
        document.documentElement.lang = newLang
      } catch (e) {
        console.error(e)
      }
    }
  }

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  // Translation helper
  const t = useMemo(() => {
    return (key, fallback = '') => {
      const dict = translations[lang] || translations.uz
      return dict[key] !== undefined ? dict[key] : (fallback || key)
    }
  }, [lang])

  // Category translation helper
  const tc = useMemo(() => {
    return (category) => {
      if (!category) return ''
      const mapped = CATEGORY_MAP[category]
      if (mapped && mapped[lang]) {
        return mapped[lang]
      }
      return category
    }
  }, [lang])

  // Price formatting helper with correct currency unit
  const formatPrice = useMemo(() => {
    return (priceNum) => {
      if (typeof priceNum !== 'number') return priceNum
      const formatted = priceNum.toLocaleString(lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-US' : 'uz-UZ')
      const curr = translations[lang]?.currency || "so'm"
      return `${formatted} ${curr}`
    }
  }, [lang])

  // Product translation helper
  const tp = useMemo(() => {
    return (product) => getLocalizedProduct(product, lang, tc, formatPrice)
  }, [lang, tc, formatPrice])

  const value = useMemo(() => ({
    lang,
    setLang,
    t,
    tc,
    tp,
    formatPrice
  }), [lang, t, tc, tp, formatPrice])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    return {
      lang: 'uz',
      setLang: () => {},
      t: (key, fallback = '') => translations.uz[key] || fallback || key,
      tc: (cat) => cat,
      tp: (prod) => prod,
      formatPrice: (num) => `${num?.toLocaleString() || 0} so'm`
    }
  }
  return context
}
