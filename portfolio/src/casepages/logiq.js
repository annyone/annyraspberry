import React from 'react';
import Nav from '../components/Nav';
import Subtitle from '../components/Subtitle';

export default function LogiqCase(){
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold">Редизайн основного раздела</h1>
        <Subtitle>Роль: UX / UI, исследование, прототипирование</Subtitle>
        <img src="/images/sample1.jpg" alt="Редизайн" className="w-full rounded-lg mt-6 object-cover h-96" />

        <section className="mt-8 prose max-w-none">
          <h2>Проблема</h2>
          <p>Короткое описание проблемы, которую решали. Здесь можно свободно верстать блоки, списки и таблицы.</p>

          <h2>Мой подход</h2>
          <p>Описание этапов работы: исследование, гипотезы, прототипы, тестирование.</p>

          <h2>Результаты</h2>
          <p>Качественные и количественные результаты после релиза.</p>
        </section>
      </main>
    </div>
  );
}
