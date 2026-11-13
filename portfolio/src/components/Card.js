import React from 'react';

// Серая плашка со скруглением — общий вид баннера в кейсе, отзыва
// и карточки статьи. Отступы и раскладку задаёт тот, кто её использует:
// у трёх карточек они разные, а фон и радиус — одни.
const CARD = 'rounded-xl bg-zinc-50/75 dark:bg-zinc-800/60';

export default function Card({ as: Tag = 'div', className = '', children }) {
  return <Tag className={`${CARD} ${className}`.trim()}>{children}</Tag>;
}
