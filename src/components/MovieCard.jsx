import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : '/api/placeholder/300/450';

  return (
    <motion.div
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 h-full"
    >
      <Link to={`/movie/${movie.id}`} className="block h-full">
        <div className="relative pb-[150%]">
          <img 
            src={imageUrl} 
            alt={movie.title} 
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <div className="absolute top-4 right-4 bg-yellow-500 text-black font-bold rounded-full w-10 h-10 flex items-center justify-center">
              {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
            </div>
            <h3 className="text-white font-bold text-lg leading-tight">{movie.title}</h3>
            <p className="text-gray-300 text-sm">{movie.release_date?.split('-')[0] || 'Unknown'}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;