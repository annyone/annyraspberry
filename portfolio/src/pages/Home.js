
import React from 'react';
import Nav from '../components/Nav';
import ProjectCard from '../components/ProjectCard';
import ExperienceCard from '../components/ExperienceCard';
import Subtitle from '../components/Subtitle';
import projects from '../data/projects';
import { experiences } from '../data/experiences';
import photo from '../images/photo.jpg';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main className="max-w-[1600px] w-full mx-auto">

        {/* Hero */}
        <section className="flex flex-col items-left p-[120px] my-20">
          <div className="flex items-center text-left mb-8">
            <img src={photo} alt="Аня" className="rounded-lg w-40 h-40 object-cover mr-8" />
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
        </section>

        {/* Cases */}
        <section id="cases" className="grid grid-cols-1 gap-6 my-20">
            <Subtitle>кейсы</Subtitle>
          {projects.map(p=> <ProjectCard key={p.id} project={p} />)}
        </section>


        {/* About */}
        <section id="about" className="grid grid-cols-1 gap-6 my-20">
          <Subtitle>обо мне</Subtitle>
          {experiences.map((experience, index) => (
            <ExperienceCard 
              key={index}
              dates={experience.dates}
              position={experience.position}
              company={experience.company}
              link={experience.link}
              tasks={experience.tasks}
              achievements={experience.achievements}
            />
          ))}
        </section>

      </main>
    </div>
  );
}
