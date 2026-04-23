import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // 1. Added useNavigate
import axios from 'axios';
import '../styles/MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // 2. Initialize it
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const API_KEY = import.meta.env.VITE_TMDB_KEY;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const detailsRes = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
        setMovie(detailsRes.data);

        const videoRes = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`);
        const trailer = videoRes.data.results.find(v => v.type === "Trailer");
        setTrailerKey(trailer ? trailer.key : null);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDetails();
  }, [id]);

  if (!movie) return <div className="loader">Loading...</div>;

  return (
    <div className="details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to Movies
      </button>

      <div className="details-container">
        {/* ... (rest of your existing code stays the same) ... */}
        <div className="details-left">
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title} 
            className="detail-poster"
          />
          <div className="detail-text">
            <h1>{movie.title}</h1>
            <div className="detail-meta">
              <span className="detail-rate">⭐ {movie.vote_average.toFixed(1)}</span>
              <span className="detail-year">{movie.release_date.split('-')[0]}</span>
              <span className="detail-runtime">{movie.runtime} min</span>
            </div>
            <p className="overview">{movie.overview}</p>
          </div>
        </div>

        <div className="details-right">
          {trailerKey ? (
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="Trailer"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="no-trailer">No Trailer Available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;