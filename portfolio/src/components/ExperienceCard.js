import React from 'react';
import Text from './Text';
import MarkerList from './MarkerList';
import Link from './Link';

// Карточка получает уже локализованную запись опыта: Home читает
// t('experiences') целиком, и t() подставляет нужный язык во все вложенные
// пары { ru, en }. Обращаться к словарю ещё раз по experiences.<id>.<поле>
// нельзя — experiences в JSON это массив, а не объект с ключами по id,
// то есть такой ключ не разрешается никогда.
export default function ExperienceCard({ experience }) {
  const { dates, position, company, tasks, achievements } = experience;

  let achievementsItems = [];
  let achievementsMarker = '•';

  if (achievements && typeof achievements === 'object' && !Array.isArray(achievements)) {
    if (Array.isArray(achievements.items)) achievementsItems = achievements.items;
    if (achievements.marker) achievementsMarker = achievements.marker;
  }

  return (
    <article className="flex flex-col xl:flex-row gap-1 xl:gap-8 max-w-[1200px]">
      <div className="min-w-[120px] text-zinc-500 mb-4">{dates}</div>
      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-baseline md:gap-4">
          <Text variant="h2" className="mb-4 xl:mb-8 !mt-0">
            {position}
          </Text>
          {company && (
            <>
              {experience.link ? (
                <Link
                  href={experience.link}
                  label={company}
                  className="inline-block mb-4 xl:mb-8"
                />
              ) : (
                <span className="text-zinc-500 mb-4 xl:mb-8">{company}</span>
              )}
            </>
          )}
        </div>
        {tasks && (
          <Text variant="p" className="mb-4 mr-4">
            {tasks}
          </Text>
        )}
        <MarkerList marker={achievementsMarker} items={achievementsItems} className="space-y-2" />
      </div>
    </article>
  );
}
