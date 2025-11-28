# Pao Fiction

A modern, responsive movie exploration dashboard built with LitElement, TypeScript, and TailwindCSS. Discover popular movies and search through the extensive TMDB database.

## Features

- 🎬 **Popular Movies**: Browse trending movies from The Movie Database (TMDB)
- 🔍 **Advanced Search**: Search for movies by title with real-time results
- 📱 **Responsive Design**: Beautiful grid layout that works on all devices
- 📄 **Pagination**: Navigate through multiple pages of results
- ⚡ **Fast Performance**: Built with LitElement for optimal rendering performance
- 🎨 **Modern UI**: Clean, professional design with TailwindCSS
- 🔒 **Secure API**: Environment-based API key management

## Tech Stack

- **LitElement 3.x** - Web Components framework
- **TypeScript** - Type safety and development experience
- **TailwindCSS 3.x** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **TMDB API** - Movie database API

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- TMDB API account ([Get API Key](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd tmdb-movie-explorer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

4. **Add your TMDB API key**

   Edit the `.env` file and replace `your_tmdb_api_key_here` with your actual TMDB API key:

   ```env
   VITE_TMDB_API_KEY=your_actual_api_key_here
   VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
   VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
   ```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Linting and Formatting

```bash
npm run lint    # ESLint check
npm run format  # Prettier formatting
```

## Project Structure

```
src/
├── components/          # LitElement components
│   ├── movie-app.ts    # Main application component
│   ├── movie-card.ts   # Individual movie card
│   ├── movie-grid.ts   # Movies grid with pagination
│   └── search-bar.ts   # Search input component
├── services/           # API services
│   └── tmdb-api.ts     # TMDB API service
├── types/              # TypeScript type definitions
│   └── movie.ts        # Movie-related types
├── styles/             # Global styles
│   └── index.css       # Tailwind imports
└── main.ts             # Application entry point
```

## API Configuration

This application uses The Movie Database (TMDB) API. To get an API key:

1. Create an account at [https://www.themoviedb.org/](https://www.themoviedb.org/)
2. Go to [API Settings](https://www.themoviedb.org/settings/api)
3. Create a new API key
4. Copy the key and add it to your `.env` file

## Environment Variables

| Variable                   | Description         | Default                        |
| -------------------------- | ------------------- | ------------------------------ |
| `VITE_TMDB_API_KEY`        | Your TMDB API key   | Required                       |
| `VITE_TMDB_BASE_URL`       | TMDB API base URL   | `https://api.themoviedb.org/3` |
| `VITE_TMDB_IMAGE_BASE_URL` | TMDB image base URL | `https://image.tmdb.org/t/p`   |

## Usage

1. **Browse Popular Movies**: The app loads with popular movies on startup
2. **Search Movies**: Use the search bar to find movies by title
3. **Navigate Pages**: Use pagination controls to browse through results
4. **View Details**: Click on movie cards to see more information (expandable)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the movie data API
- [Lit](https://lit.dev/) for the excellent web components framework
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vite](https://vitejs.dev/) for the fast build tool
