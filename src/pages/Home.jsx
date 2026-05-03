import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Home.css';

const Home = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        // If text exists, search. If empty, go to main dashboard.
        if (searchQuery.trim()) {
            navigate(`/main?query=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate('/main');
        }
    };

    return (
        <div className="home-container">
            <div className="hero-overlay">
                <div className="hero-content">
                    <h1 className="hero-title">Unlimited movies, TV shows, and more</h1>
                    
                    <form className="hero-search-wrapper" onSubmit={handleSearch}>
                        <input 
                            type="text" 
                            placeholder="Search for a movie or TV show..." 
                            className="hero-input" 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                        />
                        <button type="submit" className="hero-search-btn">
                            {searchQuery.trim() ? "Search" : "Explore All"}
                        </button>
                    </form>

                    <button className="explore-btn" onClick={() => navigate('/main')}>
                        Go to main Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;