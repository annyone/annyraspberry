import React, { Suspense, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import projects from '../data/projects';
import ProjectTemplate from './ProjectTemplate';
// Statically import known case pages so they are included in the main bundle
import LogiqCase from '../casepages/logiq';
import DartsCase from '../casepages/darts';

const staticPages = {
  logiq: LogiqCase,
  darts: DartsCase,
};

// Contract:
// - Input: route param `id`
// - Output: renders the custom case page component if found, otherwise falls back to ProjectTemplate
// - Error modes: if dynamic import fails, fallback to template

export default function ProjectLoader(){
  const { id } = useParams();
  const project = projects.find(p=>p.id===id);
  const [CaseComponent, setCaseComponent] = useState(null);

  useEffect(()=>{
    let mounted = true;
    async function load(){
      if(!project || !project.page){
        setCaseComponent(null);
        return;
      }
      // If we have a statically imported page, use it immediately (avoids chunk load errors on prod)
      if(staticPages[project.page]){
        setCaseComponent(()=>staticPages[project.page]);
        return;
      }
      try{
        // dynamic import from src/casepages/<page>.js
        const mod = await import(`../casepages/${project.page}.js`);
        if(mounted){
          setCaseComponent(()=>mod.default || null);
        }
      }catch(err){
        // If import fails (module not found), we keep CaseComponent null to use fallback template
        console.warn('Case page import failed for', project.page, err);
        if(mounted) setCaseComponent(null);
      }
    }
    load();
    return ()=>{ mounted = false };
  }, [id, project]);

  if(!project){
    // let ProjectTemplate render the not-found UI
    return <ProjectTemplate />;
  }

  if(CaseComponent){
    return (
      <Suspense fallback={<div className="min-h-screen"><p className="p-8">Loading case...</p></div>}>
        <CaseComponent project={project} />
      </Suspense>
    );
  }

  // Fallback to generic template
  return <ProjectTemplate />;
}
