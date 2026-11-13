import React from 'react';
import AnyLink from './AnyLink';

// Кегль и поведение при наведении общие у всех крупных пунктов меню,
// различается только цвет.
const MENU_ITEM =
  'inline-flex items-center gap-[0.3em] ' +
  'text-4xl md:text-5xl xl:text-4xl leading-tight transition-colors duration-150';

// Розовым набран один пункт — резюме: оно не ведёт по сайту, а скачивает
// файл. Приглушённым серым — ссылки на внешние площадки, тем же zinc-500,
// которым в проекте набраны второстепенные подписи (components/Link.js).
const MENU_TONE = {
  default: 'text-zinc-800 dark:text-zinc-100 hover:text-rose-400',
  accent: 'text-rose-500 hover:text-rose-400',
  muted: 'text-zinc-500 hover:text-rose-400',
};

// Крупный пункт меню. Отдельный элемент, а не components/Link.js: там
// подпись набрана размером от body, а здесь пункт идёт кеглем заголовка.
//
// Живёт в своём файле, а не внутри components/Nav.js, потому что резюме
// и площадки стоят ещё и в подвале (components/Footer.js) и должны
// выглядеть там точно так же, как в меню.
//
// Куда ведёт пункт — внутрь сайта (`to`) или на файл и внешнюю площадку
// (`href`) — решает AnyLink.
export default function MenuItem({ label, tone = 'default', ...props }) {
  return (
    <AnyLink className={`${MENU_ITEM} ${MENU_TONE[tone]}`} {...props}>
      {label}
    </AnyLink>
  );
}
