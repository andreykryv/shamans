# 🗺️ КАРТА КОДА — ЗдравДом

## Структура проекта

```
ZdravDom/
├── Program.cs                          ← Точка входа .NET 10, middleware
├── ZdravDom.csproj                     ← Зависимости проекта
├── appsettings.json                    ← Телефон, email, настройки сайта
│
├── Pages/
│   ├── _ViewStart.cshtml               ← Подключает _Layout ко всем страницам
│   ├── _ViewImports.cshtml             ← Глобальные using и TagHelpers
│   ├── Index.cshtml                    ← ГЛАВНАЯ СТРАНИЦА (все секции)
│   ├── Index.cshtml.cs                 ← Логика главной (обработка формы)
│   ├── Kirill.cshtml                   ← Страница Кирилла Борея
│   ├── Kirill.cshtml.cs                ← Логика страницы Кирилла
│   ├── Denis.cshtml                    ← Страница Дениса (саунд-хилинг)
│   ├── Denis.cshtml.cs                 ← Логика страницы Дениса
│   └── Shared/
│       └── _Layout.cshtml              ← Шапка (nav) + подвал (footer)
│
└── wwwroot/
    ├── css/
    │   └── site.css                    ← ВСЕ стили (5 разделов ниже)
    ├── js/
    │   └── site.js                     ← Все анимации и интерактив
    └── images/                         ← ПОМЕСТИТЕ ФОТО СЮДА
        ├── hero-bg.jpg                 ← Фон главного экрана
        ├── about.jpg                   ← Фото в секции "О нас"
        ├── kirill.jpg                  ← Фото Кирилла (мужчина со скрещ. руками)
        └── denis.jpg                   ← Фото Дениса (второе фото)
```

---

## 📸 Фотографии

**Источник:** https://trufanov-photographer.ru/disk/zdravdom-j5vnhq

| Файл | Что туда положить |
|------|-------------------|
| `wwwroot/images/kirill.jpg` | Мужчина со скрещёнными руками в чёрной рубашке |
| `wwwroot/images/denis.jpg` | Мужчина с тёмной бородой (второе фото) |
| `wwwroot/images/hero-bg.jpg` | Любое фото интерьера/атмосферы для главного фона |
| `wwwroot/images/about.jpg` | Фото кабинета/процедуры для секции "О нас" |

---

## 🎨 Дизайн — CSS Variables (`site.css` строки 1–25)

```css
:root {
    --c-forest:    #1a2e1e;   /* Тёмно-зелёный — основной цвет бренда */
    --c-copper:    #b07840;   /* Медный — акцентный цвет               */
    --c-cream:     #f5efe6;   /* Кремовый — фон светлых секций         */
    --font-display: 'Cormorant Garamond'; /* Заголовки                 */
    --font-body:    'Raleway';            /* Текст                     */
}
```

**Чтобы сменить цвета** — меняйте только переменные в `:root`. Всё остальное обновится автоматически.

---

## 📄 Страницы

### 1. `Pages/Index.cshtml` — Главная

| Секция | ID | Что содержит |
|--------|----|--------------|
| Hero | `#hero` | Заголовок, статистика, кнопки |
| О нас | `#about` | Текст о компании, преимущества |
| Услуги | `#services` | 4 карточки услуг |
| Специалисты | `#specialists` | Кирилл и Денис |
| Тарифы | `#tariffs` | 3 тарифа (заглушки — замените цены) |
| Отзывы | `#reviews` | Слайдер с 5 отзывами |
| Форматы | `#formats` | Краснодар / Садовое / Выезд |
| Контакты | `#contact` | Форма заявки + FAQ |

### 2. `Pages/Kirill.cshtml` — Страница Кирилла
- Hero с фото и заголовком
- Методика и биография
- Инструменты процедуры
- Проблемы и результаты
- Противопоказания
- CTA (кнопка записи)

### 3. `Pages/Denis.cshtml` — Страница Дениса
- Hero с анимацией звуковых волн
- Что такое саунд-хилинг
- Инструменты (чаши, гонги и пр.)
- Для кого / результаты
- Структура сессии (4 шага)
- Форматы (индивидуально / группа / ретрит)
- CTA

---

## 📝 Где что редактировать

### Тарифы (ГЛАВНАЯ страница)
**Файл:** `Pages/Index.cshtml`, поиск: `id="tariffs"`

```html
<span class="price-num">—</span>   ← Замените — на цену, например: 3500
<span class="price-unit">₽ / сеанс</span>
```

Три тарифа — три таких блока. Ищите комментарии `<!-- ЗАМЕНИТЕ: укажите цену -->`.

### Контакты (телефон, email)
- **Файл 1:** `Pages/Shared/_Layout.cshtml` — footer
- **Файл 2:** `Pages/Index.cshtml` — секция `#contact`  
- **Файл 3:** `appsettings.json` — настройки

### Добавить нового специалиста
1. **Фото:** положите `wwwroot/images/имя.jpg`
2. **Карточка на главной** (`Pages/Index.cshtml`, секция `#specialists`):
   Скопируйте блок `<div class="specialist-card">` и измените имя, текст, фото
3. **Страница специалиста:**
   Скопируйте `Pages/Denis.cshtml` → `Pages/NewSpec.cshtml`
   Скопируйте `Pages/Denis.cshtml.cs` → `Pages/NewSpec.cshtml.cs`
   Измените `DenisModel` на `NewSpecModel`, заполните содержимое
4. **Навигация** (`Pages/Shared/_Layout.cshtml`): добавьте ссылку в nav

### Добавить тариф
В `Pages/Index.cshtml`, секция `#tariffs`:
```html
<!-- Скопируйте этот блок: -->
<div class="tariff-card reveal-up delay-N">
    <div class="tariff-header">
        <span class="tariff-tag">Название тарифа</span>
        <div class="tariff-price">
            <span class="price-num">5000</span>
            <span class="price-unit">₽ / сеанс</span>
        </div>
    </div>
    <ul class="tariff-features">
        <li>Пункт 1</li>
        <li>Пункт 2</li>
    </ul>
    <a href="#contact" class="btn btn-primary w-full">Записаться</a>
</div>
```

### Добавить отзыв
В `Pages/Index.cshtml`, секция `#reviews`, скопируйте `.review-card`:
```html
<div class="review-card">
    <div class="review-stars">★★★★★</div>
    <blockquote>Текст отзыва...</blockquote>
    <div class="review-author">
        <span class="review-name">Имя</span>
        <span class="review-meta">Возраст · профессия</span>
    </div>
</div>
```

---

## 🎬 JavaScript — `wwwroot/js/site.js`

| Функция | Строки | Что делает |
|---------|--------|------------|
| Header scroll | ~8–15 | Тёмный фон шапки при прокрутке |
| Mobile menu | ~17–30 | Бургер-меню для мобильных |
| Scroll reveal | ~32–42 | Анимация появления элементов |
| Counter animation | ~44–64 | Счётчики в hero (500+, 7+, 95%) |
| Reviews slider | ~66–118 | Слайдер отзывов (drag + touch + dots) |
| Hero particles | ~120–163 | Золотые частицы на hero-фоне |
| Sound waves | ~165–202 | Анимация волн на странице Дениса |
| Phone mask | ~220–236 | Маска +7 (___) ___-__-__ |

---

## 📧 Обработка формы

**Файл:** `Pages/Index.cshtml.cs`

Сейчас форма принимает данные, но не отправляет уведомление. Подключите:

```csharp
// Вариант 1: Email через SMTP
using System.Net.Mail;
var client = new SmtpClient("smtp.yandex.ru", 465);
client.Credentials = new NetworkCredential("your@email.ru", "password");
await client.SendMailAsync("from@zdravdom.ru", "to@zdravdom.ru", 
    $"Заявка от {Name}", $"Телефон: {Phone}\nУслуга: {Service}\n{Message}");

// Вариант 2: Telegram Bot
var botToken = "ВАШ_ТОКЕН";
var chatId = "ВАШ_CHAT_ID";
var text = $"Заявка%20от%20{Name}%0AТел%3A%20{Phone}";
await httpClient.GetAsync($"https://api.telegram.org/bot{botToken}/sendMessage?chat_id={chatId}&text={text}");
```

---

## 🚀 Запуск проекта

```bash
# 1. Убедитесь что установлен .NET 10
dotnet --version   # должно быть 10.x.x

# 2. Запуск в режиме разработки
cd ZdravDom
dotnet run

# 3. Сайт откроется на
# http://localhost:5000  или  https://localhost:5001

# 4. Публикация для продакшена
dotnet publish -c Release -o ./publish
```

---

## 🌐 Деплой

**Рекомендуемые хостинги для .NET:**
- **Timeweb** (Россия) — поддерживает .NET
- **Beget** — .NET через Docker
- **VPS + Nginx** — настройте reverse proxy на порт 5000
- **Railway.app** — бесплатный tier для тестирования

**Nginx config (если VPS):**
```nginx
server {
    listen 80;
    server_name zdravdom.ru www.zdravdom.ru;
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## ✅ Чеклист перед запуском

- [ ] Добавить фото из ссылки в `wwwroot/images/`
- [ ] Заменить `—` на реальные цены в тарифах
- [ ] Заменить телефон `+7 (800) 123-45-67` на реальный
- [ ] Заменить email `info@zdravdom.ru` на реальный
- [ ] Подключить отправку формы (email или Telegram)
- [ ] Настроить домен и SSL
- [ ] Добавить реальный адрес в `Краснодаре`
