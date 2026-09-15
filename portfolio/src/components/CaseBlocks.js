import React from 'react';
import Text from './Text';
import Banner from './Banner';
import MarkerList from './MarkerList';
import Image, { retinaSources } from './Image';
import Article from './Article';
import FeedbackCard from './FeedbackCard';

// Отрисовка кейса по описанию из src/data/cases. Перечень допустимых
// значений block.type собран здесь, и другого места, где страница кейса
// превращается в разметку, нет.
//
// t — переводчик, привязанный к конкретному кейсу: принимает ключ без
// префикса pages.<id>, который иначе повторялся бы в каждой строке описания.

// Собирает карточки-баннеры из двух возможных источников:
// key   — массив в переводах, каждый элемент с полями icon, title, text;
// items — перечисление прямо в описании, каждый элемент с полями emoji и key,
//         а заголовок и текст читаются по key + '.title' и key + '.text'.
function bannerItems(block, t) {
  if (block.key) {
    const items = t(block.key, []);
    return Array.isArray(items)
      ? items.map(item => ({ emoji: item.icon, title: item.title, text: item.text }))
      : [];
  }

  return (block.items || []).map(item => ({
    emoji: item.emoji,
    title: t(`${item.key}.title`),
    text: t(`${item.key}.text`),
  }));
}

function CaseBlock({ block, t, last = false }) {
  switch (block.type) {
    case 'text':
      return (
        <Text variant="p" className={block.className}>
          {t(block.key)}
        </Text>
      );

    case 'list':
      return <MarkerList className="space-y-2" items={t(block.key, [])} />;

    case 'image':
      return (
        <Image
          src={block.src}
          sources={retinaSources(block.src)}
          alt={block.alt ? t(block.alt) : ''}
          className={block.className}
          shadow={block.shadow}
        />
      );

    case 'banners':
      return (
        <div className={block.className}>
          {bannerItems(block, t).map((item, index) => (
            <Banner key={index} emoji={item.emoji} title={item.title} text={item.text} />
          ))}
        </div>
      );

    case 'feedback':
      return <FeedbackCard text={t(block.key)} />;

    case 'video':
      // paddingBottom 56.25% держит пропорцию 16:9, пока видео не загрузилось.
      return (
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            title={t(block.title)}
            src={block.src}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock;"
            frameBorder="0"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          ></iframe>
        </div>
      );

    // Колонка внутри row: своей разметки не добавляет, только ширину.
    case 'group':
      return (
        <div className={block.className}>
          <CaseBlocks blocks={block.blocks} t={t} />
        </div>
      );

    // Две колонки на широком экране, одна на узком.
    case 'row':
      return (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <CaseBlocks blocks={block.blocks} t={t} />
        </div>
      );

    case 'article':
      return (
        <Article title={block.title ? t(block.title) : undefined} last={last}>
          <CaseBlocks blocks={block.blocks} t={t} />
        </Article>
      );

    default:
      return null;
  }
}

export default function CaseBlocks({ blocks = [], t }) {
  // Признак «последняя статья в разделе» (у неё нет нижнего отступа)
  // вычисляется, а не проставляется руками в описании: раньше его писали
  // вручную, и в darts подряд оказались две статьи, помеченные как
  // последние. Критерий: индекс самого позднего блока с type === 'article'.
  const lastArticleIndex = blocks.reduce(
    (found, block, index) => (block.type === 'article' ? index : found),
    -1
  );

  return blocks.map((block, index) => (
    <CaseBlock key={index} block={block} t={t} last={index === lastArticleIndex} />
  ));
}
