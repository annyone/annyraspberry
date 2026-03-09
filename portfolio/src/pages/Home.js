import React from 'react';
import Nav from '../components/Nav';
import Section from '../components/Section';
import Hero from '../components/Hero';
import ProjectCard from '../components/ProjectCard';
import ExperienceCard from '../components/ExperienceCard';
import ArticleCard from '../components/ArticleCard';
// projects are now provided from translations
import { getNavItems } from '../data/navItems';
import { useLanguage } from '../i18n/LanguageContext';
import projects from '../data/projects';

export default function Home() {
  const { t, lang } = useLanguage();
  const localizedArticles = t('articles.items', { returnObjects: true });
  return (
    <div className="min-h-screen">
      <Nav items={getNavItems(t, lang)} />
      <main className="max-w-[1600px] w-full mx-auto pb-1">

        <Hero />

        {/* Cases */}
        <Section id="cases" subtitle={t('home.sections.cases', 'cases')}>
          {
            // Use thumbnails and page info from src/data/projects.js
            (projects || []).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          }
        </Section>


        {/* About */}
        <Section id="about" subtitle={t('home.sections.about', 'about')}>
          {
            // read experiences from translations (array) — fallback to empty array
            (t('experiences') || []).filter(e => e && e.show !== false).map((experience, index) => (
              <ExperienceCard
                key={experience.id || index}
                experience={experience}
              />
            ))
          }
        </Section>

        {/* Articles */}
        <Section id="articles" subtitle={t('home.sections.articles', 'articles')} className="!gap-6 xl:grid-cols-2" last>
          {Array.isArray(localizedArticles) && localizedArticles.map((article, i) => (
            <ArticleCard
              key={article.title || i}
              article={article}
            />
          ))}
        </Section>



      </main>
    </div>
  );
}
