import React, { useState } from 'react';
import photo from '../images/photo.jpg';
import Text from '../components/Text';


export default function Hero() {
  const [photoLoaded, setPhotoLoaded] = useState(false);

  return (
    <section className="flex flex-col items-left p-[40px] md:p-[80px] xl:p-[140px]">
      <div className="flex flex-col xl:flex-row items-start text-left">
        <div className="w-40 h-40 flex-shrink-0 xl:mr-12 mb-6 xl:mb-0">
          {!photoLoaded && (
            <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
          )}
          <img
            src={photo}
            alt="Аня"
            className="rounded-lg w-40 h-40 transition-opacity duration-500"
            style={{
              opacity: photoLoaded ? 1 : 0
            }}
            onLoad={() => setPhotoLoaded(true)}
          />
        </div>
        <div className="w-full">
          <Text variant="hero" className='mb-4 lg:mb-6 xl:mb-8'>Привет! 🤚 Я — Аня</Text>
          <Text variant="hero">UI/UX дизайнер с 11-летним опытом в IT: <span className="hidden lg:inline"><br /></span>продуктовый дизайн, разработка, тестирование</Text>
        </div>
      </div>
      <Text variant="display" className='mt-8 lg:mt-12 xl:mt-16'>Создаю интуитивно понятные интерфейсы <br />для сложных продуктов 😎</Text>
    </section>
  );
}
