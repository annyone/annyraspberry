import React from 'react';
import Text from './Text';
import MarkerList from './MarkerList';
import Link from './Link';
import { useLanguage } from '../i18n/LanguageContext';

export default function ExperienceCard({ experience }) {
  const { t } = useLanguage();
  const keyBase = experience.id ? `experiences.${experience.id}` : null;
  const position = keyBase ? t(`${keyBase}.position`, experience.position) : experience.position;
  const company = keyBase ? t(`${keyBase}.company`, experience.company) : experience.company;
  const tasks = keyBase ? t(`${keyBase}.tasks`, experience.tasks) : experience.tasks;
  const achievements = Array.isArray(experience.achievements)
    ? experience.achievements.map((item, idx) => keyBase ? t(`${keyBase}.achievements.${idx}`, item) : item)
    : [];
  
  // Translate "н.в." to localized "now"
  const dates = experience.dates ? experience.dates.replace(/н\.в\./g, t('common.now', 'н.в.')) : experience.dates;
  
  return (
    <article className="flex flex-col xl:flex-row gap-1 xl:gap-8 max-w-[1200px]">
      <div className="min-w-[120px] text-zinc-500 mb-4">{dates}</div>
      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-baseline md:gap-4">
          <Text variant="h2" className="mb-4 xl:mb-8 !mt-0">{position}</Text>
          {company && (
            <>
              {experience.link ? (
                <Link href={experience.link} label={company} className="inline-block mb-4 xl:mb-8" />
              ) : (
                <span className="text-zinc-500 mb-4 xl:mb-8">{company}</span>
              )}
            </>
          )}
        </div>
        {tasks && (
          <Text variant="p" className="mb-4 mr-4">{tasks}</Text>
        )}
        <MarkerList marker={experience.marker} items={achievements} className="space-y-2" />
      </div>
    </article>
  );
}