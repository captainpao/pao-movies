
const fs = require('fs');
const path = require('path');

const API_KEY = '70e6d2184b0a7a8a6f9f42f5b73df664';
const BASE_URL = 'https://api.themoviedb.org/3';

const dataFilePath = path.join(__dirname, '../src/data/captainpao-movies.ts');

async function fetchMovieId(title, year, director) {
  try {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}&year=${year}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      // Simple heuristic: pick the first one. 
      // We could check director if we fetched details, but search usually does a good job with title + year.
      return data.results[0].id;
    } else {
      // Try without year if not found (sometimes release dates differ)
      const urlNoYear = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`;
      const responseNoYear = await fetch(urlNoYear);
      const dataNoYear = await responseNoYear.json();
      if (dataNoYear.results && dataNoYear.results.length > 0) {
        console.log(`Found ${title} without year constraint.`);
        return dataNoYear.results[0].id;
      }
    }
    console.warn(`Could not find ID for: ${title} (${year})`);
    return null;
  } catch (error) {
    console.error(`Error fetching ${title}:`, error.message);
    return null;
  }
}

async function main() {
  const fileContent = fs.readFileSync(dataFilePath, 'utf8');
  // Extract the array part
  const match = fileContent.match(/export const captainPaoFavoriteMovies = (\[[\s\S]*?\]);/);
  if (!match) {
    console.error('Could not parse data file');
    process.exit(1);
  }

  // The content is valid JSON-compatible JS (keys are quoted)
  const movies = JSON.parse(match[1]);

  console.log(`Processing ${movies.length} movies...`);

  const updatedMovies = [];

  // Process in batches to avoid rate limits if any, though TMDB is generous.
  // Sequential is safer for 100 items to avoid hitting limits.
  for (const movie of movies) {
    console.log(`Fetching ID for #${movie.rank}: ${movie.title}`);
    const id = await fetchMovieId(movie.title, movie.year, movie.director);
    updatedMovies.push({
      ...movie,
      id: id
    });
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  const newContent = `export const captainPaoFavoriteMovies = ${JSON.stringify(updatedMovies, null, 2)};\n`;

  fs.writeFileSync(dataFilePath, newContent);
  console.log('Done! Updated file with IDs.');
}

main();
