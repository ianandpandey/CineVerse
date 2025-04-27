import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MovieCard from '../components/MovieCard';
import Navbar from '../components/Navbar';
import Pagination from '../components/Pagination';
import GenreSelector from '../components/GenreSelector';
import { fetchTrendingMovies, searchMovies, fetchMoviesByGenre } from '../services/tmdbApi';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenreId, setSelectedGenreId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  
  const fetchMovies = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      
      if (isSearching && searchQuery) {
        data = await searchMovies(searchQuery, page);
      } else if (selectedGenreId) {
        data = await fetchMoviesByGenre(selectedGenreId, page);
      } else {
        data = await fetchTrendingMovies(page);
      }
      
      setMovies(data.results || []);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setMovies([]);
      setError('An error occurred while fetching movies.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMovies(1);
  }, [selectedGenreId]);
  
  useEffect(() => {
    // When search query or genre changes, reset to page 1
    if (isSearching || selectedGenreId) {
      setCurrentPage(1);
    }
  }, [isSearching, searchQuery, selectedGenreId]);
  
  const handleSearch = async (query) => {
    setSearchQuery(query);
    setIsSearching(Boolean(query));
    setSelectedGenreId(null);
    
    try {
      setLoading(true);
      setError(null);
      
      if (query) {
        const data = await searchMovies(query, 1);
        setMovies(data.results || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(1);
      } else {
        const data = await fetchTrendingMovies(1);
        setMovies(data.results || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error('Error searching movies:', err);
      setMovies([]);
      setError('An error occurred while searching for movies.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGenreChange = (genreId) => {
    setSelectedGenreId(genreId);
    setIsSearching(false);
    setSearchQuery('');
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchMovies(page);
    
    // Scroll back to top of page when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const getContentTitle = () => {
    if (isSearching) return `Search Results: "${searchQuery}"`;
    if (selectedGenreId) {
      const genreName = document.querySelector(`button[class*="bg-blue-500"][onclick*="${selectedGenreId}"]`)?.textContent;
      return genreName ? `${genreName} Movies` : 'Movies by Genre';
    }
    return 'Trending Movies';
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar onSearch={handleSearch} />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Genre selector */}
        {!isSearching && (
          <GenreSelector 
            selectedGenreId={selectedGenreId} 
            onGenreChange={handleGenreChange} 
          />
        )}
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {getContentTitle()}
          </h1>
          
          {isSearching && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSearch('')}
              className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm"
            >
              Back to Trending
            </motion.button>
          )}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 dark:bg-gray-700 rounded-lg aspect-[2/3]"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mt-2 w-3/4"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mt-2 w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Something went wrong</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{error}</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">No movies found</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {isSearching 
                ? `No results for "${searchQuery}". Try a different search term.` 
                : selectedGenreId
                  ? 'No movies found for this genre. Try another genre.'
                  : 'Unable to load movies. Please try again later.'}
            </p>
          </div>
        ) : (
          <>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
            >
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </motion.div>
            
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Home;