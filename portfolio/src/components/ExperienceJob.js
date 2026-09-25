import React from 'react';
import Text, { variants } from './Text';
import MarkerList from './MarkerList';
import Link from './Link';
import CompanyLogo from './CompanyLogo';
import TagList from './TagList';
import { formatPeriod } from '../data/experienceDates';
import { useLanguage } from '../i18n/LanguageContext';

// Одно место работы внутри роли. Получает уже локализованную запись:
// Home читает t('experiences') целиком, и t() подставляет язык во все
// вложенные пары { ru, en }.
//
// Сетка из двух колонок: логотип и всё остальное. Описание, достижения
// и теги инструментов стоят во второй колонке — их левый край совпадает с названием компании.
// На экранах уже 768px отступ под логотип съедал бы строку, поэтому там
// текст занимает обе колонки.
export default function ExperienceJob({ job }) {
  const { t } = useLanguage();
  const { company, logo, link, description, achievements, tools } = job;

  const period = formatPeriod(job, {
    months: t('experience.months', []),
    monthsSince: t('experience.monthsSince', []),
    since: t('experience.since', ''),
  });

  const items = Array.isArray(achievements) ? achievements : [];
  const toolList = Array.isArray(tools) ? tools : [];
  const hasBody = Boolean(description) || items.length > 0 || toolList.length > 0;

  return (
    <article className="grid grid-cols-[1.75rem_1fr] gap-x-6 gap-y-4">
      <CompanyLogo src={logo} name={company} />

      <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1 self-center">
        <h4 className="text-lg font-medium xl:text-xl">
          {link ? (
            <Link
              href={link}
              label={company}
              className="!text-inherit hover:!text-rose-500"
              // Сайт компании — чужой ресурс, поэтому открывается в новой
              // вкладке. rel обязателен: без noopener открытая страница
              // получает доступ к window.opener и может подменить вкладку,
              // из которой её открыли.
              target="_blank"
              rel="noopener noreferrer"
            />
          ) : (
            company
          )}
        </h4>
        <span className="text-zinc-500 lining-nums">{period}</span>
      </header>

      {hasBody && (
        <div className="col-span-2 max-w-3xl space-y-4 md:col-span-1 md:col-start-2">
          {description && <Text variant="p">{description}</Text>}
          {items.length > 0 && (
            <MarkerList
              items={items}
              className={`space-y-2 xl:space-y-3 ${variants.p.className}`}
            />
          )}
          {/* Отступ над тегами — тот же space-y-4 (16px), что между
              названием компании и описанием (gap-y-4 у сетки). */}
          <TagList items={toolList} label={t('experience.tools', '')} />
        </div>
      )}
    </article>
  );
}
