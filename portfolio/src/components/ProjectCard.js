import React from 'react';
import Text from './Text';
import Link from './Link';

export default function ProjectCard({ project }) {
  return (
    <article className="flex flex-col xl:flex-row overflow-hidden gap-8">
      {/* Text block */}
      <div className="w-full xl:w-[40%] flex flex-col">
        <Text variant="h3" className="mb-4">{project.title}</Text>
        <Text variant="p">{project.excerpt}</Text>
        <Link to={`/${project.id}`} showLinkIcon className="self-start">Подробнее</Link>
      </div>
      {/* Image block */}
      {project.thumbnail && (
        <div className="w-full xl:w-[60%] flex items-start justify-center">
          <div className="relative w-full aspect-[16/9]">
            <img src={project.thumbnail} alt={project.title} className="rounded-2xl w-full h-full object-cover absolute top-0 left-0" />
          </div>
        </div>
      )}
    </article>
  );
}
