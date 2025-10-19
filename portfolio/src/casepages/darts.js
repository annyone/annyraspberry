import React from 'react';
import Nav from '../components/Nav';
import ExperienceCard from '../components/ExperienceCard';

export default function DartsCase(){
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Система управления турнирами</h1>
          <p className="text-gray-600 mt-2">Полный цикл: от идеи до дизайн-ревью</p>
        </header>

        <section className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold">Контекст</h2>
            <p className="mt-2">Здесь можно описать задачу, требования и ограничения.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Мой вклад</h2>
            <p className="mt-2">Роль в проекте, взаимодействие с командой и ключевые решения.</p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Кейсы и артефакты</h2>
          <ExperienceCard experience={{ title: 'Пример исследования', description: 'Краткое описание исследования' }} />
        </section>
      </main>
    </div>
  );
}
