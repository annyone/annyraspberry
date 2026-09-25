import React, { useState } from 'react';

const box = 'size-10 shrink-0 rounded-lg';

// Логотип компании — квадратная плашка 40×40.
//
// Файл логотипа должен сам быть плашкой: квадрат с фоном, заполненный
// до краёв (см. public/images/companies). Прозрачный значок без фона
// прилипнет к краям рамки — такой файл сначала кладут на квадрат
// с отступами, как сделано для axelpro.svg.
//
// Нет файла или он не загрузился — вместо него первая буква названия
// на серой плашке, чтобы колонка логотипов не прерывалась пустым местом.
//
// alt пустой намеренно: название компании стоит рядом текстом,
// и скринридер иначе прочитал бы его дважды.
export default function CompanyLogo({ src, name = '' }) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt=""
        className={`${box} object-cover ring-1 ring-black/5 dark:ring-white/10`}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`${box} flex items-center justify-center bg-zinc-100 text-lg font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400`}
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}
