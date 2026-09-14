import React from 'react';
import Layout from '../../components/Layout';
import Text from '../../components/Text';
import Section from '../../components/Section';
import Image from '../../components/Image';
import FeedbackCard from '../../components/FeedbackCard';
import Article from '../../components/Article';
import { useLanguage } from '../../i18n/LanguageContext';

export default function AdidasCase({ project }) {
  const { t } = useLanguage();
  const title = t('projects.adidas.title');

  return (
    <Layout title={`${title} — ${t('site.author')}`}>
      <Section className="pt-12 gap-8">
        <Text variant="h1">{title}</Text>
        <Image src={project.thumbnail} backgroundColor={project.thumbnailBackground} alt={title} />
        <Text variant="h4">{t('pages.adidas.subtitle')}</Text>
      </Section>

      <Section title={t('pages.adidas.task.title')} className="gap-4">
        <Text variant="p">{t('pages.adidas.task.text')}</Text>
      </Section>

      <Section title={t('pages.adidas.concept.title')} className="gap-4">
        <Article>
          <Text variant="p">{t('pages.adidas.concept.main1')}</Text>
          <Text variant="p">{t('pages.adidas.concept.main2')}</Text>
          <Text variant="p">{t('pages.adidas.concept.main3')}</Text>
        </Article>
        <Article title={t('pages.adidas.concept.ai.title')}>
          <Text variant="p">{t('pages.adidas.concept.ai.text')}</Text>
        </Article>
        <Article title={t('pages.adidas.concept.ar.title')} last>
          <Text variant="p">{t('pages.adidas.concept.ar.text')}</Text>
        </Article>
      </Section>

      <Section title={t('pages.adidas.result.title')} className="gap-4">
        <Article title={t('pages.adidas.result.landing.title')}>
          <Text variant="p">{t('pages.adidas.result.landing.text')}</Text>
          <Image src="/images/adidas/1.png" alt={t('pages.adidas.result.landing.alt')} />
        </Article>

        <Article title={t('pages.adidas.result.outfit.title')}>
          <Text variant="p">{t('pages.adidas.result.outfit.text')}</Text>
          <Image src="/images/adidas/2.png" alt={t('pages.adidas.result.landing.alt')} />
        </Article>

        <Article title={t('pages.adidas.result.specs.title')}>
          <Text variant="p">{t('pages.adidas.result.specs.text')}</Text>
          <Image src="/images/adidas/3.png" alt={t('pages.adidas.result.landing.alt')} />
        </Article>

        <Article title={t('pages.adidas.result.animation.title')} last>
          <Text variant="p">{t('pages.adidas.result.animation.text')}</Text>

          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              title={t('pages.adidas.result.animation.videoTitle')}
              src="https://kinescope.io/embed/cmjUG9xfXuJy1kFNc8D3ZT"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock;"
              frameBorder="0"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
          </div>
        </Article>
      </Section>

      <Section title={t('pages.adidas.feedback.title')} last className="gap-4">
        <FeedbackCard text={t('pages.adidas.feedback.text1')} />
        <FeedbackCard text={t('pages.adidas.feedback.text2')} />
      </Section>
    </Layout>
  );
}
