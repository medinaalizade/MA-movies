import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Main from './pages/Main';
import MovieDetails from './pages/MovieDetails';

const isProd = import.meta.env.MODE === 'production';

function App() {
  return (
    <Router basename="/MA-movies"> 
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main" element={<Main type="movie" />} />
        <Route path="/tv" element={<Main type="tv" />} />
        <Route path="/:type/:id" element={<MovieDetails />} />
      </Routes>
    </Router>
  );
}
export default App