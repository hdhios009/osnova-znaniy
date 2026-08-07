(function () {
  'use strict';

  var FORM_ENDPOINT =
    'https://script.google.com/macros/s/AKfycby87hWuo9uuhgNc2Lc16C_AnwFB9zVyvh5DTcOUhYVVMD_MaE2YvZtE1otrStmnxDyoJg/exec';
  var PAGE_NAME = 'Основа знаний — Главная';
  var ATTR_KEY = 'osnova_attribution';
  var ATTR_FIELDS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'yclid',
    'gclid'
  ];

  function readStoredAttribution() {
    try {
      var raw = sessionStorage.getItem(ATTR_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function captureAttribution() {
    var stored = readStoredAttribution();
    var params = new URLSearchParams(window.location.search);
    var next = {};
    var i;
    var key;
    var value;

    for (i = 0; i < ATTR_FIELDS.length; i++) {
      key = ATTR_FIELDS[i];
      next[key] = stored[key] || '';
      value = params.get(key);
      if (value) next[key] = value;
    }

    try {
      sessionStorage.setItem(ATTR_KEY, JSON.stringify(next));
    } catch (e) {}

    return next;
  }

  function fmtPhone(raw, prev) {
    var d = (raw || '').replace(/\D/g, '');
    if (d.indexOf('8') === 0) d = '7' + d.slice(1);
    else if (d.indexOf('9') === 0) d = '7' + d;
    else if (d && d[0] !== '7') d = '7' + d;
    d = d.slice(0, 11);
    if (prev != null && (raw || '').length < prev.length) {
      var pd = prev.replace(/\D/g, '');
      if (pd === d) d = d.slice(0, -1);
    }
    var r = d.slice(1);
    if (r.length === 0) return '';
    var out = '+7 (' + r.slice(0, 3);
    if (r.length >= 3) out += ')';
    if (r.length > 3) out += ' ' + r.slice(3, 6);
    if (r.length > 6) out += '-' + r.slice(6, 8);
    if (r.length > 8) out += '-' + r.slice(8, 10);
    return out;
  }

  function validPhone(v) {
    var d = (v || '').replace(/\D/g, '');
    return d.length === 11 && d[0] === '7';
  }

  function validAge(v) {
    if (!v) return true;
    var n = parseInt(v, 10);
    return !isNaN(n) && n >= 4 && n <= 17;
  }

  function leadKey(name, phone, age) {
    return [name, phone, age].join('|');
  }

  var attribution = captureAttribution();

  var form = document.getElementById('lead-form');
  var nameEl = document.getElementById('f_name');
  var phoneEl = document.getElementById('f_phone');
  var ageEl = document.getElementById('f_age');
  var websiteEl = document.getElementById('f_website');
  var btn = document.getElementById('f_submit');
  var status = document.getElementById('form-status');
  var prevPhone = '';
  var busy = false;
  var lastSentKey = '';

  function setStatus(text, kind) {
    if (!status) return;
    status.textContent = text || '';
    status.className = 'form-status' + (kind ? ' ' + kind : '');
  }

  if (phoneEl) {
    phoneEl.addEventListener('input', function () {
      var v = fmtPhone(phoneEl.value, prevPhone);
      phoneEl.value = v;
      prevPhone = v;
    });
  }

  if (ageEl) {
    ageEl.addEventListener('input', function () {
      ageEl.value = ageEl.value.replace(/[^0-9]/g, '').slice(0, 2);
    });
  }

  if (!form || !btn) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (busy || btn.disabled) return;

    setStatus('', '');

    var name = ((nameEl && nameEl.value) || '').trim();
    var phone = ((phoneEl && phoneEl.value) || '').trim();
    var age = ((ageEl && ageEl.value) || '').trim();
    var website = ((websiteEl && websiteEl.value) || '').trim();
    var key = leadKey(name, phone, age);

    if (!name) {
      setStatus('Пожалуйста, укажите имя.', 'err');
      if (nameEl) nameEl.focus();
      return;
    }
    if (!validPhone(phone)) {
      setStatus('Введите корректный российский номер: +7 и 10 цифр.', 'err');
      if (phoneEl) phoneEl.focus();
      return;
    }
    if (!validAge(age)) {
      setStatus('Возраст ребёнка — от 4 до 17 лет.', 'err');
      if (ageEl) ageEl.focus();
      return;
    }
    if (key && key === lastSentKey) {
      setStatus('Заявка уже отправлена. Мы свяжемся с вами в ближайшее время.', 'ok');
      return;
    }

    attribution = captureAttribution();

    var body = new URLSearchParams();
    body.append('name', name);
    body.append('phone', phone);
    body.append('age', age);
    body.append('page_name', PAGE_NAME);
    body.append('page_url', window.location.href);
    body.append('referrer', document.referrer || '');
    body.append('utm_source', attribution.utm_source || '');
    body.append('utm_medium', attribution.utm_medium || '');
    body.append('utm_campaign', attribution.utm_campaign || '');
    body.append('utm_content', attribution.utm_content || '');
    body.append('utm_term', attribution.utm_term || '');
    body.append('yclid', attribution.yclid || '');
    body.append('gclid', attribution.gclid || '');
    body.append('website', website);

    busy = true;
    var orig = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Отправляем…';
    setStatus('', '');

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      body: body
    })
      .then(function () {
        lastSentKey = key;
        if (window.ym) ym(110489022, 'reachGoal', 'lead_form_submit');
        setStatus('Заявка отправлена. Мы свяжемся с вами в ближайшее время.', 'ok');
        if (nameEl) nameEl.value = '';
        if (phoneEl) phoneEl.value = '';
        if (ageEl) ageEl.value = '';
        if (websiteEl) websiteEl.value = '';
        prevPhone = '';
      })
      .catch(function (err) {
        console.error(err);
        setStatus('Не удалось отправить заявку. Попробуйте ещё раз.', 'err');
      })
      .then(function () {
        busy = false;
        btn.disabled = false;
        btn.textContent = orig;
      });
  });
})();
