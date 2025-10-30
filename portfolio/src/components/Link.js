import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// Стили для base и hover состояний
const baseStyles = 'inline-flex items-center text-zinc-500 transition-transform duration-150';
const hoverStyles = 'hover:-translate-y-0.5 hover:text-rose-500';
const iconClass = 'h-7 w-7';

export default function Link({ to, href, label, icon, className = '', ...props }) {
  // Клонируем иконку с нужными классами - SVG наследует цвет через currentColor
  const iconEl = icon ? React.cloneElement(icon, { 
    className: `${iconClass} ${icon.props.className || ''}`.trim()
  }) : null;

  const content = (
    <>
      {iconEl && <span className={label ? 'mr-2' : ''}>{iconEl}</span>}
      {label}
    </>
  );

  const classes = `group ${baseStyles} ${hoverStyles} ${className}`.trim();

  // Внутренняя ссылка (React Router)
  if (to) {
    return (
      <RouterLink to={to} className={classes} {...props}>
        {content}
      </RouterLink>
    );
  }

  // Внешняя ссылка
  return (
    <a href={href} className={classes} {...props}>
      {content}
    </a>
  );
}
