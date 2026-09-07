# Основа знаний — сайт для GitHub Pages

Production: https://osnova.kotiksym.ru/  
Репозиторий: `hdhios009/osnova-znaniy`

Дизайн главной перенесён с `osnovashik.ru`. Это отдельный локальный сайт центра на Мичуринском проспекте. Не путать с КотиксУМ (`kotiksym.ru`, м. Планерная).

## Что сохраняем при обновлении дизайна
- `CNAME` — `osnova.kotiksym.ru`
- favicon-набор и `apple-touch-icon.png`
- `privacy/`, `privacy.html`, `consent/`, `license/`
- `form.js` — заявки в существующий Google Apps Script
- `robots.txt`, `sitemap.xml`, `.nojekyll`

## Форма
Заявки уходят на тот же Apps Script endpoint, что и у КотиксУМ. Поля: имя, телефон, возраст, задача, комментарий, `page_name`, `page_url`, `referrer`, UTM, `yclid`, `gclid`, honeypot `website`. Цель Метрики: `lead_form_submit` (счётчик `110489022`).

Не меняйте endpoint без решения владельца.

## GitHub Pages
1. Branch: `main`, folder: `/ (root)`.
2. Custom domain: `osnova.kotiksym.ru`, HTTPS включён.
