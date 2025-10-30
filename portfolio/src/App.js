import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProjectLoader from './pages/ProjectLoader';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

function App(){
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/:id" element={<ProjectLoader/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
