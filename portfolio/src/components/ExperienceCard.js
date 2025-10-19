import React from 'react';
import Link from './Link';

export default function ExperienceCard({ dates, position, company, link, achievements, tasks }) {
  return (
    <article className="flex flex-row gap-8 mb-8 max-w-[1200px]">
      <div className="min-w-[120px] text-zinc-500 pt-1">{dates}</div>
      <div className="flex-1">
        <div className="mb-6">
          <h3 className="text-3xl font-medium inline-block mr-4">{position}</h3>
          {company && (
            <>
              {link ? (
                <Link href={link} className="inline-block">{company}</Link>
              ) : (
                <span>{company}</span>
              )}
            </>
          )}
        </div>
        {tasks && (
          <div className="mb-6">{tasks}</div>
        )}
        <div className="space-y-2">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-start gap-2">
              <p>{achievement}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}