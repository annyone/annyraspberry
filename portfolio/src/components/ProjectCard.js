import React from 'react';
import Text from './Text';
import { Link as RouterLink } from 'react-router-dom';
import Image, { retinaSources } from './Image';
import { useLanguage } from '../i18n/LanguageContext';

export default function ProjectCard({ project }) {
  const { t } = useLanguage();
  const title = t(`projects.${project.id}.title`);
  const description = t(`projects.${project.id}.description`);

  const bg = project.thumbnailBackground;
  const isGradientOrImage = bg?.includes('gradient') || bg?.startsWith('url(');
  const backgroundStyle = bg
    ? isGradientOrImage
      ? { backgroundImage: bg }
      : { backgroundColor: bg }
    : {};

  return (
    <RouterLink
      to={`/${project.id}`}
      aria-label={`${t('projectCard.open')}: ${title}`}
      className="group block"
      style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
    >
      <article className="py-16 xl:py-24" style={backgroundStyle}>
        <div className="max-w-[1600px] mx-auto px-8 xl:px-12 flex flex-col xl:flex-row gap-8">
          {/* Text block */}
          <div className="w-full xl:w-[40%] flex flex-col">
            <Text variant="h2" className="mb-4 xl:mb-8 text-white">
              {title}
            </Text>
            <Text variant="p" className="mb-4 text-white/80">
              {description}
            </Text>

            <span
              className="self-start inline-flex items-center text-white/50 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:text-white"
              aria-hidden="true"
            >
              {t('common.more', 'Подробнее')}
            </span>
          </div>

          {/* Image block */}
          {project.thumbnail && (
            <div className="w-full xl:w-[60%] flex items-start justify-center">
              {/* Второй источник вычисляется из имени файла, а не берётся из
                  project.thumbnail_2x: у Adidas обложка в .png, поля нет, и
                  раньше в разметку уходил <source> вообще без srcset. */}
              <Image
                src={project.thumbnail}
                sources={retinaSources(project.thumbnail)}
                alt={title}
              />
            </div>
          )}
        </div>
      </article>
    </RouterLink>
  );
}
