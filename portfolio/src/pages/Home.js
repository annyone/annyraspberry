import React from 'react';
import Nav from '../components/Nav';
import Section from '../components/Section';
import Hero from '../components/Hero';
import ProjectCard from '../components/ProjectCard';
import ExperienceCard from '../components/ExperienceCard';
import ArticleCard from '../components/ArticleCard';
import projects from '../data/projects';
import { experiences } from '../data/experiences';
import { articles } from '../data/articles';
import { getNavItems } from '../data/navItems';
import { useLanguage } from '../i18n/LanguageContext';


export default function Home() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen">
      <Nav items={getNavItems(t)} />
      <main className="max-w-[1600px] w-full mx-auto pb-1">

        <Hero />

        {/* Cases */}
        <Section id="cases" subtitle={t('home.sections.cases', 'cases')}>
          {projects.map(p=> <ProjectCard key={p.id} project={p} />)}
        </Section>


        {/* About */}
        <Section id="about" subtitle={t('home.sections.about', 'about')}>
          {experiences.map((experience, index) => (
            <ExperienceCard 
              key={index}
              experience={experience}
            />
          ))}
        </Section>

        {/* Articles */}
        <Section id="articles" subtitle={t('home.sections.articles', 'articles')} className="!gap-6 xl:grid-cols-2" last>
            {articles.map((article, index) => (
            <ArticleCard 
              key={index}
              article={article}
            />
            ))}
        </Section>



      </main>
    </div>
  );
}
