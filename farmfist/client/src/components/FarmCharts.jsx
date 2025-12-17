import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FarmCharts = ({ farms = [], inspections = [] }) => {
  // Process data for farm type distribution chart
  const processFarmTypeData = () => {
    const farmTypes = {};
    
    // Initialize with all possible farm types to ensure consistent colors
    const allFarmTypes = ['poultry', 'dairy', 'livestock', 'crop', 'mixed', 'other'];
    allFarmTypes.forEach(type => {
      farmTypes[type] = 0;
    });
    
    // Count actual farm types
    farms.forEach(farm => {
      const type = farm.farmType?.toLowerCase() || 'other';
      farmTypes[type] = (farmTypes[type] || 0) + 1;
    });

    // Filter out farm types with zero counts
    const labels = [];
    const data = [];
    
    Object.entries(farmTypes).forEach(([type, count]) => {
      if (count > 0 || allFarmTypes.includes(type)) {
        labels.push(type.charAt(0).toUpperCase() + type.slice(1));
        data.push(count);
      }
    });

    return {
      labels,
      datasets: [
        {
          label: 'Number of Farms',
          data,
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
          ].slice(0, labels.length),
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ].slice(0, labels.length),
          borderWidth: 1,
        },
      ],
    };
  };

  const processInspectionTrends = () => {
    // Group inspections by month
    const monthlyData = {};
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5); // Get last 6 months
    sixMonthsAgo.setDate(1); // Start from the first day of the month
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // Initialize with empty data for last 6 months
    const labels = [];
    const data = [];
    
    // Create array of the last 6 months
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(now.getMonth() - (5 - i));
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      
      const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      labels.push(monthYear);
      monthlyData[monthYear] = 0;
    }

    // Count inspections per month
    inspections.forEach(inspection => {
      if (!inspection) return;
      
      let inspectionDate;
      try {
        inspectionDate = new Date(inspection.inspectionDate || inspection.createdAt || Date.now());
        // Ensure the date is valid
        if (isNaN(inspectionDate.getTime())) {
          console.warn('Invalid inspection date:', inspection.inspectionDate || inspection.createdAt);
          return;
        }
      } catch (e) {
        console.warn('Error parsing inspection date:', e);
        return;
      }
      
      // Only process inspections from the last 6 months
      if (inspectionDate >= sixMonthsAgo) {
        const monthYear = inspectionDate.toLocaleString('default', { month: 'short', year: '2-digit' });
        if (monthlyData.hasOwnProperty(monthYear)) {
          monthlyData[monthYear]++;
        }
      }
    });

    // Ensure data is in the correct order
    labels.forEach(label => {
      data.push(monthlyData[label] || 0);
    });

    return {
      labels,
      datasets: [
        {
          label: 'Inspections',
          data,
          fill: false,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          tension: 0.4,
          pointBackgroundColor: 'rgba(75, 192, 192, 1)',
          pointBorderColor: '#fff',
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75, 192, 192, 1)',
          pointHoverBorderColor: 'rgba(220, 220, 220, 1)',
          pointHitRadius: 10,
          pointBorderWidth: 2,
        },
      ],
    };
  };

  const processComplianceData = () => {
    const statusCounts = {
      compliant: 0,
      'needs-improvement': 0,
      'non-compliant': 0,
      'not-set': 0, // For farms without a compliance status
    };

    // Count farms by compliance status
    farms.forEach(farm => {
      if (!farm) return;
      
      const status = (farm.complianceStatus || 'not-set').toLowerCase();
      if (statusCounts.hasOwnProperty(status)) {
        statusCounts[status]++;
      } else {
        // For any unexpected status values
        statusCounts['not-set']++;
      }
    });

    // Only include statuses that have counts > 0
    const labels = [];
    const data = [];
    const backgroundColors = [];
    const borderColors = [];

    const statusConfig = [
      { 
        key: 'compliant', 
        label: 'Compliant',
        bgColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)'
      },
      { 
        key: 'needs-improvement', 
        label: 'Needs Improvement',
        bgColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)'
      },
      { 
        key: 'non-compliant', 
        label: 'Non-Compliant',
        bgColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)'
      },
      { 
        key: 'not-set', 
        label: 'Not Set',
        bgColor: 'rgba(201, 203, 207, 0.6)',
        borderColor: 'rgba(201, 203, 207, 1)'
      }
    ];

    statusConfig.forEach(config => {
      if (statusCounts[config.key] > 0 || config.key === 'not-set') {
        labels.push(config.label);
        data.push(statusCounts[config.key]);
        backgroundColors.push(config.bgColor);
        borderColors.push(config.borderColor);
      }
    });

    // If no data, show a message
    if (data.every(count => count === 0)) {
      return {
        labels: ['No Data'],
        datasets: [{
          data: [1],
          backgroundColor: ['rgba(201, 203, 207, 0.6)'],
          borderColor: ['rgba(201, 203, 207, 1)'],
          borderWidth: 1,
        }]
      };
    }

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          stepSize: 1,
        },
        grid: {
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    elements: {
      line: {
        tension: 0.3,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 12,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
    },
    cutout: '60%',
    radius: '80%',
  };
  
  // Memoize chart data to prevent unnecessary re-renders
  const farmTypeData = React.useMemo(() => processFarmTypeData(), [farms]);
  const complianceData = React.useMemo(() => processComplianceData(), [farms]);
  const inspectionTrendsData = React.useMemo(() => processInspectionTrends(), [inspections]);

  return (
    <Row className="g-4 mb-4">
      {/* Farm Types Distribution */}
      <Col md={6} lg={4}>
        <Card className="h-100">
          <Card.Body>
            <Card.Title>Farm Types</Card.Title>
            <div style={{ height: '300px' }}>
              <Pie data={farmTypeData} options={pieOptions} />
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* Compliance Status */}
      <Col md={6} lg={4}>
        <Card className="h-100">
          <Card.Body>
            <Card.Title>Compliance Status</Card.Title>
            <div style={{ height: '300px' }}>
              <Pie data={complianceData} options={pieOptions} />
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* Inspection Trends */}
      <Col md={12} lg={4}>
        <Card className="h-100">
          <Card.Body>
            <Card.Title>Inspection Trends (Last 6 Months)</Card.Title>
            <div style={{ height: '300px' }}>
              <Line data={inspectionTrendsData} options={chartOptions} />
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default FarmCharts;
