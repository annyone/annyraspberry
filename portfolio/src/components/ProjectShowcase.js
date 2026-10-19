import React from 'react';
import { Link, useViewTransitionState } from 'react-router-dom';
import Image, { retinaSources } from './Image';
import { useLanguage } from '../i18n/LanguageContext';
import { projectBackground } from '../data/projectBackground';
import { caseTransitionNames } from '../data/viewTransitions';
import { useCaseTransitionBackground } from '../data/useCaseTransitionBackground';
import { arrangeProjects, homeProjects } from '../data/homeProjects';
import './ProjectShowcase.css';

function ProjectTile({ project, featured = false }) {
  const { t } = useLanguage();
  const to = `/${project.id}`;
  const isTransitioning = useViewTransitionState(to);
  const names = caseTransitionNames(isTransitioning);
  useCaseTransitionBackground(project, isTransitioning);
  const title = t(`projects.${project.id}.title`);

  return (
    <Link
      to={to}
      viewTransition
      className={`project-tile${featured ? ' project-tile--featured' : ''}`}
      aria-label={`${t('projectCard.open')}: ${title}`}
    >
      <article className="project-tile__body">
        <span
          aria-hidden="true"
          className={`project-tile__background ${names.background}`}
          style={projectBackground(project.background)}
        />
        <div className="project-tile__heading">
          <h2 className={`case-project-title ${names.title}`}>{title}</h2>
        </div>
        {/* Полные описания сохранены в словаре; в сетке показываем только заголовки. */}
        <div className={`project-tile__visual ${names.thumbnail}`}>
          <Image
            src={project.thumbnail}
            sources={retinaSources(project.thumbnail)}
            alt={title}
            loading={featured ? 'eager' : 'lazy'}
          />
        </div>
      </article>
    </Link>
  );
}

function CompactProject({ project }) {
  const { t } = useLanguage();
  // Пока нет страницы, карточка намеренно не является ссылкой.
  return (
    <article className={`compact-project compact-project--${project.tone}`}>
      <span className="compact-project__symbol" aria-hidden="true">
        {project.symbol}
      </span>
      <div>
        <h2>{t(`showcase.${project.id}.title`)}</h2>
      </div>
    </article>
  );
}

export default function ProjectShowcase({ projects }) {
  const { featured, primary, rest } = arrangeProjects(projects, homeProjects.featuredId);
  return (
    <div className="project-showcase">
      {featured && <ProjectTile project={featured} featured />}
      {(primary || homeProjects.compact.length > 0) && (
        <div
          className={`project-showcase__mixed${primary && homeProjects.compact.length ? '' : ' project-showcase__mixed--compact'}`}
        >
          {primary && <ProjectTile project={primary} />}
          {homeProjects.compact.length > 0 && (
            <div className="project-showcase__compact">
              {homeProjects.compact.map(project => (
                <CompactProject key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      )}
      {rest.length > 0 && (
        <div className="project-showcase__rest">
          {rest.map(project => (
            <ProjectTile key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
