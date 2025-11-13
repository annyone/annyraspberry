import React from 'react';
import Nav from '../components/Nav';
import Text from '../components/Text';
import Section from '../components/Section';
import MarkerList from '../components/MarkerList';
import Image from '../components/Image';
import projects from '../data/projects';
import { getNavItems } from '../data/navItems';
import Article from '../components/Article';
import { useLanguage } from '../i18n/LanguageContext';

export default function DartsCase(){
  const { t } = useLanguage();
  const project = projects.find(p => p.id === 'darts');
  const title = t('projects.darts.title', project.title);
  
  return (
    <div className="min-h-screen">
      <Nav items={getNavItems(t)} />
      <main className="max-w-[1600px] w-full mx-auto">

        <Section className="pt-12 gap-8">
          <Text variant="h2">{title}</Text>
          <Image
            src={project.thumbnail}
            sources={[
              { srcSet: project.thumbnail_2x, media: "(min-width: 1024px)" }
            ]}
            backgroundColor={project.thumbnailBackground}
            alt={title}
          />
          <Text variant="h4">{t('pages.darts.subtitle')}</Text>
        </Section>

        <Section title={t('pages.darts.task.title')} className="gap-4">
          <Text variant="p">{t('pages.darts.task.text1')}</Text>
          <Text variant="p">{t('pages.darts.task.text2')}</Text>
        </Section>

        <Section title={t('pages.darts.participation.title')} className="gap-4">
          <MarkerList
            className="space-y-2"
            items={[
              t('pages.darts.participation.items.0'),
              t('pages.darts.participation.items.1'),
              t('pages.darts.participation.items.2'),
              t('pages.darts.participation.items.3'),
              t('pages.darts.participation.items.4'),
            ]}
          />
        </Section>    

        <Section title={t('pages.darts.scenarios.title')} className="gap-4">
          <Article title={t('pages.darts.scenarios.player.title')}>
            <Text variant="p">{t('pages.darts.scenarios.player.text1')}</Text>
            <Text variant="p">{t('pages.darts.scenarios.player.text2')}</Text>

            <Image
              src="/images/darts/10.gif"
              alt={t('pages.darts.scenarios.player.alt')}
              shadow
            />
          </Article>
          <Article title={t('pages.darts.scenarios.tournament.title')} last>
            <Text variant="p">{t('pages.darts.scenarios.tournament.text1')}</Text>
            <Text variant="p">{t('pages.darts.scenarios.tournament.text2')}</Text>
            <Text variant="p">{t('pages.darts.scenarios.tournament.text3')}</Text>

            <Image
              src="/images/darts/scenario.webp"
              sources={[
                { srcSet: "/images/darts/scenario-2x.webp", media: "(min-width: 1024px)" }
              ]}
              alt={t('pages.darts.scenarios.tournament.alt')}
            />
          </Article>
        </Section>


        <Section title={t('pages.darts.scalability.title')} className="gap-4">
          <Text variant="p">{t('pages.darts.scalability.text')}</Text>

          <Image
            src="/images/darts/scale.webp"
            sources={[
              { srcSet: "/images/darts/scale-2x.webp", media: "(min-width: 1024px)" }
            ]}
            alt={t('pages.darts.scalability.alt')}
          />
        </Section>

        <Section title={t('pages.darts.stages.title')} className="gap-4">
          <Text variant="p">{t('pages.darts.stages.text')}</Text>

          <Article title={t('pages.darts.stages.participants.title')}>
            <Text variant="p">{t('pages.darts.stages.participants.text')}</Text>
            <Image
              src="/images/darts/add.webp"
              sources={[
                { srcSet: "/images/darts/add-2x.webp", media: "(min-width: 1024px)" }
              ]}
              alt={t('pages.darts.stages.participants.alt')}
            />
          </Article>
          <Article title={t('pages.darts.stages.documents.title')}>
            <Text variant="p">{t('pages.darts.stages.documents.text')}</Text>
            <Image
              src="/images/darts/player.webp"
              sources={[
                { srcSet: "/images/darts/player-2x.webp", media: "(min-width: 1024px)" }
              ]}
              alt={t('pages.darts.stages.documents.alt')}
              shadow
            />
          </Article>
          <Article title={t('pages.darts.stages.groups.title')} last>
            <Text variant="p">{t('pages.darts.stages.groups.text')}</Text>
            <Image
              src="/images/darts/groups.webp"
              sources={[
                { srcSet: "/images/darts/groups-2x.webp", media: "(min-width: 1024px)" }
              ]}
              alt={t('pages.darts.stages.groups.alt')}
              shadow
            />
          </Article>
          <Article title={t('pages.darts.stages.finish.title')} last>
            <Text variant="p">{t('pages.darts.stages.finish.text')}</Text>
            <Image
              src="/images/darts/results.webp"
              sources={[
                { srcSet: "/images/darts/results-2x.webp", media: "(min-width: 1024px)" }
              ]}
              alt={t('pages.darts.stages.finish.alt')}
              shadow
            />
          </Article>
        </Section>

        <Section title={t('pages.darts.informativeness.title')} className="gap-4">
          <Text variant="p">{t('pages.darts.informativeness.text')}</Text>
          <Image
            src="/images/darts/stages.webp"
            sources={[
              { srcSet: "/images/darts/stages-2x.webp", media: "(min-width: 1024px)" }
            ]}
            alt={t('pages.darts.informativeness.alt')}
          />
        </Section>

        <Section title={t('pages.darts.familiarity.title')} className="gap-4">
          <Text variant="p">{t('pages.darts.familiarity.text')}</Text>
          <Image
            src="/images/darts/calc.webp"
            sources={[
              { srcSet: "/images/darts/calc-2x.webp", media: "(min-width: 1024px)" }
            ]}
            alt={t('pages.darts.familiarity.alt')}
          />
        </Section>

        <Section title={t('pages.darts.result.title')} className="gap-4" last>
          <Text variant="p">{t('pages.darts.result.text1')}</Text>
          <MarkerList
            className="space-y-2"
            items={[
              t('pages.darts.result.items.0'),
              t('pages.darts.result.items.1'),
              t('pages.darts.result.items.2'),
            ]}
          />
          <Text variant="p">{t('pages.darts.result.text2')}</Text>
        </Section>
      </main>
    </div>
  );
}
