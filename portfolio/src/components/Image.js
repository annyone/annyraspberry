import React, { useState } from 'react';
import imageSizes from '../data/imageSizes.json';

// Когда нужен файл двойного размера: на широком экране с плотностью от 1,5
// и на очень широком окне с любой плотностью. Одного условия по ширине
// мало: раньше оно стояло как (min-width: 1024px), и обычный монитор
// качал 3840 пикселей в плитку шириной 420. Одного условия по плотности
// тоже мало: телефон с плотностью 3 тянул бы 3840 пикселей по мобильной
// сети в картинку шириной 300.
export const RETINA_MEDIA =
  '(min-width: 1024px) and (min-resolution: 1.5dppx), (min-width: 1600px)';

// Второй источник картинки — файл двойного размера.
//
// Соглашение об именовании: рядом с X.webp лежит X-2x.webp. Пара есть
// у каждого .webp в public/images — это проверяет data/assets.test.js
// и data/cases/cases.test.js. Для остальных расширений возвращаем пустой
// список, иначе в разметку попадёт <source> с адресом, которого нет.
export function retinaSources(src) {
  if (typeof src !== 'string' || !src.endsWith('.webp')) return [];
  return [{ srcSet: src.replace(/\.webp$/, '-2x.webp'), media: RETINA_MEDIA }];
}

const FADE = 'opacity 0.5s ease-in-out';

const Image = ({
  src,
  sources = [], // массив объектов { srcSet, media, type }
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
  // Картинка считается загруженной и при ошибке: иначе заглушка
  // пульсировала бы на месте отсутствующего файла бесконечно.
  const [isLoaded, setIsLoaded] = useState(false);
  const markLoaded = () => setIsLoaded(true);

  // Размеры файла из data/imageSizes.json. Сами по себе они картинку не
  // растягивают (ширина и высота заданы стилем ниже), но по ним браузер
  // знает пропорции до загрузки и сразу отводит место нужной высоты —
  // текст под картинкой не прыгает, а заглушка видна в полный размер.
  // Для файла вне списка (фотография на главной) атрибутов нет: ей размер
  // задаёт тот, кто её ставит.
  const [width, height] = imageSizes[src] || [];

  const imageStyle = {
    width: '100%',
    maxWidth: 'none',
    height: 'auto',
    display: 'block',
    opacity: isLoaded ? 1 : 0,
    transition: FADE,
    ...(shadow && { boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)' }),
  };

  // Заглушка лежит поверх места под картинку, пока та не загрузилась.
  const skeletonStyle = {
    position: 'absolute',
    inset: 0,
    opacity: isLoaded ? 0 : 1,
    transition: FADE,
    pointerEvents: 'none',
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

  return (
    <div className={className || 'w-full h-full'}>
      {/* Заглушка стоит рядом с <picture>, а не внутри: по спецификации
          внутри <picture> допустимы только <source> и <img>. */}
      <div style={{ position: 'relative', width: '100%' }}>
        <div style={skeletonStyle} className={skeletonClass} />
        <picture style={{ display: 'block', width: '100%' }}>
          {sources.map((source, index) => (
            <source key={index} srcSet={source.srcSet} media={source.media} type={source.type} />
          ))}
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="rounded-lg"
            style={imageStyle}
            loading={loading}
            decoding="async"
            onLoad={markLoaded}
            onError={markLoaded}
          />
        </picture>
      </div>
    </div>
  );
};

export default Image;
