import React from 'react';
import Text from './Text';
import MarkerList from './MarkerList';
import Link from './Link';

export default function ExperienceCard({ experience }) {
  return (
    <article className="flex flex-col xl:flex-row gap-1 xl:gap-8 max-w-[1200px]">
      <div className="min-w-[120px] text-zinc-500 mb-4">{experience.dates}</div>
      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-baseline md:gap-4">
          <Text variant="h2" className="mb-4 xl:mb-8 !mt-0">{experience.position}</Text>
          {experience.company && (
            <>
              {experience.link ? (
                <Link href={experience.link} label={experience.company} className="inline-block mb-4 xl:mb-8" />
              ) : (
                <span className="text-zinc-500 mb-4 xl:mb-8">{experience.company}</span>
              )}
            </>
          )}
        </div>
        {experience.tasks && (
          <Text variant="p" className="mb-4 mr-4">{experience.tasks}</Text>
        )}
        <MarkerList marker={experience.marker} items={experience.achievements} className="space-y-2" />
      </div>
    </article>
  );
}