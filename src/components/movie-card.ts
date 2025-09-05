import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Movie } from '../types/movie';
import { tmdbService } from '../services/tmdb-api';

@customElement('movie-card')
export class MovieCard extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .movie-card {
      background: white;
      border-radius: 0.75rem;
      box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
      overflow: hidden;
      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
      height: 100%;
    }

    .movie-card:hover {
      transform: translateY(-2px);
      box-shadow:
        0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    .poster {
      width: 100%;
      height: 300px;
      object-fit: cover;
      background: #f3f4f6;
    }

    .content {
      padding: 1rem;
    }

    .title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.5rem;
      line-height: 1.4;
    }

    .overview {
      color: #6b7280;
      font-size: 0.875rem;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 1rem;
    }

    .details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.875rem;
      color: #9ca3af;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-weight: 500;
      color: #f59e0b;
    }

    .release-date {
      color: #6b7280;
    }

    .placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e5e7eb;
      color: #9ca3af;
      font-size: 0.875rem;
      height: 300px;
    }
  `;

  @property({ type: Object })
  movie!: Movie;

  render() {
    if (!this.movie) {
      return html`<div class="movie-card">
        <div class="placeholder">No movie data</div>
      </div>`;
    }

    const posterUrl = tmdbService.getMoviePosterUrl(this.movie.poster_path);
    const rating = this.movie.vote_average.toFixed(1);
    const releaseYear = this.movie.release_date
      ? new Date(this.movie.release_date).getFullYear()
      : 'N/A';

    return html`
      <div class="movie-card">
        ${this.movie.poster_path
          ? html`<img
              class="poster"
              src=${posterUrl}
              alt="${this.movie.title}"
              loading="lazy"
            />`
          : html`<div class="placeholder">No poster available</div>`}
        <div class="content">
          <h3 class="title">${this.movie.title}</h3>
          <p class="overview">
            ${this.movie.overview || 'No overview available.'}
          </p>
          <div class="details">
            <span class="release-date">${releaseYear}</span>
            <span class="rating"> ⭐ ${rating} </span>
          </div>
        </div>
      </div>
    `;
  }
}
