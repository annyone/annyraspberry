import React from 'react';
import Nav from '../components/Nav';
import Text from '../components/Text';
import Banner from '../components/Banner';
import Section from '../components/Section';
import MarkerList from '../components/MarkerList';
import Image from '../components/Image';
import projects from '../data/projects';
import FeedBackCard from '../components/FeedBackCard';
import { getNavItems } from '../data/navItems';
import Article from '../components/Article';
import { useLanguage } from '../i18n/LanguageContext';

export default function AxelNacCase(){
  const { t, lang } = useLanguage();
  const project = projects.find(p => p.id === 'axelnac');
  const title = t(`projects.${project.id}.title`, project.title);
  const tasks = t('pages.axelnac.tasks.items', { returnObjects: true });
  const done = t('pages.axelnac.done.items', { returnObjects: true });
  
  return (
    <div className="min-h-screen">
  <Nav items={getNavItems(t, lang)} />
      <main className="max-w-[1600px] w-full mx-auto pb-1">

        <Section className="pt-12 gap-8">
          <Text variant="h1">{title}</Text>
          <Image
            src={project.thumbnail}
            sources={[
              { srcSet: project.thumbnail_2x, media: "(min-width: 1024px)" }
            ]}
            backgroundColor={project.thumbnailBackground}
            alt={title}
          />
          <Text variant="h4">{t('pages.axelnac.subtitle')}</Text>
        </Section>

        <Section title={t('pages.axelnac.tasks.title')} className="gap-4">
          <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
            {Array.isArray(tasks) && tasks.map((task, i) => (
              <Banner
                key={i}
                emoji={task.icon}
                title={task.title}
                text={task.text}
              />
            ))}
          </div>
        </Section>

        <Section title={t('pages.axelnac.done.title')} className="gap-4">
          <MarkerList
            className="space-y-2"
            items={done}
          />
        </Section>

        <Section title={t('pages.axelnac.before.title')} className="gap-4">
          <Article>
            <Text variant="p">{t('pages.axelnac.before.1')}</Text>
            <Image
              src="/images/axelnac/step1.webp"
              sources={[
                { srcSet: "/images/axelnac/step1-2x.webp", media: "(min-width: 1024px)" }
              ]}
              alt={t('pages.axelnac.before.altBefore')}
              shadow
            />
          </Article>
            <Article last>
            <Text variant="p">{t('pages.axelnac.before.2')}</Text>
            <Image
              src="/images/axelnac/step2.webp"
              sources={[
                { srcSet: "/images/axelnac/step2-2x.webp", media: "(min-width: 1024px)" }
              ]}
              alt={t('pages.axelnac.before.altBefore')}
              shadow
            />
          </Article>
        </Section>

        <Section title={t('pages.axelnac.after.title')} className="gap-4">
          <Article>
            <Text variant="p">{t('pages.axelnac.after.1')}</Text>
            <Image
              src="/images/axelnac/empty.webp"
              sources={[
                { srcSet: "/images/axelnac/empty-2x.webp", media: "(min-width: 1024px)" }
              ]}
              alt={t('pages.axelnac.before.altBefore')}
              shadow
            />
          </Article>
          <Article>
            <Text variant="p">{t('pages.axelnac.after.2')}</Text>
            <Image
              src="/images/axelnac/started.webp"
              sources={[
                { srcSet: "/images/axelnac/started-2x.webp", media: "(min-width: 1024px)" }
              ]}
              alt={t('pages.axelnac.before.altBefore')}
              shadow
            />
          </Article>
          <Article>
            <div className='flex flex-col lg:flex-row gap-8 items-start'>
              <div className='w-full lg:w-[55%] grid gap-2'>
                <Text variant="p">{t('pages.axelnac.after.3')}</Text>
              </div>
              <Image
                src="/images/axelnac/actions.webp"
                sources={[
                  { srcSet: "/images/axelnac/actions-2x.webp", media: "(min-width: 1024px)" }
                ]}
                alt={t('pages.axelnac.after.altAfter')}
                shadow
              />
            </div>
          </Article>
        </Section>
        <Section title={t('pages.axelnac.result.title')} last className="gap-4">
          <Text variant="p">{t('pages.axelnac.result.1')}</Text>
        </Section>
      </main>
    </div>
  );
}
