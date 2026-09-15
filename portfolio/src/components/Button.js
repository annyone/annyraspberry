import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Контурная кнопка: рамка и подпись цветом rose-500, при наведении
// заливается тем же цветом.
//
// Размер шрифта не задан намеренно — он наследуется от body (text-base,
// md:text-lg, xl:text-xl в src/index.css), как и у пунктов меню, которые
// рисует components/Link.js. Иначе кнопка рядом с ними выглядела бы мельче
// на широких экранах.
const BASE =
  'inline-flex items-center gap-2 rounded-lg border border-rose-500 px-4 py-2 ' +
  'text-rose-500 transition-colors duration-200 ' +
  'hover:bg-rose-500 hover:text-white ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500';

// Иконка масштабируется вместе с подписью: размер в em, а не в пикселях.
// При фиксированных 20px она отставала бы от текста, который на широких
// экранах вырастает до 20px сам.
const ICON = 'h-[1.25em] w-[1.25em] shrink-0';

/**
 * @param {React.ReactElement} [icon] значок перед подписью
 * @param {string} [to]   внутренний адрес — переход через react-router
 * @param {string} [href] обычная ссылка, в том числе на файл для скачивания
 *
 * Без `to` и `href` рисуется <button type="button">: тогда это действие
 * на странице, а не переход.
 */
export default function Button({ icon, to, href, children, className = '', ...props }) {
  // SVG наследует цвет через currentColor, поэтому иконке задаётся
  // только размер — цвет придёт от кнопки вместе с наведением.
  const iconEl = icon
    ? React.cloneElement(icon, {
        className: `${ICON} ${icon.props.className || ''}`.trim(),
        'aria-hidden': 'true',
      })
    : null;

  const content = (
    <>
      {iconEl}
      {children}
    </>
  );

  const classes = `${BASE} ${className}`.trim();

  if (to) {
    return (
      <RouterLink to={to} className={classes} {...props}>
        {content}
      </RouterLink>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  );
}
