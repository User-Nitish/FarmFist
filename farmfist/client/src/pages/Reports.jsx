import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Row, Col, Card, Button, Modal, Table,
  Form, Alert, Spinner, Badge, Tabs, Tab, ListGroup,
  ProgressBar, InputGroup, FormControl, Dropdown
} from 'react-bootstrap';
import { 
  FiFileText, FiDownload, FiPlus, FiFilter, FiClock, 
  FiAlertCircle, FiCheckCircle, FiShield, FiActivity, 
  FiDollarSign, FiAlertTriangle, FiInfo, FiZap, 
  FiLoader, FiShare2, FiBarChart2, FiPieChart, 
  FiTrendingUp, FiCalendar, FiEye, FiRefreshCw, 
  FiBarChart, FiSun, FiDroplet, FiWind, FiCloud, 
  FiCloudRain, FiCloudSnow, FiCloudLightning, 
  FiSunrise, FiSunset, FiCloudDrizzle 
} from 'react-icons/fi';

import { 
  FaLeaf, FaTree, FaTractor, FaHorse, FaCarrot, 
  FaAppleAlt, FaEgg, FaFeather, FaFish, FaWater, 
  FaMountain, FaMoon, FaPaw, FaUmbrella, 
  FaSeedling, FaSnowflake, FaBolt,
  FaTools, FaWrench, FaTint
} from 'react-icons/fa';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import { generatePdf, generatePdfFromHtml } from '../utils/reportPdfGenerator';
import { formatReportToText } from '../utils/reportFormatter';
import html2pdf from 'html2pdf.js';

// Styled components for decorative elements
const DecorativeElement = styled.div`
  position: fixed;
  opacity: 0.2;  
  z-index: -1;
  font-size: 6vw;  
  pointer-events: none;
  transition: all 0.8s ease;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 150px;  
  @media (max-width: 768px) {
    font-size: 10vw;  
    max-width: 120px;  
  }
`;

const TopLeftElement = styled(DecorativeElement)`
  top: 10px;
  left: 10px;
  transform: rotate(-15deg);
`;

const TopRightElement = styled(DecorativeElement)`
  top: 10px;
  right: 10px;
  transform: rotate(15deg);
`;

const BottomLeftElement = styled(DecorativeElement)`
  bottom: 10px;
  left: 10px;
  transform: rotate(15deg);
`;

const BottomRightElement = styled(DecorativeElement)`
  bottom: 10px;
  right: 10px;
  transform: rotate(-15deg);
`;

const MiddleTopElement = styled(DecorativeElement)`
  top: 10%;
  left: 50%;
  transform: translateX(-50%) rotate(5deg);
  font-size: 5vw;
  opacity: 0.15;
`;

const MiddleBottomElement = styled(DecorativeElement)`
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%) rotate(-5deg);
  font-size: 5vw;
  opacity: 0.15;
`;

const SideLeftElement = styled(DecorativeElement)`
  top: 50%;
  left: 10px;
  transform: translateY(-50%) rotate(-10deg);
  font-size: 5vw;
  opacity: 0.15;
`;

const SideRightElement = styled(DecorativeElement)`
  top: 50%;
  right: 10px;
  transform: translateY(-50%) rotate(10deg);
  font-size: 5vw;
  opacity: 0.15;
`;

// Farm-themed icon components - using only available icons
const FarmIcons = [
  // Basic farm elements
  FaLeaf, FaTree, FaTractor, FaHorse, FaCarrot, 
  FaAppleAlt, FaEgg, FaFeather,
  
  // Nature elements
  FaFish, FaWater, FaMountain, 
  FaMoon, FaPaw, FaUmbrella, 
  
  // Additional farm-related icons
  FaSeedling, // Small plant sprout
  FaSnowflake, // Snowflake
  FaBolt, // Lightning bolt
  
  // Farm tools and equipment
  FaTools, // General tools
  FaWrench, // Wrench (for equipment)
  
  // Weather and environment
  FaTint // Water drop (for irrigation)
];

// Get a random farm icon
const getRandomFarmIcon = () => {
  const RandomIcon = FarmIcons[Math.floor(Math.random() * FarmIcons.length)];
  return <RandomIcon />;
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Report status badge component
const ReportStatusBadge = ({ status }) => {
  const statusVariant = {
    completed: 'success',
    pending: 'warning',
    failed: 'danger',
    processing: 'info',
    generated: 'primary'
  }[status] || 'secondary';
  
  return <Badge bg={statusVariant} className="text-capitalize">{status}</Badge>;
};

// Report type icon component
const ReportTypeIcon = ({ type }) => {
  const iconMap = {
    biosecurity_audit: <FiShield className="me-2" />,
    health_report: <FiActivity className="me-2" />,
    production_summary: <FiBarChart2 className="me-2" />,
    financial_report: <FiDollarSign className="me-2" />,
    compliance_report: <FiCheckCircle className="me-2" />,
    risk_assessment: <FiAlertTriangle className="me-2" />,
    ai_insights: <FiZap className="me-2" />,
    default: <FiFileText className="me-2" />
  };
  
  return iconMap[type] || iconMap.default;
};

const Reports = () => {
  const { user } = useAuth();
  
  // Get random icons for all decorative elements
  const [decorativeIcons] = useState({
    topLeft: getRandomFarmIcon(),
    topRight: getRandomFarmIcon(),
    bottomLeft: getRandomFarmIcon(),
    bottomRight: getRandomFarmIcon(),
    middleTop: getRandomFarmIcon(),
    middleBottom: getRandomFarmIcon(),
    sideLeft: getRandomFarmIcon(),
    sideRight: getRandomFarmIcon()
  });
  const [reports, setReports] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [farmsLoading, setFarmsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [insights, setInsights] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    dateRange: 'all'
  });

  // Fetch reports
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/reports`, {
        headers: { Authorization: `Bearer ${user?.token || localStorage.getItem('token')}` }
      });
      setReports(response.data.reports || response.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  // Fetch farms when component mounts
  const fetchFarms = useCallback(async () => {
    setFarmsLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/farms`, {
        headers: { 
          'Authorization': `Bearer ${user?.token || localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setFarms(response.data.farms || []);
    } catch (err) {
      console.error('Error fetching farms:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError('Failed to load farms. Please try again.');
    } finally {
      setFarmsLoading(false);
    }
  }, [user?.token]);

  // Fetch reports when component mounts
  useEffect(() => {
    fetchReports();
    fetchFarms();
  }, [fetchFarms, fetchReports]);

  // Handle viewing AI insights for a report
  const handleViewInsights = async (report) => {
    try {
      setGenerating(true);
      setError('');
      
      // If we already have insights in the report, use them
      if (report.insights?.summary || report.aiAnalysis?.summary) {
        setSelectedReport(report);
        setShowViewModal(true);
        return;
      }

      // Otherwise, fetch fresh data
      const response = await axios.get(
        `${API_URL}/reports/${report._id}`,
        { 
          headers: { 
            'Authorization': `Bearer ${user?.token || localStorage.getItem('token')}`
          } 
        }
      );

      const updatedReport = response.data.report || response.data;
      
      if (!updatedReport.insights?.summary && !updatedReport.aiAnalysis?.summary) {
        throw new Error('No insights available for this report');
      }

      setSelectedReport(updatedReport);
      setShowViewModal(true);
    } catch (err) {
      console.error('Error fetching insights:', err);
      setError('Failed to load insights. ' + (err.response?.data?.message || err.message));
    } finally {
      setGenerating(false);
    }
  };

  // Generate AI report
  const generateAIReport = async (reportData) => {
    try {
      setGenerating(true);
      setError('');
      
      const response = await axios.post(
        `${API_URL}/reports/generate-ai`,
        reportData,
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token || localStorage.getItem('token')}`
          } 
        }
      );
      
      setSuccess('AI report generation started! This may take a moment...');
      
      // Poll for report completion
      const checkReportStatus = async () => {
        try {
          const statusResponse = await axios.get(
            `${API_URL}/reports/${response.data.reportId}`,
            { 
              headers: { 
                'Authorization': `Bearer ${user?.token || localStorage.getItem('token')}`
              } 
            }
          );
          
          const report = statusResponse.data.report || statusResponse.data;
          
          if (report.status === 'completed' || report.status === 'generated') {
            setSuccess('Report generated successfully!');
            fetchReports(); // Refresh the reports list
            setSelectedReport(report);
            setShowGenerateModal(false);
            setShowViewModal(true);
          } else if (report.status === 'failed') {
            throw new Error(report.error || 'Failed to generate report');
          } else {
            // If still processing, check again after delay
            setTimeout(checkReportStatus, 2000);
          }
        } catch (err) {
          console.error('Error checking report status:', err);
          setError('Failed to check report status: ' + (err.response?.data?.message || err.message));
        }
      };
      
      // Start polling for status
      setTimeout(checkReportStatus, 2000);
      
      return response.data;
    } catch (err) {
      console.error('Error generating AI report:', err);
      setError(err.response?.data?.message || 'Failed to generate AI report');
      throw err;
    } finally {
      setGenerating(false);
    }
  };

  // Handle downloading a report as PDF
  const handleDownloadReport = useCallback(async (report) => {
    try {
      setGenerating(true);
      setError('');
      
      // Use the existing report data if it's already loaded in the view modal
      let reportData = selectedReport?._id === report._id ? selectedReport : null;
      
      if (!reportData) {
        // If we don't have the full report data, fetch it
        const response = await axios.get(
          `${API_URL}/reports/${report._id}`,
          { 
            headers: { 
              'Authorization': `Bearer ${user?.token || localStorage.getItem('token')}`
            } 
          }
        );
        reportData = response.data.report || response.data;
      }

      // Ensure we have a summary
      if (!reportData.summary && reportData.insights?.summary) {
        reportData.summary = reportData.insights.summary;
      } else if (!reportData.summary) {
        reportData.summary = `Report generated on ${new Date(reportData.createdAt).toLocaleDateString()}.`;
      }

      // Generate and download the PDF
      const success = await generatePdfFromHtml(reportData, `report_${report._id}.pdf`);
      
      if (!success) {
        throw new Error('Failed to generate PDF');
      }
      
      setSuccess('Report downloaded successfully!');
    } catch (err) {
      console.error('Error downloading report:', err);
      setError('Failed to download report. ' + (err.response?.data?.message || err.message));
    } finally {
      setGenerating(false);
    }
  }, [user?.token, selectedReport]);

  // Filter reports based on active tab and filters
  const filteredReports = reports.filter(report => {
    // Filter by tab
    if (activeTab === 'ai' && report.reportType !== 'ai_insights') return false;
    if (activeTab === 'recent' && 
        (new Date() - new Date(report.createdAt)) > (30 * 24 * 60 * 60 * 1000)) return false;
    
    // Apply other filters
    if (filters.type && report.reportType !== filters.type) return false;
    if (filters.status && report.status !== filters.status) return false;
    
    return true;
  });

  return (
    <div>
      <Container fluid className="px-0 position-relative" style={{ position: 'relative', zIndex: 1 }}>
        {/* Decorative elements */}
        <TopLeftElement>{decorativeIcons.topLeft}</TopLeftElement>
        <TopRightElement>{decorativeIcons.topRight}</TopRightElement>
        <BottomLeftElement>{decorativeIcons.bottomLeft}</BottomLeftElement>
        <BottomRightElement>{decorativeIcons.bottomRight}</BottomRightElement>
        <MiddleTopElement>{decorativeIcons.middleTop}</MiddleTopElement>
        <MiddleBottomElement>{decorativeIcons.middleBottom}</MiddleBottomElement>
        <SideLeftElement>{decorativeIcons.sideLeft}</SideLeftElement>
        <SideRightElement>{decorativeIcons.sideRight}</SideRightElement>
        <Row className="mb-4">
          <Col>
            <h2>Reports</h2>
            <p className="text-muted">View and generate detailed farm reports with AI-powered insights</p>
          </Col>
          <Col className="text-end">
            <Button 
              variant="primary" 
              onClick={() => setShowGenerateModal(true)}
            >
              <FiPlus className="me-2" /> Generate Report
            </Button>
          </Col>
        </Row>

        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
        {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

        <Card className="mb-4" style={{ backgroundColor: 'var(--primary-50)' }}>
          <Card.Header className="border-bottom-0" style={{ backgroundColor: 'var(--primary-50)' }}>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-0"
            >
              <Tab eventKey="all" title={
                <span><FiFileText className="me-1" /> All Reports</span>
              } />
              <Tab eventKey="ai" title={
                <span><FiZap className="me-1" /> AI Insights</span>
              } />
              <Tab eventKey="recent" title={
                <span><FiClock className="me-1" /> Recent</span>
              } />
            </Tabs>
          </Card.Header>
          <Card.Body>
            <div className="d-flex justify-content-between mb-4">
              <div className="d-flex">
                <Form.Select 
                  className="me-2" 
                  style={{ width: '200px' }}
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                >
                  <option value="">All Types</option>
                  <option value="biosecurity_audit">Biosecurity Audit</option>
                  <option value="health_report">Health Report</option>
                  <option value="production_summary">Production Summary</option>
                  <option value="financial_report">Financial Report</option>
                  <option value="compliance_report">Compliance Report</option>
                  <option value="risk_assessment">Risk Assessment</option>
                  <option value="ai_insights">AI Insights</option>
                </Form.Select>
                <Form.Select 
                  className="me-2" 
                  style={{ width: '150px' }}
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="failed">Failed</option>
                  <option value="generated">Generated</option>
                </Form.Select>
              </div>
              <div>
                <Form.Control
                  type="text"
                  placeholder="Search reports..."
                  style={{ width: '250px' }}
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading reports...</p>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-5">
                <FiFileText size={48} className="text-muted mb-3" />
                <h5>No reports found</h5>
                <p className="text-muted">
                  {activeTab === 'ai' 
                    ? 'No AI-generated reports available. Generate a new AI report to get started.' 
                    : 'No reports match the current filters.'}
                </p>
                {activeTab === 'ai' && (
                  <Button 
                    variant="primary" 
                    onClick={() => setShowGenerateModal(true)}
                    className="mt-2"
                  >
                    <FiZap className="me-2" /> Generate AI Report
                  </Button>
                )}
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Report Title</th>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report) => (
                      <tr key={report._id} className="align-middle">
                        <td>
                          <div className="d-flex align-items-center">
                            <ReportTypeIcon type={report.reportType} />
                            <div>
                              <div className="fw-medium">{report.title}</div>
                              <small className="text-muted">
                                {report.farmId?.name || 'All Farms'}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td className="text-capitalize">
                          {report.reportType.replace('_', ' ')}
                        </td>
                        <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                        <td>
                          <ReportStatusBadge status={report.status} />
                        </td>
                        <td className="text-end">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            title="Download PDF"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadReport(report).catch(console.error);
                            }}
                            disabled={generating}
                          >
                            {generating && selectedReport?._id === report._id ? (
                              <Spinner as="span" animation="border" size="sm" className="me-1" />
                            ) : (
                              <FiDownload />
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* View Report Modal */}
        <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{selectedReport?.title || 'Report Details'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedReport && (
              <div className="report-view">
                <div className="mb-4">
                  <h5>Farm Information</h5>
                  <p><strong>Farm Name:</strong> {selectedReport.data?.farm?.name || selectedReport.farm?.name || 'N/A'}</p>
                  <p><strong>Report Period:</strong> {new Date(selectedReport.parameters?.startDate || selectedReport.report_period?.start).toLocaleDateString()} - {new Date(selectedReport.parameters?.endDate || selectedReport.report_period?.end).toLocaleDateString()}</p>
                </div>

                {selectedReport.summary && (
                  <div className="mb-4 p-3 bg-light rounded">
                    <h5>Summary</h5>
                    <p>{selectedReport.summary}</p>
                  </div>
                )}

                {console.log('Report Data:', JSON.stringify(selectedReport, null, 2))}
                {(selectedReport.insights?.summary || selectedReport.aiAnalysis?.summary) && (
                  <div className="mb-4 p-3 bg-light rounded">
                    <h5>AI Insights</h5>
                    <p>{selectedReport.insights?.summary || selectedReport.aiAnalysis?.summary}</p>
                    
                    {selectedReport.insights?.key_metrics && (
                      <div className="mb-3">
                        <h6>Key Metrics</h6>
                        <div className="bg-white p-3 rounded border">
                          {Object.entries(selectedReport.insights.key_metrics).map(([category, data]) => {
                            // If it's an object with metrics array, handle nested structure
                            if (data && typeof data === 'object' && data.metrics && Array.isArray(data.metrics)) {
                              return (
                                <div key={category} className="mb-3">
                                  <h6 className="text-capitalize">{category.replace(/_/g, ' ')}</h6>
                                  <ul className="mb-0">
                                    {data.metrics.map((metric, i) => (
                                      <li key={i} className="mb-1">
                                        {typeof metric === 'object' ? (
                                          <div>
                                            <strong>{metric.title || 'Metric'}:</strong> {metric.value || ''} {metric.unit || ''}
                                            {metric.description && (
                                              <div className="text-muted small">{metric.description}</div>
                                            )}
                                          </div>
                                        ) : (
                                          <div>{metric}</div>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            }
                            // Fallback for non-standard format
                            return (
                              <div key={category} className="mb-2">
                                <div>
                                  <strong>{category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> 
                                  {typeof data === 'object' ? JSON.stringify(data) : data}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {(selectedReport.insights?.risks?.length || selectedReport.aiAnalysis?.risks?.length) && (
                      <>
                        <h6>Risk Assessment</h6>
                        <ListGroup className="mb-3">
                          {(selectedReport.insights?.risks || selectedReport.aiAnalysis?.risks || []).map((risk, i) => (
                            <ListGroup.Item key={i} variant={risk.severity === 'High' ? 'danger' : risk.severity === 'Medium' ? 'warning' : 'info'}>
                              <div><strong>{risk.risk || risk.title || 'Risk'}</strong> ({risk.severity})</div>
                              {risk.recommendation && <div className="mt-1"><small>Recommendation: {risk.recommendation}</small></div>}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </>
                    )}

                    {(selectedReport.insights?.recommendations?.length || selectedReport.aiAnalysis?.recommendations?.length) && (
                      <>
                        <h6>Recommendations</h6>
                        <ListGroup>
                          {(selectedReport.insights?.recommendations || selectedReport.aiAnalysis?.recommendations || []).map((rec, i) => (
                            <ListGroup.Item key={i}>
                              {typeof rec === 'object' ? (
                                <div>
                                  <div><strong>{rec.title || 'Recommendation'}</strong></div>
                                  <div className="d-flex flex-wrap gap-3 mt-2">
                                    <small>Priority: <Badge bg={rec.priority === 'High' ? 'danger' : rec.priority === 'Medium' ? 'warning' : 'info'}>{rec.priority}</Badge></small>
                                    <small>Effort: <Badge bg="secondary">{rec.effort}</Badge></small>
                                    <small>Impact: <Badge bg={rec.impact === 'High' ? 'danger' : rec.impact === 'Medium' ? 'warning' : 'info'}>{rec.impact}</Badge></small>
                                    {rec.category && <small>Category: <Badge bg="light" text="dark">{rec.category}</Badge></small>}
                                  </div>
                                </div>
                              ) : (
                                rec
                              )}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </>
                    )}
                  </div>
                )}

                {selectedReport.sensorReadings?.length > 0 && (
                  <div className="mb-4">
                    <h5>Sensor Data</h5>
                    <div className="table-responsive">
                      <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>Timestamp</th>
                            <th>Temperature (°C)</th>
                            <th>Humidity (%)</th>
                            <th>Water Level (%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedReport.sensorReadings.map((reading, i) => (
                            <tr key={i}>
                              <td>{new Date(reading.timestamp).toLocaleString()}</td>
                              <td>{reading.temperature !== undefined ? reading.temperature.toFixed(1) : 'N/A'}</td>
                              <td>{reading.humidity !== undefined ? reading.humidity : 'N/A'}</td>
                              <td>{reading.waterLevel !== undefined ? reading.waterLevel : 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                )}

                {selectedReport.data && Object.keys(selectedReport.data).length > 0 && (
                  <div className="mb-4">
                    <h5>Additional Data</h5>
                    <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '4px', maxHeight: '300px', overflow: 'auto' }}>
                      {Object.entries(selectedReport.data).map(([key, value]) => {
                        // Handle different types of values
                        const formatValue = (val) => {
                          if (val === null) return 'N/A';
                          if (Array.isArray(val)) return val.map(v => formatValue(v)).join(', ');
                          if (typeof val === 'object') return Object.entries(val).map(([k, v]) => `${k}: ${formatValue(v)}`).join(' | ');
                          return String(val);
                        };
                        
                        // Format the key for display (convert camelCase to Title Case)
                        const formattedKey = key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, str => str.toUpperCase())
                          .trim();
                        
                        return (
                          <div key={key} className="mb-2">
                            <strong>{formattedKey}:</strong> {formatValue(value)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="outline-secondary" 
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(formatReportToText(selectedReport));
                  setSuccess('Report copied to clipboard as text!');
                  setTimeout(() => setSuccess(''), 3000);
                } catch (err) {
                  console.error('Failed to copy text: ', err);
                  setError('Failed to copy report to clipboard');
                }
              }}
              className="me-2"
            >
              Copy as Text
            </Button>
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>
              Close
            </Button>
            {!selectedReport?.insights?.summary && !selectedReport?.aiAnalysis?.summary && (
              <Button 
                variant="outline-primary" 
                onClick={async () => {
                  try {
                    setGenerating(true);
                    const response = await axios.post(
                      `${API_URL}/reports/${selectedReport._id}/generate-insights`,
                      {},
                      { 
                        headers: { 
                          'Authorization': `Bearer ${user?.token || localStorage.getItem('token')}`,
                          'Content-Type': 'application/json'
                        } 
                      }
                    );
                    
                    // Update the report with new insights
                    setSelectedReport(prev => ({
                      ...prev,
                      insights: response.data.insights
                    }));
                    
                    // Show success message
                    setSuccess('AI insights generated successfully!');
                  } catch (error) {
                    console.error('Error generating insights:', error);
                    setError(error.response?.data?.message || 'Failed to generate insights');
                  } finally {
                    setGenerating(false);
                  }
                }}
                disabled={generating}
                className="me-2"
              >
                {generating ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Generating Insights...
                  </>
                ) : (
                  <>
                    <FiZap className="me-1" /> Get AI Insights
                  </>
                )}
              </Button>
            )}
            <Button 
              variant="primary" 
              onClick={() => handleDownloadReport(selectedReport)}
              disabled={generating}
            >
              {generating ? 'Downloading...' : 'Download PDF'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Generate Report Modal */}
        <Modal show={showGenerateModal} onHide={() => setShowGenerateModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Generate New Report</Modal.Title>
          </Modal.Header>
          <Form onSubmit={async (e) => {
            e.preventDefault();
            setGenerating(true);
            setError('');
            
            try {
              const formData = new FormData(e.target);
              const farmId = formData.get('farmId');
              
              if (!farmId) {
                setError('Please select a farm');
                setGenerating(false);
                return;
              }
              
              const reportData = {
                title: formData.get('title').trim(),
                reportType: formData.get('reportType'),
                farmId: farmId,
                parameters: {
                  startDate: formData.get('startDate') || undefined,
                  endDate: formData.get('endDate') || undefined,
                  includeDetails: formData.get('includeDetails') === 'on'
                }
              };
              
              console.log('Sending report data:', JSON.stringify(reportData, null, 2));
              
              const response = await axios.post(
                `${API_URL}/reports/generate-ai`,
                reportData,
                { 
                  headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token || localStorage.getItem('token')}`
                  } 
                }
              );
              
              console.log('Response:', response.data);
              setSuccess(response.data.message || 'Report generation started!');
              
              // Poll for report completion
              const checkReportStatusInner = async () => {
                try {
                  const statusResponse = await axios.get(
                    `${API_URL}/reports/${response.data.reportId}`,
                    { 
                      headers: { 
                        'Authorization': `Bearer ${user?.token || localStorage.getItem('token')}`
                      } 
                    }
                  );
                  
                  const report = statusResponse.data.report;
                  if (report.status === 'completed') {
                    setSuccess('Report generated successfully!');
                    fetchReports();
                    setShowGenerateModal(false);
                    setSelectedReport(report);
                    setShowViewModal(true);
                  } else if (report.status === 'failed') {
                    throw new Error('Failed to generate report');
                  } else {
                    // If still processing, check again after delay
                    setTimeout(checkReportStatusInner, 2000);
                  }
                } catch (err) {
                  console.error('Error checking report status:', err);
                  setError('Failed to check report status');
                }
              };
              
              // Start polling for status
              setTimeout(checkReportStatusInner, 2000);
              
            } catch (err) {
              console.error('Error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
              });
              setError(err.response?.data?.message || 'Failed to generate report. Please check the form and try again.');
            } finally {
              setGenerating(false);
            }
          }}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Report Title</Form.Label>
                <Form.Control 
                  type="text" 
                  name="title" 
                  placeholder="e.g., Monthly Production Summary" 
                  required 
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Report Type</Form.Label>
                <Form.Select name="reportType" required>
                  <option value="">Select a report type</option>
                  <option value="production_summary">Production Summary</option>
                  <option value="health_report">Health Report</option>
                  <option value="biosecurity_audit">Biosecurity Audit</option>
                  <option value="financial_report">Financial Report</option>
                  <option value="compliance_report">Compliance Report</option>
                  <option value="risk_assessment">Risk Assessment</option>
                  <option value="ai_insights">AI Insights Report</option>
                </Form.Select>
              </Form.Group>
              
              {farmsLoading ? (
                <div className="text-center my-3">
                  <Spinner animation="border" size="sm" />
                  <span className="ms-2">Loading farms...</span>
                </div>
              ) : farms.length === 0 ? (
                <Alert variant="warning" className="mb-3">
                  <FiAlertCircle className="me-2" />
                  No farms found. Please create a farm before generating reports.
                </Alert>
              ) : (
                <Form.Group className="mb-3">
                  <Form.Label>Farm <span className="text-danger">*</span></Form.Label>
                  <Form.Select 
                    name="farmId" 
                    required
                    defaultValue=""
                  >
                    <option value="" disabled>Select a farm</option>
                    {farms.map(farm => (
                      <option key={farm._id} value={farm._id}>
                        {farm.farmName || `Farm ${farm._id.substring(0, 6)}`}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Select the farm this report is for
                  </Form.Text>
                </Form.Group>
              )}
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control 
                      type="date" 
                      name="startDate" 
                      defaultValue={new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0]} 
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control 
                      type="date" 
                      name="endDate" 
                      defaultValue={new Date().toISOString().split('T')[0]} 
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Check 
                  type="checkbox" 
                  id="includeDetails" 
                  name="includeDetails" 
                  label="Include detailed records" 
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowGenerateModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                disabled={generating || farmsLoading || farms.length === 0}
              >
                {generating ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Generating...
                  </>
                ) : (
                  'Generate Report'
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default Reports;