# Основа знаний — сайт для GitHub Pages

Production: https://osnova.kotiksym.ru/  
Репозиторий: `hdhios009/osnova-znaniy`

Это отдельный локальный сайт центра на Мичуринском проспекте. Не путать с КотиксУМ (`kotiksym.ru`, м. Планерная).

## Структура
- `index.html` — главная
- `form.js` — заявка в существующий Google Apps Script, attribution в `sessionStorage` (`osnova_attribution`)
- `privacy/index.html`, `consent/index.html` — юридические страницы бренда «Основа знаний»
- `privacy.html` — редирект на `/privacy/`
- `robots.txt`, `sitemap.xml`
- `images/` — фотографии центра
- `favicon-120.png`
- `.nojekyll` — GitHub Pages отдаёт файлы как статику
- `CNAME` — `osnova.kotiksym.ru`

## Форма
Заявки уходят на тот же Apps Script endpoint, что и у КотиксУМ. Поля: имя, телефон, возраст, `page_name`, `page_url`, `referrer`, UTM, `yclid`, `gclid`, honeypot `website`. Цель Метрики: `lead_form_submit` (счётчик `110489022`).

Не меняйте endpoint без решения владельца.

## GitHub Pages
1. Branch: `main`, folder: `/ (root)`.
2. Custom domain: `osnova.kotiksym.ru`, HTTPS включён.
