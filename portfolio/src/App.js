import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProjectTemplate from './pages/ProjectTemplate';
import './App.css';

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/projects/:id" element={<ProjectTemplate/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
