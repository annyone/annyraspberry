import React from 'react';
import Link from './Link';

export default function ExperienceCard({ experience }) {
  return (
    <article className="flex flex-row gap-8 mb-8 max-w-[1200px]">
      <div className="min-w-[120px] text-zinc-500 pt-1">{experience.dates}</div>
      <div className="flex-1">
        <div className="mb-6">
          <h3 className="text-3xl font-medium inline-block mr-4">{experience.position}</h3>
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
        <div className="space-y-2">
          {experience.achievements.map((achievement, index) => (
            <div key={index} className="flex items-start gap-2">
              <p>{achievement}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}