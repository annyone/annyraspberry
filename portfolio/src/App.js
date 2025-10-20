import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProjectTemplate from './pages/ProjectTemplate';
import ProjectLoader from './pages/ProjectLoader';
import './App.css';

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/:id" element={<ProjectLoader/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
