import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Movie } from '../types/movie';

@customElement('movie-grid')
export class MovieGrid extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property({ type: Array })
  movies: Movie[] = [];

  @property({ type: Boolean })
  loading = false;

  @property({ type: String })
  error = '';

  @property({ type: Number })
  currentPage = 1;

  @property({ type: Number })
  totalPages = 1;

  @state()
  private _isFirstRender = true;

  protected firstUpdated(): void {
    this._isFirstRender = false;
  }

  private _handlePageChange(page: number) {
    this.dispatchEvent(
      new CustomEvent('page-change', {
        detail: { page },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (this.loading && this._isFirstRender) {
      return html`<div class="flex justify-center items-center p-12 text-gray-500 text-lg">Loading movies...</div>`;
    }

    if (this.error) {
      return html`<div class="flex justify-center items-center p-12 text-red-500 text-lg text-center">
        <p>Error: ${this.error}</p>
      </div>`;
    }

    if (!this.movies.length && !this.loading) {
      return html`<div class="flex justify-center items-center p-12 text-gray-500 text-lg text-center">
        <p>No movies found. Try a different search.</p>
      </div>`;
    }

    return html`
      <div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
        ${this.movies.map(
          (movie) => html` <movie-card .movie=${movie}></movie-card> `
        )}
      </div>

      ${this.totalPages > 1
        ? html`
            <div class="flex justify-center items-center gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                class="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                ?disabled=${this.currentPage === 1 || this.loading}
                @click=${() => this._handlePageChange(this.currentPage - 1)}
              >
                Previous
              </button>

              <span class="text-gray-600 text-sm font-medium">
                Page ${this.currentPage} of ${this.totalPages}
              </span>

              <button
                class="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                ?disabled=${this.currentPage === this.totalPages ||
                this.loading}
                @click=${() => this._handlePageChange(this.currentPage + 1)}
              >
                Next
              </button>
            </div>
          `
        : ''}
      ${this.loading
        ? html`<div class="flex justify-center items-center p-12 text-gray-500 text-lg">Loading more movies...</div>`
        : ''}
    `;
  }
}
