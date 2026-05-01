import React, { useState } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState(""); // Track input
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    
    const isGenreOpen = searchParams.get("showGenres") === "true";

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            const searchType = location.pathname.includes('tv') ? 'tv' : 'main';
            navigate(`/${searchType}?query=${searchTerm}`);
            setSearchTerm(""); // Clear bar after search
        }
    };
 
    const toggleGenres = () => {
        const currentPath = location.pathname === "/" ? "/main" : location.pathname;
        if (isGenreOpen) {
            navigate(currentPath); 
        } else {
            navigate(`${currentPath}?showGenres=true`); 
        }
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="logo">MAmovies</Link>

                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/main">Movies</Link></li>
                    <li><Link to="/tv">TV Series</Link></li>
                    <li>
                        <button 
                            className={`nav-genre-btn ${isGenreOpen ? 'active' : ''}`} 
                            onClick={toggleGenres}
                        >
                            Genres
                        </button>
                    </li>
                </ul>

                <div className="nav-actions">
                    <form className="search-form" onSubmit={handleSearch}>
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="nav-search" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;