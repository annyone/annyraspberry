import React from 'react';
import photo from '../images/photo.jpg';
import Text from '../components/Text';


export default function Hero() {
  return (
    <section className="flex flex-col items-left p-[40px] md:p-[80px] xl:p-[140px]">
      <div className="flex flex-col xl:flex-row items-start text-left">
        <img
          src={photo}
          alt="Аня"
          className="rounded-lg w-40 h-40 object-cover xl:mr-12 mb-6 xl:mb-0"
        />
        <div className="w-full">
          <Text variant="hero" className='mb-4 lg:mb-6 xl:mb-8'>Привет! 🤚 Я — Аня</Text>
          <Text variant="hero">UI/UX дизайнер с 11-летним опытом в IT: <span className="hidden lg:inline"><br /></span>продуктовый дизайн, разработка, тестирование</Text>
        </div>
      </div>
      <Text variant="display" className='mt-8 lg:mt-12 xl:mt-16'>Создаю интуитивно понятные интерфейсы <br />для сложных продуктов 😎</Text>
    </section>
  );
}
