import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Section from '../components/Section';
import Text from '../components/Text';
import { useLanguage } from '../i18n/LanguageContext';

// Показывается на любом адресе, который не совпал ни с главной,
// ни с одним из маршрутов кейсов из routes.js.
export default function NotFound() {
  const { t } = useLanguage();
  const title = t('notFound.title');

  return (
    <Layout title={`${title} — ${t('site.author')}`}>
      <Section className="pt-12 gap-4" last>
        <Text variant="h1">{title}</Text>
        <Text variant="p">{t('notFound.text')}</Text>
        <Link
          to="/"
          className="text-rose-500 hover:-translate-y-0.5 inline-block transition-transform duration-150"
        >
          ← {t('notFound.back')}
        </Link>
      </Section>
    </Layout>
  );
}
