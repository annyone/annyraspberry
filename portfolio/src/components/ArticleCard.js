
import React from 'react';
import Text from './Text';
import Link from './Link';
import { useLanguage } from '../i18n/LanguageContext';

export default function ArticleCard({ article }) {
  const { t } = useLanguage();
  const keyBase = article.id ? `articles.${article.id}` : null;
  const name = keyBase ? t(`${keyBase}.name`, article.name) : article.name;
  const description = keyBase ? t(`${keyBase}.description`, article.description) : article.description;
  return (
    <article className="bg-zinc-50/75 p-6 xl:p-8 rounded-xl dark:bg-zinc-800/60">
      <p className="text-3xl">📰</p>
      <Text variant="h3" className='my-4 xl:my-8'>{name}</Text>
      <Text variant="p" className='mb-4'>{description}</Text>
      <div className="flex flex-row flex-wrap gap-4">
        {article.links && article.links.map((link, index) => (
          <Link
            key={index}
            href={link.url}
            label={link.text}
            target="_blank"
            rel="noopener noreferrer"
          />
        ))}
      </div>
    </article>
  );
}