import { MoviesResponse, SearchParams, MovieDetail } from '../types/movie';
import { TMDB_API_URL } from '../config/api';

const BASE_URL = TMDB_API_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

export const PLACEHOLDER_POSTER = '/placeholder-movie-poster.jpg';

// Fallback for TMDB image links that 404 at load time (poster_path present but
// the asset is gone). Attach as @error on <img>; the guard avoids a reload loop.
export function handlePosterError(e: Event) {
  const img = e.target as HTMLImageElement;
  if (img.src.endsWith(PLACEHOLDER_POSTER)) return;
  img.src = PLACEHOLDER_POSTER;
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
      return PLACEHOLDER_POSTER;
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
