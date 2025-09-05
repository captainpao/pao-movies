import { MoviesResponse, SearchParams } from '../types/movie';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

if (!API_KEY || API_KEY === 'your_tmdb_api_key_here') {
  throw new Error(
    'TMDB API key is not configured. Please set VITE_TMDB_API_KEY in your .env file'
  );
}

class TMDBService {
  private async fetchWithErrorHandling<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.errors) {
        throw new Error(data.errors.join(', '));
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`TMDB API Error: ${error.message}`);
      }
      throw new Error('Unknown error occurred while fetching data from TMDB');
    }
  }

  async getPopularMovies(page: number = 1): Promise<MoviesResponse> {
    const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}&language=en-US`;
    return this.fetchWithErrorHandling<MoviesResponse>(url);
  }

  async searchMovies({
    query,
    page = 1,
  }: SearchParams): Promise<MoviesResponse> {
    const encodedQuery = encodeURIComponent(query);
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodedQuery}&page=${page}&language=en-US&include_adult=false`;
    return this.fetchWithErrorHandling<MoviesResponse>(url);
  }

  getMoviePosterUrl(posterPath: string | null, size: string = 'w500'): string {
    if (!posterPath) {
      return '/placeholder-movie-poster.jpg';
    }
    return `${IMAGE_BASE_URL}/${size}${posterPath}`;
  }

  getMovieBackdropUrl(
    backdropPath: string | null,
    size: string = 'w1280'
  ): string {
    if (!backdropPath) {
      return '/placeholder-backdrop.jpg';
    }
    return `${IMAGE_BASE_URL}/${size}${backdropPath}`;
  }
}

export const tmdbService = new TMDBService();
