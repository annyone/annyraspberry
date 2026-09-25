import React from 'react';

// Набор тегов — короткие подписи в плашках, например инструменты,
// с которыми работала в компании.
//
// Это список, а не просто строка: скринридер объявит «список, 7 пунктов»
// и прочитает подпись из label — так понятно, что за перечисление.
// Не массив или пустой массив — не рисуется ничего, чтобы в карточке
// не оставался пустой отступ.
export default function TagList({ items, label, className = '' }) {
  const list = Array.isArray(items) ? items : [];
  if (list.length === 0) return null;

  return (
    <ul aria-label={label} className={`flex flex-wrap gap-2 ${className}`}>
      {list.map(item => (
        <li
          key={item}
          className="rounded-md bg-zinc-100/50 px-2.5 py-1 text-sm text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
