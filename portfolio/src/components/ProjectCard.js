import React from 'react';
import Text from './Text';
import Link from './Link';
import Image from './Image';

export default function ProjectCard({ project }) {
  return (
    <article className="flex flex-col xl:flex-row overflow-hidden gap-8">
      {/* Text block */}
      <div className="w-full xl:w-[40%] flex flex-col">
        <Text variant="h2" className="mb-4 xl:mb-8">{project.title}</Text>
        <Text variant="p" className="mb-4">{project.excerpt}</Text>
        <Link to={`/${project.id}`} label="Подробнее" className="self-start" />
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
