const axios = require('axios');
const API_URL = 'http://localhost:5000/api';

async function testWeatherIntegration() {
  try {
    // 1. Create a unique test email
    const testEmail = `test${Date.now()}@example.com`;
    
    // 2. Register a test user
    console.log('Registering test user...');
    await axios.post(`${API_URL}/auth/register`, {
      name: 'Test User',
      email: testEmail,
      password: 'test1234',
      farmType: 'poultry',
      farmSize: 'medium'
    });

    // 3. Login to get token
    console.log('Logging in...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: testEmail,
      password: 'test1234'
    });

    const token = loginRes.data.token;
    console.log('Login successful!');

    // 3. Create a test farm
    console.log('Creating test farm...');
    const farmRes = await axios.post(`${API_URL}/farms`, {
      farmName: 'Test Farm',
      farmType: 'poultry',
      location: {
        address: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456',
        coordinates: {
          latitude: 20.5937,  // Coordinates for India
          longitude: 78.9629
        }
      },
      farmSize: 10,
      capacity: {
        poultry: 1000
      }
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const farmId = farmRes.data.farm._id;
    console.log(`Created farm with ID: ${farmId}`);

    // 4. Generate a report
    console.log('Generating report...');
    const reportRes = await axios.post(`${API_URL}/reports/generate-ai`, {
      title: 'Test Weather Report',
      reportType: 'production_summary',
      farmId: farmId,
      parameters: {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString(),
        includeDetails: true
      }
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const reportId = reportRes.data.reportId;
    console.log(`Report generation started with ID: ${reportId}`);

    // 5. Check report status
    const checkStatus = async () => {
      const statusRes = await axios.get(`${API_URL}/reports/${reportId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const report = statusRes.data.report;
      console.log(`Report status: ${report.status}`);
      
      if (report.status === 'completed') {
        console.log('\n--- REPORT GENERATED SUCCESSFULLY ---');
        console.log('Summary:', report.summary);
        console.log('Insights:', JSON.stringify(report.insights, null, 2));
        console.log('Weather Data:', report.data?.weather);
      } else if (report.status === 'failed') {
        console.error('Report generation failed:', report.error);
      } else {
        setTimeout(checkStatus, 2000);
      }
    };

    await checkStatus();

  } catch (error) {
    console.error('Test failed:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
  }
}

testWeatherIntegration();
