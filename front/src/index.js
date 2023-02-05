import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Forum from './Pages/Forum/Forum';
import Community from './Pages/Community/Community';
import Error404 from './Pages/Error404/Error404';
import SignUp from './Pages/SignUp/SignUp';


const root = document.getElementById('root');

createRoot(root).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/forum" element={ <Forum /> } />
        <Route path="/community" element={ <Community /> } />
        <Route path="/signup" element={ <SignUp /> } />
        <Route path='*' element={ <Error404 /> } />
      </Routes>
    </Router>
  </React.StrictMode>
);