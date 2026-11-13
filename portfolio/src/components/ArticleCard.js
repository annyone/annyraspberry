import React from 'react';
import Card from './Card';
import Text from './Text';
import Link from './Link';

export default function ArticleCard({ article, className = '' }) {
  if (!article) return null;

  return (
    <Card as="article" className={`p-6 xl:p-8 ${className}`}>
      <p className="text-3xl">📰</p>
      <Text variant="h3" className="my-4 xl:my-8">
        {article.title}
      </Text>
      <Text variant="p" className="mb-4">
        {article.text}
      </Text>
      <div className="flex flex-row flex-wrap gap-4">
        {article.links &&
          article.links.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              label={link.label}
              target="_blank"
              rel="noopener noreferrer"
            />
          ))}
      </div>
    </Card>
  );
}
