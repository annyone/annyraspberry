import React from 'react';
import photo from '../images/photo.jpg';
import Text from '../components/Text';
import Image from '../components/Image';
import { useLanguage } from '../i18n/LanguageContext';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="flex flex-col p-[40px] md:p-[80px] xl:p-[140px]">
      <div className="flex flex-col xl:flex-row items-start text-left">
        {/* Заглушку на время загрузки и плавное появление рисует Image —
            здесь задаётся только размер. Раньше та же логика была написана
            в Hero второй раз, и именно её копия растягивала серый блок
            на весь экран. loading="eager": фотография видна без прокрутки. */}
        <div className="w-40 h-40 flex-shrink-0 xl:mr-12 mb-6 xl:mb-0">
          <Image
            src={photo}
            alt={t('hero.photoAlt', 'Anya')}
            className="w-40 h-40"
            loading="eager"
          />
        </div>
        <div className="w-full">
          <Text variant="hero" className="mb-4 lg:mb-6 xl:mb-8">
            {t('hero.greeting', "Hi! 🤚 I'm Anya")}
          </Text>
          <Text variant="hero">
            {t('hero.subtitle.part1', 'UI/UX designer with 11 years in IT:')}
            <span className="hidden lg:inline">
              <br />
            </span>
            {` ${t('hero.subtitle.part2', 'product design, development, testing')}`}
          </Text>
        </div>
      </div>
      <Text variant="display" className="mt-8 lg:mt-12 xl:mt-16">
        {t('hero.tagline.part1', 'I create intuitive interfaces')} <br />
        {t('hero.tagline.part2', 'for complex products 😎')}
      </Text>
    </section>
  );
}
