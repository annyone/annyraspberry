import React from 'react';
import { ReactComponent as LinkedInIcon } from '../images/linkedin.svg';
import { ReactComponent as TelegramIcon } from '../images/telegram.svg';

// Build nav items using translation function t(key) and current lang.
// lang is optional for backward compatibility; defaults to 'en'.
export function getNavItems(t, lang = 'en') {
  // Choose correct CV file based on language.
  // Files are placed in /public and served from root.
  const cvFile =
    lang === 'ru'
      ? 'CV-Malinina-Anna-UI-UX-designer RU.pdf'
      : 'CV-Malinina-Anna-UI-UX-designer EN.pdf';

  // Encode filename to handle spaces in URL.
  const cvUrl = '/' + encodeURIComponent(cvFile);

  return [
    // Ссылки на секции задаются от корня сайта и полем `to`, а не `href`.
    // Просто '#cases' со страницы кейса даёт адрес /logiq#cases: остаёмся
    // на кейсе, секции с таким id там нет, никуда не прокручиваемся.
    // Поле `to` заставляет Link отрендерить RouterLink, поэтому переход
    // на главную идёт без перезагрузки страницы, а прокрутку к якорю
    // выполняет components/ScrollToTop.js.
    {
      to: '/#cases',
      label: t('nav.cases', 'Cases'),
    },
    {
      to: '/#about',
      label: t('nav.about', 'About'),
    },
    {
      to: '/#articles',
      label: t('nav.articles', 'Articles'),
    },
    {
      url: cvUrl,
      label: t('nav.downloadCV', 'Download CV'),
      // download attribute triggers save dialog. Provide a generic filename without locale.
      download: 'CV-Malinina-Anna-UI-UX-designer.pdf',
    },
    {
      url: 'https://www.linkedin.com/in/annyraspberry/',
      icon: <LinkedInIcon />,
      target: '_blank',
      rel: 'noopener noreferrer',
      'aria-label': t('nav.linkedin', 'LinkedIn'),
    },
    {
      url: 'https://t.me/annyraspberry',
      icon: <TelegramIcon />,
      target: '_blank',
      rel: 'noopener noreferrer',
      'aria-label': t('nav.telegram', 'Telegram'),
    },
  ];
}

export default getNavItems;
