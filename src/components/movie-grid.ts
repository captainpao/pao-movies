import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Movie } from '../types/movie';

@customElement('movie-grid')
export class MovieGrid extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      padding: 1rem 0;
    }

    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 3rem;
      color: #6b7280;
      font-size: 1.125rem;
    }

    .error {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 3rem;
      color: #ef4444;
      font-size: 1.125rem;
      text-align: center;
    }

    .empty {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 3rem;
      color: #6b7280;
      font-size: 1.125rem;
      text-align: center;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 2rem;
      padding: 1rem 0;
    }

    .pagination-button {
      padding: 0.5rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      background: white;
      color: #374151;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .pagination-button:hover:not(:disabled) {
      background: #f3f4f6;
      border-color: #9ca3af;
    }

    .pagination-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-info {
      color: #6b7280;
      font-size: 0.875rem;
    }
  `;

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
      return html`<div class="loading">Loading movies...</div>`;
    }

    if (this.error) {
      return html`<div class="error">
        <p>Error: ${this.error}</p>
      </div>`;
    }

    if (!this.movies.length && !this.loading) {
      return html`<div class="empty">
        <p>No movies found. Try a different search.</p>
      </div>`;
    }

    return html`
      <div class="grid">
        ${this.movies.map(
          (movie) => html` <movie-card .movie=${movie}></movie-card> `
        )}
      </div>

      ${this.totalPages > 1
        ? html`
            <div class="pagination">
              <button
                class="pagination-button"
                ?disabled=${this.currentPage === 1 || this.loading}
                @click=${() => this._handlePageChange(this.currentPage - 1)}
              >
                Previous
              </button>

              <span class="page-info">
                Page ${this.currentPage} of ${this.totalPages}
              </span>

              <button
                class="pagination-button"
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
        ? html`<div class="loading">Loading more movies...</div>`
        : ''}
    `;
  }
}
