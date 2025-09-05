import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Movie } from '../types/movie';
import { tmdbService } from '../services/tmdb-api';

@customElement('movie-card')
export class MovieCard extends LitElement {

  @property({ type: Object })
  movie!: Movie;

  render() {
    if (!this.movie) {
      return html`<div class="bg-white rounded-xl shadow-md overflow-hidden transition h-full">
        <div class="flex items-center justify-center bg-gray-200 text-gray-400 text-sm h-[300px]">No movie data</div>
      </div>`;
    }

    const posterUrl = tmdbService.getMoviePosterUrl(this.movie.poster_path);
    const rating = this.movie.vote_average.toFixed(1);
    const releaseYear = this.movie.release_date
      ? new Date(this.movie.release_date).getFullYear()
      : 'N/A';

    return html`
      <div class="bg-white rounded-xl shadow-md overflow-hidden transition h-full hover:-translate-y-0.5 hover:shadow-lg">
        ${this.movie.poster_path
          ? html`<img
              class="w-full h-[300px] object-cover bg-gray-100"
              src=${posterUrl}
              alt="${this.movie.title}"
              loading="lazy"
            />`
          : html`<div class="flex items-center justify-center bg-gray-200 text-gray-400 text-sm h-[300px]">No poster available</div>`}
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-2 leading-snug">${this.movie.title}</h3>
          <p class="text-gray-500 text-sm leading-6 line-clamp-3 mb-4">
            ${this.movie.overview || 'No overview available.'}
          </p>
          <div class="flex items-center justify-between text-sm text-gray-400">
            <span class="text-gray-500">${releaseYear}</span>
            <span class="flex items-center gap-1 font-medium text-amber-500">⭐ ${rating}</span>
          </div>
        </div>
      </div>
    `;
  }
}
