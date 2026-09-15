import React, { useState } from 'react';

// Второй источник картинки для экранов с двойной плотностью.
//
// Соглашение об именовании: рядом с X.webp лежит X-2x.webp. Проверено по
// public/images — пара есть у каждого .webp без единого исключения, и ни
// у одного .png или .gif её нет. Отсюда правило: для .webp возвращаем
// второй источник, для остальных расширений — пустой список, иначе
// в разметку попадёт <source> без srcset.
//
// Порог (min-width: 1024px) до этого был записан руками в 22 местах
// страниц кейсов; здесь он один.
export function retinaSources(src) {
  if (typeof src !== 'string' || !src.endsWith('.webp')) return [];
  return [{ srcSet: src.replace(/\.webp$/, '-2x.webp'), media: '(min-width: 1024px)' }];
}

const Image = ({
  src,
  sources = [], // массив объектов { srcSet, media, type }
  backgroundColor,
  alt = '',
  className = '',
  shadow = false,
  // Когда браузер начинает качать файл. 'lazy' — только при приближении
  // картинки к области просмотра, 'eager' — сразу. По умолчанию 'lazy':
  // на страницах кейсов картинок девять и больше, и без этого все они
  // качаются одновременно с первым экраном. Критерий выбора 'eager':
  // картинка видна без прокрутки при открытии страницы.
  loading = 'lazy',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Определяем, является ли background градиентом или картинкой
  const isGradientOrImage =
    backgroundColor?.includes('gradient') || backgroundColor?.startsWith('url(');

  const backgroundStyle = backgroundColor
    ? isGradientOrImage
      ? { backgroundImage: backgroundColor }
      : { backgroundColor }
    : null;

  const shadowStyle = { boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)' };

  const imageStyle = {
    width: '100%',
    maxWidth: 'none',
    height: 'auto',
    display: 'block',
    opacity: isLoaded ? 1 : 0,
    transition: 'opacity 0.5s ease-in-out',
    ...(shadow && shadowStyle),
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setIsLoaded(true);
  };

  // Пульсация включена только до загрузки.
  //
  // Держать animate-pulse постоянно нельзя: объявления анимации в каскаде
  // стоят выше инлайновых стилей, а правило Tailwind описано как
  // @keyframes pulse { 50% { opacity: .5 } } — недостающие кадры 0% и 100%
  // берут значение из элемента, то есть из inline opacity. Заглушка с
  // opacity: 0 продолжала бы бесконечно всплывать до 0.5 и обратно серой
  // вуалью поверх уже загруженной картинки.
  //
  // Проверка: открыть страницу кейса, дождаться загрузки картинок и
  // посмотреть на них десяток секунд — серого мерцания быть не должно.
  const skeletonClass = `rounded-lg bg-zinc-200 dark:bg-zinc-700${isLoaded ? '' : ' animate-pulse'}`;

  // Стиль для скелетона загрузки
  const skeletonStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: isLoaded ? 0 : 1,
    transition: 'opacity 0.5s ease-in-out',
    pointerEvents: 'none',
  };

  const imageContent =
    sources.length > 0 ? (
      <picture style={{ width: '100%', display: 'block', position: 'relative' }}>
        <div style={skeletonStyle} className={skeletonClass} />
        {sources.map((source, index) => (
          <source key={index} srcSet={source.srcSet} media={source.media} type={source.type} />
        ))}
        <img
          src={src}
          alt={alt}
          className="rounded-lg"
          style={imageStyle}
          loading={loading}
          decoding="async"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </picture>
    ) : (
      <div style={{ position: 'relative', width: '100%', display: 'block' }}>
        <div style={skeletonStyle} className={skeletonClass} />
        <img
          src={src}
          alt={alt}
          className="rounded-lg"
          style={imageStyle}
          loading={loading}
          decoding="async"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
    );

  // Стиль для контейнера с фоном - тоже делаем его плавно появляющимся
  const containerStyle = backgroundColor
    ? {
        ...backgroundStyle,
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
      }
    : null;

  if (backgroundColor) {
    return (
      <div
        className={`rounded-lg p-2 lg:p-6 xl:p-8 ${className || 'w-full'}`}
        style={containerStyle}
      >
        {imageContent}
      </div>
    );
  } else {
    return <div className={`${className || 'w-full h-full'}`}>{imageContent}</div>;
  }
};

export default Image;
