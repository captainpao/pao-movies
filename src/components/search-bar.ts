import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('search-bar')
export class SearchBar extends LitElement {
  static styles = css`
    :host {
      display: block;
      margin-bottom: 2rem;
    }

    .search-container {
      max-width: 600px;
      margin: 0 auto;
    }

    .search-form {
      display: flex;
      gap: 0.5rem;
      align-items: stretch;
    }

    .search-input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.2s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .search-button {
      padding: 0.75rem 1.5rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .search-button:hover {
      background: #2563eb;
    }

    .search-button:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .clear-button {
      padding: 0.75rem 1rem;
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .clear-button:hover {
      background: #4b5563;
    }

    .search-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .search-title {
      font-size: 2rem;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 0.5rem;
    }

    .search-subtitle {
      color: #6b7280;
      font-size: 1.125rem;
    }
  `;

  @state()
  private _searchQuery = '';

  @state()
  private _isLoading = false;

  private _handleInput(event: Event) {
    this._searchQuery = (event.target as HTMLInputElement).value;
  }

  private _handleSubmit(event: Event) {
    event.preventDefault();
    if (this._searchQuery.trim()) {
      this._performSearch();
    }
  }

  private _handleClear() {
    this._searchQuery = '';
    this.dispatchEvent(
      new CustomEvent('search-clear', {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _performSearch() {
    this._isLoading = true;
    this.dispatchEvent(
      new CustomEvent('search-submit', {
        detail: { query: this._searchQuery.trim() },
        bubbles: true,
        composed: true,
      })
    );

    // Reset loading state after a short delay to allow the parent to handle it
    setTimeout(() => {
      this._isLoading = false;
    }, 100);
  }

  set loading(value: boolean) {
    this._isLoading = value;
  }

  render() {
    return html`
      <div class="search-container">
        <div class="search-header">
          <h1 class="search-title">Movie Explorer</h1>
          <p class="search-subtitle">
            Discover and search for your favorite movies
          </p>
        </div>

        <form class="search-form" @submit=${this._handleSubmit}>
          <input
            type="text"
            class="search-input"
            placeholder="Search for movies..."
            .value=${this._searchQuery}
            @input=${this._handleInput}
            ?disabled=${this._isLoading}
          />

          <button
            type="submit"
            class="search-button"
            ?disabled=${!this._searchQuery.trim() || this._isLoading}
          >
            ${this._isLoading ? 'Searching...' : 'Search'}
          </button>

          ${this._searchQuery
            ? html`
                <button
                  type="button"
                  class="clear-button"
                  @click=${this._handleClear}
                  ?disabled=${this._isLoading}
                >
                  Clear
                </button>
              `
            : ''}
        </form>
      </div>
    `;
  }
}
