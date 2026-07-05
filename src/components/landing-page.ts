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
        <!-- Hero band: generated storefront + real Bungee wordmark on the marquee -->
        <div class="relative w-full">
          <img
            src=${heroImg}
            alt="The Pao Fiction video store at night"
            class="w-full h-auto block select-none pointer-events-none"
          />
          <!-- bottom fade so the night sky melts into the page gradient -->
          <div
            class="absolute inset-x-0 bottom-0 h-24 sm:h-32 bg-gradient-to-b from-transparent to-slate-900 pointer-events-none"
          ></div>
          <!-- wordmark overlaid on the blank marquee (real text, not baked into the image) -->
          <h1
            class="absolute left-1/2 -translate-x-1/2 top-[14.5%] w-[26%] text-center leading-none font-bungee text-transparent bg-clip-text bg-gradient-to-br from-[#fff200] via-[#ffe600] to-[#d57e05] drop-shadow-[0_2px_0_rgba(0,0,0,0.35)] text-[clamp(0.7rem,3.6vw,4rem)]"
          >
            PAO FICTION
          </h1>
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
