import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Movie, MovieDetail } from '../types/movie';
import { tmdbService } from '../services/tmdb-api';
import { deepseekService } from '../services/deepseek-service';
import { Clerk } from '../data/clerks';
import './movie-detail';
import './landing-page';

@customElement('movie-app')
export class MovieApp extends LitElement {
  createRenderRoot() {
    return this;
  }

  private _clerk: Clerk | null = null;
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

  private async _loadClerkMovies(page: number = 1) {
    this.loading = true;
    this.error = '';
    this._searchMode = false;
    this._currentQuery = '';

    try {
      const itemsPerPage = 20;
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginatedMovies = this._clerk!.movies.slice(start, end);

      const moviePromises = paginatedMovies.map(async (m) => {
        const id = (m as any).id;
        if (id) {
          try {
            return await tmdbService.getMovieById(id);
          } catch (e) {
            // Fallback will be used
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
      this.totalPages = Math.ceil(this._clerk!.movies.length / itemsPerPage);
    } catch (error) {
      this.error = 'Failed to load movies';
      this._showErrorToast(this.error);
    } finally {
      this.loading = false;
    }
  }

  private _rationale = '';

  private async _searchMovies(query: string, page: number = 1) {
    this.loading = true;
    this.error = '';
    this._searchMode = true;
    this._currentQuery = query;
    this._rationale = ''; // Reset rationale

    try {
      // Use DeepSeek to get recommendations based on the prompt
      // We pass the full list of movies to the service so the clerk can choose from them
      const { recommendations, rationale } = await deepseekService.getRecommendations(
        query,
        this._clerk!.movies,
        this._clerk!.personaPrompt
      );

      this._rationale = rationale;

      const itemsPerPage = 20;
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginatedMovies = recommendations.slice(start, end);

      const moviePromises = paginatedMovies.map(async (m) => {
        const id = (m as any).id;
        if (id) {
          try {
            return await tmdbService.getMovieById(id);
          } catch (e) {
            // Fallback will be used
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
      this.totalPages = Math.ceil(recommendations.length / itemsPerPage);
    } catch (error) {
      this.error =
        error instanceof Error ? error.message : 'Failed to get recommendations';
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
    this._rationale = '';
    this._loadClerkMovies();
  }

  private _handlePageChange(event: CustomEvent) {
    const page = event.detail.page;
    if (this._searchMode) {
      this._searchMovies(this._currentQuery, page);
    } else {
      this._loadClerkMovies(page);
    }
  }

  private _handleClerkSelected(event: CustomEvent) {
    this._clerk = event.detail.clerk;
    this.requestUpdate();
    this._loadClerkMovies();
  }

  private _handleChangeClerk() {
    this._clerk = null;
    this._movies = [];
    this._rationale = '';
    this._searchMode = false;
    this._currentQuery = '';
    this._selectedMovie = null;
    this._detailError = '';
    this.requestUpdate();
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
      <div class="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900">
          ${!this._clerk
        ? html`<landing-page @clerk-selected=${this._handleClerkSelected}></landing-page>`
        : html`
                <div class="max-w-[1600px] mx-auto relative">
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
                        <button
                          class="mb-2 px-4 py-2 text-sm bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
                          @click=${this._handleChangeClerk}
                        >
                          ← Store Front
                        </button>
                        <div style="background-image: url('${this._clerk.image}'); background-repeat: no-repeat; background-size: ${this._clerk.storeFigureSize}; background-position: top right 50px; padding-bottom: 16px;">
                          <search-bar
                            .clerk=${this._clerk}
                            .loading=${this._loading}
                            @search-submit=${this._handleSearchSubmit}
                            @search-clear=${this._handleSearchClear}
                          ></search-bar>
                        </div>

                        <div class="bg-white p-4 sm:p-8 rounded-2xl shadow-2xl">
                          ${this._rationale
                ? html`
                        <blockquote class="relative p-6 text-xl border-l-4 bg-neutral-50 text-neutral-600 border-neutral-500 quote">
                          <div class="stylistic-quote-mark" aria-hidden="true"></div>
                          <p class="text-gray-800">${this._rationale}</p>
                          <cite class="block text-right text-sm italic mt-2">${this._clerk.quoteAttribution}</cite>
                        </blockquote>
                        `
                : ''}
                          <movie-grid
                            .movies=${this._movies}
                            .loading=${this._loading}
                            .loadingMessage=${this._clerk.loadingMessage}
                            .error=${this._error}
                            .currentPage=${this._currentPage}
                            .totalPages=${this._totalPages}
                            @page-change=${this._handlePageChange}
                            @movie-click=${this._handleMovieClick}
                          ></movie-grid>
                        </div>
                      `}
                </div>
                </div>
              `}

        ${this._showError
        ? html` <div class="fixed top-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50">${this._error}</div> `
        : ''}
      </div>
    `;
  }
}
