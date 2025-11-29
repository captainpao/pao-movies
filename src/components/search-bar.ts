import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('search-bar')
export class SearchBar extends LitElement {
  createRenderRoot() {
    return this;
  }

  @state()
  private _searchQuery = '';

  @state()
  private _isLoading = false;

  private _handleInput(event: Event) {
    this._searchQuery = (event.target as HTMLTextAreaElement).value;
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


  }

  set loading(value: boolean) {
    this._isLoading = value;
  }

  render() {
    return html`
      <div class="max-w-2xl mx-auto">
        <div class="text-center mb-6">
          <h1 class="text-5xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#fff200] via-[#ffe600] to-[#d57e05] drop-shadow-[0_2px_0_rgba(0,0,0,0.25)] font-bungee mb-2">Pao Fiction</h1>
          <p class="text-white text-lg">
            Retro Recs from Paolo — analog attitude for a digital world.
          </p>
        </div>

        <form class="flex items-stretch gap-2 mb-8" @submit=${this._handleSubmit}>
          <textarea
            class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-colors duration-200 resize-none h-24"
            placeholder="Tell Paolo what you're craving — like, “Action vibes today. Hand me a tape.”"
            .value=${this._searchQuery}
            @input=${this._handleInput}
            ?disabled=${this._isLoading}
          ></textarea>

          <button
            type="submit"
            class="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 font-bold rounded-lg hover:from-yellow-500 hover:to-yellow-600 disabled:from-gray-400 disabled:to-gray-500 disabled:text-gray-800 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
            ?disabled=${this._isLoading}
          >
            ${this._isLoading ? 'Thinking...' : 'Ask Paolo'}
          </button>

          <button
            type="button"
            class="px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-lg hover:from-gray-700 hover:to-gray-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
            @click=${this._handleClear}
            ?disabled=${this._isLoading}
          >
            Clear
          </button>
        </form>
      </div>
    `;
  }
}
