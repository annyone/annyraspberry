import React from 'react';

// Маркер списков на всём сайте — длинное тире. Он один на все списки
// и в данных не задаётся, поэтому новый список выглядит так же, как
// остальные, без дополнительных полей.
const MARKER = '—';

export default function MarkerList({ items = [], className = '' }) {
  // Значение по умолчанию items = [] закрывает только undefined. Если ключ
  // перевода отсутствует, t() вернёт строку ключа, а не массив, и .map
  // уронит страницу. Условие отрисовки списка: items — массив; иначе
  // отрисовывается пустой <ul>.
  const list = Array.isArray(items) ? items : [];

  return (
    <ul className={className}>
      {list.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2">
          {/* Тире — оформление, а не текст: скринридер и так объявляет
              пункт списка, и «тире» перед каждым пунктом было бы лишним. */}
          <span aria-hidden="true">{MARKER}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
