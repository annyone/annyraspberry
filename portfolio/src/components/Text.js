import React from 'react';

const variants = {
  h1: {
    tag: 'h1',
    className: 'text-4xl font-bold',
  },
  h2: {
    tag: 'h2',
    className: 'text-4xl',
  },
  h3: {
    tag: 'h3',
    className: 'text-3xl font-medium inline-block',
  },
  h4: {
    tag: 'h4',
    className: 'text-2xl font-medium',
  },
  subtitle: {
    tag: 'p',
    className: 'text-base text-zinc-500 font-feature-settings-smcp',
  },
  p:{
    tag: 'p',
    className: 'text-base md:text-lg/7 xl:text-xl/9',
  },
};

export default function Text({ children, variant = 'h3', className = '', ...props }) {
  const { tag: Tag, className: variantClass } = variants[variant] || variants.h3;
  return (
    <Tag className={`${className} ${variantClass}`} {...props}>
      {children}
    </Tag>
  );
}
