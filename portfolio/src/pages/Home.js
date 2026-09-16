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
  // Второй аргумент t() — запасное значение. Для списков это всегда [],
  // чтобы при отсутствующем ключе в разметку не уехала строка ключа.
  const localizedArticles = t('articles.items', []);
  const localizedExperiences = t('experiences', []);
  return (
    <Layout title={t('site.title')} cover={<Hero />}>
      {/* Cases */}
      <Section id="cases" className="!gap-0">
        {
          // Use thumbnails and page info from src/data/projects.json
          (projects || []).map(project => (
            <ProjectCard key={project.id} project={project} />
          ))
        }
      </Section>

      {/* About */}
      <Section id="about" subtitle={t('home.sections.about', 'about')}>
        {Array.isArray(localizedExperiences) &&
          localizedExperiences.map((experience, index) => (
            <ExperienceCard key={experience.id || index} experience={experience} />
          ))}
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
