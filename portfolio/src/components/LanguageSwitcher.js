import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

// Подписи — коды языков по ISO 639-1 в верхнем регистре. Они не переводятся:
// «RU» остаётся «RU» и в русском интерфейсе, и в английском, иначе носитель
// другого языка не нашёл бы в переключателе свой.
const LABELS = { ru: 'RU', en: 'EN' };

// Цвет активного языка совпадает с цветом обычного текста страницы —
// он задан для body в src/index.css. Неактивный берёт тот же приглушённый
// zinc-500, которым в проекте набраны второстепенные подписи
// (components/Link.js, вариант subtitle в components/Text.js).
const BASE_TEXT = 'text-zinc-800 dark:text-zinc-300';
const MUTED_TEXT = 'text-zinc-500';

// Отбивка между кодами — настоящая линия толщиной в пиксель (w-px),
// а не символ «|»: у глифа толщина и высота зависят от шрифта и кегля,
// и рядом с RU и EN он выглядел бы то тоньше, то толще. Цвет светлее
// неактивного языка: это разделитель, а не третья равноправная подпись.
// Высота задана в em, а не в пикселях: кегль переключателя меняется вместе
// с body, и фиксированная линия отстала бы от подросших букв.
const SEPARATOR = 'mx-2 h-[1em] w-px bg-zinc-300 dark:bg-zinc-600';

// Кегль намеренно не задан: он наследуется от body (text-base, md:text-lg,
// xl:text-xl в src/index.css) — ровно так же, как у пунктов меню, которые
// рисует components/Link.js и которые тоже не объявляют размер. С жёстким
// text-base переключатель оставался 16px там, где соседние пункты меню
// вырастали до 18px и 20px, и выглядел мельче их.
// Проверка: открыть шапку на ширине 1920 и сверить высоту букв RU и «Кейсы».
const BUTTON_BASE = 'px-1 py-1.5 transition-colors duration-200';

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();

  // Состояние передаётся через aria-pressed: без него активный язык виден
  // только по цвету, то есть недоступен программам чтения с экрана.
  // Проверка: включить чтение с экрана и пройти по кнопкам — должно
  // звучать «Русский, нажата» и «Английский, не нажата».
  const button = code => (
    <button
      type="button"
      onClick={() => setLang(code)}
      className={`${BUTTON_BASE} ${
        lang === code ? BASE_TEXT : `${MUTED_TEXT} hover:text-zinc-800 dark:hover:text-zinc-300`
      }`}
      aria-label={t(`lang.${code}`)}
      aria-pressed={lang === code}
    >
      {LABELS[code]}
    </button>
  );

  return (
    <div className="inline-flex items-center" role="group" aria-label={t('lang.group')}>
      {button('ru')}
      {/* Разделитель скрыт от программ чтения с экрана: озвучивать его
          между двумя кнопками — лишний шум, границу кнопок они и так
          сообщают. */}
      <span aria-hidden="true" data-testid="language-separator" className={SEPARATOR} />
      {button('en')}
    </div>
  );
}
