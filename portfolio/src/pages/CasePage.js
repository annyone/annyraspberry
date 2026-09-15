import React from 'react';
import Layout from '../components/Layout';
import Section from '../components/Section';
import Text from '../components/Text';
import Image, { retinaSources } from '../components/Image';
import CaseBlocks from '../components/CaseBlocks';
import CaseSwitcher from '../components/CaseSwitcher';
import { useLanguage } from '../i18n/LanguageContext';

// Одна страница на все кейсы. Что именно показать, берётся из описания
// в src/data/cases/<id>.js — четыре страницы с одинаковой разметкой
// и разными данными раньше были четырьмя почти одинаковыми файлами,
// и добавление пятого кейса означало копирование полутора сотен строк.
export default function CasePage({ project, description }) {
  const { t } = useLanguage();
  const title = t(`projects.${project.id}.title`);

  // Ключи в описании записаны без общего префикса pages.<id>: он
  // подставляется здесь, поэтому блок можно перенести в другой кейс,
  // не переписывая каждую строку.
  const ct = (key, fallback) => t(`pages.${project.id}.${key}`, fallback);

  const sections = description.sections || [];

  return (
    <Layout
      title={`${title} — ${t('site.author')}`}
      mainClassName={description.mainClassName}
      showProgress
    >
      <Section className="pt-12 gap-8">
        <Text variant="h1">{title}</Text>
        <Image
          src={project.thumbnail}
          sources={retinaSources(project.thumbnail)}
          backgroundColor={project.thumbnailBackground}
          alt={title}
          loading="eager"
        />
        <Text variant="h4">{ct('subtitle')}</Text>
      </Section>

      {sections.map((section, index) => (
        <Section
          key={section.title || index}
          title={section.title ? ct(section.title) : undefined}
          className={section.className}
          // Признак последнего раздела вычисляется, а не пишется руками.
          last={index === sections.length - 1}
        >
          <CaseBlocks blocks={section.blocks} t={ct} />
        </Section>
      ))}

      <CaseSwitcher currentId={project.id} />
    </Layout>
  );
}
