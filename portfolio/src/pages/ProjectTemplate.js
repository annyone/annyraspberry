import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Nav from '../components/Nav';
import projects from '../data/projects';

export default function ProjectTemplate(){
  const { id } = useParams();
  const project = projects.find(p=>p.id===id);
  if(!project){
    return (
      <div className="min-h-screen">
        <Nav />
        <main className="max-w-3xl mx-auto px-4 py-12">
          <h2 className="text-xl font-semibold">Project not found</h2>
          <Link to="/" className="text-indigo-600">Back home</Link>
        </main>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold">{project.title}</h1>
        {project.thumbnail && <img src={project.thumbnail} alt={project.title} className="w-full mt-4 rounded-md object-cover" />}
        <div className="mt-4 text-gray-700">{project.content}</div>
        <p className="mt-6"><Link to="/" className="text-indigo-600">← Back</Link></p>
      </main>
    </div>
  )
}
