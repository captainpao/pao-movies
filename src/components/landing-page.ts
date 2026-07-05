import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { clerks, Clerk } from '../data/clerks';

@customElement('landing-page')
export class LandingPage extends LitElement {
  createRenderRoot() {
    return this;
  }

  private _selectClerk(clerk: Clerk) {
    this.dispatchEvent(
      new CustomEvent('clerk-selected', {
        detail: { clerk },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div
        class="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      >
        <h1
          class="text-5xl sm:text-7xl font-bungee text-center text-transparent bg-clip-text bg-gradient-to-br from-[#fff200] via-[#ffe600] to-[#d57e05] drop-shadow-[0_2px_0_rgba(0,0,0,0.25)]"
        >
          PAO FICTION
        </h1>
        <p class="mt-3 text-lg sm:text-xl text-indigo-200 text-center">
          The video store. Choose your clerk.
        </p>

        <div
          class="mt-12 flex flex-col sm:flex-row gap-8 w-full max-w-3xl justify-center"
        >
          ${clerks.map(
            (clerk) => html`
              <button
                class="group flex-1 bg-white/10 backdrop-blur rounded-2xl p-6 flex flex-col items-center
                       border border-white/20 hover:border-yellow-400 hover:bg-white/20
                       transition-all duration-200 cursor-pointer"
                @click=${() => this._selectClerk(clerk)}
              >
                <img
                  src=${clerk.image}
                  alt=${clerk.name}
                  class="h-56 sm:h-64 object-contain group-hover:scale-105 transition-transform duration-200"
                />
                <h2 class="mt-4 text-2xl font-bold text-white">
                  ${clerk.name}
                </h2>
                <p class="mt-1 text-sm text-indigo-200 text-center">
                  ${clerk.tagline}
                </p>
              </button>
            `
          )}
        </div>
      </div>
    `;
  }
}
