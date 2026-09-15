import React from 'react';
import { ReactComponent as LinkedInIcon } from '../images/linkedin.svg';
import { ReactComponent as TelegramIcon } from '../images/telegram.svg';

// Иконки взяты из набора Phosphor Icons (лицензия MIT), вес light.
// Толщина линии задана не здесь, а внутри самих файлов: в них залитые
// контуры, а не обводка, поэтому параметра stroke-width нет и сменить вес
// можно только заменой файлов на другой вес из того же набора.
//
// Замеры при размере иконки 28px: thin даёт штрих 0.88px, light — 1.31px,
// regular — 1.75px. Вертикальный штрих Raleway 400 в шапке — 1.45px при
// кегле 18px и 1.96px при 20px.
// Проверка при замене: отрисовать иконку и букву «Н» рядом в одном кегле
// и сравнить толщину вертикальных линий.

// Резюме описано отдельно от остальных пунктов: в шапке оно рисуется
// не ссылкой, а контурной кнопкой после переключателя языка
// (components/Nav.js). Логика имени файла и кодирования адреса осталась
// здесь одна на всё приложение — она нетривиальная и проверяется тестом
// в data/assets.test.js.
export function getCvItem(t, lang = 'en') {
  // Файл резюме свой на каждый язык, оба лежат в /public и отдаются
  // от корня сайта.
  const file =
    lang === 'ru'
      ? 'CV-Malinina-Anna-UI-UX-designer RU.pdf'
      : 'CV-Malinina-Anna-UI-UX-designer EN.pdf';

  return {
    // В имени файла есть пробелы, поэтому адрес кодируется. Расхождение
    // в одном символе даёт скачивание пустоты без единой ошибки в консоли.
    url: '/' + encodeURIComponent(file),
    label: t('nav.downloadCV', 'Download CV'),
    // Атрибут download открывает диалог сохранения. Имя даётся общее,
    // без пометки языка: посетитель скачивает «резюме», а не «резюме RU».
    download: 'CV-Malinina-Anna-UI-UX-designer.pdf',
  };
}

// Build nav items using translation function t(key) and current lang.
// lang is optional for backward compatibility; defaults to 'en'.
export function getNavItems(t, lang = 'en') {
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
