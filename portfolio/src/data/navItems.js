// Резюме описано отдельно от остальных пунктов: оно не ведёт по сайту,
// а скачивает файл, и в меню набрано розовым (components/Nav.js). Логика
// имени файла и кодирования адреса осталась здесь одна на всё приложение —
// она нетривиальная и проверяется тестом в data/assets.test.js.
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

// Крупные пункты меню — разделы главной страницы.
//
// Ссылки на секции задаются от корня сайта и полем `to`, а не `href`.
// Просто '#cases' со страницы кейса даёт адрес /logiq#cases: остаёмся
// на кейсе, секции с таким id там нет, никуда не прокручиваемся.
// Поле `to` заставляет Link отрендерить RouterLink, поэтому переход
// на главную идёт без перезагрузки страницы, а прокрутку к якорю
// выполняет components/ScrollToTop.js.
export function getSectionItems(t) {
  return [
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
  ];
}

// Ссылки на внешние площадки. Подпись видимая, поэтому aria-label здесь
// не нужен: он перекрыл бы текст ссылки, и программа чтения с экрана
// прочитала бы его вместо того, что видит зрячий посетитель.
//
// Своего значка у площадки нет: в меню все они набраны крупной подписью
// со значком внешней ссылки в конце (components/Nav.js). Файлы значков
// LinkedIn и Telegram остались в src/images на случай возврата.
export function getSocialItems(t) {
  return [
    {
      url: 'https://www.linkedin.com/in/annyraspberry/',
      label: t('nav.linkedin', 'LinkedIn'),
      target: '_blank',
      rel: 'noopener noreferrer',
    },
    {
      url: 'https://t.me/annyraspberry',
      label: t('nav.telegram', 'Telegram'),
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  ];
}

// Полный список пунктов одним массивом. Меню разложено на две части
// (getSectionItems и getSocialItems) и этой функцией не пользуется —
// она осталась для проверок, которым нужны все адреса разом
// (data/assets.test.js).
export function getNavItems(t, lang = 'en') {
  return [...getSectionItems(t, lang), ...getSocialItems(t, lang)];
}

export default getNavItems;
