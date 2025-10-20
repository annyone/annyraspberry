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
// photo is now handled inside Hero component

export default function Home() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="max-w-[1600px] w-full mx-auto">

        <Hero />

        {/* Cases */}
        <Section id="cases" title="кейсы">
          {projects.map(p=> <ProjectCard key={p.id} project={p} />)}
        </Section>


        {/* About */}
        <Section id="about" title="обо мне">
          {experiences.map((experience, index) => (
            <ExperienceCard 
              key={index}
              experience={experience}
            />
          ))}
        </Section>

        {/* Articles */}
        <Section id="articles" title="статьи" className="!gap-6 xl:grid-cols-2">
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
