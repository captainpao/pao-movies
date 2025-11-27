import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MovieDetail } from '../types/movie';
import { tmdbService } from '../services/tmdb-api';

@customElement('movie-detail')
export class MovieDetailComponent extends LitElement {
  createRenderRoot() {
    return this;
  }

  @property({ type: Object }) movie: MovieDetail | null = null;
  @property({ type: Boolean }) loading = false;
  @property({ type: String }) error = '';

  private _handleBackClick() {
    this.dispatchEvent(new CustomEvent('back-click'));
  }

  render() {
    if (this.loading) {
      return html`
        <div class="flex justify-center items-center h-64">
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"
          ></div>
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="text-center text-red-500 p-4">
          <p>${this.error}</p>
          <button
            @click=${this._handleBackClick}
            class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      `;
    }

    if (!this.movie) {
      return html``;
    }

    const backdropUrl = tmdbService.getMovieBackdropUrl(
      this.movie.backdrop_path
    );
    const posterUrl = tmdbService.getMoviePosterUrl(this.movie.poster_path);

    return html`
      <div class="bg-white rounded-2xl overflow-hidden shadow-xl">
        <div class="relative h-96">
          <img
            src="${backdropUrl}"
            alt="${this.movie.title} backdrop"
            class="w-full h-full object-cover"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          ></div>
          <button
            @click=${this._handleBackClick}
            class="absolute top-4 left-4 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
            Back to Results
          </button>
        </div>

        <div class="p-6 sm:p-8 -mt-32 relative z-10">
          <div class="flex flex-col md:flex-row gap-8">
            <div class="flex-shrink-0 mx-auto md:mx-0">
              <img
                src="${posterUrl}"
                alt="${this.movie.title} poster"
                class="w-64 rounded-xl shadow-2xl border-4 border-white"
              />
            </div>

            <div class="flex-grow text-white md:text-gray-800 pt-4 md:pt-32">
              <h1 class="text-4xl font-bold mb-2 text-white md:text-gray-900">
                ${this.movie.title}
              </h1>
              ${this.movie.tagline
        ? html`<p
                    class="text-lg italic mb-4 text-gray-300 md:text-gray-600"
                  >
                    ${this.movie.tagline}
                  </p>`
        : ''}

              <div class="flex flex-wrap gap-2 mb-6">
                ${this.movie.genres.map(
          (genre) => html`
                    <span
                      class="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium"
                    >
                      ${genre.name}
                    </span>
                  `
        )}
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 text-sm">
                <div>
                  <p class="text-gray-500">Release Date</p>
                  <p class="font-semibold text-gray-900">
                    ${new Date(this.movie.release_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p class="text-gray-500">Runtime</p>
                  <p class="font-semibold text-gray-900">
                    ${this.movie.runtime} min
                  </p>
                </div>
                <div>
                  <p class="text-gray-500">Rating</p>
                  <div class="flex items-center gap-1">
                    <span class="text-yellow-500">★</span>
                    <span class="font-semibold text-gray-900"
                      >${this.movie.vote_average.toFixed(1)}</span
                    >
                  </div>
                </div>
                <div>
                  <p class="text-gray-500">Status</p>
                  <p class="font-semibold text-gray-900">${this.movie.status}</p>
                </div>
              </div>

              <div class="prose max-w-none text-gray-700 mb-8">
                <h3 class="text-xl font-bold mb-2 text-gray-900">Overview</h3>
                <p class="leading-relaxed">${this.movie.overview}</p>
              </div>

              <div class="mb-8">
                <h3 class="text-xl font-bold mb-4 text-gray-900">Top Cast</h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  ${this.movie.credits.cast.slice(0, 10).map(
          (actor) => html`
                      <div class="text-center">
                        <img
                          src="${tmdbService.getMoviePosterUrl(
            actor.profile_path,
            'w185'
          )}"
                          alt="${actor.name}"
                          class="w-full h-40 object-cover rounded-lg mb-2 shadow-md"
                        />
                        <p class="font-semibold text-gray-900 text-sm truncate">
                          ${actor.name}
                        </p>
                        <p class="text-gray-500 text-xs truncate">
                          ${actor.character}
                        </p>
                      </div>
                    `
        )}
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 class="text-lg font-bold mb-2 text-gray-900">Director</h3>
                  <p class="text-gray-700">
                    ${this.movie.credits.crew
        .filter((person) => person.job === 'Director')
        .map((director) => director.name)
        .join(', ') || 'N/A'}
                  </p>
                </div>
                <div>
                  <h3 class="text-lg font-bold mb-2 text-gray-900">Writers</h3>
                  <p class="text-gray-700">
                    ${this.movie.credits.crew
        .filter(
          (person) =>
            person.department === 'Writing' ||
            person.job === 'Screenplay' ||
            person.job === 'Writer'
        )
        .slice(0, 3)
        .map((writer) => writer.name)
        .filter((value, index, self) => self.indexOf(value) === index)
        .join(', ') || 'N/A'}
                  </p>
                </div>
              </div>

              ${this.movie.homepage
        ? html`
                    <div class="mt-8">
                      <a
                        href="${this.movie.homepage}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Visit Homepage
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-4 h-4"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                          />
                        </svg>
                      </a>
                    </div>
                  `
        : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
