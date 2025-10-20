import React, { Suspense, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import projects from '../data/projects';
import Nav from '../components/Nav';
// Statically import known case pages so they are included in the main bundle
import LogiqCase from '../casepages/logiq';
import DartsCase from '../casepages/darts';

const staticPages = {
  logiq: LogiqCase,
  darts: DartsCase,
};

// Contract:
// - Input: route param `id`
// - Output: renders the custom case page component if found, shows loading or error states
// - Error modes: if project not found, show error message

export default function ProjectLoader(){
  const { id } = useParams();
  const project = projects.find(p=>p.id===id);
  const [CaseComponent, setCaseComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>{
    let mounted = true;
    async function load(){
      setIsLoading(true);
      if(!project || !project.page){
        if(mounted) setIsLoading(false);
        return;
      }
      // If we have a statically imported page, use it immediately (avoids chunk load errors on prod)
      if(staticPages[project.page]){
        if(mounted){
          setCaseComponent(()=>staticPages[project.page]);
          setIsLoading(false);
        }
        return;
      }
      try{
        // dynamic import from src/casepages/<page>.js
        const mod = await import(`../casepages/${project.page}.js`);
        if(mounted){
          setCaseComponent(()=>mod.default || null);
          setIsLoading(false);
        }
      }catch(err){
        // If import fails (module not found), show error state
        console.warn('Case page import failed for', project.page, err);
        if(mounted){
          setCaseComponent(null);
          setIsLoading(false);
        }
      }
    }
    load();
    return ()=>{ mounted = false };
  }, [id, project]);

  // Project not found
  if(!project){
    return (
      <div className="min-h-screen page-transition">
        <Nav />
        <main className="max-w-3xl mx-auto px-4 py-12">
          <h2 className="text-xl font-semibold">Project not found</h2>
          <Link to="/" className="text-indigo-600">Back home</Link>
        </main>
      </div>
    );
  }

  // Loading state - minimal, doesn't show any content to prevent flicker
  if(isLoading){
    return (
      <div className="min-h-screen page-transition" style={{opacity: 0}}>
        {/* Empty loading state to prevent flicker */}
      </div>
    );
  }

  // Render the case component
  if(CaseComponent){
    return (
      <Suspense fallback={<div className="min-h-screen" style={{opacity: 0}}></div>}>
        <div className="page-transition">
          <CaseComponent project={project} />
        </div>
      </Suspense>
    );
  }

  // Error state - case page not found
  return (
    <div className="min-h-screen page-transition">
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold">Case page not available</h2>
        <p className="mt-4 text-gray-600">This project doesn't have a detailed case study yet.</p>
        <Link to="/" className="text-indigo-600 mt-4 inline-block">← Back home</Link>
      </main>
    </div>
  );
}
