import React, { useState } from 'react';
import photo from '../images/photo.jpg';
import Text from '../components/Text';
import { useLanguage } from '../i18n/LanguageContext';


export default function Hero() {
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const { t } = useLanguage();

  return (
    <section className="flex flex-col items-left p-[40px] md:p-[80px] xl:p-[140px]">
      <div className="flex flex-col xl:flex-row items-start text-left">
        <div className="w-40 h-40 flex-shrink-0 xl:mr-12 mb-6 xl:mb-0">
          {!photoLoaded && (
            <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-700 rounded-lg animate-pulse" />
          )}
          <img
            src={photo}
            alt={t('hero.photoAlt', 'Anya')}
            className="rounded-lg w-40 h-40 transition-opacity duration-500"
            style={{
              opacity: photoLoaded ? 1 : 0
            }}
            onLoad={() => setPhotoLoaded(true)}
          />
        </div>
        <div className="w-full">
          <Text variant="hero" className='mb-4 lg:mb-6 xl:mb-8'>{t('hero.greeting', "Hi! 🤚 I'm Anya")}</Text>
          <Text variant="hero">
            {t('hero.subtitle.part1', 'UI/UX designer with 11 years in IT:')}
            <span className="hidden lg:inline"><br /></span>
            {` ${t('hero.subtitle.part2', 'product design, development, testing')}`}
          </Text>
        </div>
      </div>
      <Text variant="display" className='mt-8 lg:mt-12 xl:mt-16'>
        {t('hero.tagline.part1', 'I create intuitive interfaces')} <br />
        {t('hero.tagline.part2', 'for complex products 😎')}
      </Text>
    </section>
  );
}
