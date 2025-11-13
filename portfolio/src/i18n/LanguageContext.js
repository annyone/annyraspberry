import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

import en from './translations/en.json';
import ru from './translations/ru.json';

const dictionaries = { en, ru };

const LanguageContext = createContext({
  lang: 'ru',
  setLang: () => {},
  t: (key, fallback) => fallback ?? key,
});

function resolveInitialLang() {
  // 1) saved
  const saved = typeof window !== 'undefined' ? window.localStorage.getItem('lang') : null;
  if (saved && (saved === 'ru' || saved === 'en')) return saved;
  // 2) env default per build
  const envLang = process.env.REACT_APP_LANG;
  if (envLang === 'ru' || envLang === 'en') return envLang;
  // 3) browser
  if (typeof navigator !== 'undefined') {
    const n = navigator.language || (navigator.languages && navigator.languages[0]) || '';
    if (/^ru/i.test(n)) return 'ru';
  }
  return 'en';
}

function getByPath(obj, path) {
  return path.split('.').reduce((acc, part) => (acc && acc[part] != null ? acc[part] : undefined), obj);
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(resolveInitialLang);

  useEffect(() => {
    try {
      window.localStorage.setItem('lang', lang);
    } catch {}
  }, [lang]);

  const t = useMemo(() => {
    const dict = dictionaries[lang] || dictionaries.en;
    return (key, fallback) => {
      const val = getByPath(dict, key);
      return val != null ? val : fallback ?? key;
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
