import html2pdf from 'html2pdf.js/dist/html2pdf.min.js';

export const generatePdf = async (elementId, filename = 'report.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Report element not found');
    return false;
  }

  // Create a clone of the element to avoid modifying the original
  const elementClone = element.cloneNode(true);
  elementClone.style.visibility = 'visible';
  elementClone.style.position = 'absolute';
  elementClone.style.left = '0';
  elementClone.style.top = '0';
  elementClone.style.width = '100%';
  
  // Append to body to ensure all styles are applied
  document.body.appendChild(elementClone);

  const opt = {
    margin: 15,
    filename: filename,
    image: { 
      type: 'jpeg', 
      quality: 0.98 
    },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: true,
      scrollY: 0
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    }
  };

  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await html2pdf()
      .set(opt)
      .from(elementClone)
      .save();
    
    document.body.removeChild(elementClone);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    if (elementClone.parentNode) {
      document.body.removeChild(elementClone);
    }
    return false;
  }
};

export const generatePdfFromHtml = async (reportData, filename = 'report.pdf') => {
  try {
    // Helper function to format dates
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Create HTML content for the PDF
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
        <h1 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
          ${reportData.title || 'Farm Report'}
        </h1>
        
        <div style="margin-bottom: 20px; background: #f8f9fa; padding: 15px; border-radius: 5px;">
          <h3>Farm Information</h3>
          <p><strong>Farm Name:</strong> ${reportData.farm?.name || 'N/A'}</p>
          <p><strong>Farm Type:</strong> ${reportData.farm?.type || 'N/A'}</p>
          <p><strong>Location:</strong> ${reportData.farm?.location?.address || 'N/A'}</p>
          <p><strong>Size:</strong> ${reportData.farm?.size ? `${reportData.farm.size} acres` : 'N/A'}</p>
        </div>

        <div style="margin-bottom: 20px; background: #f8f9fa; padding: 15px; border-radius: 5px;">
          <h3>Report Period</h3>
          <p><strong>Start Date:</strong> ${formatDate(reportData.report_period?.start || reportData.parameters?.startDate)}</p>
          <p><strong>End Date:</strong> ${formatDate(reportData.report_period?.end || reportData.parameters?.endDate)}</p>
        </div>

        ${reportData.summary ? `
          <div style="margin-bottom: 20px; background: #e8f4fd; padding: 15px; border-radius: 5px; border-left: 4px solid #3498db;">
            <h3>Summary</h3>
            <p>${reportData.summary}</p>
          </div>
        ` : ''}

        ${(reportData.insights?.summary || reportData.aiAnalysis?.summary) ? `
          <div style="margin-bottom: 20px; background: #f0f8ff; padding: 15px; border-radius: 5px; border-left: 4px solid #5d9cec;">
            <h3>AI Insights</h3>
            <p>${reportData.insights?.summary || reportData.aiAnalysis?.summary}</p>
            ${(reportData.insights?.key_metrics?.length || reportData.aiAnalysis?.keyMetrics?.length) ? `
              <h4>Key Metrics</h4>
              <ul>
                ${(reportData.insights?.key_metrics || reportData.aiAnalysis?.keyMetrics || []).map(metric => 
                  `<li>${typeof metric === 'object' ? metric.metric || JSON.stringify(metric) : metric}</li>`
                ).join('')}
              </ul>
            ` : ''}
            ${(reportData.insights?.risks?.length || reportData.aiAnalysis?.risks?.length) ? `
              <h4>Risk Assessment</h4>
              <ul style="list-style-type: none; padding-left: 0;">
                ${(reportData.insights?.risks || reportData.aiAnalysis?.risks || []).map(risk => `
                  <li style="margin-bottom: 10px; padding: 10px; background: #fff9f9; border-radius: 4px; border-left: 3px solid #ed5565;">
                    <strong>${risk.risk || risk.title || 'Risk'}</strong>
                    ${risk.severity ? `<span style="color: ${risk.severity === 'High' ? '#ed5565' : risk.severity === 'Medium' ? '#f8ac59' : '#1ab394'}; margin-left: 10px;">(${risk.severity})</span>` : ''}
                    ${risk.recommendation ? `<div style="margin-top: 5px;"><strong>Recommendation:</strong> ${risk.recommendation}</div>` : ''}
                  </li>
                `).join('')}
              </ul>
            ` : ''}
            ${(reportData.insights?.recommendations?.length || reportData.aiAnalysis?.recommendations?.length) ? `
              <h4>Recommendations</h4>
              <ul>
                ${(reportData.insights?.recommendations || reportData.aiAnalysis?.recommendations || []).map(rec => 
                  `<li>${rec}</li>`
                ).join('')}
              </ul>
            ` : ''}
          </div>
        ` : ''}

        ${reportData.sensorReadings?.length ? `
          <div style="margin-bottom: 20px; overflow-x: auto;">
            <h3>Sensor Data</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr style="background-color: #f2f2f2;">
                  <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Timestamp</th>
                  <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Temperature (°C)</th>
                  <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Humidity (%)</th>
                  <th style="padding: 12px; border: 1px solid #ddd; text-align: center;">Water Level (%)</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.sensorReadings.map(reading => `
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">${new Date(reading.timestamp).toLocaleString()}</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${reading.temperature !== undefined ? reading.temperature.toFixed(1) : 'N/A'}</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${reading.humidity !== undefined ? reading.humidity : 'N/A'}</td>
                    <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${reading.waterLevel !== undefined ? reading.waterLevel : 'N/A'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        ${reportData.data && Object.keys(reportData.data).length > 0 ? `
          <div style="margin-bottom: 20px;">
            <h3>Additional Data</h3>
            <pre style="background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto;">
              ${JSON.stringify(reportData.data, null, 2)}
            </pre>
          </div>
        ` : ''}

        <div style="margin-top: 30px; font-size: 0.9em; color: #666; text-align: center; border-top: 1px solid #eee; padding-top: 10px;">
          Report generated on ${new Date(reportData.generatedAt || reportData.createdAt || new Date()).toLocaleString()}
        </div>
      </div>
    `;

    const opt = {
      margin: 15,
      filename: filename,
      image: { 
        type: 'jpeg', 
        quality: 0.98 
      },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollY: 0,
        logging: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      }
    };

    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    document.body.appendChild(element);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await html2pdf()
      .set(opt)
      .from(element)
      .save();
    
    document.body.removeChild(element);
    return true;
  } catch (error) {
    console.error('Error generating PDF from HTML:', error);
    return false;
  }
};
