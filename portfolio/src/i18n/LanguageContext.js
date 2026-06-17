import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

import nav         from './translations/nav.json';
import ui          from './translations/ui.json';
import projects    from './translations/projects.json';
import experiences from './translations/experiences.json';
import articles    from './translations/articles.json';
import axelnac     from './translations/pages/axelnac.json';
import logiq       from './translations/pages/logiq.json';
import darts       from './translations/pages/darts.json';
import adidas      from './translations/pages/adidas.json';

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
  return path.split('.').reduce(
    (acc, part) => (acc && acc[part] != null ? acc[part] : undefined),
    obj
  );
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
  const [lang, setLang] = useState(resolveInitialLang);

  useEffect(() => {
    try { window.localStorage.setItem('lang', lang); } catch {}
  }, [lang]);

  const t = useMemo(() => {
    return (key, fallback) => {
      const raw = getByPath(dict, key);
      if (raw == null) return fallback ?? key;
      return resolveNode(raw, lang);
    };
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
