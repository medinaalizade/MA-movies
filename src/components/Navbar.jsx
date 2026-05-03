import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [menuOpen, setMenuOpen] = useState(false);
    
    const isGenreOpen = searchParams.get("showGenres") === "true";

    // Close menu when route changes
    useEffect(() => {
        setMenuOpen(false);
    }, [location]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            const searchType = location.pathname.includes('tv') ? 'tv' : 'main';
            navigate(`/${searchType}?query=${searchTerm}`);
            setSearchTerm("");
            setMenuOpen(false);
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
        <>
            <nav className="navbar">
                <div className="nav-container">
                    <Link to="/" className="logo">MA<span>movies</span></Link>

                    {/* Desktop Search */}
                    <div className="nav-search-wrapper desktop-only">
                        <form onSubmit={handleSearch}>
                            <input 
                                type="text" 
                                placeholder="Search movies, TV shows..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </form>
                    </div>

                    <div className={`nav-menu ${menuOpen ? "open" : ""}`}>
                        <ul className="nav-links">
                            <li><Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link></li>
                            <li><Link to="/main" className={location.pathname === "/main" ? "active" : ""}>Movies</Link></li>
                            <li><Link to="/tv" className={location.pathname === "/tv" ? "active" : ""}>TV Series</Link></li>
                        </ul>
                        <button 
                            className={`nav-genre-btn ${isGenreOpen ? 'active' : ''}`} 
                            onClick={toggleGenres}
                        >
                            Genres
                        </button>
                        
                        {/* Mobile Search inside Menu */}
                        <div className="mobile-only mobile-search">
                           <form onSubmit={handleSearch}>
                                <input 
                                    type="text" 
                                    placeholder="Search..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </form>
                        </div>
                    </div>

                    <button className={`hamburger ${menuOpen ? "is-active" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
                        <span className="line"></span>
                        <span className="line"></span>
                        <span className="line"></span>
                    </button>
                </div>
            </nav>
        </>
    );
};

export default Navbar;