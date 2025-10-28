import React from 'react';
import Text from './Text';
import Link from './Link';
import Image from './Image';

export default function ProjectCard({ project }) {
  return (
    <article className="flex flex-col xl:flex-row overflow-hidden gap-8">
      {/* Text block */}
      <div className="w-full xl:w-[40%] flex flex-col">
        <Text variant="h3" className="mb-8 lg:mb-4">{project.title}</Text>
        <Text variant="p" className="mb-4">{project.excerpt}</Text>
        <Link to={`/${project.id}`} showLinkIcon className="self-start">Подробнее</Link>
      </div>
      {/* Image block */}
      {project.thumbnail && (
        <div className="w-full xl:w-[60%] flex items-start justify-center">

          <Image
            src={project.thumbnail}
            backgroundColor={project.thumbnailBackground}
            alt="alt={project.title}"
          />
          
        </div>
      )}
    </article>
  );
}
