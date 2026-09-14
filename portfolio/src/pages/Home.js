import React from 'react';
import Layout from '../components/Layout';
import Section from '../components/Section';
import Hero from '../components/Hero';
import ProjectCard from '../components/ProjectCard';
import ExperienceCard from '../components/ExperienceCard';
import ArticleCard from '../components/ArticleCard';
import { useLanguage } from '../i18n/LanguageContext';
import projects from '../data/projects.json';

export default function Home() {
  const { t } = useLanguage();
  const localizedArticles = t('articles.items', { returnObjects: true });
  return (
    <Layout title={t('site.title')}>
      <Hero />

      {/* Cases */}
      <Section id="cases" subtitle={t('home.sections.cases', 'cases')} className="!gap-0">
        {
          // Use thumbnails and page info from src/data/projects.json
          (projects || []).map(project => (
            <ProjectCard key={project.id} project={project} />
          ))
        }
      </Section>

      {/* About */}
      <Section id="about" subtitle={t('home.sections.about', 'about')}>
        {
          // read experiences from translations (array) — fallback to empty array
          (t('experiences') || []).map((experience, index) => (
            <ExperienceCard key={experience.id || index} experience={experience} />
          ))
        }
      </Section>

      {/* Articles */}
      <Section
        id="articles"
        subtitle={t('home.sections.articles', 'articles')}
        className="!gap-6 xl:grid-cols-2"
        last
      >
        {Array.isArray(localizedArticles) &&
          localizedArticles.map((article, i) => (
            <ArticleCard key={article.title || i} article={article} />
          ))}
      </Section>
    </Layout>
  );
}
