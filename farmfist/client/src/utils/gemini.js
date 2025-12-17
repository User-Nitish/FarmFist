const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export const generateInsights = async (data, context = 'farm_inspection') => {
  try {
    const prompt = `Based on the following ${context} data, provide key insights, potential risks, and recommendations in JSON format with the following structure: 
    {
      "summary": "Brief summary of the inspection",
      "key_metrics": ["metric1", "metric2"],
      "risks": [{"risk": "description", "severity": "high/medium/low"}],
      "recommendations": ["recommendation1", "recommendation2"]}
    
    Data: ${JSON.stringify(data, null, 2)}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate insights');
    }

    const result = await response.json();
    const content = result.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    
    // Fallback to direct JSON parsing
    try {
      return JSON.parse(content);
    } catch (e) {
      return {
        summary: content,
        key_metrics: [],
        risks: [],
        recommendations: []
      };
    }
  } catch (error) {
    console.error('Error generating insights:', error);
    return {
      summary: 'Error generating insights. Please try again later.',
      key_metrics: [],
      risks: [],
      recommendations: []
    };
  }
};