import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';
import projects from './data/projects.json';
import CasePage from './pages/CasePage';
import { caseDescriptions } from './routes';
import './App.css';
import { LanguageProvider } from './i18n/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Маршрут на каждый проект объявляется явно. Проект без описания
              в реестре routes.js просто не получает маршрута и попадёт
              на NotFound — вместо пустого экрана «страница недоступна». */}
          {projects.map(project => {
            const description = caseDescriptions[project.id];
            if (!description) return null;
            return (
              <Route
                key={project.id}
                path={`/${project.id}`}
                element={<CasePage project={project} description={description} />}
              />
            );
          })}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
