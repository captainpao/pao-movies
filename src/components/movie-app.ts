import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Movie, MovieDetail } from '../types/movie';
import { tmdbService } from '../services/tmdb-api';
import { captainPaoFavoriteMovies } from '../data/captainpao-movies';
import './movie-detail';
import paoVideoClerkBg from '../assets/images/pao-video-clerk.png';

@customElement('movie-app')
export class MovieApp extends LitElement {
  createRenderRoot() {
    return this;
  }

  private _movies: Movie[] = [];
  private _loading = false;
  private _error = '';
  private _currentPage = 1;
  private _totalPages = 1;
  private _searchMode = false;
  private _currentQuery = '';
  private _showError = false;
  private _selectedMovie: MovieDetail | null = null;
  private _detailLoading = false;
  private _detailError = '';

  get movies() {
    return this._movies;
  }

  set movies(value: Movie[]) {
    this._movies = value;
    this.requestUpdate();
  }

  get loading() {
    return this._loading;
  }

  set loading(value: boolean) {
    this._loading = value;
    this.requestUpdate();
  }

  get error() {
    return this._error;
  }

  set error(value: string) {
    this._error = value;
    this.requestUpdate();
  }

  get currentPage() {
    return this._currentPage;
  }

  set currentPage(value: number) {
    this._currentPage = value;
    this.requestUpdate();
  }

  get totalPages() {
    return this._totalPages;
  }

  set totalPages(value: number) {
    this._totalPages = value;
    this.requestUpdate();
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._loadCaptainPaoMovies();
  }

  private async _loadCaptainPaoMovies(page: number = 1) {
    this.loading = true;
    this.error = '';
    this._searchMode = false;
    this._currentQuery = '';

    try {
      const itemsPerPage = 20;
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginatedMovies = captainPaoFavoriteMovies.slice(start, end);

      const moviePromises = paginatedMovies.map(async (m) => {
        const id = (m as any).id;
        if (id) {
          try {
            return await tmdbService.getMovieById(id);
          } catch (e) {
            console.warn(`Failed to fetch details for ${m.title}`, e);
          }
        }

        // Fallback if ID missing or fetch fails
        return {
          id: m.rank,
          title: m.title,
          overview: `Directed by ${m.director}. Rank: ${m.rank}`,
          poster_path: null,
          backdrop_path: null,
          release_date: `${m.year}-01-01`,
          vote_average: 0,
          vote_count: 0,
          popularity: 0,
        };
      });

      this.movies = await Promise.all(moviePromises);
      this.currentPage = page;
      this.totalPages = Math.ceil(captainPaoFavoriteMovies.length / itemsPerPage);
    } catch (error) {
      this.error = 'Failed to load movies';
      this._showErrorToast(this.error);
    } finally {
      this.loading = false;
    }
  }

  private async _searchMovies(query: string, page: number = 1) {
    this.loading = true;
    this.error = '';
    this._searchMode = true;
    this._currentQuery = query;

    try {
      const lowerQuery = query.toLowerCase();
      const filteredMovies = captainPaoFavoriteMovies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(lowerQuery) ||
          movie.director.toLowerCase().includes(lowerQuery)
      );

      const itemsPerPage = 20;
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginatedMovies = filteredMovies.slice(start, end);

      const moviePromises = paginatedMovies.map(async (m) => {
        const id = (m as any).id;
        if (id) {
          try {
            return await tmdbService.getMovieById(id);
          } catch (e) {
            console.warn(`Failed to fetch details for ${m.title}`, e);
          }
        }

        // Fallback if ID missing or fetch fails
        return {
          id: m.rank,
          title: m.title,
          overview: `Directed by ${m.director}. Rank: ${m.rank}`,
          poster_path: null,
          backdrop_path: null,
          release_date: `${m.year}-01-01`,
          vote_average: 0,
          vote_count: 0,
          popularity: 0,
        };
      });

      this.movies = await Promise.all(moviePromises);
      this.currentPage = page;
      this.totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
    } catch (error) {
      this.error =
        error instanceof Error ? error.message : 'Failed to search movies';
      this._showErrorToast(this.error);
    } finally {
      this.loading = false;
    }
  }

  private _handleSearchSubmit(event: CustomEvent) {
    const query = event.detail.query;
    if (query.trim()) {
      this._searchMovies(query);
    }
  }

  private _handleSearchClear() {
    this._loadCaptainPaoMovies();
  }

  private _handlePageChange(event: CustomEvent) {
    const page = event.detail.page;
    if (this._searchMode) {
      this._searchMovies(this._currentQuery, page);
    } else {
      this._loadCaptainPaoMovies(page);
    }
  }

  private _showErrorToast(message: string) {
    this.error = message;
    this._showError = true;

    setTimeout(() => {
      this._showError = false;
      this.requestUpdate();
    }, 5000);
  }

  private async _handleMovieClick(event: CustomEvent) {
    const movie = event.detail.movie;
    this._selectedMovie = null;
    this._detailLoading = true;
    this._detailError = '';
    this.requestUpdate();

    try {
      const detail = await tmdbService.getMovieById(movie.id);
      this._selectedMovie = detail;
    } catch (error) {
      this._detailError =
        error instanceof Error ? error.message : 'Failed to load movie details';
    } finally {
      this._detailLoading = false;
      this.requestUpdate();
    }
  }

  private _handleBackClick() {
    this._selectedMovie = null;
    this._detailError = '';
    this.requestUpdate();
  }

  render() {
    return html`
      <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800">
        <div class="max-w-[1600px] mx-auto relative" style="background-image: url('${paoVideoClerkBg}'); background-repeat: no-repeat; background-size: 300px; background-position: top right;">
          <div class="p-4">
            ${this._selectedMovie || this._detailLoading || this._detailError
        ? html`
                  <movie-detail
                    .movie=${this._selectedMovie}
                    .loading=${this._detailLoading}
                    .error=${this._detailError}
                    @back-click=${this._handleBackClick}
                  ></movie-detail>
                `
        : html`
                  <search-bar
                    .loading=${this._loading}
                    @search-submit=${this._handleSearchSubmit}
                    @search-clear=${this._handleSearchClear}
                  ></search-bar>
                </div>

                <div class="bg-white p-4 sm:p-8 rounded-2xl shadow-2xl">
                  <movie-grid
                    .movies=${this._movies}
                    .loading=${this._loading}
                    .error=${this._error}
                    .currentPage=${this._currentPage}
                    .totalPages=${this._totalPages}
                    @page-change=${this._handlePageChange}
                    @movie-click=${this._handleMovieClick}
                  ></movie-grid>
                `}
          </div>
        </div>

        ${this._showError
        ? html` <div class="fixed top-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50">${this._error}</div> `
        : ''}
      </div>
    `;
  }
}
