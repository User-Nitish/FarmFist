import React, { useState, useEffect, useCallback, useMemo } from 'react';
// Add this import at the top if not already present
import { 
  Container, Row, Col, Card, Button, Modal, Form, Alert, 
  Spinner, Badge, Table, Tab, Tabs, ListGroup, ProgressBar,
  OverlayTrigger, Tooltip, ButtonGroup, Dropdown, InputGroup
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import { 
  FiEye, FiPlus, FiAlertTriangle, FiCheckCircle, FiClock, 
  FiClipboard, FiCalendar, FiUser, FiMapPin, FiTag, 
  FiFileText, FiZap, FiActivity, FiTrendingUp, FiDownload,
  FiInfo, FiFilter, FiCalendar as FiCalendarIcon, FiList, FiGrid, FiBarChart2,
  FiCheckSquare, FiClock as FiClockIcon, FiCheck, FiX, FiSettings, FiSearch
} from 'react-icons/fi';
import { generateInsights } from '../utils/gemini';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Inspections = () => {
  const { user } = useAuth();
  const [inspections, setInspections] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loadingFarms, setLoadingFarms] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewingInspection, setViewingInspection] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [insights, setInsights] = useState(null);
  const [generatingInsights, setGeneratingInsights] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFarm, setSelectedFarm] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'inspectionDate', direction: 'asc' });

  const getInitialFormData = () => ({
    farmId: '',
    inspectionDate: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:MM
    inspectionType: 'routine',
    inspectorId: user?._id || '',
    inspectorName: user?.name || '',
    status: 'scheduled',
    notes: '',
    biosecurityChecks: {
      perimeterSecurity: { score: 0, notes: '', compliant: false },
      accessControl: { score: 0, notes: '', compliant: false },
      quarantineFacility: { score: 0, notes: '', compliant: false },
      wasteManagement: { score: 0, notes: '', compliant: false },
      disinfection: { score: 0, notes: '', compliant: false },
      pestControl: { score: 0, notes: '', compliant: false }
    },
    livestockHealth: {
      overallHealth: 'good',
      vaccinationStatus: 'up_to_date',
      diseaseSigns: [],
      mortalityRate: 0,
      feedQuality: 'good'
    },
    recommendations: [],
    overallScore: 0,
    complianceStatus: 'compliant',
    nextInspectionDate: '',
    notes: ''
  });

  const [formData, setFormData] = useState(getInitialFormData());

  // Fetch inspections data
  const fetchInspections = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching inspections...');
      const response = await axios.get(`${API_URL}/inspections`, {
        headers: { 
          'Authorization': `Bearer ${user?.token || localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Inspections API response:', response.data);
      const inspectionsData = response.data.inspections || response.data || [];
      
      // Log each inspection's status
      console.log('All inspections with their statuses:');
      inspectionsData.forEach(inspection => {
        console.log(`- ID: ${inspection._id}, Status: ${inspection.status || 'undefined'}, Date: ${inspection.inspectionDate}`);
      });
      
      setInspections(inspectionsData);
      setLoading(false);
      return inspectionsData;
    } catch (err) {
      console.error('Error fetching inspections:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError('Failed to load inspections. Please try again.');
      setLoading(false);
      return [];
    }
  }, [user?.token]);

  // Fetch farms data
  const fetchFarms = useCallback(async () => {
    try {
      setLoadingFarms(true);
      setError('');
      console.log('Fetching farms...');
      const token = user?.token || localStorage.getItem('token');
      console.log('Using token:', token ? 'Token exists' : 'No token found');
      
      const response = await axios.get(`${API_URL}/farms`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Farms API response:', response.data);
      const farmsData = response.data.farms || response.data || [];
      console.log('Setting farms:', farmsData);
      setFarms(farmsData);
      return farmsData;
    } catch (err) {
      console.error('Error fetching farms:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError('Failed to load farms. Please try again.');
      return [];
    } finally {
      setLoadingFarms(false);
    }
  }, [user?.token]);

  // Handle generating AI insights
  const handleGenerateInsights = async (inspection) => {
    try {
      setGeneratingInsights(true);
      const data = {
        ...inspection,
        farm: farms.find(f => f._id === inspection.farmId)
      };
      const result = await generateInsights(data, 'farm_inspection');
      setInsights(result);
    } catch (error) {
      console.error('Error generating insights:', error);
      setError('Failed to generate insights. Please try again.');
    } finally {
      setGeneratingInsights(false);
    }
  };

  // Get status badge with icon
  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    const statusConfig = {
      'completed': { bg: 'success', icon: <FiCheckCircle className="me-1" />, text: 'Completed' },
      'in-progress': { bg: 'warning', icon: <FiActivity className="me-1" />, text: 'In Progress', textDark: true },
      'pending': { bg: 'secondary', icon: <FiClockIcon className="me-1" />, text: 'Pending' },
      'scheduled': { bg: 'info', icon: <FiCalendarIcon className="me-1" />, text: 'Scheduled' },
      'cancelled': { bg: 'danger', icon: <FiX className="me-1" />, text: 'Cancelled' }
    };
    
    const config = statusConfig[statusLower] || { bg: 'light', text: 'Unknown', textDark: true };
    
    return (
      <Badge bg={config.bg} text={config.textDark ? 'dark' : null} className="d-inline-flex align-items-center">
        {config.icon || null}
        {config.text}
      </Badge>
    );
  };

  // Render inspections list with sorting and filtering
  const renderInspectionsList = (inspectionsToRender) => {
    if (loading) {
      return (
        <div className="text-center p-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading inspections...</p>
        </div>
      );
    }

    if (inspectionsToRender.length === 0) {
      return (
        <div className="text-center p-5 bg-light rounded">
          <FiClipboard size={48} className="text-muted mb-3" />
          <h5>No Inspections Found</h5>
          <p className="text-muted">
            {searchTerm || selectedFarm !== 'all' || dateRange.start || dateRange.end
              ? 'No inspections match your current filters.'
              : 'No inspections have been scheduled yet.'}
          </p>
          {(user?.role === 'inspector' || user?.role === 'admin') && (
            <Button variant="primary" onClick={() => setShowModal(true)}>
              <FiPlus className="me-1" /> Schedule Inspection
            </Button>
          )}
        </div>
      );
    }

    const requestSort = (key) => {
      let direction = 'asc';
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
      }
      setSortConfig({ key, direction });
    };

    const getSortIndicator = (key) => {
      if (sortConfig.key !== key) return null;
      return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    };

    const sortedInspections = [...inspectionsToRender].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return (
      <div className="table-responsive">
        <Table hover className="align-middle">
          <thead>
            <tr>
              <th 
                className="cursor-pointer"
                onClick={() => requestSort('inspectionDate')}
              >
                Date {getSortIndicator('inspectionDate')}
              </th>
              <th>Farm</th>
              <th>Inspector</th>
              <th 
                className="cursor-pointer"
                onClick={() => requestSort('status')}
              >
                Status {getSortIndicator('status')}
              </th>
              <th>Notes</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedInspections.map((inspection) => (
              <tr key={inspection._id}>
                <td>
                  <div className="d-flex align-items-center">
                    <FiCalendar className="me-2 text-muted" />
                    {new Date(inspection.inspectionDate).toLocaleDateString()}
                  </div>
                  <small className="text-muted">
                    {new Date(inspection.inspectionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </small>
                </td>
                <td>
                  {inspection.farmName || 'Unknown Farm'}
                </td>
                <td>{inspection.inspectorName || 'N/A'}</td>
                <td>{getStatusBadge(inspection.status)}</td>
                <td>
                  {inspection.notes ? (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>{inspection.notes}</Tooltip>}
                    >
                      <span className="d-inline-block text-truncate" style={{ maxWidth: '150px' }}>
                        {inspection.notes}
                      </span>
                    </OverlayTrigger>
                  ) : (
                    <span className="text-muted">No notes</span>
                  )}
                </td>
                <td className="text-end">
                  <ButtonGroup size="sm">
                    <Button
                      variant="outline-primary"
                      onClick={() => setViewingInspection(inspection)}
                      title="View Details"
                    >
                      <FiEye />
                    </Button>
                    {(user?.role === 'inspector' || user?.role === 'admin') && (
                      <Button
                        variant="outline-secondary"
                        onClick={() => {
                          setFormData({
                            ...inspection,
                            farmId: inspection.farmId
                          });
                          setShowModal(true);
                        }}
                        title="Edit"
                      >
                        <FiSettings />
                      </Button>
                    )}
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        
        <div className="d-flex justify-content-between align-items-center p-3 border-top">
          <div className="text-muted">
            Showing <strong>{sortedInspections.length}</strong> of <strong>{inspections.length}</strong> inspections
          </div>
        </div>
      </div>
    );
  };

  // Calculate inspection statistics
  const inspectionStats = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    const stats = {
      total: inspections.length,
      completed: 0,
      inProgress: 0,
      scheduled: 0,
      pending: 0,
      cancelled: 0,
      complianceRate: 0,
      pastDue: 0,
      completedThisMonth: 0,
      upcomingThisWeek: 0,
      averageCompletionTime: 0,
      completionTimes: []
    };
    
    inspections.forEach(inspection => {
      const status = inspection.status?.toLowerCase();
      const inspectionDate = new Date(inspection.inspectionDate);
      const isCompleted = status === 'completed';
      const isUpcoming = ['scheduled', 'in-progress', 'pending'].includes(status);
      
      // Count by status
      if (isCompleted) stats.completed++;
      else if (status === 'in-progress') stats.inProgress++;
      else if (status === 'scheduled') stats.scheduled++;
      else if (status === 'pending') stats.pending++;
      else if (status === 'cancelled') stats.cancelled++;
      
      // Check if inspection is past due
      if (isUpcoming && inspectionDate < now) {
        stats.pastDue++;
      }
      
      // Count completed this month
      if (isCompleted && inspectionDate >= thirtyDaysAgo) {
        stats.completedThisMonth++;
      }
      
      // Count upcoming this week
      if (isUpcoming) {
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(now.getDate() + 7);
        if (inspectionDate <= oneWeekFromNow) {
          stats.upcomingThisWeek++;
        }
      }
      
      // Calculate completion time for completed inspections
      if (isCompleted && inspection.completedAt) {
        const completedAt = new Date(inspection.completedAt);
        const timeToComplete = (completedAt - inspectionDate) / (1000 * 60 * 60); // in hours
        stats.completionTimes.push(timeToComplete);
      }
    });
    
    // Calculate average completion time
    if (stats.completionTimes.length > 0) {
      const sum = stats.completionTimes.reduce((a, b) => a + b, 0);
      stats.averageCompletionTime = Math.round(sum / stats.completionTimes.length * 10) / 10; // 1 decimal place
    }
    
    // Calculate compliance rate (percentage of completed out of total non-cancelled)
    const nonCancelled = inspections.filter(i => i.status?.toLowerCase() !== 'cancelled').length;
    stats.complianceRate = nonCancelled > 0 
      ? Math.round((stats.completed / nonCancelled) * 100) 
      : 0;
    
    console.log('=== Inspection Statistics ===');
    console.log('Total inspections:', stats.total);
    console.log('Completed inspections:', stats.completed);
    console.log('In progress inspections:', stats.inProgress);
    console.log('Scheduled inspections:', stats.scheduled);
    console.log('Pending inspections:', stats.pending);
    console.log('Cancelled inspections:', stats.cancelled);
    console.log('Compliance rate:', stats.complianceRate);
    console.log('Past due inspections:', stats.pastDue);
    console.log('Completed this month:', stats.completedThisMonth);
    console.log('Upcoming this week:', stats.upcomingThisWeek);
    console.log('Average completion time:', stats.averageCompletionTime);
    
    return stats;
  }, [inspections]);

  // Apply all filters and sorting to inspections
  const filteredInspections = useMemo(() => {
    console.log('=== Filtering Inspections ===');
    console.log('Active tab:', activeTab);
    
    // Log all inspections with their status for debugging
    console.log('All inspections with status:', 
      inspections.map(i => ({
        id: i._id,
        status: i.status || 'undefined',
        date: i.inspectionDate,
        farmId: i.farmId
      }))
    );
    
    let result = [...inspections];
    
    // Apply status filter based on active tab
    if (activeTab === 'upcoming') {
      console.log('Filtering for upcoming inspections');
      result = result.filter(inspection => {
        const status = (inspection.status || 'scheduled').toLowerCase();
        const isUpcoming = ['scheduled', 'in-progress', 'pending'].includes(status);
        console.log(`Inspection ${inspection._id}: status=${status}, isUpcoming=${isUpcoming}`);
        return isUpcoming;
      });
    } else if (activeTab === 'completed') {
      console.log('Filtering for completed inspections');
      result = result.filter(inspection => {
        const status = (inspection.status || '').toLowerCase();
        const isCompleted = status === 'completed';
        console.log(`Inspection ${inspection._id}: status=${status}, isCompleted=${isCompleted}`);
        return isCompleted;
      });
    }
    
    // Apply search filter
    if (searchTerm) {
      console.log('Filtering for search term:', searchTerm);
      result = result.filter(inspection => 
        (inspection.notes && inspection.notes.toLowerCase().includes(searchTerm)) ||
        (inspection.inspectorName && inspection.inspectorName.toLowerCase().includes(searchTerm)) ||
        (inspection.status && inspection.status.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply farm filter
    if (selectedFarm && selectedFarm !== 'all') {
      console.log('Filtering for farm:', selectedFarm);
      result = result.filter(inspection => inspection.farmId === selectedFarm);
    }
    
    // Apply date range filter
    if (dateRange.start) {
      console.log('Filtering for start date:', dateRange.start);
      const startDate = new Date(dateRange.start);
      result = result.filter(inspection => new Date(inspection.inspectionDate) >= startDate);
    }
    if (dateRange.end) {
      console.log('Filtering for end date:', dateRange.end);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999); // End of the day
      result = result.filter(inspection => new Date(inspection.inspectionDate) <= endDate);
    }
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [inspections, activeTab, searchTerm, selectedFarm, dateRange, sortConfig]);
  
  // Handle sort request
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };
  
  // Reset all filters
  const resetFilters = () => {
    // Reset all filter states here
    setSearchTerm('');
    setSelectedFarm('all');
    setDateRange({ start: null, end: null });
    setSortConfig({ key: 'inspectionDate', direction: 'desc' });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    let newValue = value;
    if (type === 'checkbox') {
      newValue = checked;
    } else if (type === 'number') {
      newValue = parseFloat(value) || 0;
    }
    
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: newValue
      };
      
      // Log the change for debugging
      console.log(`Field ${name} updated:`, { value: newValue, type });
      return updated;
    });
  };

  // Handle nested object changes
  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  // Handle biosecurity check changes
  const handleBiosecurityChange = (check, field, value) => {
    setFormData(prev => {
      // Ensure biosecurityChecks exists
      const biosecurityChecks = prev.biosecurityChecks || {};
      
      // Parse value based on field type
      let parsedValue = value;
      if (field === 'score') {
        parsedValue = parseInt(value, 10) || 0;
      } else if (field === 'compliant') {
        parsedValue = Boolean(value);
      }
      
      const updated = {
        ...prev,
        biosecurityChecks: {
          ...biosecurityChecks,
          [check]: {
            ...(biosecurityChecks[check] || {}),
            [field]: parsedValue
          }
        }
      };
      
      console.log('Biosecurity check updated:', { check, field, value, updated });
      return updated;
    });
  };

  // Handle form submission
 const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);
  setError('');

  try {
    // Basic validation
    if (!formData.farmId) {
      setError('Please select a farm');
      return;
    }

    // Ensure status is set, default to 'scheduled' if not provided
    const status = formData.status || 'scheduled';
    
    // Prepare the inspection data with proper defaults
    const inspectionData = {
      ...formData,
      status, // Make sure status is included
      inspectionDate: new Date(formData.inspectionDate).toISOString(),
      inspectorId: user?._id || formData.inspectorId || '',
      inspectorName: user?.name || formData.inspectorName || '',
      biosecurityChecks: formData.biosecurityChecks || {
        perimeterSecurity: { score: 0, notes: '', compliant: false },
        accessControl: { score: 0, notes: '', compliant: false },
        quarantineFacility: { score: 0, notes: '', compliant: false },
        wasteManagement: { score: 0, notes: '', compliant: false },
        disinfection: { score: 0, notes: '', compliant: false },
        pestControl: { score: 0, notes: '', compliant: false }
      }
    };

    console.log('Submitting inspection with data:', inspectionData);
    
    let response;
    if (formData._id) {
      // Update existing inspection
      response = await axios.put(
        `${API_URL}/inspections/${formData._id}`,
        inspectionData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token || localStorage.getItem('token')}`
          }
        }
      );
      console.log('Inspection updated:', response.data);
      setSuccess('Inspection updated successfully!');
    } else {
      // Create new inspection
      response = await axios.post(
        `${API_URL}/inspections`,
        inspectionData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token || localStorage.getItem('token')}`
          }
        }
      );
      console.log('Inspection created:', response.data);
      setSuccess('Inspection created successfully!');
    }

    // Reset form and close modal
    setFormData(getInitialFormData());
    setShowModal(false);
    
    // Refresh the inspections list
    await fetchInspections();
  } catch (err) {
    console.error('Error saving inspection:', {
      error: err,
      response: err.response?.data
    });
    
    const errorMessage = err.response?.data?.message || 'Failed to save inspection. Please try again.';
    setError(errorMessage);
  } finally {
    setSaving(false);
  }
};

  // Set up effect for data fetching
  useEffect(() => {
    const init = async () => {
      await fetchInspections();
      if (user?.role === 'inspector' || user?.role === 'admin' || user?.role === 'farmer') {
        const farmsData = await fetchFarms();
        console.log('Initial farms loaded:', farmsData);
      }
    };
    init();
  }, [fetchInspections, fetchFarms, user]);

  // Render inspection detail modal
  const renderInspectionDetail = () => {
    if (!viewingInspection) return null;
    
    const farm = farms.find(f => f._id === viewingInspection.farmId);
    
    return (
      <Modal show={!!viewingInspection} onHide={() => {
        setViewingInspection(null);
        setInsights(null);
      }} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Inspection Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="details" id="inspection-tabs">
            <Tab eventKey="details" title="Details">
              <div className="mb-4">
                <h5>Inspection Information</h5>
                <p><FiCalendar className="me-2" /> <strong>Date:</strong> {new Date(viewingInspection.inspectionDate).toLocaleDateString()}</p>
                <p><FiUser className="me-2" /> <strong>Inspector:</strong> {viewingInspection.inspectorName}</p>
                <p><FiMapPin className="me-2" /> <strong>Farm:</strong> {farm?.name || 'N/A'}</p>
                <p><FiTag className="me-2" /> <strong>Status:</strong> {getStatusBadge(viewingInspection.status)}</p>
              </div>
              
              <div className="mb-4">
                <h5>Findings</h5>
                <div className="p-3 bg-light rounded" dangerouslySetInnerHTML={{ 
                  __html: viewingInspection.notes || '<p class="text-muted">No notes available for this inspection.</p>' 
                }} />
              </div>
            </Tab>
            
            <Tab eventKey="insights" title="AI Insights">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5><FiActivity className="me-2" />AI-Powered Analysis</h5>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => handleGenerateInsights(viewingInspection)}
                  disabled={generatingInsights}
                >
                  {generatingInsights ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" className="me-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FiZap className="me-1" /> Generate Insights
                    </>
                  )}
                </Button>
              </div>
              
              {insights ? (
                <>
                  <Card className="mb-3">
                    <Card.Header>Summary</Card.Header>
                    <Card.Body>
                      <p>{insights.summary}</p>
                    </Card.Body>
                  </Card>
                  
                  <Card className="mb-3">
                    <Card.Header>Key Metrics</Card.Header>
                    <Card.Body>
                      <ListGroup variant="flush">
                        {insights.key_metrics?.length > 0 ? (
                          insights.key_metrics.map((metric, i) => (
                            <ListGroup.Item key={i}>
                              <FiTrendingUp className="text-primary me-2" />
                              {metric}
                            </ListGroup.Item>
                          ))
                        ) : (
                          <p className="text-muted">No metrics available. Generate insights to see key metrics.</p>
                        )}
                      </ListGroup>
                    </Card.Body>
                  </Card>
                  
                  <Card className="mb-3">
                    <Card.Header>Potential Risks</Card.Header>
                    <Card.Body>
                      {insights.risks?.length > 0 ? (
                        insights.risks.map((risk, i) => (
                          <Alert 
                            key={i} 
                            variant={
                              risk.severity === 'high' ? 'danger' : 
                              risk.severity === 'medium' ? 'warning' : 'info'
                            }
                            className="py-2"
                          >
                            <div className="d-flex align-items-center">
                              <FiAlertTriangle className="me-2" />
                              {risk.risk}
                            </div>
                          </Alert>
                        ))
                      ) : (
                        <p className="text-muted">No risks identified. Generate insights to analyze potential risks.</p>
                      )}
                    </Card.Body>
                  </Card>
                  
                  <Card>
                    <Card.Header>Recommendations</Card.Header>
                    <Card.Body>
                      {insights.recommendations?.length > 0 ? (
                        <ListGroup variant="flush">
                          {insights.recommendations.map((rec, i) => (
                            <ListGroup.Item key={i}>
                              <FiCheckCircle className="text-success me-2" />
                              {rec}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      ) : (
                        <p className="text-muted">No recommendations available. Generate insights to get recommendations.</p>
                      )}
                    </Card.Body>
                  </Card>
                </>
              ) : (
                <div className="text-center p-5 bg-light rounded">
                  <FiActivity size={48} className="text-muted mb-3" />
                  <h5>No Insights Generated Yet</h5>
                  <p className="text-muted">Click the "Generate Insights" button to analyze this inspection with AI.</p>
                  <Button 
                    variant="primary" 
                    onClick={() => handleGenerateInsights(viewingInspection)}
                    disabled={generatingInsights}
                  >
                    {generatingInsights ? 'Generating...' : 'Generate Insights'}
                  </Button>
                </div>
              )}
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setViewingInspection(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  // Styles for the page with background image
  const pageStyles = {
    minHeight: '100vh',
    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    backgroundRepeat: 'no-repeat',
    padding: '2rem',
    borderRadius: '16px',
    margin: '1rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: '16px',
      border: '1px solid rgba(0, 0, 0, 0.08)',
      pointerEvents: 'none',
      zIndex: 1
    }
  };

  // Card styles for inspection cards
  const cardStyles = {
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    marginBottom: '1.5rem',
    border: 'none',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
    }
  };

  // Card header styles
  const cardHeaderStyles = {
    borderTopLeftRadius: '12px',
    borderTopRightRadius: '12px',
    borderBottom: 'none',
    backgroundColor: '#f8f9fa',
    padding: '1rem 1.25rem',
    fontWeight: '600',
    color: '#2c3e50'
  };

  // Card body styles
  const cardBodyStyles = {
    padding: '1.25rem',
    backgroundColor: '#fff',
    borderBottomLeftRadius: '12px',
    borderBottomRightRadius: '12px'
  };

  return (
    <div style={pageStyles}>
      <Container fluid className="py-4">
        <Row className="mb-4">
          <Col>
            <h2>Inspections</h2>
            <p className="text-muted">Manage and track farm inspections with AI-powered insights</p>
          </Col>
          <Col className="text-end">
            {user?.role === 'inspector' || user?.role === 'admin' ? (
              <Button variant="primary" onClick={() => setShowModal(true)}>
                <FiPlus className="me-2" /> Schedule Inspection
              </Button>
            ) : (
              <OverlayTrigger
                placement="left"
                overlay={<Tooltip>Only inspectors can schedule inspections</Tooltip>}
              >
                <div className="d-inline-block">
                  <Button variant="secondary" disabled>
                    <FiPlus className="me-2" /> Schedule Inspection
                  </Button>
                </div>
              </OverlayTrigger>
            )}
          </Col>
        </Row>

        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
        {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <h2 className="mb-0 me-3">Inspections</h2>
            <Button 
              variant="outline-secondary" 
              size="sm" 
              className="me-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter className="me-1" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            {(searchTerm || selectedFarm !== 'all' || dateRange.start || dateRange.end) && (
              <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={resetFilters}
              >
                Clear Filters
              </Button>
            )}
          </div>
          <Button 
            variant="primary" 
            onClick={() => {
              setFormData(getInitialFormData());
              setShowModal(true);
            }}
          >
            <FiPlus className="me-1" /> Schedule Inspection
          </Button>
        </div>
        
        {showFilters && (
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Search</Form.Label>
                    <InputGroup>
                      <InputGroup.Text><FiSearch /></InputGroup.Text>
                      <Form.Control 
                        type="text" 
                        placeholder="Search inspections..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Farm</Form.Label>
                    <Form.Select 
                      value={selectedFarm}
                      onChange={(e) => setSelectedFarm(e.target.value)}
                    >
                      <option value="all">All Farms</option>
                      {farms.map(farm => (
                        <option key={farm._id} value={farm._id}>
                          {farm.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-3">
                    <Form.Label>From Date</Form.Label>
                    <Form.Control 
                      type="date" 
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-3">
                    <Form.Label>To Date</Form.Label>
                    <Form.Control 
                      type="date" 
                      value={dateRange.end}
                      min={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    />
                  </Form.Group>
                </Col>
                <Col md={1} className="d-flex align-items-end">
                  <Button 
                    variant="outline-secondary" 
                    onClick={resetFilters}
                    className="w-100"
                    disabled={!searchTerm && selectedFarm === 'all' && !dateRange.start && !dateRange.end}
                  >
                    Reset
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}
        
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
        >
          <Tab 
            eventKey="upcoming" 
            title={
              <span className="text-dark">
                <FiClock className="me-1" />
                Upcoming {inspections.filter(i => ['scheduled', 'in-progress', 'pending'].includes(i.status?.toLowerCase())).length > 0 && 
                  <Badge bg="primary" className="ms-1">
                    {inspections.filter(i => ['scheduled', 'in-progress', 'pending'].includes(i.status?.toLowerCase())).length}
                  </Badge>
                }
              </span>
            }
          >
            {renderInspectionsList(filteredInspections)}
          </Tab>
          <Tab 
            eventKey="completed" 
            title={
              <span className="text-dark">
                <FiCheckCircle className="me-1" />
                Completed {inspections.filter(i => i.status?.toLowerCase() === 'completed').length > 0 && 
                  <Badge bg="success" className="ms-1">
                    {inspections.filter(i => i.status?.toLowerCase() === 'completed').length}
                  </Badge>
                }
              </span>
            }
          >
            {renderInspectionsList(filteredInspections)}
          </Tab>
        </Tabs>

        {/* Inspection Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Schedule New Inspection</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit} id="inspectionForm">
              <Form.Group className="mb-3">
                <Form.Label>Farm</Form.Label>
                <div className="input-group">
                  <Form.Select 
                    name="farmId"
                    value={formData.farmId}
                    onChange={handleInputChange}
                    required
                    disabled={loadingFarms}
                    className={loadingFarms ? 'pe-5' : ''}
                  >
                    <option value="">
                      {loadingFarms ? 'Loading farms...' : 'Select a farm'}
                    </option>
                    {farms.length > 0 ? (
                      farms.map(farm => (
                        <option key={farm._id} value={farm._id}>
                          {farm.farmName || farm.name} - {farm.location?.address || 'No address'}
                        </option>
                      ))
                    ) : !loadingFarms ? (
                      <option value="" disabled>No farms available. Please add a farm first.</option>
                    ) : null}
                  </Form.Select>
                  <Button 
                    variant="outline-secondary" 
                    onClick={fetchFarms}
                    disabled={loadingFarms}
                    title="Refresh farms list"
                    type="button"
                  >
                    <i className={`bi bi-arrow-repeat${loadingFarms ? ' fa-spin' : ''}`}></i>
                  </Button>
                </div>
                {!loadingFarms && farms.length === 0 && (
                  <div className="text-muted small mt-1">
                    No farms found. <a href="/farms" className="text-primary">Add a farm</a> first.
                  </div>
                )}
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Inspection Date</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="inspectionDate"
                  value={formData.inspectionDate}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Inspector Name</Form.Label>
                {user?.role === 'inspector' || user?.role === 'admin' ? (
                  <Form.Control
                    type="text"
                    name="inspectorName"
                    value={user.name || formData.inspectorName}
                    onChange={handleInputChange}
                    required
                    readOnly={!!user.name}
                  />
                ) : (
                  <Alert variant="warning" className="mb-0">
                    Only inspectors can schedule inspections. Please contact an administrator.
                  </Alert>
                )}
              </Form.Group>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Inspection Type</Form.Label>
                    <Form.Select
                      name="inspectionType"
                      value={formData.inspectionType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="routine">Routine</option>
                      <option value="emergency">Emergency</option>
                      <option value="follow_up">Follow-up</option>
                      <option value="certification">Certification</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Overall Score (0-100)</Form.Label>
                    <Form.Control
                      type="number"
                      name="overallScore"
                      min="0"
                      max="100"
                      value={formData.overallScore}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Compliance Status</Form.Label>
                    <Form.Select
                      name="complianceStatus"
                      value={formData.complianceStatus}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="compliant">Compliant</option>
                      <option value="non_compliant">Non-Compliant</option>
                      <option value="conditional">Conditional</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any additional notes about the inspection..."
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              type="submit" 
              form="inspectionForm"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Inspection'}
            </Button>
          </Modal.Footer>
        </Modal>
        
        {renderInspectionDetail()}
        
        {user?.role !== 'inspector' && user?.role !== 'admin' && (
          <Alert variant="info" className="mt-4">
            <FiInfo className="me-2" />
            You need to be an inspector or administrator to schedule inspections. 
            Please contact your administrator if you need this access.
          </Alert>
        )}
      </Container>
    </div>
  );
};

export default Inspections;