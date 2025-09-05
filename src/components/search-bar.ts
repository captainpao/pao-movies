import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('search-bar')
export class SearchBar extends LitElement {

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
      <div class="max-w-xl mx-auto mb-8">
        <div class="text-center mb-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Movie Explorer</h1>
          <p class="text-gray-500 text-lg">
            Discover and search for your favorite movies
          </p>
        </div>

        <form class="flex items-stretch gap-2" @submit=${this._handleSubmit}>
          <input
            type="text"
            class="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            placeholder="Search for movies..."
            .value=${this._searchQuery}
            @input=${this._handleInput}
            ?disabled=${this._isLoading}
          />

          <button
            type="submit"
            class="px-6 py-3 bg-blue-500 text-white rounded-lg text-base font-medium hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            ?disabled=${!this._searchQuery.trim() || this._isLoading}
          >
            ${this._isLoading ? 'Searching...' : 'Search'}
          </button>

          ${this._searchQuery
            ? html`
                <button
                  type="button"
                  class="px-4 py-3 bg-gray-600 text-white rounded-lg text-base hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
