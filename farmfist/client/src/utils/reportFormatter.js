/**
 * Converts AI insights from JSON format to plain text
 * @param {Object} report - The report object containing insights
 * @returns {string} Formatted plain text version of the insights
 */
const formatInsightsToText = (report) => {
  const insights = report.insights || report.aiAnalysis || {};
  if (!insights) return 'No insights available';

  let text = '';

  // Add summary if available
  if (insights.summary) {
    text += `AI INSIGHTS SUMMARY\n${'='.repeat(50)}\n${insights.summary}\n\n`;
  }

  // Add key metrics if available
  const keyMetrics = insights.key_metrics || insights.keyMetrics || [];
  if (keyMetrics.length > 0) {
    text += 'KEY METRICS\n' + '-'.repeat(50) + '\n';
    keyMetrics.forEach((metric, index) => {
      if (typeof metric === 'object') {
        text += `- ${metric.metric || JSON.stringify(metric)}\n`;
      } else {
        text += `- ${metric}\n`;
      }
    });
    text += '\n';
  }

  // Add risk assessment if available
  const risks = insights.risks || [];
  if (risks.length > 0) {
    text += 'RISK ASSESSMENT\n' + '-'.repeat(50) + '\n';
    
    // Group risks by severity
    const risksBySeverity = risks.reduce((acc, risk) => {
      const severity = risk.severity || 'Medium';
      if (!acc[severity]) acc[severity] = [];
      acc[severity].push(risk);
      return acc;
    }, {});

    // Add risks by severity level (High, Medium, Low)
    ['High', 'Medium', 'Low'].forEach(severity => {
      if (risksBySeverity[severity]?.length > 0) {
        text += `\n${severity} Severity:\n`;
        risksBySeverity[severity].forEach(risk => {
          text += `- ${risk.risk || risk.title || 'Risk'}`;
          if (risk.recommendation) {
            text += `\n  Recommendation: ${risk.recommendation}`;
          }
          text += '\n';
        });
      }
    });
    text += '\n';
  }

  // Add recommendations if available
  const recommendations = insights.recommendations || [];
  if (recommendations.length > 0) {
    text += 'RECOMMENDATIONS\n' + '-'.repeat(50) + '\n';
    recommendations.forEach((rec, index) => {
      if (typeof rec === 'object') {
        text += `${index + 1}. ${rec.title || 'Recommendation'}`;
        if (rec.description) text += `\n   ${rec.description}`;
        
        // Add metadata if available
        const meta = [];
        if (rec.priority) meta.push(`Priority: ${rec.priority}`);
        if (rec.impact) meta.push(`Impact: ${rec.impact}`);
        if (rec.effort) meta.push(`Effort: ${rec.effort}`);
        if (meta.length > 0) {
          text += `\n   (${meta.join(', ')})`;
        }
      } else {
        text += `${index + 1}. ${rec}`;
      }
      text += '\n\n';
    });
  }

  // Add additional data if no other insights were found
  if (text.trim() === '' && report.data) {
    text += 'ADDITIONAL DATA\n' + '-'.repeat(50) + '\n';
    text += JSON.stringify(report.data, null, 2);
  }

  return text.trim();
};

/**
 * Formats a complete report to plain text
 * @param {Object} report - The report object
 * @returns {string} Formatted plain text version of the report
 */
const formatReportToText = (report) => {
  if (!report) return 'No report data available';

  let text = `REPORT: ${report.title || 'Untitled Report'}\n`;
  text += '='.repeat(60) + '\n\n';

  // Add basic report info
  text += `Farm: ${report.data?.farm?.name || report.farmId?.name || 'N/A'}\n`;
  text += `Type: ${report.reportType ? report.reportType.replace('_', ' ').toUpperCase() : 'N/A'}\n`;
  text += `Date: ${new Date(report.createdAt || Date.now()).toLocaleDateString()}\n`;
  text += `Status: ${report.status || 'N/A'}\n\n`;

  // Add summary if available
  if (report.summary) {
    text += 'SUMMARY\n' + '-'.repeat(60) + '\n';
    text += `${report.summary}\n\n`;
  }

  // Add insights
  const insightsText = formatInsightsToText(report);
  if (insightsText) {
    text += insightsText + '\n\n';
  }

  // Add sensor data if available
  if (report.sensorReadings?.length > 0) {
    text += 'SENSOR READINGS\n' + '-'.repeat(60) + '\n';
    text += 'Timestamp                 | Temp (°C) | Humidity | Water Level\n';
    text += '-'.repeat(60) + '\n';
    
    report.sensorReadings.forEach(reading => {
      const date = new Date(reading.timestamp).toLocaleString();
      const temp = reading.temperature !== undefined ? reading.temperature.toFixed(1).padStart(6) : 'N/A';
      const humidity = reading.humidity !== undefined ? String(reading.humidity).padStart(7) : 'N/A';
      const waterLevel = reading.waterLevel !== undefined ? String(reading.waterLevel).padStart(11) : 'N/A';
      text += `${date.padEnd(25)} | ${temp} | ${humidity}% | ${waterLevel}%\n`;
    });
    text += '\n';
  }

  return text.trim();
};

export { formatInsightsToText, formatReportToText };
