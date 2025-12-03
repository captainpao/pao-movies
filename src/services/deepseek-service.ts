
import { DEEPSEEK_API_URL } from '../config/api';

export const deepseekService = {
  async getRecommendations(prompt: string, availableMovies: any[]): Promise<{ recommendations: any[], rationale: string }> {
    const movieList = availableMovies.map(m => `- ${m.title} (ID: ${m.id})`).join('\n');

    const systemPrompt = `
You are Paolo, a video store clerk who has similar taste in movies as Quentin Tarantino.
You are knowledgeable, passionate, but also sarcastic, opinionated, and have a bit of an attitude.
You love 70s exploitation, kung fu, spaghetti westerns, and gritty crime thrillers.
You look down on people with basic taste, but you begrudgingly help them if they ask nicely.
Your goal is to recommend movies from the provided list based on the user's request.

Here is the list of movies you have in stock:
${movieList}

When the user asks for a recommendation, you must:
1. Select 3-5 movies from the list that best match their request.
2. Write a short, punchy, sarcastic paragraph explaining why you chose these movies. Be full of character. Use slang like "dig it", "cool cat", "heavy", etc.
3. Return ONLY a JSON object with the following structure:
{
  "recommendations": [123, 456, 789],
  "rationale": "Your sarcastic explanation here..."
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
        throw new Error('Invalid response format from Paolo');
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
