import React from 'react';
import photo from '../images/photo.jpg';
import Image from './Image';
import { useLanguage } from '../i18n/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section
      className="page-grid pt-10 pb-16 md:pt-14 md:pb-24 xl:pt-16 xl:pb-28"
      aria-labelledby="home-intro"
    >
      <div className="flex flex-col items-start gap-6 xl:flex-row xl:gap-12">
        <Image
          src={photo}
          alt={t('hero.photoAlt', 'Anya')}
          className="h-[180px] w-[180px] shrink-0"
          loading="eager"
        />
        <h1
          id="home-intro"
          className="min-w-0 flex-1 text-xl font-normal leading-[1.4] md:text-2xl md:leading-[1.4] lg:text-3xl lg:leading-[1.35] xl:text-4xl xl:leading-[1.3]"
        >
          {t('hero.intro')}
        </h1>
      </div>
    </section>
  );
}
