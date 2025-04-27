// src/services/tmdbApi.js
const API_KEY = process.env.REACT_APP_API_KEY; // Using the API key from .env file
const BASE_URL = process.env.REACT_APP_BASE_URL; // Using the base URL from .env file

export const fetchTrendingMovies = async (page = 1) => {
    try {
      const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${page}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.results && Array.isArray(data.results)) {
        return {
          results: data.results,
          totalPages: data.total_pages || 1,
          currentPage: data.page || 1
        };
      } else {
        console.error('Unexpected API response format:', data);
        return { results: [], totalPages: 1, currentPage: 1 };
      }
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      return { results: [], totalPages: 1, currentPage: 1 };
    }
  };
  
  export const fetchMoviesByGenre = async (genreId, page = 1) => {
    try {
      const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.results && Array.isArray(data.results)) {
        return {
          results: data.results,
          totalPages: data.total_pages || 1,
          currentPage: data.page || 1
        };
      } else {
        console.error('Unexpected API response format:', data);
        return { results: [], totalPages: 1, currentPage: 1 };
      }
    } catch (error) {
      console.error(`Error fetching movies for genre ${genreId}:`, error);
      return { results: [], totalPages: 1, currentPage: 1 };
    }
  };
  
  export const fetchGenres = async () => {
    try {
      const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.genres && Array.isArray(data.genres)) {
        return data.genres;
      } else {
        console.error('Unexpected genre API response format:', data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching genres:', error);
      return [];
    }
  };
  
  export const searchMovies = async (query, page = 1) => {
    try {
      const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.results && Array.isArray(data.results)) {
        return {
          results: data.results,
          totalPages: data.total_pages || 1,
          currentPage: data.page || 1
        };
      } else {
        console.error('Unexpected API search response format:', data);
        return { results: [], totalPages: 1, currentPage: 1 };
      }
    } catch (error) {
      console.error('Error searching movies:', error);
      return { results: [], totalPages: 1, currentPage: 1 };
    }
  };
  
  export const fetchMovieDetails = async (movieId) => {
    try {
      const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos,similar`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return { notFound: true };
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching movie details for ID ${movieId}:`, error);
      return null;
    }
  };