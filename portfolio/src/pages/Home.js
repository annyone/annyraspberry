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
import navItems from '../data/navItems';


export default function Home() {
  return (
    <div className="min-h-screen">
      <Nav items={navItems} />
      <main className="max-w-[1600px] w-full mx-auto pb-1">

        <Hero />

        {/* Cases */}
        <Section id="cases" subtitle="кейсы">
          {projects.map(p=> <ProjectCard key={p.id} project={p} />)}
        </Section>


        {/* About */}
        <Section id="about" subtitle="обо мне">
          {experiences.map((experience, index) => (
            <ExperienceCard 
              key={index}
              experience={experience}
            />
          ))}
        </Section>

        {/* Articles */}
        <Section id="articles" subtitle="статьи" className="!gap-6 xl:grid-cols-2" last>
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
