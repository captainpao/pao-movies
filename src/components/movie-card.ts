import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Movie } from '../types/movie';
import { tmdbService, handlePosterError } from '../services/tmdb-api';

@customElement('movie-card')
export class MovieCard extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property({ type: Object })
  movie!: Movie;

  private _handleClick() {
    this.dispatchEvent(
      new CustomEvent('movie-click', {
        detail: { movie: this.movie },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (!this.movie) {
      return html`<div class="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 h-full hover:shadow-xl hover:-translate-y-1">
        <div class="flex items-center justify-center bg-gray-100 text-gray-400 text-sm h-[320px]">No movie data</div>
      </div>`;
    }

    const posterUrl = tmdbService.getMoviePosterUrl(this.movie.poster_path);
    const rating = this.movie.vote_average.toFixed(1);
    const releaseYear = this.movie.release_date
      ? new Date(this.movie.release_date).getFullYear()
      : 'N/A';

    return html`
      <div
        class="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
        @click=${this._handleClick}
      >
        ${this.movie.poster_path
        ? html`<img
              class="w-full h-[320px] object-cover bg-gray-100"
              src=${posterUrl}
              alt="${this.movie.title}"
              loading="lazy"
              @error=${handlePosterError}
            />`
        : html`<div class="flex items-center justify-center bg-gray-100 text-gray-400 text-sm h-[320px]">No poster available</div>`}
        <div class="p-5">
          <h3 class="text-lg font-bold text-gray-800 mb-3 leading-tight">${this.movie.title}</h3>
          <p class="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
            ${this.movie.overview || 'No overview available.'}
          </p>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500 font-medium">${releaseYear}</span>
            <span class="flex items-center gap-1 font-bold text-amber-500">⭐ ${rating}</span>
          </div>
        </div>
      </div>
    `;
  }
}
