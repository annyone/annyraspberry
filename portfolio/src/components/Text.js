import React from 'react';

export const variants = {
  display: {
    tag: 'h1',
    className: 'text-3xl lg:text-4xl xl:text-5xl !leading-tight',
  },
  hero: {
    tag: 'h2',
    className: 'text-lg lg:text-xl xl:text-2xl font-normal',
  },
  h1: {
    tag: 'h1',
    className: 'text-4xl font-bold',
  },
  h2: {
    tag: 'h2',
    className: 'text-2xl md:text-3xl xl:text-4xl',
  },
  h3: {
    tag: 'h3',
    className: 'text-xl md:text-2xl xl:text-3xl font-medium inline-block',
  },
  h4: {
    tag: 'h4',
    className: 'text-lg md:text-xl xl:text-2xl font-medium',
  },
  subtitle: {
    tag: 'p',
    className: 'text-base text-zinc-500',
  },
  p: {
    tag: 'p',
    className: 'text-base md:text-lg/7 xl:text-xl/8',
  },
};

/**
 * @param {string} [variant] набор стилей: кегль, насыщенность, цвет
 * @param {string} [as] тег, если он должен отличаться от тега набора
 *
 * `as` нужен там, где вид и место в структуре документа расходятся.
 * Заголовок страницы кейса набран тем же кеглем, что карточка этого кейса
 * на главной, — иначе при переходе он менял бы размер на лету, — но это
 * главный заголовок страницы, и тег у него h1, а не h2 из набора.
 */
export default function Text({ children, variant = 'h3', as, className = '', ...props }) {
  const { tag, className: variantClass } = variants[variant] || variants.h3;
  const Tag = as || tag;

  return (
    <Tag className={`${variantClass} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
