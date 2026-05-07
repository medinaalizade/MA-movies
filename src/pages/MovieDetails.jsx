import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/MovieDetails.css';

const MovieDetails = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const API_KEY = import.meta.env.VITE_TMDB_KEY;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const detailsRes = await axios.get(`https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}`);
        setMovie(detailsRes.data);

        const videoRes = await axios.get(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${API_KEY}`);
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

  const displayTitle = movie.title || movie.name;
  const displayDate = (movie.release_date || movie.first_air_date)?.split('-')[0];

  return (
    <div className="details-page">
      <div 
        className="details-bg" 
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
      />
      
      <button className="modern-back-btn" onClick={() => navigate(-1)}>
        <span className="btn-icon">←</span>
        <span className="btn-text">Back to Explore</span>
      </button>

      <div className="details-container animate-fade-in">
        <div className="details-layout">
          <div className="top-section">
            <div className="poster-wrapper">
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={displayTitle} 
                className="detail-poster"
              />
            </div>
            
            <div className="detail-text">
              <h1 className="movie-title">{displayTitle}</h1>
              <div className="detail-meta">
                <span className="badge rating">⭐ {movie.vote_average.toFixed(1)}</span>
                <span className="badge year">{displayDate}</span>
                {/* TV shows use number_of_seasons instead of runtime */}
                <span className="badge runtime">
                   {movie.runtime ? `${movie.runtime} min` : `${movie.number_of_seasons} Seasons`}
                </span>
              </div>
              <p className="overview">{movie.overview}</p>
              <div className="detail-genres">
                {movie.genres?.map(g => (
                  <span key={g.id} className="genre-tag">{g.name}</span>
                ))}
              </div>
            </div>
          </div>

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