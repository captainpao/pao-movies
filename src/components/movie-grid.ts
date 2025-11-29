import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Movie } from '../types/movie';
import '@lottiefiles/lottie-player';
import popcornAnimation from '../assets/lottie/popcorn.json';

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
    if (this.loading) {
      return html`
        <div class="flex flex-col justify-center items-center p-12">
          <lottie-player
            src=${JSON.stringify(popcornAnimation)}
            background="transparent"
            speed="1"
            style="width: 300px; height: 300px;"
            loop
            autoplay
          ></lottie-player>
          <div class="text-gray-500 text-lg mt-4">Paolo is thinking...</div>
        </div>
      `;
    }

    if (this.error) {
      return html`<div class="flex justify-center items-center p-12 text-red-500 text-lg text-center">
        <p>Error: ${this.error}</p>
      </div>`;
    }

    if (!this.movies.length) {
      return html`<div class="flex justify-center items-center p-12 text-gray-500 text-lg text-center">
        <p>Say what? Try again.</p>
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
                class="px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 font-bold rounded-lg hover:from-yellow-500 hover:to-yellow-600 disabled:from-gray-400 disabled:to-gray-500 disabled:text-gray-800 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                ?disabled=${this.currentPage === 1}
                @click=${() => this._handlePageChange(this.currentPage - 1)}
              >
                Previous
              </button>

              <span class="text-gray-600 text-sm font-medium">
                Page ${this.currentPage} of ${this.totalPages}
              </span>

              <button
                class="px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 font-bold rounded-lg hover:from-yellow-500 hover:to-yellow-600 disabled:from-gray-400 disabled:to-gray-500 disabled:text-gray-800 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
                ?disabled=${this.currentPage === this.totalPages}
                @click=${() => this._handlePageChange(this.currentPage + 1)}
              >
                Next
              </button>
            </div>
          `
        : ''}
    `;
  }
}
