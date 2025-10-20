import React from 'react';
import Text from './Text';
import MarkerList from './MarkerList';
import Link from './Link';

export default function ExperienceCard({ experience }) {
  return (
    <article className="flex flex-col xl:flex-row gap-1 xl:gap-8 max-w-[1200px]">
      <div className="min-w-[120px] text-zinc-500 mb-4">{experience.dates}</div>
      <div className="flex-1">
        <div className="flex flex-col xl:inline">
          <Text variant="h3" className="xl:mr-4 !mt-0">{experience.position}</Text>
          {experience.company && (
            <>
              {experience.link ? (
                <Link href={experience.link} className="inline-block">{experience.company}</Link>
              ) : (
                <span className="text-zinc-500">{experience.company}</span>
              )}
            </>
          )}
        </div>
        {experience.tasks && (
          <Text variant="p" className="mr-4">{experience.tasks}</Text>
        )}
        <MarkerList marker={experience.marker} items={experience.achievements} className="space-y-2" />
      </div>
    </article>
  );
}