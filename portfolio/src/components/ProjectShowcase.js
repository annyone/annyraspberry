import React from 'react';
import { Link, useViewTransitionState } from 'react-router-dom';
import Image, { retinaSources } from './Image';
import usePointerHover from './usePointerHover';
import { useLanguage } from '../i18n/LanguageContext';
import { caseTransitionNames } from '../data/viewTransitions';
import { useCaseTransitionBackground } from '../data/useCaseTransitionBackground';
import { arrangeProjects, homeProjects } from '../data/homeProjects';
import './ProjectShowcase.css';

const palettes = {
  axelnac: ['#a36bfa', '#f29cdd', '#6055e8'],
  logiq: ['#388bfa', '#76e4ed', '#7466ef'],
  darts: ['#26a973', '#b7e77b', '#40c9c0'],
  adidas: ['#d34ce9', '#9290ff', '#f693c9'],
};

function ProjectTile({ project, featured = false }) {
  const { t } = useLanguage();
  const to = `/${project.id}`;
  const isTransitioning = useViewTransitionState(to);
  const names = caseTransitionNames(isTransitioning);
  useCaseTransitionBackground(project, isTransitioning);
  const title = t(`projects.${project.id}.title`);
  const colors = palettes[project.id] || palettes.axelnac;

  return (
    <Link
      to={to}
      viewTransition
      className={`project-tile${featured ? ' project-tile--featured' : ''}`}
      aria-label={`${t('projectCard.open')}: ${title}`}
      style={{ '--glow-a': colors[0], '--glow-b': colors[1], '--glow-c': colors[2] }}
    >
      <article className="project-tile__body">
        <span aria-hidden="true" className={`project-tile__background ${names.background}`}>
          <span className="project-tile__flow">
            <span className="project-tile__light" />
            <span className="project-tile__light project-tile__light--two" />
            <span className="project-tile__light project-tile__light--three" />
          </span>
        </span>
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
  const showcaseRef = usePointerHover();
  const { featured, primary, rest } = arrangeProjects(projects, homeProjects.featuredId);
  return (
    <div className="project-showcase" ref={showcaseRef}>
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
