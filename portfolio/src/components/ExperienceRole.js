import React from 'react';
import Text from './Text';
import ExperienceJob from './ExperienceJob';
import { formatYears, roleYears } from '../data/experienceDates';
import { useLanguage } from '../i18n/LanguageContext';

// Группа опыта по роли: заголовок «Продуктовый дизайнер · 4 года» и под ним
// места работы, от последнего к первому — в том порядке, в каком они
// записаны в experiences.json. Стаж считается по датам мест работы
// (roleYears), руками его не пишут.
//
// now нужен только тестам: стаж текущей роли зависит от сегодняшней даты.
export default function ExperienceRole({ experience, now }) {
  const { t, lang } = useLanguage();
  const { role, jobs } = experience;
  const list = Array.isArray(jobs) ? jobs : [];
  const years = roleYears(list, now);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-baseline gap-x-4 gap-y-1 xl:mb-10">
        <Text variant="h3">{role}</Text>
        {years > 0 && (
          <span className="text-zinc-500 lining-nums md:text-lg">
            {formatYears(years, lang, t('experience.years', {}))}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-10 xl:gap-12">
        {list.map((job, index) => (
          <ExperienceJob key={job.id || index} job={job} />
        ))}
      </div>
    </div>
  );
}
