import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const { darkMode } = useContext(ThemeContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-10 px-4 py-3 bg-white dark:bg-gray-900 shadow-md"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <motion.div whileHover={{ rotate: 10 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 11H7V13H9V11ZM13 11H11V13H13V11ZM17 11H15V13H17V11Z" 
                fill={darkMode ? "#FFFFFF" : "#000000"} />
            </svg>
          </motion.div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">CineVerse</span>
        </Link>
        
        <form onSubmit={handleSubmit} className="flex-1 max-w-md mx-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-full py-2 pl-10 pr-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            />
            <button type="submit" className="absolute left-3 top-2">
              <Search size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </form>
        
        <ThemeToggle />
      </div>
    </motion.nav>
  );
};

export default Navbar;