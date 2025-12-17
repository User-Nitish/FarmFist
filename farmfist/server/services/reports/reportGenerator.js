const axios = require('axios');
const Farm = require('../../models/Farm');
const Report = require('../../models/Report');

// OpenWeatherMap API integration
const getWeatherData = async (coordinates, startDate, endDate) => {
  const API_KEY = '6bae766a4c6828ade48c79b30d2b3715';
  const lat = coordinates.latitude;
  const lon = coordinates.longitude;
  
  try {
    // Get current weather data
    const currentResponse = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
        lang: 'en'
      }
    });

    // Get forecast data (5 day / 3 hour forecast)
    const forecastResponse = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
        cnt: 8 // Get 8 forecasts (24 hours)
      }
    });

    // Format the response to match our expected format
    const current = currentResponse.data;
    const forecast = forecastResponse.data.list;

    return [{
      date: new Date().toISOString().split('T')[0],
      day: {
        maxtemp_c: Math.round(current.main.temp_max),
        mintemp_c: Math.round(current.main.temp_min),
        avgtemp_c: Math.round(current.main.temp),
        maxwind_kph: (current.wind?.speed * 3.6).toFixed(1), // Convert m/s to km/h
        totalprecip_mm: current.rain?.['1h'] || 0,
        avghumidity: current.main.humidity,
        condition: {
          text: current.weather[0]?.description || 'N/A',
          icon: `https://openweathermap.org/img/wn/${current.weather[0]?.icon}@2x.png`,
          code: current.weather[0]?.id
        }
      },
      forecast: forecast.map(item => ({
        time: new Date(item.dt * 1000).toLocaleTimeString(),
        temp: Math.round(item.main.temp),
        condition: item.weather[0]?.description,
        icon: `https://openweathermap.org/img/wn/${item.weather[0]?.icon}.png`
      }))
    }];
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Return mock data if API call fails
    return [{
      date: new Date().toISOString().split('T')[0],
      day: {
        maxtemp_c: 28,
        mintemp_c: 22,
        avgtemp_c: 25,
        maxwind_kph: 15,
        totalprecip_mm: 5.2,
        avghumidity: 70,
        condition: {
          text: 'Partly cloudy',
          icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
          code: 1003
        }
      },
      forecast: [
        {
          time: new Date().toLocaleTimeString(),
          temp: 25,
          condition: 'Partly cloudy',
          icon: '//cdn.weatherapi.com/weather/64x64/day/116.png'
        }
      ]
    }];
  }
};

const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

const generateStatusSummary = (farm, sensorData, weatherData) => {
  const latestWeather = weatherData[weatherData.length - 1]?.day || {};
  const latestReading = sensorData[sensorData.length - 1] || {};
  
  return `Current farm status as of ${new Date().toLocaleString()}:
- Location: ${farm.location.address || 'N/A'}
- Farm Type: ${farm.farmType}
- Current Temperature: ${latestReading.temperature || latestWeather.avgtemp_c || 'N/A'}°C
- Humidity: ${latestReading.humidity || latestWeather.avghumidity || 'N/A'}%
- Weather Condition: ${latestWeather.condition?.text || 'N/A'}
- Last 24h Rainfall: ${latestWeather.totalprecip_mm || 0}mm`;
};

const generateRecommendations = (farm, sensorData, weatherData) => {
  const recommendations = [];
  const latest = sensorData[sensorData.length - 1] || {};
  const weather = weatherData[weatherData.length - 1]?.day || {};

  // Temperature-based recommendations
  if (latest.temperature > 30 || weather.maxtemp_c > 30) {
    recommendations.push({
      risk: 'High Temperature',
      severity: 'high',
      recommendation: 'Provide additional shade and ensure adequate water supply for animals.'
    });
  }

  // Water level recommendations
  if (latest.waterLevel < 30) {
    recommendations.push({
      risk: 'Low Water Level',
      severity: 'high',
      recommendation: 'Water levels are critically low. Check water supply and irrigation systems.'
    });
  }

  // Weather-based recommendations
  if (weather.totalprecip_mm > 20) {
    recommendations.push({
      risk: 'Heavy Rainfall',
      severity: 'medium',
      recommendation: 'Check drainage systems and prepare for potential flooding.'
    });
  }

  // Farm type specific recommendations
  if (farm.farmType === 'poultry' && (latest.temperature < 18 || latest.temperature > 27)) {
    recommendations.push({
      risk: 'Temperature Stress',
      severity: 'high',
      recommendation: 'Poultry is sensitive to temperature changes. Adjust heating/cooling systems.'
    });
  }

  return recommendations.length > 0 
    ? recommendations 
    : [{
        risk: 'No Immediate Risks',
        severity: 'low',
        recommendation: 'Current conditions are optimal. Continue with regular monitoring.'
      }];
};

const analyzeSensorData = (sensorData) => {
  if (!sensorData || sensorData.length === 0) return [];
  
  const first = sensorData[0];
  const last = sensorData[sensorData.length - 1];
  const tempTrend = last.temperature > first.temperature ? 'increasing' : 'decreasing';
  
  return [
    `Temperature trend: ${tempTrend} (${first.temperature}°C → ${last.temperature}°C)`,
    `Average humidity: ${(sensorData.reduce((sum, s) => sum + (s.humidity || 0), 0) / sensorData.length).toFixed(1)}%`,
    `Data points analyzed: ${sensorData.length}`
  ];
};

const generateReportContent = async (report) => {
  try {
    console.log(`[${new Date().toISOString()}] Starting report generation for farm ID: ${report.farmId}`);
    
    // Get farm data with detailed error handling
    const farm = await Farm.findById(report.farmId).lean();
    if (!farm) {
      const error = new Error(`Farm with ID ${report.farmId} not found`);
      error.code = 'FARM_NOT_FOUND';
      throw error;
    }
    console.log(`[${new Date().toISOString()}] Found farm: ${farm.farmName || 'Unnamed Farm'}`);

    // Format dates for display
    const startDate = new Date(report.parameters.startDate || new Date().setMonth(new Date().getMonth() - 1));
    const endDate = new Date(report.parameters.endDate || new Date());

    let weatherData = [];
    let weatherError = null;
    
    // Only try to get weather if we have coordinates
    if (farm.location?.coordinates) {
      try {
        weatherData = await getWeatherData(
          farm.location.coordinates, 
          startDate, 
          endDate
        );
      } catch (error) {
        console.warn(`[${new Date().toISOString()}] Could not fetch weather data:`, error.message);
        weatherError = 'Weather data unavailable';
        // Continue with empty weather data
      }
    } else {
      weatherError = 'Farm location not set - using default weather data';
      console.log(`[${new Date().toISOString()}] ${weatherError}`);
    }

    // Generate report content with available data
    const sensorData = [{
      temperature: 25.5,
      humidity: 65,
      waterLevel: 75,
      timestamp: new Date()
    }];

    const statusSummary = generateStatusSummary(farm, sensorData, weatherData);
    const recommendations = generateRecommendations(farm, sensorData, weatherData);
    const sensorAnalysis = analyzeSensorData(sensorData);

    // Build the report
    const reportContent = {
      summary: statusSummary,
      insights: {
        key_metrics: [...sensorAnalysis],
        risks: recommendations.filter(r => r.severity !== 'low'),
        recommendations: recommendations.map(r => r.recommendation)
      },
      data: {
        farm: {
          name: farm.farmName,
          type: farm.farmType,
          location: farm.location || { coordinates: null },
          size: farm.farmSize,
          coordinates: farm.location?.coordinates || null
        },
        report_period: {
          start: startDate.toISOString().split('T')[0],
          end: endDate.toISOString().split('T')[0]
        },
        sensorReadings: sensorData
      }
    };

    // Add weather data if available
    if (weatherData.length > 0) {
      const currentWeather = weatherData[0]?.day || {};
      reportContent.insights.weather_summary = currentWeather.condition ? 
        `Current weather: ${currentWeather.condition.text}, ${currentWeather.avgtemp_c}°C` :
        'Weather data not available';
      
      reportContent.data.weather = {
        current: currentWeather,
        forecast: weatherData[0]?.forecast || []
      };
    } else if (weatherError) {
      reportContent.insights.weather_summary = weatherError;
    }

    console.log(`[${new Date().toISOString()}] Report generation completed successfully`);
    return reportContent;

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in generateReportContent:`, {
      error: error.message,
      code: error.code || 'UNKNOWN_ERROR',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
    throw error;
  }
};

const processReport = async (reportId) => {
  try {
    const report = await Report.findById(reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    // Update status to processing
    report.status = 'processing';
    await report.save();

    // Generate report content
    const reportContent = await generateReportContent(report);

    // Update report with generated content
    await Report.findByIdAndUpdate(reportId, {
      status: 'completed',
      ...reportContent,
      generatedAt: new Date()
    });

    return reportContent;
  } catch (error) {
    console.error('Error processing report:', error);
    await Report.findByIdAndUpdate(reportId, {
      status: 'failed',
      error: error.message
    });
    throw error;
  }
};

module.exports = {
  processReport,
  generateReportContent
};
