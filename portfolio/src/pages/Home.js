
import React from 'react';
import Nav from '../components/Nav';
import Section from '../components/Section';
import ProjectCard from '../components/ProjectCard';
import ExperienceCard from '../components/ExperienceCard';
import ArticleCard from '../components/ArticleCard';
import projects from '../data/projects';
import { experiences } from '../data/experiences';
import { articles } from '../data/articles';
import photo from '../images/photo.jpg';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="max-w-[1600px] w-full mx-auto">

        {/* Hero */}
        <Section className="flex flex-col items-left p-[140px]">
          <div className="flex items-center text-left mb-8">
            <img src={photo} alt="Аня" className="rounded-lg w-40 h-40 object-cover mr-12" />
            <div>
                <div className="text-2xl font-normal mb-6">Привет! Я — Аня</div>
                <div className="text-2xl font-normal">
                    UI/UX дизайнер с 11-летним опытом в IT:<br />продуктовый дизайн, разработка, тестирование
                </div>
            </div>
          </div>
          <div className="text-5xl leading-tight mt-8">
            Создаю интуитивно понятные интерфейсы<br />для сложных продуктов 😎
          </div>
        </Section>

        {/* Cases */}
        <Section id="cases" className="grid grid-cols-1" title="кейсы">
          {projects.map(p=> <ProjectCard key={p.id} project={p} />)}
        </Section>


        {/* About */}
        <Section id="about" className="grid grid-cols-1" title="обо мне">
          {experiences.map((experience, index) => (
            <ExperienceCard 
              key={index}
              experience={experience}
            />
          ))}
        </Section>

        {/* Articles */}
        <Section id="articles" title="статьи">
          <div className="grid grid-cols-2 gap-6">
            {articles.map((article, index) => (
            <ArticleCard 
              key={index}
              article={article}
            />
            ))}
          </div>
        </Section>



      </main>
    </div>
  );
}
