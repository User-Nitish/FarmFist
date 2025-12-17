const axios = require('axios');

// Replace with your actual server URL and authentication token
const API_URL = 'http://localhost:5000/api';
const AUTH_TOKEN = 'YOUR_AUTH_TOKEN'; // Replace with a valid token

async function testWeatherIntegration() {
  try {
    // First, get a list of farms to use for testing
    const farmsResponse = await axios.get(`${API_URL}/farms`, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    });
    
    if (!farmsResponse.data.farms || farmsResponse.data.farms.length === 0) {
      console.log('No farms found. Please create a farm first.');
      return;
    }

    // Use the first available farm
    const farmId = farmsResponse.data.farms[0]._id;
    
    console.log(`Generating report for farm ID: ${farmId}`);
    
    // Generate a report
    const reportResponse = await axios.post(
      `${API_URL}/reports/generate-ai`,
      {
        title: 'Test Weather Report',
        reportType: 'production_summary',
        farmId: farmId,
        parameters: {
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
          endDate: new Date().toISOString(),
          includeDetails: true
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`
        }
      }
    );

    console.log('Report generation started:', reportResponse.data);
    const reportId = reportResponse.data.reportId;

    // Check report status
    console.log('Checking report status...');
    const checkStatus = async () => {
      const statusResponse = await axios.get(`${API_URL}/reports/${reportId}`, {
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`
        }
      });
      
      console.log('Report status:', statusResponse.data.report.status);
      
      if (statusResponse.data.report.status === 'completed') {
        console.log('Report generated successfully!');
        console.log('Summary:', statusResponse.data.report.summary);
        console.log('Insights:', JSON.stringify(statusResponse.data.report.insights, null, 2));
      } else if (statusResponse.data.report.status === 'failed') {
        console.error('Report generation failed:', statusResponse.data.report.error);
      } else {
        // Check again after 2 seconds
        setTimeout(checkStatus, 2000);
      }
    };

    // Start checking status
    await checkStatus();

  } catch (error) {
    console.error('Error testing weather integration:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
}

testWeatherIntegration();
