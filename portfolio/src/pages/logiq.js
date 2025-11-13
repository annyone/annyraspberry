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

export default function LogiqCase(){
  const { t } = useLanguage();
  const project = projects.find(p => p.id === 'logiq');
  const title = t('projects.logiq.title', project.title);
  
  return (
    <div className="min-h-screen">
      <Nav items={getNavItems(t)} />
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
          <Text variant="h4">{t('pages.logiq.subtitle')}</Text>
        </Section>

        <Section title={t('pages.logiq.tasks.title')} className="gap-4">
          <div className="grid gap-4 grid-cols-1 xl:grid-cols-3">
            <Banner emoji="🤩" 
                    title={t('pages.logiq.tasks.simplify.title')}
                    text={t('pages.logiq.tasks.simplify.text')}
            />
            <Banner emoji="📉"
              title={t('pages.logiq.tasks.reduce.title')}
              text={t('pages.logiq.tasks.reduce.text')}
            /> 
            <Banner emoji="ℹ️" 
                    title={t('pages.logiq.tasks.increase.title')}
                    text={t('pages.logiq.tasks.increase.text')}
            />
          </div>
        </Section>

        <Section title={t('pages.logiq.what.title')} className="gap-4">
          <MarkerList
            className="space-y-2"
            items={[
              t('pages.logiq.what.items.0'),
              t('pages.logiq.what.items.1'),
              t('pages.logiq.what.items.2'),
              t('pages.logiq.what.items.3'),
              t('pages.logiq.what.items.4'),
            ]}
          />
        </Section>

        <Section title={t('pages.logiq.before.title')} className="gap-4">
          <Article>
            <Text variant="p">{t('pages.logiq.before.main')}</Text>
            <Image
              src="/images/logiq/was.webp"
              sources={[
                { srcSet: "/images/logiq/was-2x.webp", media: "(min-width: 1024px)" }
              ]}
              alt={t('pages.logiq.before.altBefore')}
              shadow
            />
          </Article>
          <Article last>
            <Text variant="p">{t('pages.logiq.before.constructor1')}</Text>
            <Text variant="p">{t('pages.logiq.before.constructor2')}</Text>
            <Image
              src="/images/logiq/2.png"
              alt={t('pages.logiq.before.altBefore')}
              className='!pb-0'
              shadow 
            />
          </Article>
        </Section>

        <Section title={t('pages.logiq.after.title')} className="gap-4">
          <Article title={t('pages.logiq.after.structure.title')}>
            <Text variant="p">{t('pages.logiq.after.structure.text')}</Text>
            <Image
              src="/images/logiq/now.webp"
              sources={[
                { srcSet: "/images/logiq/now-2x.webp", media: "(min-width: 1024px)" }
              ]}
              alt={t('pages.logiq.after.altAfter')}
              shadow
            />
          </Article>
          <Article>
            <Text variant="p">{t('pages.logiq.after.grouped')}</Text>
            <Image
              src="/images/logiq/layout.webp"
              sources={[
                { srcSet: "/images/logiq/layout-2x.webp", media: "(min-width: 1024px)" }
              ]}
              alt={t('pages.logiq.after.altAfter')}
              shadow
            />
          </Article>
          <Article title={t('pages.logiq.after.modes.title')} >
            <div className='flex flex-col lg:flex-row gap-8 items-start'>
              <div className='w-full lg:w-[35%] grid gap-2'>
                <Text variant="p">{t('pages.logiq.after.modes.text1')}</Text>
                <Text variant="p">{t('pages.logiq.after.modes.text2')}</Text>
              </div>
              <Image
                src="/images/logiq/12.gif"
                alt={t('pages.logiq.after.altAfter')}
                className='w-full lg:w-[65%]'
                shadow
              />
            </div>
            

          </Article>
        </Section>

        <Section title={t('pages.logiq.constructor.title')} className="gap-4">
          <Article>
              <Text variant="p">{t('pages.logiq.constructor.main1')}</Text>
              
              <Text variant="p">{t('pages.logiq.constructor.main2')}</Text>
            
            <Image
              src="/images/logiq/board.webp"
              sources={[
                { srcSet: "/images/logiq/board-2x.webp", media: "(min-width: 1024px)" }
              ]}
              alt={t('pages.logiq.after.altAfter')}
              shadow
            />
            </Article>
            <Article title={t('pages.logiq.constructor.fields.title')}>
              <Text variant="p">{t('pages.logiq.constructor.fields.text')}</Text>
              <Image
                src="/images/logiq/fields.webp"
                sources={[
                  { srcSet: "/images/logiq/fields-2x.webp", media: "(min-width: 1024px)" }
                ]}
                alt={t('pages.logiq.after.altAfter')}
              />
            </Article>
            <Article title={t('pages.logiq.constructor.search.title')}>
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <Image
                  src="/images/logiq/6.gif"
                  alt={t('pages.logiq.after.altAfter')}
                  className="w-full lg:w-1/2 !pb-0"
                  shadow
                />
                <Text variant="p" className="w-full lg:w-1/2">{t('pages.logiq.constructor.search.text')}</Text>
              </div>
            </Article>   
            <Article title={t('pages.logiq.constructor.sorting.title')} last>
              <Text variant="p">{t('pages.logiq.constructor.sorting.text')}</Text>
              <Image
                src="/images/logiq/sorting.webp"
                sources={[
                  { srcSet: "/images/logiq/sorting-2x.webp", media: "(min-width: 1024px)" }
                ]}
                alt={t('pages.logiq.after.altAfter')}
              />     
            </Article>
        </Section>

        <Section title={t('pages.logiq.result.title')} last className="gap-4">
          <Text variant="p">{t('pages.logiq.result.text')}</Text>
          <FeedBackCard
            text={t('pages.logiq.result.feedback1')}
          />
          <FeedBackCard
            text={t('pages.logiq.result.feedback2')}
          />
        </Section>
      </main>
    </div>
  );
}
