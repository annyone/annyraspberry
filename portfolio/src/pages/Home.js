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
        <Section className="flex flex-col items-left md:p-[80px] xl:p-[140px]">
          <div className="flex flex-col xl:flex-row items-start text-left">
            <img src={photo} alt="Аня" className="rounded-lg w-40 h-40 object-cover xl:mr-12 mb-6 xl:mb-0" />
            <div className="w-full">
              <div className="text-2xl font-normal mb-6">Привет! 🤚 Я — Аня</div>
              <div className="text-2xl font-normal">
                UI/UX дизайнер с 11-летним опытом в IT: <span className="hidden lg:inline"><br /></span>продуктовый дизайн, разработка, тестирование
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
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
