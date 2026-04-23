import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Main.css';

const MOVIE_GENRES = [
    { id: 28, name: "Action" }, { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" }, { id: 35, name: "Comedy" },
    { id: 80, name: "Crime" }, { id: 18, name: "Drama" },
    { id: 27, name: "Horror" }, { id: 10749, name: "Romance" },
    { id: 878, name: "Sci-Fi" }, { id: 53, name: "Thriller" }
];

const TV_GENRES = [
    { id: 10759, name: "Action & Adventure" }, { id: 35, name: "Comedy" },
    { id: 18, name: "Drama" }, { id: 80, name: "Crime" },
    { id: 16, name: "Animation" }, { id: 99, name: "Documentary" },
    { id: 10751, name: "Family" }, { id: 10765, name: "Sci-Fi & Fantasy" },
    { id: 9648, name: "Mystery" }
];

const Main = ({ type = "movie" }) => {
    const [movies, setMovies] = useState([]);
    const [topTen, setTopTen] = useState([]); // New state for Sidebar
    const [featuredMovie, setFeaturedMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('popular');
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [trailerKey, setTrailerKey] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const query = searchParams.get('query');
    const showGenresUI = searchParams.get('showGenres') === 'true';
    
    const API_KEY = import.meta.env.VITE_TMDB_KEY;
    const BASE_URL = 'https://api.themoviedb.org/3';

    const currentGenres = type === 'movie' ? MOVIE_GENRES : TV_GENRES;

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                // 1. Main Content Fetch
                let endpoint;
                if (query) {
                    endpoint = `${BASE_URL}/search/${type}?api_key=${API_KEY}&query=${query}`;
                } else if (selectedGenres.length > 0) {
                    const genreString = selectedGenres.join(',');
                    endpoint = `${BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genreString}&sort_by=popularity.desc`;
                } else {
                    endpoint = `${BASE_URL}/${type}/${category}?api_key=${API_KEY}`;
                }

                const mainRes = await axios.get(endpoint);
                setMovies(mainRes.data.results);
                if (!query && mainRes.data.results.length > 0) {
                    setFeaturedMovie(mainRes.data.results[0]);
                }

                // 2. Top 10 Sidebar Fetch (Trending for the week)
                const trendingRes = await axios.get(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
                setTopTen(trendingRes.data.results.slice(0, 10));

                setLoading(false);
            } catch (error) {
                console.error("Error:", error);
                setLoading(false);
            }
        };
        fetchContent();
    }, [category, query, type, selectedGenres, API_KEY]);

    const toggleGenre = (id) => {
        setSelectedGenres(prev => 
            prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
        );
    };

    const handleWatchTrailer = async (id) => {
        const res = await axios.get(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`);
        const trailer = res.data.results.find(v => v.type === "Trailer");
        if (trailer) { setTrailerKey(trailer.key); setShowModal(true); }
    };

    return (
        <div className="main-page">
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <iframe width="100%" height="450px" src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`} frameBorder="0" allowFullScreen title="trailer"></iframe>
                    </div>
                </div>
            )}

            {!query && featuredMovie && (
                <header className="main-hero" style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1)), url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})` }}>
                    <div className="hero-info">
                        <h1>{featuredMovie.title || featuredMovie.name}</h1>
                        <button className="play-btn" onClick={() => handleWatchTrailer(featuredMovie.id)}>▶ Watch Trailer</button>
                    </div>
                </header>
            )}

            <section className="content-container">
                <div className="layout-wrapper">
                    
                    <div className="movies-block">
                        {showGenresUI && (
                            <div className="genre-container">
                                <div className="genre-list">
                                    {currentGenres.map(genre => (
                                        <button 
                                            key={genre.id} 
                                            className={`genre-pill ${selectedGenres.includes(genre.id) ? 'active' : ''}`}
                                            onClick={() => toggleGenre(genre.id)}
                                        >
                                            {genre.name}
                                        </button>
                                    ))}
                                    {selectedGenres.length > 0 && (
                                        <button className='clear-btn' onClick={() => setSelectedGenres([])}>✕ Clear</button>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="filter-bar">
                            <h2>{query ? `Search: ${query}` : type === 'movie' ? "Movies" : "TV Series"}</h2>
                            {!query && (
                                <div className="filter-btns">
                                    <button className={category === 'popular' ? 'active' : ''} onClick={() => setCategory('popular')}>Popular</button>
                                    <button className={category === 'top_rated' ? 'active' : ''} onClick={() => setCategory('top_rated')}>Top Rated</button>
                                </div>
                            )}
                        </div>

                        <div className="movie-grid">
                            {movies.map(item => (
                                <div key={item.id} className="movie-card" onClick={() => navigate(`/${type}/${item.id}`)}>
                                    <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title || item.name} />
                                    <h3>{item.title || item.name}</h3>
                                </div>
                            ))}
                        </div>
                    </div>

                    <aside className="top-ten-sidebar">
                        <h2 className="sidebar-title">Top 10 {type === 'movie' ? 'Movies' : 'TV Shows'}</h2>
                        <div className="top-list">
                            {topTen.map((item, index) => (
                                <div key={item.id} className="top-item" onClick={() => navigate(`/${type}/${item.id}`)}>
                                    <span className="rank-number">{index + 1}</span>
                                    <img src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} alt={item.title} />
                                    <div className="top-item-info">
                                        <h4>{item.title || item.name}</h4>
                                        <p>⭐ {item.vote_average.toFixed(1)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>

                </div>
            </section>
        </div>
    );
};

export default Main;