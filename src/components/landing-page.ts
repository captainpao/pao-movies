import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { clerks, Clerk } from '../data/clerks';
import heroImg from '../assets/images/pao-fiction-storefront.webp';

// Brady-Bunch-style palette: each clerk card gets a different colored backdrop,
// assigned by position so it stays stable and needs no per-clerk config.
const CARD_BG = [
  'bg-gradient-to-br from-rose-400 to-rose-600',
  'bg-gradient-to-br from-teal-300 to-teal-500',
  'bg-gradient-to-br from-amber-300 to-amber-500',
  'bg-gradient-to-br from-violet-400 to-violet-600',
  'bg-gradient-to-br from-sky-300 to-sky-500',
  'bg-gradient-to-br from-orange-300 to-orange-500',
];

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
          class="relative w-full h-[250px] sm:h-[350px] lg:h-[450px] bg-cover bg-center"
          style="background-image: url('${heroImg}')"
        >
          <!-- darken layer -->
          <div class="absolute inset-0 bg-black/50"></div>
          <!-- giant title + subtitle over the darken layer, in the site's yellow gradient -->
          <div class="absolute inset-0 flex flex-col items-center justify-center px-4">
            <h1
              class="font-bungee text-center leading-none text-transparent bg-clip-text bg-gradient-to-br from-[#fff200] via-[#ffe600] to-[#d57e05] drop-shadow-[0_3px_8px_rgba(0,0,0,0.6)] text-6xl sm:text-7xl lg:text-9xl"
            >
              PAO FICTION
            </h1>
            <p
              class="mt-2 sm:mt-4 font-bungee uppercase text-white/90 tracking-[0.3em] drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] text-xl sm:text-2xl lg:text-3xl"
            >
              The Video Store
            </p>
            <p
              class="mt-3 sm:mt-5 max-w-md text-center text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] text-md sm:text-lg lg:text-xl"
            >
              Every clerk's got taste. Whose do you trust?
            </p>
          </div>
        </div>

        <!-- Picker: clerk cards (tagline lives in the header) -->
        <div class="px-4 pb-12 pt-10">
          <!-- flex-wrap + justify-center scales to any number of clerks -->
          <div
            class="flex flex-wrap justify-center gap-8 w-full max-w-6xl mx-auto"
          >
            ${clerks.map(
              (clerk, i) => html`
                <button
                  class="group w-full sm:w-80 flex flex-col overflow-hidden rounded-2xl
                         border border-white/20 hover:border-yellow-400
                         bg-white/10 backdrop-blur transition-all duration-200 cursor-pointer"
                  @click=${() => this._selectClerk(clerk)}
                >
                  <div
                    class="w-full overflow-hidden flex items-center justify-center ${clerk.cardBg ??
                    CARD_BG[i % CARD_BG.length]}"
                  >
                    <img
                      src=${clerk.image}
                      alt=${clerk.name}
                      class="h-56 sm:h-64 object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div class="px-4 py-4 text-center">
                    <h2 class="text-2xl font-bold uppercase tracking-wide text-white">
                      ${clerk.name}
                    </h2>
                    <p class="mt-1 text-sm text-indigo-200">
                      ${clerk.searchTagline}
                    </p>
                  </div>
                </button>
              `
            )}
          </div>
        </div>
      </div>
    `;
  }
}
