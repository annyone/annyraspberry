
import React from 'react';
import Text from './Text';
import Link from './Link';

export default function ArticleCard({ article, className = '' }) {
  if (!article) return null;

  const title = article.name || article.title;
  const text = article.description || article.text;

  return (
    <article className={`bg-zinc-50/75 p-6 xl:p-8 rounded-xl dark:bg-zinc-800/60 ${className}`}>
      <p className="text-3xl">📰</p>
      <Text variant="h3" className='my-4 xl:my-8'>{title}</Text>
      <Text variant="p" className='mb-4'>{text}</Text>
      <div className="flex flex-row flex-wrap gap-4">
        {article.links && article.links.map((link, index) => (
          <Link
            key={index}
            href={link.url}
            label={link.text || link.label}
            target="_blank"
            rel="noopener noreferrer"
          />
        ))}
      </div>
    </article>
  );
}