import React from 'react';
import Text from './Text';
import MarkerList from './MarkerList';
import Link from './Link';

export default function ExperienceCard({ experience }) {
  return (
    <article className="flex flex-row gap-8 mb-8 max-w-[1200px]">
      <div className="min-w-[120px] text-zinc-500 pt-1">{experience.dates}</div>
      <div className="flex-1">
        <div>
          <Text variant="h3" className="mr-4">{experience.position}</Text>
          {experience.company && (
            <>
              {experience.link ? (
                <Link href={experience.link} className="inline-block">{experience.company}</Link>
              ) : (
                <span>{experience.company}</span>
              )}
            </>
          )}
        </div>
        {experience.tasks && (
          <div className="mb-6">{experience.tasks}</div>
        )}
        <MarkerList marker={experience.marker} items={experience.achievements} className="space-y-2" />
      </div>
    </article>
  );
}