import React from 'react';

export default function MarkerList({ marker = '•', items = [], className = '' }) {
  // Значение по умолчанию items = [] закрывает только undefined. Если ключ
  // перевода отсутствует, t() вернёт строку ключа, а не массив, и .map
  // уронит страницу. Условие отрисовки списка: items — массив; иначе
  // отрисовывается пустой <ul>.
  const list = Array.isArray(items) ? items : [];

  return (
    <ul className={className}>
      {list.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2">
          <span>{marker}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
