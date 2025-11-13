import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();

  const buttonBaseClass = 'relative z-10 px-3 py-1.5 text-base font-medium rounded-md transition-all duration-300';
  const buttonActiveClass = 'text-zinc-900 dark:text-white';
  const buttonInactiveClass = 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white';

  return (
    <div className="relative inline-flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
      {/* Анимированный фон для активной кнопки */}
      <div 
        className="absolute top-1 bottom-1 bg-white dark:bg-zinc-700 rounded-md shadow-sm transition-all duration-300 ease-out"
        style={{
          left: lang === 'ru' ? '4px' : '50%',
          width: 'calc(50% - 4px)'
        }}
      />
      
      <button
        onClick={() => setLang('ru')}
        className={`${buttonBaseClass} ${lang === 'ru' ? buttonActiveClass : buttonInactiveClass}`}
        aria-label={t('lang.switchAria')}
      >
        Ru
      </button>
      <button
        onClick={() => setLang('en')}
        className={`${buttonBaseClass} ${lang === 'en' ? buttonActiveClass : buttonInactiveClass}`}
        aria-label={t('lang.switchAria')}
      >
        En
      </button>
    </div>
  );
}
