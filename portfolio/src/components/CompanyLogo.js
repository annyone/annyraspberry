import React, { useState } from 'react';

const box = 'size-7 shrink-0 self-center rounded-md';

// Логотип компании — квадрат 28×28 без рамки.
//
// Файл вписывается в квадрат целиком, с сохранением пропорций
// (object-contain): подойдёт и плашка с фоном, и прозрачный значок.
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
        className={`${box} object-contain`}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`${box} flex items-center justify-center bg-zinc-100 text-sm font-medium leading-none text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400`}
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}
