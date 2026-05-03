import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const API_KEY = import.meta.env.VITE_TMDB_KEY;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const detailsRes = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
        setMovie(detailsRes.data);

        const videoRes = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`);
        const trailer = videoRes.data.results.find(v => v.type === "Trailer" || v.type === "Teaser");
        setTrailerKey(trailer ? trailer.key : null);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetails();
    window.scrollTo(0, 0);
  }, [id, API_KEY]);

  if (!movie) return <div className="loader">Loading...</div>;

  return (
    <div className="details-page">
      {/* Immersive Background */}
      <div 
        className="details-bg" 
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
      />
      
      {/* Modern Back Button */}
      <button className="modern-back-btn" onClick={() => navigate(-1)}>
        <span className="btn-icon">←</span>
        <span className="btn-text">Back to Explore</span>
      </button>

      <div className="details-container animate-fade-in">
        <div className="details-layout">
          
          {/* TOP SECTION: Poster Left, Info Right */}
          <div className="top-section">
            <div className="poster-wrapper">
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title} 
                className="detail-poster"
              />
            </div>
            
            <div className="detail-text">
              <h1 className="movie-title">{movie.title}</h1>
              <div className="detail-meta">
                <span className="badge rating">⭐ {movie.vote_average.toFixed(1)}</span>
                <span className="badge year">{movie.release_date.split('-')[0]}</span>
                <span className="badge runtime">{movie.runtime} min</span>
              </div>
              <p className="overview">{movie.overview}</p>
              <div className="detail-genres">
                {movie.genres?.map(g => (
                  <span key={g.id} className="genre-tag">{g.name}</span>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION: Trailer Full Width */}
          <div className="bottom-section">
            <h2 className="section-title">Official Trailer</h2>
            {trailerKey ? (
              <div className="video-wrapper">
                <iframe 
                  src={`https://www.youtube.com/embed/${trailerKey}?modestbranding=1&rel=0&showinfo=0`}
                  title="Trailer"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="no-trailer">
                <span>🎬 No trailer available for this title</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MovieDetails;