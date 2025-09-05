import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Movie, MoviesResponse } from '../types/movie';
import { tmdbService } from '../services/tmdb-api';

@customElement('movie-app')
export class MovieApp extends LitElement {

  private _movies: Movie[] = [];
  private _loading = false;
  private _error = '';
  private _currentPage = 1;
  private _totalPages = 1;
  private _searchMode = false;
  private _currentQuery = '';
  private _showError = false;

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
    this._loadPopularMovies();
  }

  private async _loadPopularMovies(page: number = 1) {
    this.loading = true;
    this.error = '';
    this._searchMode = false;
    this._currentQuery = '';

    try {
      const response: MoviesResponse = await tmdbService.getPopularMovies(page);
      this.movies = response.results;
      this.currentPage = response.page;
      this.totalPages = Math.min(response.total_pages, 500); // TMDB limits to 500 pages
    } catch (error) {
      this.error =
        error instanceof Error ? error.message : 'Failed to load movies';
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
      const response: MoviesResponse = await tmdbService.searchMovies({
        query,
        page,
      });
      this.movies = response.results;
      this.currentPage = response.page;
      this.totalPages = Math.min(response.total_pages, 500);
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
    this._loadPopularMovies();
  }

  private _handlePageChange(event: CustomEvent) {
    const page = event.detail.page;
    if (this._searchMode) {
      this._searchMovies(this._currentQuery, page);
    } else {
      this._loadPopularMovies(page);
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

  render() {
    return html`
      <div class="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 px-4 py-8">
        <div class="max-w-6xl mx-auto">
          <search-bar
            .loading=${this._loading}
            @search-submit=${this._handleSearchSubmit}
            @search-clear=${this._handleSearchClear}
          ></search-bar>

          <movie-grid
            .movies=${this._movies}
            .loading=${this._loading}
            .error=${this._error}
            .currentPage=${this._currentPage}
            .totalPages=${this._totalPages}
            @page-change=${this._handlePageChange}
          ></movie-grid>
        </div>

        ${this._showError
          ? html` <div class="fixed top-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow z-50">${this._error}</div> `
          : ''}
      </div>
    `;
  }
}
