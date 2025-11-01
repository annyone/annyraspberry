import React from 'react';
import Text from './Text';
import { Link as RouterLink } from 'react-router-dom';
import Image from './Image';

export default function ProjectCard({ project }) {
  return (
    <RouterLink
      to={`/${project.id}`}
      aria-label={`Перейти к ${project.title}`}
      className="group block"
    >
      <article className="flex flex-col xl:flex-row overflow-hidden gap-8">
        {/* Text block */}
        <div className="w-full xl:w-[40%] flex flex-col">
          <Text variant="h2" className="mb-4 xl:mb-8">{project.title}</Text>
          <Text variant="p" className="mb-4">{project.excerpt}</Text>

          <span
            className="self-start inline-flex items-center text-zinc-500 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:text-rose-500"
            aria-hidden="true"
          >
            Подробнее
          </span>
        </div>

        {/* Image block */}
        {project.thumbnail && (
          <div className="w-full xl:w-[60%] flex items-start justify-center">

            <Image
              src={project.thumbnail}
              backgroundColor={project.thumbnailBackground}
              alt={`alt=${project.title}`}
            />
            
          </div>
        )}
      </article>
    </RouterLink>
  );
}
