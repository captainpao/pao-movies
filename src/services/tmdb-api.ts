import { MoviesResponse, SearchParams, MovieDetail } from '../types/movie';

const envBackendUrl = import.meta.env.VITE_BACKEND_URL;
const BACKEND_URL = envBackendUrl === 'http://localhost:3001' ? '' : (envBackendUrl || '');
const BASE_URL = `${BACKEND_URL}/api/tmdb`;
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

class TMDBService {
  private async fetchWithErrorHandling<T>(url: string): Promise<T> {
    try {
      console.log(`Fetching URL: ${url}`);
      const response = await fetch(url);
      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched data:', data);

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
    const url = `${BASE_URL}/movie/popular?page=${page}&language=en-US`;
    return this.fetchWithErrorHandling<MoviesResponse>(url);
  }

  async getMovieById(id: number): Promise<MovieDetail> {
    const url = `${BASE_URL}/movie/${id}?language=en-US&append_to_response=credits`;
    return this.fetchWithErrorHandling<MovieDetail>(url);
  }

  async searchMovies({
    query,
    page = 1,
  }: SearchParams): Promise<MoviesResponse> {
    const encodedQuery = encodeURIComponent(query);
    const url = `${BASE_URL}/search/movie?query=${encodedQuery}&page=${page}&language=en-US&include_adult=false`;
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
