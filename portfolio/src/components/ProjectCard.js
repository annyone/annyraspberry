import React from 'react';
import Text from './Text';
import Link from './Link';

export default function ProjectCard({ project }) {
  return (
    <article className="flex flex-col md:flex-row overflow-hidden mb-8">
      {/* Text block */}
      <div className="w-[40%] flex flex-col">
        <Text variant="h3" className="mb-4">{project.title}</Text>
        <Text variant="p">{project.excerpt}</Text>
  <Link to={`/projects/${project.id}`} showLinkIcon>Подробнее</Link>
      </div>
      {/* Image block */}
      {project.thumbnail && (
        <div className="w-[60%] flex items-center justify-center p-4">
          <div className="relative w-full aspect-[16/9]">
            <img src={project.thumbnail} alt={project.title} className="rounded-2xl w-full h-full object-cover absolute top-0 left-0" />
          </div>
        </div>
      )}
    </article>
  );
}
