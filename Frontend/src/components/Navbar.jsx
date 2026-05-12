import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hook/useAuth';

const Navbar = () => {
    const user = useSelector(state => state.auth.user);
    const cart = useSelector(state => state.cart);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { handleLogout } = useAuth();

    const items = Array.isArray(cart?.items) ? cart.items : [];
    const cartCount = items.reduce((total, item) => total + (item?.quantity || 0), 0);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleNameClick = () => {
        if (user?.role === 'seller') {
            navigate('/seller/dashboard');
        }
    };

    const onLogout = async () => {
        setShowDropdown(false);
        const result = await handleLogout();
        if (result?.success) navigate('/login');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap"
                rel="stylesheet"
            />
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                
                {/* ── Search Bar ── */}
                <form onSubmit={handleSearch} className="flex-1 max-w-xs relative hidden md:block">
                    <input
                        type="text"
                        placeholder="SEARCH PIECES..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 border-none px-4 py-2 text-[10px] tracking-[0.1em] font-medium focus:ring-1 focus:ring-black/5 rounded-sm outline-none transition-all"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </form>

                {/* ── Logo ── */}
                <Link to="/" className="flex-shrink-0 text-center">
                    <h1 className="text-2xl font-semibold tracking-[0.4em] uppercase" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                        SNITCH
                    </h1>
                </Link>

                {/* ── Actions ── */}
                <div className="flex-1 flex items-center justify-end gap-6">
                    
                    {/* User Info */}
                    {user ? (
                        <div className="flex items-center gap-3">
                            {/* Name — sellers click to go to dashboard */}
                            <span 
                                onClick={handleNameClick}
                                className={`text-[10px] tracking-[0.15em] font-bold uppercase text-gray-500 hover:text-black transition-colors ${user.role === 'seller' ? 'cursor-pointer' : ''}`}
                            >
                                {user.fullname || user.name || 'ACCOUNT'}
                            </span>

                            {/* Logout dropdown toggle */}
                            <div className="relative" ref={dropdownRef}>
                                <button 
                                    onClick={() => setShowDropdown(prev => !prev)}
                                    className="flex items-center bg-transparent border-none outline-none cursor-pointer p-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 hover:text-black transition-colors">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>

                                {/* Dropdown */}
                                {showDropdown && (
                                    <div className="absolute right-0 top-full mt-2 w-36 bg-white border border-gray-100 rounded-lg shadow-lg shadow-black/8 overflow-hidden z-50"
                                        style={{ animation: 'fadeIn 0.15s ease-out' }}
                                    >
                                        <button
                                            onClick={onLogout}
                                            className="w-full text-left px-4 py-2.5 text-[10px] tracking-[0.12em] font-bold uppercase text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="text-[10px] tracking-[0.15em] font-bold uppercase text-gray-500 hover:text-black transition-colors">
                            LOGIN
                        </Link>
                    )}

                    {/* Cart Button */}
                    <Link to="/cart" className="relative group p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 group-hover:text-black transition-colors">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full scale-90 group-hover:scale-100 transition-transform">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Dropdown animation */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
