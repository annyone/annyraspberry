
import React from 'react';
import Text from './Text';
import Link from './Link';

export default function ArticleCard({ article }) {
  return (
    <article className="gap-8 mb-8 bg-zinc-50/75 p-6 rounded-xl">
      <p className="text-3xl mb-6">📰</p>
      <Text variant="h3">{article.name}</Text>
      <Text variant="p">{article.description}</Text>
      <div className="flex flex-row flex-wrap gap-4 mt-4">
        {article.links && article.links.map((link, index) => (
          <Link
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.text}
          </Link>
        ))}
      </div>
    </article>
  );
}