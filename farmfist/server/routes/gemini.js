const express = require('express');
const axios = require('axios');
const { auth } = require('../middleware/auth');
const Farm = require('../models/Farm');
const Inspection = require('../models/Inspection');
const Report = require('../models/Report');

const router = express.Router();

// Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDYyK5Iuk6PKMgHtkdJ69vi8QBa2DW-iGk';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Helper function to call Gemini API
const callGeminiAPI = async (prompt) => {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    throw new Error('Failed to generate AI response');
  }
};

// Generate biosecurity insights for a farm
router.post('/biosecurity-insights/:farmId', auth, async (req, res) => {
  try {
    const farm = await Farm.findOne({
      _id: req.params.farmId,
      userId: req.user.userId
    });

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    // Get recent inspections
    const recentInspections = await Inspection.find({ farmId: req.params.farmId })
      .sort({ inspectionDate: -1 })
      .limit(5);

    const prompt = `
You are an expert agricultural biosecurity consultant specializing in pig and poultry farming. Analyze the following farm data and provide detailed biosecurity insights, recommendations, and risk assessments.

Farm Details:
- Name: ${farm.farmName}
- Type: ${farm.farmType}
- Size: ${farm.farmSize}
- Biosecurity Level: ${farm.biosecurityLevel}
- Facilities: ${farm.facilities.join(', ') || 'None specified'}
- Livestock: ${farm.livestock.map(l => `${l.quantity} ${l.type}(s) - ${l.healthStatus}`).join(', ') || 'No livestock data'}

Recent Inspections Summary:
${recentInspections.map(inspection =>
  `Date: ${inspection.inspectionDate.toDateString()}
   Overall Score: ${inspection.overallScore}/100
   Compliance: ${inspection.complianceStatus}
   Key Issues: ${inspection.biosecurityChecks ? Object.entries(inspection.biosecurityChecks)
     .filter(([key, value]) => !value.compliant)
     .map(([key, value]) => key.replace(/([A-Z])/g, ' $1').toLowerCase())
     .join(', ') : 'None noted'}`
).join('\n\n')}

Please provide:
1. **Biosecurity Risk Assessment**: Current risk level (Low/Medium/High/Critical) with explanation
2. **Key Strengths**: What's working well
3. **Critical Vulnerabilities**: Immediate concerns that need attention
4. **Priority Recommendations**: 3-5 actionable improvements ranked by urgency
5. **Preventive Measures**: Long-term strategies to enhance biosecurity
6. **Compliance Score Prediction**: Estimated improvement if recommendations are implemented

Format your response as a structured JSON object with these exact keys: riskAssessment, keyStrengths, criticalVulnerabilities, priorityRecommendations, preventiveMeasures, compliancePrediction
`;

    const aiResponse = await callGeminiAPI(prompt);

    // Try to parse the response as JSON, if it fails, return as text
    let insights;
    try {
      insights = JSON.parse(aiResponse);
    } catch (parseError) {
      insights = { summary: aiResponse };
    }

    res.json({
      farmId: req.params.farmId,
      insights,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate biosecurity insights' });
  }
});

// Generate health monitoring insights
router.post('/health-insights/:farmId', auth, async (req, res) => {
  try {
    const farm = await Farm.findOne({
      _id: req.params.farmId,
      userId: req.user.userId
    });

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    const recentInspections = await Inspection.find({ farmId: req.params.farmId })
      .sort({ inspectionDate: -1 })
      .limit(3);

    const prompt = `
You are a veterinary specialist in pig and poultry health management. Analyze the following livestock health data and provide insights and recommendations.

Farm: ${farm.farmName} (${farm.farmType})
Current Livestock:
${farm.livestock.map(l =>
  `- ${l.type}: ${l.quantity} animals, Age: ${l.age} weeks, Health: ${l.healthStatus}, Breed: ${l.breed || 'Not specified'}`
).join('\n')}

Recent Health Assessments:
${recentInspections.map(inspection =>
  `Date: ${inspection.inspectionDate.toDateString()}
   Overall Health: ${inspection.livestockHealth?.overallHealth || 'Not assessed'}
   Vaccination Status: ${inspection.livestockHealth?.vaccinationStatus || 'Not assessed'}
   Mortality Rate: ${inspection.livestockHealth?.mortalityRate || 'Not recorded'}%
   Feed Quality: ${inspection.livestockHealth?.feedQuality || 'Not assessed'}
   Disease Signs: ${inspection.livestockHealth?.diseaseSigns?.map(d => `${d.disease} (${d.severity})`).join(', ') || 'None noted'}`
).join('\n\n')}

Please provide health monitoring insights including:
1. **Health Status Overview**: Current assessment of livestock health
2. **Disease Risk Analysis**: Potential health threats based on current conditions
3. **Vaccination Recommendations**: What vaccinations should be prioritized
4. **Nutrition Advice**: Feed quality and nutritional recommendations
5. **Monitoring Protocols**: What to watch for and how often
6. **Preventive Healthcare**: Long-term health management strategies

Format as JSON with keys: healthOverview, diseaseRisks, vaccinationRecommendations, nutritionAdvice, monitoringProtocols, preventiveHealthcare
`;

    const aiResponse = await callGeminiAPI(prompt);
    let insights;

    try {
      insights = JSON.parse(aiResponse);
    } catch (parseError) {
      insights = { summary: aiResponse };
    }

    res.json({
      farmId: req.params.farmId,
      insights,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate health insights' });
  }
});

// Generate climate and weather impact analysis
router.post('/climate-insights/:farmId', auth, async (req, res) => {
  try {
    const farm = await Farm.findOne({
      _id: req.params.farmId,
      userId: req.user.userId
    });

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    const prompt = `
You are an agricultural climatologist specializing in livestock farming. Analyze how weather conditions impact ${farm.farmType} farming operations and biosecurity.

Farm Details:
- Location: ${farm.location?.city || 'Not specified'}, ${farm.location?.state || 'Not specified'}
- Farm Type: ${farm.farmType}
- Current Climate Data: ${farm.climateData ?
  `Temperature: ${farm.climateData.temperature}°C, Humidity: ${farm.climateData.humidity}%, Rainfall: ${farm.climateData.rainfall}mm, Wind Speed: ${farm.climateData.windSpeed}km/h` :
  'No climate data available'}

Please analyze weather impacts on:
1. **Biosecurity Risks**: How current/future weather affects disease transmission
2. **Livestock Comfort**: Temperature/humidity effects on animal health
3. **Facility Management**: Weather-related maintenance needs
4. **Disease Vectors**: How weather influences pest and pathogen activity
5. **Seasonal Planning**: Best practices for different weather conditions
6. **Climate Adaptation**: Long-term strategies for climate resilience

Consider local conditions and provide specific recommendations for ${farm.farmType} farming in this climate zone.

Format as JSON with keys: biosecurityRisks, livestockComfort, facilityManagement, diseaseVectors, seasonalPlanning, climateAdaptation
`;

    const aiResponse = await callGeminiAPI(prompt);
    let insights;

    try {
      insights = JSON.parse(aiResponse);
    } catch (parseError) {
      insights = { summary: aiResponse };
    }

    res.json({
      farmId: req.params.farmId,
      insights,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate climate insights' });
  }
});

// Generate comprehensive farm report
router.post('/comprehensive-report/:farmId', auth, async (req, res) => {
  try {
    const farm = await Farm.findOne({
      _id: req.params.farmId,
      userId: req.user.userId
    });

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    const inspections = await Inspection.find({ farmId: req.params.farmId })
      .sort({ inspectionDate: -1 })
      .limit(10);

    const prompt = `
Generate a comprehensive farm management report for ${farm.farmName}, a ${farm.farmType} farm.

Farm Overview:
- Size: ${farm.farmSize}
- Established: ${farm.establishedDate.toDateString()}
- Biosecurity Level: ${farm.biosecurityLevel}
- Facilities: ${farm.facilities.join(', ') || 'Basic facilities'}

Performance Summary (Last 10 Inspections):
${inspections.map((inspection, index) =>
  `Inspection ${index + 1}: ${inspection.inspectionDate.toDateString()}
   Score: ${inspection.overallScore}/100
   Compliance: ${inspection.complianceStatus}
   Key Issues: ${inspection.recommendations?.slice(0, 2).map(r => r.action).join(', ') || 'None'}`
).join('\n')}

Please create a detailed report covering:
1. **Executive Summary**: Overall farm performance and status
2. **Biosecurity Assessment**: Current level and gaps
3. **Operational Efficiency**: Recommendations for improvement
4. **Risk Management**: Current risks and mitigation strategies
5. **Sustainability Metrics**: Environmental and economic considerations
6. **Future Roadmap**: 6-month and 1-year improvement plans

Include specific, actionable recommendations with priority levels (High/Medium/Low) and timelines.

Format as JSON with keys: executiveSummary, biosecurityAssessment, operationalEfficiency, riskManagement, sustainabilityMetrics, futureRoadmap
`;

    const aiResponse = await callGeminiAPI(prompt);
    let report;

    try {
      report = JSON.parse(aiResponse);
    } catch (parseError) {
      report = { summary: aiResponse };
    }

    res.json({
      farmId: req.params.farmId,
      report,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate comprehensive report' });
  }
});

// Detect potential harm or anomalies from farm data
router.post('/anomaly-detection/:farmId', auth, async (req, res) => {
  try {
    const farm = await Farm.findOne({
      _id: req.params.farmId,
      userId: req.user.userId
    });

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    const recentInspections = await Inspection.find({ farmId: req.params.farmId })
      .sort({ inspectionDate: -1 })
      .limit(5);

    const prompt = `
You are an AI safety inspector for livestock farms. Analyze the following data for potential safety hazards, health risks, and biosecurity violations that could cause harm to animals, humans, or the environment.

Farm: ${farm.farmName} (${farm.farmType})

Current Data:
- Livestock Health: ${farm.livestock.map(l => `${l.type}: ${l.healthStatus}`).join(', ')}
- Biosecurity Level: ${farm.biosecurityLevel}
- Facilities: ${farm.facilities.join(', ')}

Recent Inspection Findings:
${recentInspections.map(inspection =>
  `Date: ${inspection.inspectionDate.toDateString()}
   Critical Issues: ${inspection.biosecurityChecks ?
     Object.entries(inspection.biosecurityChecks)
       .filter(([key, value]) => value.score < 5)
       .map(([key]) => key.replace(/([A-Z])/g, ' $1').toLowerCase())
       .join(', ') : 'None'}
   Health Concerns: ${inspection.livestockHealth?.diseaseSigns?.length > 0 ?
     inspection.livestockHealth.diseaseSigns.map(d => `${d.disease} (${d.severity})`).join(', ') :
     'None reported'}`
).join('\n')}

Identify and prioritize potential harm including:
1. **Immediate Dangers**: Critical safety issues requiring immediate action
2. **Health Risks**: Potential disease outbreaks or animal welfare issues
3. **Environmental Hazards**: Pollution or contamination risks
4. **Human Health Concerns**: Zoonotic disease transmission risks
5. **Regulatory Violations**: Non-compliance that could lead to penalties
6. **Economic Impacts**: Issues that could affect farm viability

Rate each risk as Critical/High/Medium/Low and provide specific mitigation steps.

Format as JSON with keys: immediateDangers, healthRisks, environmentalHazards, humanHealthConcerns, regulatoryViolations, economicImpacts
`;

    const aiResponse = await callGeminiAPI(prompt);
    let analysis;

    try {
      analysis = JSON.parse(aiResponse);
    } catch (parseError) {
      analysis = { summary: aiResponse };
    }

    res.json({
      farmId: req.params.farmId,
      analysis,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to perform anomaly detection' });
  }
});

// Generate potential threats and solutions for a farm based on location and type
router.post('/generate-threats', auth, async (req, res) => {
  try {
    const { farmAddress, farmType } = req.body;

    if (!farmAddress || !farmType) {
      return res.status(400).json({ message: 'Farm address and type are required' });
    }

    const prompt = `You are an expert agricultural consultant. Analyze potential threats for a ${farmType} farm located at: ${farmAddress}.

Please provide:
1. A list of 3-5 potential threats this farm might face based on its location and type
2. For each threat, include:
   - A brief description
   - Severity (Low/Medium/High)
   - 2-3 recommended solutions or preventive measures

Format your response as a JSON array of objects with these exact keys: title, description, severity, solutions (array of strings)

Example response format:
[
  {
    "title": "Avian Influenza Outbreak",
    "description": "High risk of avian influenza due to migratory bird patterns in the area.",
    "severity": "High",
    "solutions": [
      "Implement strict biosecurity measures for all farm visitors",
      "Monitor bird health daily for signs of illness",
      "Vaccinate poultry according to local regulations"
    ]
  }
]`;

    const aiResponse = await callGeminiAPI(prompt);

    // Try to parse the response as JSON, if it fails, return as text
    let threats;
    try {
      threats = JSON.parse(aiResponse);
      if (!Array.isArray(threats)) {
        throw new Error('Invalid response format: expected an array');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return res.status(500).json({
        message: 'Failed to process AI response',
        error: parseError.message,
        rawResponse: aiResponse
      });
    }

    res.json({ threats });
  } catch (error) {
    console.error('Error generating threats:', error);
    res.status(500).json({ 
      message: 'Failed to generate threats',
      error: error.message 
    });
  }
});

module.exports = router;
