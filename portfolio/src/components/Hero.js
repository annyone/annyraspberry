import React from 'react';
import photo from '../images/photo.jpg';

export default function Hero() {
  return (
    <section className="flex flex-col items-left md:p-[80px] xl:p-[140px]">
      <div className="flex flex-col xl:flex-row items-start text-left">
        <img
          src={photo}
          alt="Аня"
          className="rounded-lg w-40 h-40 object-cover xl:mr-12 mb-6 xl:mb-0"
        />
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
    </section>
  );
}
