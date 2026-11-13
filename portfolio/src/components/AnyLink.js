import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Ссылка без оформления: `to` даёт переход внутри сайта через react-router,
// `href` — обычную ссылку, в том числе на файл или на внешнюю площадку.
// На этом выборе стоят и components/Link.js, и components/MenuItem.js.
//
// viewTransition понимает только ссылка роутера; обычному <a> он не
// передаётся, иначе React предупреждает о неизвестном атрибуте.
export default function AnyLink({ to, href, viewTransition, children, ...props }) {
  if (to) {
    return (
      <RouterLink to={to} viewTransition={viewTransition} {...props}>
        {children}
      </RouterLink>
    );
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
