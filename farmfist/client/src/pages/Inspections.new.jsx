import React, { useState, useEffect, useCallback } from 'react';
// Add this import at the top if not already present
import { useAuth } from '../context/AuthContext';
import { 
  Container, Row, Col, Card, Button, Modal, Form, Alert, 
  Spinner, Badge, Table, Tab, Tabs, ListGroup, ProgressBar 
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import { 
  FiEye, FiPlus, FiAlertTriangle, FiCheckCircle, FiClock, 
  FiClipboard, FiCalendar, FiUser, FiMapPin, FiTag, 
  FiFileText, FiZap, FiActivity, FiTrendingUp, FiDownload
} from 'react-icons/fi';
import { generateInsights } from '../utils/gemini';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Inspections = () => {
  const { user, logout } = useAuth();
  const [inspections, setInspections] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewingInspection, setViewingInspection] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [insights, setInsights] = useState(null);
  const [generatingInsights, setGeneratingInsights] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const [formData, setFormData] = useState({
    farmId: '',
    inspectionDate: '',
    inspectionType: 'routine',
    notes: ''
  });

  // Fetch farms when component mounts
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await axios.get(`${API_URL}/farms`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setFarms(response.data.farms);
      } catch (error) {
        console.error('Error fetching farms:', error);
        setError('Failed to load farms. Please try again later.');
      }
    };

    if (user) {
      fetchFarms();
    }
  }, [user]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.post(
        `${API_URL}/inspections`,
        {
          ...formData,
          inspectionDate: new Date(formData.inspectionDate).toISOString()
        },
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );
      
      setSuccess('Inspection scheduled successfully!');
      setInspections([response.data.inspection, ...inspections]);
      setShowModal(false);
      // Reset form
      setFormData({
        farmId: '',
        inspectionDate: '',
        inspectionType: 'routine',
        notes: ''
      });
    } catch (error) {
      console.error('Error scheduling inspection:', error);
      setError(error.response?.data?.message || 'Failed to schedule inspection');
    } finally {
      setSaving(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
        return <Badge bg="success">Completed</Badge>;
      case 'scheduled':
        return <Badge bg="info">Scheduled</Badge>;
      case 'in_progress':
        return <Badge bg="warning" text="dark">In Progress</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">Pending</Badge>;
    }
  };

  // Filter inspections based on active tab
  const filteredInspections = inspections.filter(inspection => {
    if (activeTab === 'upcoming') {
      return new Date(inspection.date) > new Date() && inspection.status !== 'completed';
    } else if (activeTab === 'completed') {
      return inspection.status === 'completed';
    }
    return true; // Show all for 'all' tab
  });

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2>Inspections</h2>
          <p className="text-muted">Manage and track farm inspections with AI-powered insights</p>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <FiPlus className="me-2" /> Schedule Inspection
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      <Card className="mb-4">
        <Card.Header className="bg-white border-bottom-0">
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-0"
          >
            <Tab eventKey="upcoming" title={
              <span><FiClock className="me-1" /> Upcoming</span>
            } />
            <Tab eventKey="completed" title={
              <span><FiCheckCircle className="me-1" /> Completed</span>
            } />
            <Tab eventKey="all" title={
              <span><FiFileText className="me-1" /> All Inspections</span>
            } />
          </Tabs>
        </Card.Header>
      </Card>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading inspections...</p>
        </div>
      ) : (
        <Card>
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Farm</th>
                  <th>Date</th>
                  <th>Inspector</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInspections.length > 0 ? (
                  filteredInspections.map((inspection) => {
                    const farm = farms.find(f => f._id === inspection.farmId);
                    return (
                      <tr key={inspection._id} className="align-middle">
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-2">
                              <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{width: '36px', height: '36px'}}>
                                <FiMapPin className="text-primary" />
                              </div>
                            </div>
                            <div>
                              <div className="fw-medium">{farm?.name || 'Unknown Farm'}</div>
                              <small className="text-muted">{farm?.location || 'Location not specified'}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="text-nowrap">
                            {new Date(inspection.date).toLocaleDateString()}
                          </div>
                          <small className="text-muted">
                            {new Date(inspection.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </small>
                        </td>
                        <td>{inspection.inspectorName || 'N/A'}</td>
                        <td>{getStatusBadge(inspection.status)}</td>
                        <td className="text-end">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-1"
                            onClick={() => {
                              setViewingInspection(inspection);
                              setInsights(null);
                            }}
                            title="View details"
                          >
                            <FiEye />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      <div className="py-4">
                        <FiClipboard size={48} className="text-muted mb-3" />
                        <h5>No {activeTab} inspections found</h5>
                        <p className="text-muted">
                          {activeTab === 'upcoming' 
                            ? 'You have no upcoming inspections scheduled.' 
                            : 'No completed inspections found.'}
                        </p>
                        {activeTab === 'upcoming' && (
                          <Button variant="primary" onClick={() => setShowModal(true)}>
                            <FiPlus className="me-2" /> Schedule New Inspection
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          
          {filteredInspections.length > 0 && (
            <div className="d-flex justify-content-between align-items-center p-3 border-top">
              <div className="text-muted">
                Showing <strong>{filteredInspections.length}</strong> of <strong>{inspections.length}</strong> inspections
              </div>
              <div>
                <Button variant="outline-secondary" size="sm" className="me-2">
                  <FiDownload className="me-1" /> Export
                </Button>
                <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
                  <FiPlus className="me-1" /> New Inspection
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
      
      {renderInspectionDetail()}
      
      {/* Add Inspection Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Schedule New Inspection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3" controlId="farmSelect">
                  <Form.Label>Select Farm</Form.Label>
                  <Form.Select 
                    value={formData.farmId} 
                    onChange={(e) => setFormData({...formData, farmId: e.target.value})}
                    required
                  >
                    <option value="">Select a farm</option>
                    {farms.map(farm => (
                      <option key={farm._id} value={farm._id}>
                        {farm.farmName} - {farm.location?.address || 'No address'}
                      </option>
            setShowModal(false);
          }}>
            Schedule Inspection
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Inspections;
