import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

// Подписи — коды языков по ISO 639-1 в верхнем регистре. Они не переводятся:
// «RU» остаётся «RU» и в русском интерфейсе, и в английском, иначе носитель
// другого языка не нашёл бы в переключателе свой.
const LABELS = { ru: 'RU', en: 'EN' };

// Порядок значений на барабане сверху вниз. От него — и только от него —
// зависит направление движения: RU стоит выше EN, поэтому переход на
// английский уводит ленту вверх, а возврат на русский опускает её обратно.
// Переставить строки местами значит развернуть анимацию.
const ORDER = ['ru', 'en'];

// Метка доступности описывает действие, а не текущее значение: кнопка одна,
// и по надписи «RU» программа чтения с экрана не сообщила бы, что произойдёт
// при нажатии. Ключи плоские, без вложенного узла с ключами ru и en:
// такой узел resolveNode принял бы за двуязычную пару и вернул бы строку
// вместо ветки (см. i18n/LanguageContext.js).
const SWITCH_LABEL = { ru: 'lang.switchToRussian', en: 'lang.switchToEnglish' };

// Высота одной строки барабана. Задана в em, а не в пикселях: кегль
// переключателя наследуется от body и растёт вместе с шириной экрана
// (16px → 18px → 20px в src/index.css), а фиксированная высота обрезала бы
// подросшие буквы. При кегле 16px это 20px — заглавной букве Raleway
// (высота 0.72em) хватает с запасом сверху и снизу.
const ROW = 'h-[1.25em] leading-[1.25em]';

// Кегль намеренно не задан: он наследуется от body — ровно так же, как
// у пунктов меню. С жёстким text-base переключатель оставался 16px там,
// где соседние подписи вырастали до 18px и 20px, и выглядел мельче их.
const BUTTON =
  'px-1 py-1.5 text-zinc-800 transition-colors duration-200 dark:text-zinc-300 text-xl';

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();

  const next = lang === 'ru' ? 'en' : 'ru';

  // Сдвиг ленты в процентах от её собственной высоты. Лента — это все
  // значения подряд, её высота равна ORDER.length строк, поэтому одна
  // строка составляет 100 / ORDER.length процентов. Считать в процентах,
  // а не в em, надёжнее: при расхождении em-высоты строки и em-высоты окна
  // барабан вставал бы между значениями.
  const shift = (ORDER.indexOf(lang) * -100) / ORDER.length;

  return (
    <button
      type="button"
      onClick={() => setLang(next)}
      aria-label={t(SWITCH_LABEL[next])}
      className={`${BUTTON} hover:text-rose-400`}
    >
      {/* Окно барабана высотой ровно в одну строку: всё, что выше и ниже
          выбранного значения, обрезается. Лента скрыта от программ чтения
          с экрана целиком — иначе в кнопке читалось бы «RU EN», хотя видно
          одно значение; что делает кнопка, сказано в aria-label. */}
      <span className={`block overflow-hidden ${ROW}`} aria-hidden="true">
        <span
          data-testid="language-reel"
          className="flex flex-col transition-transform duration-300 ease-in-out motion-reduce:transition-none"
          style={{ transform: `translateY(${shift}%)` }}
        >
          {ORDER.map(code => (
            <span key={code} className={ROW}>
              {LABELS[code]}
            </span>
          ))}
        </span>
      </span>
    </button>
  );
}
