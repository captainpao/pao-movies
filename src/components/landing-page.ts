import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { clerks, Clerk } from '../data/clerks';
import heroImg from '../assets/images/pao-fiction-storefront.webp';

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
      <div class="w-full">
        <!-- Hero band: full-width 500px cover image, darkened, giant title overlaid -->
        <div
          class="relative w-full h-[500px] bg-cover bg-center"
          style="background-image: url('${heroImg}')"
        >
          <!-- darken layer -->
          <div class="absolute inset-0 bg-black/50"></div>
          <!-- giant title over the darken layer -->
          <div class="absolute inset-0 flex items-center justify-center px-4">
            <h1
              class="font-bungee text-center leading-none text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] text-6xl sm:text-8xl md:text-9xl"
            >
              PAO FICTION
            </h1>
          </div>
        </div>

        <!-- Picker: subtitle + clerk cards, pulled up into the scene -->
        <div class="px-4 pb-12 pt-6">
          <p class="text-center text-lg sm:text-xl text-indigo-200 mb-8">
            The video store. Choose your clerk.
          </p>
          <div
            class="flex flex-col sm:flex-row gap-8 w-full max-w-3xl mx-auto justify-center"
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
      </div>
    `;
  }
}
