import React from 'react';
import AnyLink from './AnyLink';

// Стили для base и hover состояний
const baseStyles = 'inline-flex items-center text-zinc-500 transition-transform duration-150';
const hoverStyles = 'hover:-translate-y-0.5 hover:text-rose-500';
const iconClass = 'h-7 w-7';

// Ссылка с подписью размером от body и необязательным значком. Куда она
// ведёт — внутрь сайта (`to`) или наружу (`href`) — решает AnyLink.
export default function Link({ label, icon, className = '', ...props }) {
  // Клонируем иконку с нужными классами - SVG наследует цвет через currentColor
  const iconEl = icon
    ? React.cloneElement(icon, {
        className: `${iconClass} ${icon.props.className || ''}`.trim(),
      })
    : null;

  return (
    <AnyLink className={`group ${baseStyles} ${hoverStyles} ${className}`.trim()} {...props}>
      {iconEl && <span className={label ? 'mr-2' : ''}>{iconEl}</span>}
      {label}
    </AnyLink>
  );
}
