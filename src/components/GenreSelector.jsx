import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchGenres } from '../services/tmdbApi';

const GenreSelector = ({ selectedGenreId, onGenreChange }) => {
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  
  useEffect(() => {
    const loadGenres = async () => {
      setIsLoading(true);
      const genreData = await fetchGenres();
      setGenres(genreData);
      setIsLoading(false);
    };
    
    loadGenres();
  }, []);
  
  // Display limited genres initially and show more when "More" is clicked
  const visibleGenres = showAll ? genres : genres.slice(0, 8);
  
  if (isLoading) {
    return (
      <div className="flex space-x-2 overflow-x-auto py-2">
        {[...Array(8)].map((_, index) => (
          <div 
            key={index}
            className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
          />
        ))}
      </div>
    );
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-6"
    >
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Genres</h2>
      <div className="flex flex-wrap gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onGenreChange(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${!selectedGenreId 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}
        >
          All
        </motion.button>
        
        {visibleGenres.map(genre => (
          <motion.button
            key={genre.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onGenreChange(genre.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${selectedGenreId === genre.id 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'}`}
          >
            {genre.name}
          </motion.button>
        ))}
        
        {genres.length > 8 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
          >
            {showAll ? 'Less' : 'More'}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default GenreSelector;
