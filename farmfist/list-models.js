const axios = require('axios');

async function listModels() {
  try {
    const API_KEY = 'AIzaSyDYyK5Iuk6PKMgHtkdJ69vi8QBa2DW-iGk';
    const response = await axios.get(
      'https://generativelanguage.googleapis.com/v1beta/models',
      {
        headers: { 'Content-Type': 'application/json' },
        params: { key: API_KEY }
      }
    );
    
    console.log('Available models:');
    response.data.models.forEach(model => {
      console.log(`- ${model.name} (${model.description || 'No description'})`);
      console.log(`  Supported methods: ${model.supportedGenerationMethods?.join(', ') || 'None'}`);
    });
    
    return response.data;
  } catch (error) {
    console.error('Error listing models:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
}

listModels().catch(console.error);
