import React from 'react';
import Link from './Link';

export default function ProjectCard({ project }) {
  return (
    <article className="flex flex-col md:flex-row overflow-hidden mb-8">
      {/* Text block */}
      <div className="w-[40%] flex flex-col">
        <h3 className="text-3xl font-medium mb-4">{project.title}</h3>
        <p className="mb-8">{project.excerpt}</p>
        <Link to={`/projects/${project.id}`}>Подробнее</Link>
      </div>
      {/* Image block */}
      {project.thumbnail && (
        <div className="w-[60%] flex items-center justify-center p-4">
          <img src={project.thumbnail} alt={project.title} className="rounded-2xl w-full h-80 object-cover" />
        </div>
      )}
    </article>
  );
}
