import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates AI insights for a property analysis
 * @param analysis The analysis data to generate insights from
 * @returns A string containing the AI-generated insights
 */
export async function generateInsights(analysis: {
  type: string;
  address: string;
  metrics: Record<string, any>;
  notes?: string;
}): Promise<string> {
  try {
    // Format the metrics for the prompt
    const metricsText = Object.entries(analysis.metrics)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    // Create the prompt
    const prompt = `Provide real estate investment insights based on the following ${analysis.type} analysis for ${analysis.address}:

${metricsText}
${analysis.notes ? `Additional notes: ${analysis.notes}` : ''}

Keep your response under 100 words and focus on key investment metrics, potential risks, and opportunities.`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a real estate investment advisor providing concise, data-driven insights.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    // Return the generated insights
    return response.choices[0]?.message?.content || 'Unable to generate insights at this time.';
  } catch (error) {
    console.error('Error generating insights:', error);
    throw new Error('Failed to generate AI insights');
  }
} 