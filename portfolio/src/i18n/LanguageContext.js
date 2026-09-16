import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import { playLanguageChange } from './langTransition';

import nav from './translations/nav.json';
import ui from './translations/ui.json';
import projects from './translations/projects.json';
import experiences from './translations/experiences.json';
import articles from './translations/articles.json';
import axelnac from './translations/pages/axelnac.json';
import logiq from './translations/pages/logiq.json';
import darts from './translations/pages/darts.json';
import adidas from './translations/pages/adidas.json';

const dict = {
  ...nav,
  ...ui,
  ...projects,
  ...experiences,
  ...articles,
  pages: { ...axelnac, ...logiq, ...darts, ...adidas },
};

const LanguageContext = createContext({
  lang: 'ru',
  setLang: () => {},
  t: (key, fallback) => fallback ?? key,
});

function resolveInitialLang() {
  const saved = typeof window !== 'undefined' ? window.localStorage.getItem('lang') : null;
  if (saved === 'ru' || saved === 'en') return saved;
  const envLang = process.env.REACT_APP_LANG;
  if (envLang === 'ru' || envLang === 'en') return envLang;
  if (typeof navigator !== 'undefined') {
    const n = navigator.language || (navigator.languages && navigator.languages[0]) || '';
    if (/^ru/i.test(n)) return 'ru';
  }
  return 'en';
}

function getByPath(obj, path) {
  return path
    .split('.')
    .reduce((acc, part) => (acc && acc[part] != null ? acc[part] : undefined), obj);
}

// Ключи, о которых уже сообщили. Один и тот же ключ читается на каждом
// рендере, поэтому без этого набора консоль заполнится повторами.
const reportedMissingKeys = new Set();

// Предупреждение о ключе, которого нет в словаре. Условие срабатывания:
// getByPath вернул undefined. Проверка: открыть страницу в режиме разработки
// (npm start) и посмотреть консоль — каждый отсутствующий ключ выводится один
// раз. Решение: либо ключ добавляют в JSON, либо вызов убирают.
// В сборке для продакшена (NODE_ENV === 'production') ничего не выводится.
function reportMissingKey(key) {
  if (process.env.NODE_ENV === 'production') return;
  if (reportedMissingKeys.has(key)) return;
  reportedMissingKeys.add(key);
  // eslint-disable-next-line no-console
  console.warn(`[i18n] нет ключа перевода: "${key}"`);
}

// Recursively resolves { ru, en } bilingual pairs to the target language.
// Plain strings, numbers, booleans, and non-bilingual objects pass through unchanged.
function resolveNode(node, lang) {
  if (!node || typeof node !== 'object') return node;
  if (Array.isArray(node)) return node.map(item => resolveNode(item, lang));
  const keys = Object.keys(node);
  if (keys.length === 2 && keys.includes('ru') && keys.includes('en')) {
    return resolveNode(node[lang] ?? node.en ?? node.ru, lang);
  }
  const out = {};
  for (const k of keys) out[k] = resolveNode(node[k], lang);
  return out;
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(resolveInitialLang);

  // Язык меняется не сразу, а в середине эффекта рассыпания: к этому
  // моменту старый текст уже растворился, и подмены не видно.
  // Где эффект не нужен — смена происходит сразу (см. langTransition.js).
  const setLang = useCallback(next => {
    playLanguageChange(() => setLangState(next));
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('lang', lang);
    } catch {}
  }, [lang]);

  // Атрибут <html lang> должен совпадать с языком текста на странице:
  // по нему скринридер выбирает голос и правила произношения, а браузер —
  // словарь переносов. Проверка: переключить язык и посмотреть в инспекторе
  // значение lang у корневого элемента — оно должно стать 'ru' или 'en'.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useMemo(() => {
    // resolveNode копирует поддерево словаря целиком, а один и тот же ключ
    // читается на каждой перерисовке: страница кейса делает больше полусотни
    // вызовов t() за рендер. Кэш живёт ровно столько, сколько выбранный язык
    // — при смене lang useMemo создаёт новый Map, и старые значения уходят
    // вместе со старой функцией. Побочный выигрыш: для одного ключа
    // возвращается один и тот же объект, поэтому списки и массивы можно
    // сравнивать по ссылке.
    const cache = new Map();

    return (key, fallback) => {
      if (cache.has(key)) return cache.get(key);

      const raw = getByPath(dict, key);
      if (raw == null) {
        reportMissingKey(key);
        return fallback ?? key;
      }

      const resolved = resolveNode(raw, lang);
      cache.set(key, resolved);
      return resolved;
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
