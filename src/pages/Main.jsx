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
    const [topTen, setTopTen] = useState([]);
    const [featuredMovie, setFeaturedMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('popular');
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [trailerKey, setTrailerKey] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    // API Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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
                let endpoint;
                if (query) {
                    endpoint = `${BASE_URL}/search/${type}?api_key=${API_KEY}&query=${query}&page=${currentPage}`;
                } else if (selectedGenres.length > 0) {
                    const genreString = selectedGenres.join(',');
                    endpoint = `${BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genreString}&sort_by=popularity.desc&page=${currentPage}`;
                } else {
                    endpoint = `${BASE_URL}/${type}/${category}?api_key=${API_KEY}&page=${currentPage}`;
                }

                // 1. Fetch the data first
                const mainRes = await axios.get(endpoint);
                const results = mainRes.data.results;

                setMovies(results);
                setTotalPages(Math.min(mainRes.data.total_pages, 500));

                if (currentPage === 1 && !query && results.length > 0) {
                    const firstMovie = results[0];
                    setFeaturedMovie(firstMovie);

                    // 2. NOW preload the image because mainRes actually exists
                    if (firstMovie.backdrop_path) {
                        const backdropUrl = `https://image.tmdb.org/t/p/original${firstMovie.backdrop_path}`;
                        const img = new Image();
                        img.src = backdropUrl;
                    }
                }

                const trendingRes = await axios.get(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
                setTopTen(trendingRes.data.results.slice(0, 10));

                setLoading(false);
            } catch (error) {
                console.error("Error:", error);
                setLoading(false);
            }
        };
        fetchContent();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [category, query, type, selectedGenres, API_KEY, currentPage]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [category, query, type, selectedGenres]);

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

    // Helper to generate page numbers
    const renderPageNumbers = () => {
        const pages = [];
        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, start + 4);
        
        for (let i = start; i <= end; i++) {
            pages.push(
                <button 
                    key={i} 
                    className={currentPage === i ? 'active' : ''} 
                    onClick={() => setCurrentPage(i)}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="main-page">
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setShowModal(false)}>&times;</button>
                        <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`} frameBorder="0" allowFullScreen title="trailer"></iframe>
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
                        <div className={`genre-section-wrapper ${showGenresUI ? 'show' : ''}`}
                            style={{display: showGenresUI ? 'block' : 'none'}}>
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
                                        <button className='clear-filters-btn' onClick={() => setSelectedGenres([])}>
                                            <span>Reset Filters</span>
                                            <i className='clear-icon'>✕</i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="filter-bar">
                            <h2>{query ? `Results for: ${query}` : selectedGenres.length > 0 ? "Filtered Results" : category === 'popular' ? "Popular Movies" : "Top Rated Movies" }</h2>
                            {!query && (
                                <div className="filter-btns">
                                    <button className={category === 'popular' ? 'active' : ''} onClick={() => setCategory('popular')}>Popular</button>
                                    <button className={category === 'top_rated' ? 'active' : ''} onClick={() => setCategory('top_rated')}>Top Rated</button>
                                </div>
                            )}
                        </div>

                        <div className="movie-grid">
                            {movies.map((item, index) => (
                                <div 
                                    key={`${item.id}-${index}`} 
                                    className="movie-card" 
                                    onClick={() => navigate(`/${type}/${item.id}`)}
                                    style={{ animationDelay: `${(index % 12) * 0.05}s` }}
                                >
                                    <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt={item.title || item.name} />
                                    <div className="card-info">
                                        <h3>{item.title || item.name}</h3>
                                        <div className="card-meta">
                                            <span className="rating">⭐ {item.vote_average?.toFixed(1)}</span>
                                            <span className="year">{(item.release_date || item.first_air_date)?.split('-')[0]}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination UI */}
                        <div className="pagination">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>&lt;</button>
                            {renderPageNumbers()}
                            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>&gt;</button>
                        </div>
                    </div>

                    <aside className="top-ten-sidebar">
                        <h2 className="sidebar-title">Top 10 This Week</h2>
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