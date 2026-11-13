import React from 'react';
import Text from './Text';

export default function Section({ children, subtitle, title, last, id, className = '', ...props }) {
  // Расстояние между блоками по умолчанию — 16px. Главная задаёт своё
  // через className с восклицательным знаком (!gap-16 и подобные).
  const base = 'grid grid-cols-1 gap-4';

  // id висит на <section>, а не на внутреннем <div> с сеткой: подзаголовок
  // раздела отрисован выше этого div, и при переходе по /#cases он оказался
  // бы над верхней кромкой экрана. Проверка: открыть /#about — первой
  // видимой строкой должно быть слово «обо мне», а не карточка опыта.
  return (
    <section id={id} className={last ? 'mb-4' : 'mb-10 lg:mb-16 xl:mb-20'} {...props}>
      {subtitle && (
        <Text variant="subtitle" className="mb-8">
          {subtitle}
        </Text>
      )}
      {title && (
        <Text variant="h3" className="mb-4">
          {title}
        </Text>
      )}
      <div className={`${base} ${className}`}>{children}</div>
    </section>
  );
}
