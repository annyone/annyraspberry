import React from 'react';
import Text from './Text';
import { Link as RouterLink } from 'react-router-dom';
import Image from './Image';
import { useLanguage } from '../i18n/LanguageContext';

export default function ProjectCard({ project }) {
  const { t } = useLanguage();
  const title = t(`projects.${project.id}.title`, project.title);
  const excerpt = t(`projects.${project.id}.excerpt`, project.excerpt);
  return (
    <RouterLink
      to={`/${project.id}`}
      aria-label={`${t('projectCard.open', 'Open')} ${title}`}
      className="group block"
    >
      <article className="flex flex-col xl:flex-row overflow-hidden gap-8">
        {/* Text block */}
        <div className="w-full xl:w-[40%] flex flex-col">
          <Text variant="h2" className="mb-4 xl:mb-8">{title}</Text>
          <Text variant="p" className="mb-4">{excerpt}</Text>

          <span
            className="self-start inline-flex items-center text-zinc-500 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:text-rose-500"
            aria-hidden="true"
          >
            {t('common.more', 'Подробнее')}
          </span>
        </div>

        {/* Image block */}
        {project.thumbnail && (
          <div className="w-full xl:w-[60%] flex items-start justify-center">

            <Image
              src={project.thumbnail}
              sources={[
                { srcSet: project.thumbnail_2x, media: "(min-width: 1024px)" }
              ]}
              backgroundColor={project.thumbnailBackground}
              alt={title}
            />
            
          </div>
        )}
      </article>
    </RouterLink>
  );
}
