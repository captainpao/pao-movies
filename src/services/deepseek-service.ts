
import { DEEPSEEK_API_URL } from '../config/api';
import { FavoriteMovie } from '../data/clerks';

export const deepseekService = {
  async getRecommendations(prompt: string, availableMovies: FavoriteMovie[], personaPrompt: string): Promise<{ recommendations: FavoriteMovie[], rationale: string }> {
    const movieList = availableMovies.map(m => `- ${m.title} (ID: ${m.id})`).join('\n');

    const systemPrompt = `
${personaPrompt}

Here is the list of movies you have in stock:
${movieList}

When the user asks for a recommendation, you must:
1. Select 3-5 movies from the list that best match their request.
2. Write your rationale in your own voice as described above.
3. Return ONLY a JSON object with the following structure:
{
  "recommendations": [123, 456, 789],
  "rationale": "Your explanation here..."
}
4. Do not include any other text or explanation in the response, just the JSON.
    `;

    try {
      const response = await fetch(`${DEEPSEEK_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.8
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch recommendations');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      // Extract JSON from content (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from the clerk');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      const recommendedIds = parsed.recommendations;
      const rationale = parsed.rationale;

      // Filter the original list to get the full movie objects
      const recommendations = availableMovies.filter(m => recommendedIds.includes(m.id));

      return { recommendations, rationale };

    } catch (error) {
      throw error;
    }
  }
};
