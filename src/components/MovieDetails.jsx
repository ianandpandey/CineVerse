import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Calendar, Film, Heart, DollarSign, Globe, Award, Users, Bookmark, ExternalLink } from 'lucide-react';
import { fetchMovieDetails } from '../services/tmdbApi';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const getMovieDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchMovieDetails(id);
        
        if (!data || data.notFound) {
          setError('Movie not found');
          return;
        }
        
        setMovie(data);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getMovieDetails();
    // Scroll to top when component mounts or ID changes
    window.scrollTo(0, 0);
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 px-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{error}</h2>
        <Link to="/">
          <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center">
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </button>
        </Link>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-16 bg-gray-100 dark:bg-gray-900">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Movie not found</h2>
        <Link to="/" className="mt-4 inline-block text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;
  
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/api/placeholder/300/450';

  // Format money values with commas
  const formatMoney = (amount) => {
    if (!amount) return 'N/A';
    return `$${amount.toLocaleString('en-US')}`;
  };

  // Format date for better display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate movie status (Coming Soon, Now Playing, etc.)
  const getMovieStatus = () => {
    if (!movie.release_date) return 'Unknown';
    
    const releaseDate = new Date(movie.release_date);
    const today = new Date();
    
    if (releaseDate > today) {
      return 'Coming Soon';
    } else if (movie.status === 'Released') {
      // Check if it's within last 90 days
      const daysSinceRelease = Math.floor((today - releaseDate) / (1000 * 60 * 60 * 24));
      if (daysSinceRelease <= 90) {
        return 'Now Playing';
      }
      return 'Released';
    }
    
    return movie.status || 'Released';
  };

  // Get director names
  const getDirectors = () => {
    if (!movie.credits || !movie.credits.crew) return [];
    return movie.credits.crew.filter(person => person.job === 'Director');
  };

  // Get writers (screenplay, story, etc.)
  const getWriters = () => {
    if (!movie.credits || !movie.credits.crew) return [];
    return movie.credits.crew.filter(person => 
      ['Screenplay', 'Writer', 'Story'].includes(person.job)
    );
  };

  // Get unique production countries
  const getProductionCountries = () => {
    if (!movie.production_countries) return [];
    return movie.production_countries;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 dark:bg-gray-900"
    >
      {/* Hero Section with Backdrop */}
      <div className="relative">
        {backdropUrl && (
          <div className="absolute inset-0 overflow-hidden h-96 md:h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-b from-black/70s"></div>
            <img
              src={backdropUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className={`relative z-20 max-w-7xl mx-auto px-4 pt-8 ${backdropUrl ? 'pb-32 md:pb-64' : 'pb-12'}`}>
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 mb-6 text-white bg-gray-800/80 hover:bg-gray-700 backdrop-blur-sm dark:bg-gray-700/80 px-4 py-2 rounded-full transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </motion.button>
          </Link>
          
          {/* Movie Status Badge */}
          <div className="absolute top-8 right-4 z-30">
            <span className="px-4 py-2 rounded-full bg-blue-600 text-white font-medium text-sm">
              {getMovieStatus()}
            </span>
          </div>
        </div>
      </div>
      
      {/* Movie Content */}
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className={`flex flex-col lg:flex-row gap-8 ${backdropUrl ? '-mt-24 md:-mt-48' : 'mt-8'}`}>
          {/* Poster */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-1/3 xl:w-1/4 flex-shrink-0"
          >
            <div className="rounded-lg overflow-hidden shadow-lg border-4 border-white dark:border-gray-800">
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-full h-auto"
              />
            </div>
            
            {/* Quick Stats & Actions */}
            <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Star className="text-yellow-500 mr-1" size={24} />
                  <div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">/10</span>
                    {movie.vote_count && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        from {movie.vote_count.toLocaleString()} votes
                      </div>
                    )}
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500"
                >
                  <Heart size={20} />
                </motion.button>
              </div>
              
              <div className="space-y-3">
                {movie.budget > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <DollarSign size={16} className="mr-2" />
                      <span>Budget</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{formatMoney(movie.budget)}</span>
                  </div>
                )}
                
                {movie.revenue > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <DollarSign size={16} className="mr-2" />
                      <span>Revenue</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">{formatMoney(movie.revenue)}</span>
                  </div>
                )}
                
                {movie.runtime > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <Clock size={16} className="mr-2" />
                      <span>Runtime</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                    </span>
                  </div>
                )}
                
                {movie.release_date && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <Calendar size={16} className="mr-2" />
                      <span>Release Date</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatDate(movie.release_date)}
                    </span>
                  </div>
                )}
                
                {getProductionCountries().length > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <Globe size={16} className="mr-2" />
                      <span>Country</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {getProductionCountries().map(country => country.name).join(', ')}
                    </span>
                  </div>
                )}
              </div>
              
              {movie.homepage && (
                <a 
                  href={movie.homepage} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 block w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-center font-medium flex items-center justify-center"
                >
                  <ExternalLink size={16} className="mr-2" />
                  Official Website
                </a>
              )}
            </div>
          </motion.div>
          
          {/* Details */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                {movie.title}
                {movie.release_date && (
                  <span className="text-gray-500 dark:text-gray-400 ml-2">
                    ({new Date(movie.release_date).getFullYear()})
                  </span>
                )}
              </h1>
              
              {movie.original_title && movie.original_title !== movie.title && (
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Original title: {movie.original_title}
                </div>
              )}
              
              {movie.tagline && (
                <p className="text-lg italic text-gray-600 dark:text-gray-400 mt-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                  "{movie.tagline}"
                </p>
              )}
              
              {/* Genres Pills */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {movie.genres.map(genre => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  className={`px-4 py-3 font-medium flex-1 text-center ${
                    activeTab === 'overview'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview
                </button>
                <button
                  className={`px-4 py-3 font-medium flex-1 text-center ${
                    activeTab === 'cast'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                  onClick={() => setActiveTab('cast')}
                >
                  Cast & Crew
                </button>
                <button
                  className={`px-4 py-3 font-medium flex-1 text-center ${
                    activeTab === 'details'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                  onClick={() => setActiveTab('details')}
                >
                  Details
                </button>
              </div>
              
              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div>
                    {movie.overview ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Synopsis</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                          {movie.overview}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400 italic">No overview available.</p>
                    )}
                    
                    {/* Key People */}
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key People</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Directors */}
                        {getDirectors().length > 0 && (
                          <div>
                            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                              <Film size={16} className="mr-2" />
                              Director{getDirectors().length > 1 ? 's' : ''}
                            </h4>
                            <ul className="space-y-2">
                              {getDirectors().map((director, idx) => (
                                <li key={`${director.id}-${idx}`} className="text-gray-700 dark:text-gray-300">
                                  {director.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {/* Writers */}
                        {getWriters().length > 0 && (
                          <div>
                            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                              <Film size={16} className="mr-2" />
                              Writer{getWriters().length > 1 ? 's' : ''}
                            </h4>
                            <ul className="space-y-2">
                              {getWriters().map((writer, idx) => (
                                <li key={`${writer.id}-${idx}`} className="text-gray-700 dark:text-gray-300">
                                  {writer.name} <span className="text-gray-500 dark:text-gray-400 text-sm">({writer.job})</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Production Companies */}
                    {movie.production_companies && movie.production_companies.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Production Companies</h3>
                        <div className="flex flex-wrap gap-6">
                          {movie.production_companies.map(company => (
                            <div key={company.id} className="flex items-center space-x-2">
                              {company.logo_path ? (
                                <img 
                                  src={`https://image.tmdb.org/t/p/w92${company.logo_path}`} 
                                  alt={company.name}
                                  className="h-8 object-contain bg-white rounded p-1"
                                />
                              ) : (
                                <DollarSign size={20} className="text-gray-500" />
                              )}
                              <span className="text-gray-800 dark:text-gray-200">{company.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Cast & Crew Tab */}
                {activeTab === 'cast' && (
                  <div>
                    {/* Top Cast */}
                    {movie.credits && movie.credits.cast && movie.credits.cast.length > 0 ? (
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <Users size={20} className="mr-2" />
                          Cast
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {movie.credits.cast.slice(0, 8).map(person => {
                            const profileUrl = person.profile_path
                              ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                              : '/api/placeholder/185/278';
                              
                            return (
                              <motion.div
                                key={`${person.id}-${person.cast_id}`}
                                whileHover={{ y: -5 }}
                                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700"
                              >
                                <img
                                  src={profileUrl}
                                  alt={person.name}
                                  className="w-full h-48 object-cover object-top"
                                />
                                <div className="p-3">
                                  <h3 className="font-medium text-gray-900 dark:text-white text-sm md:text-base">
                                    {person.name}
                                  </h3>
                                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1 italic">
                                    {person.character}
                                  </p>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                        
                        {movie.credits.cast.length > 8 && (
                          <p className="text-gray-600 dark:text-gray-400 mt-4 text-right">
                            +{movie.credits.cast.length - 8} more cast members
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400 italic">No cast information available.</p>
                    )}
                    
                    {/* Key Crew */}
                    {movie.credits && movie.credits.crew && movie.credits.crew.length > 0 && (
                      <div className="mt-12">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <Film size={20} className="mr-2" />
                          Key Crew
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                          {movie.credits.crew
                            .filter(person => 
                              ['Director', 'Producer', 'Executive Producer', 'Screenplay', 'Writer', 'Director of Photography', 'Original Music Composer'].includes(person.job)
                            )
                            .slice(0, 12)
                            .map((person, index) => (
                              <div key={`${person.id}-${index}`} className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                                <div className="mr-3">
                                  {person.profile_path ? (
                                    <img 
                                      src={`https://image.tmdb.org/t/p/w45${person.profile_path}`}
                                      alt={person.name}
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                      <Film size={16} className="text-gray-500 dark:text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">{person.name}</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{person.job}</p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Details Tab */}
                {activeTab === 'details' && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Additional Information</h2>
                    
                    <div className="space-y-6">
                      {/* General Info */}
                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">General</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {movie.original_language && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Original Language</h4>
                              <p className="text-gray-900 dark:text-white">
                                {new Intl.DisplayNames(['en'], {type: 'language'}).of(movie.original_language)}
                              </p>
                            </div>
                          )}
                          
                          {movie.popularity && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Popularity Score</h4>
                              <p className="text-gray-900 dark:text-white">{movie.popularity.toFixed(2)}</p>
                            </div>
                          )}
                          
                          {movie.status && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</h4>
                              <p className="text-gray-900 dark:text-white">{movie.status}</p>
                            </div>
                          )}
                          
                          {movie.adult !== undefined && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Adult Content</h4>
                              <p className="text-gray-900 dark:text-white">{movie.adult ? 'Yes' : 'No'}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Production Info */}
                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Production Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {movie.budget > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Budget</h4>
                              <p className="text-gray-900 dark:text-white">{formatMoney(movie.budget)}</p>
                            </div>
                          )}
                          
                          {movie.revenue > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</h4>
                              <p className="text-gray-900 dark:text-white">{formatMoney(movie.revenue)}</p>
                            </div>
                          )}
                          
                          {movie.production_countries && movie.production_countries.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Production Countries</h4>
                              <p className="text-gray-900 dark:text-white">
                                {movie.production_countries.map(country => country.name).join(', ')}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Dates & IDs */}
                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Dates & IDs</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {movie.release_date && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Release Date</h4>
                              <p className="text-gray-900 dark:text-white">{formatDate(movie.release_date)}</p>
                            </div>
                          )}
                          
                          {movie.id && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">TMDB ID</h4>
                              <p className="text-gray-900 dark:text-white">{movie.id}</p>
                            </div>
                          )}
                          
                          {movie.imdb_id && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">IMDB ID</h4>
                              <p className="text-gray-900 dark:text-white">
                                <a 
                                  href={`https://www.imdb.com/title/${movie.imdb_id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline"
                                >
                                  {movie.imdb_id}
                                </a>
                              </p>
                                </div>
                            )}
                            
                            {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Spoken Languages</h4>
                                <p className="text-gray-900 dark:text-white">
                                  {movie.spoken_languages.map(lang => lang.name).join(', ')}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
  
                        {/* Collection Information */}
                        {movie.belongs_to_collection && (
                          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Collection Information</h3>
                            <div className="flex items-center space-x-4">
                              {movie.belongs_to_collection.poster_path && (
                                <img
                                  src={`https://image.tmdb.org/t/p/w92${movie.belongs_to_collection.poster_path}`}
                                  alt={movie.belongs_to_collection.name}
                                  className="w-16 h-24 object-cover rounded-lg"
                                />
                              )}
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {movie.belongs_to_collection.name}
                                </p>
                                <a
                                  href={`https://www.themoviedb.org/collection/${movie.belongs_to_collection.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline text-sm"
                                >
                                  View Collection on TMDB
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
  
        {/* Recommendations Section */}
        {movie.recommendations && movie.recommendations.results.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Bookmark size={20} className="mr-2" />
              Recommended Movies
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movie.recommendations.results.slice(0, 5).map(recommendation => (
                <motion.div
                  key={recommendation.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${recommendation.poster_path}`}
                    alt={recommendation.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">
                      {recommendation.title}
                    </h3>
                    <div className="flex items-center mt-1">
                      <Star size={14} className="text-yellow-500 mr-1" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {recommendation.vote_average?.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };
  
  export default MovieDetails;