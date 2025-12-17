import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert, Badge, ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaUser, FaCalendarAlt, FaRulerCombined, FaTools, FaSeedling, FaClipboardCheck, FaInfoCircle, FaShieldAlt, FaUserMd, FaBuilding, FaTint, FaTrashAlt, FaClipboardList, FaShieldVirus, FaEdit } from 'react-icons/fa';
import { GiBarn, GiFarmer, GiChickenOven, GiPig } from 'react-icons/gi';
import { FiFileText } from 'react-icons/fi';
import { Tab, Tabs } from 'react-bootstrap';
import BiosecurityTab from '../components/BiosecurityTab';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const farmTypeIcons = {
  poultry: <FaSeedling className="text-warning" />,
  dairy: <GiBarn className="text-primary" />,
  livestock: <GiFarmer className="text-secondary" />,
  crop: <FaSeedling className="text-success" />,
  mixed: <FaSeedling className="text-info" />,
  other: <FaSeedling className="text-muted" />
};

const facilityIcons = {
  'Veterinary Services': <FaUserMd />,
  'Feed Storage': <FaBuilding />,
  'Water Supply': <FaTint />,
  'Biosecurity': <FaShieldAlt />,
  'Waste Management': <FaTrashAlt />,
  'Quarantine Area': <FaClipboardList />,
};

const FarmDetail = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const [farm, setFarm] = useState(null);
  const [inspections, setInspections] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('biosecurity'); // Changed from 'overview' to 'biosecurity' for testing

  useEffect(() => {
    const fetchFarmDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const farmResponse = await axios.get(`${API_URL}/farms/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setFarm(farmResponse.data.farm);

        // Fetch inspections related to this farm
        const inspectionsResponse = await axios.get(`${API_URL}/inspections/farm/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setInspections(inspectionsResponse.data.inspections);

        // Fetch reports related to this farm
        const reportsResponse = await axios.get(`${API_URL}/reports/farm/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setReports(reportsResponse.data.reports);

      } catch (err) {
        console.error('Error fetching farm details:', err);
        if (err.response?.status === 401) {
          logout();
          setError('Session expired. Please login again.');
        } else {
          setError(err.response?.data?.message || 'Failed to load farm details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFarmDetails();
  }, [id, logout]);

  const handleUpdateFarm = async (updatedData) => {
    try {
      const response = await axios.put(
        `${API_URL}/farms/${id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setFarm(response.data.farm);
      return response.data.farm;
    } catch (error) {
      console.error('Error updating farm:', error);
      setError('Failed to update farm details');
      throw error;
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading farm details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!farm) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="info">
          Farm not found.
        </Alert>
        <Link to="/farms" className="btn btn-primary mt-3">Back to Farms</Link>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <Container className="py-4">
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Row className="mb-4">
              <Col md={8}>
                <h2>
                  {farm.farmName} 
                  {farm.farmType === 'poultry' ? (
                    <GiChickenOven className="text-warning ms-2" />
                  ) : farm.farmType === 'pig' ? (
                    <GiPig className="text-danger ms-2" />
                  ) : farm.farmType === 'both' ? (
                    <>
                      <GiChickenOven className="text-warning ms-2" />
                      <GiPig className="text-danger ms-2" />
                    </>
                  ) : (
                    <GiBarn className="text-primary ms-2" />
                  )}
                </h2>
                <p className="text-muted">
                  <FaMapMarkerAlt className="me-2" />
                  {farm.location?.address}, {farm.location?.city}, {farm.location?.state} - {farm.location?.pincode}
                </p>
              </Col>
              <Col md={4} className="text-md-end">
                <Link to={`/farms/${id}/edit`} className="btn btn-primary me-2">
                  <FaEdit className="me-2" /> Edit Farm
                </Link>
                <Button variant="outline-secondary" onClick={() => window.history.back()}>
                  Back to List
                </Button>
              </Col>
            </Row>
            
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-4"
              id="farm-detail-tabs"
              style={{
                '--bs-nav-tabs-link-active-bg': '#0d6efd',
                '--bs-nav-tabs-link-active-color': '#fff',
                '--bs-nav-tabs-border-color': '#dee2e6',
                '--bs-nav-tabs-link-hover-border-color': '#e9ecef #e9ecef #dee2e6',
                '--bs-nav-tabs-link-color': '#495057',
                '--bs-nav-tabs-link-hover-color': '#0d6efd'
              }}
            >
              <Tab 
                eventKey="overview" 
                title={
                  <span className={activeTab === 'overview' ? 'text-white' : 'text-dark'}>
                    <FaInfoCircle className="me-1" /> Overview
                  </span>
                }
                tabClassName={activeTab === 'overview' ? 'active' : 'text-dark'}
              >
                <div className="mt-4">
                <Row className="mt-4">
                  <Col lg={8} className="mb-4">
                    <Card className="h-100" style={{
                      borderRadius: '12px',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                      border: '1px solid #e3e9f2',
                      backgroundColor: '#f8fafc',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      ':hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                      }
          }}>
            <Card.Body>
              <h5 className="mb-3 d-flex align-items-center"><FaInfoCircle className="me-2" /> Farm Overview</h5>
              <Row>
                <Col md={6} className="mb-3">
                  <h6><FaMapMarkerAlt className="me-2 text-danger" /> Location</h6>
                  <p className="text-muted mb-1">{farm.address}, {farm.city}, {farm.state} - {farm.pincode}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h6><FaRulerCombined className="me-2 text-info" /> Size</h6>
                  <p className="text-muted mb-1">{farm.farmSize} acres</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h6><FaCalendarAlt className="me-2 text-success" /> Established Date</h6>
                  <p className="text-muted mb-1">{new Date(farm.establishedDate).toLocaleDateString()}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <h6><FaShieldAlt className="me-2 text-warning" /> Biosecurity Level</h6>
                  <p className="text-muted mb-1">{farm.biosecurityLevel}</p>
                </Col>
                <Col xs={12} className="mb-3">
                  <h6>Description</h6>
                  <p className="text-muted">{farm.description || 'No description provided.'}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} className="mb-4">
          <Card className="h-100" style={{
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e3e9f2',
            backgroundColor: '#f8fafc',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
            }
          }}>
            <Card.Body>
              <h5 className="mb-3 d-flex align-items-center"><FaUser className="me-2" /> Contact Info</h5>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex align-items-center px-0">
                  <FaUser className="me-3 text-muted" />
                  <span>{farm.contactPerson}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex align-items-center px-0">
                  <FaPhoneAlt className="me-3 text-muted" />
                  <span>{farm.contactNumber}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex align-items-center px-0">
                  <FaEnvelope className="me-3 text-muted" />
                  <span>{farm.email}</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Capacity & Facilities */}
      <Row>
        <Col lg={6} className="mb-4">
          <Card className="h-100" style={{
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e3e9f2',
            backgroundColor: '#f8fafc',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
            }
          }}>
            <Card.Body>
              <h5 className="mb-3 d-flex align-items-center"><FaTools className="me-2" /> Capacity & Facilities</h5>
              <Row>
                <Col md={4} className="mb-3">
                  <h6>Pigs</h6>
                  <p className="text-muted">{farm.capacity?.pigs || 0}</p>
                </Col>
                <Col md={4} className="mb-3">
                  <h6>Poultry</h6>
                  <p className="text-muted">{farm.capacity?.poultry || 0}</p>
                </Col>
                <Col md={4} className="mb-3">
                  <h6>Cattle</h6>
                  <p className="text-muted">{farm.capacity?.cattle || 0}</p>
                </Col>
                <Col xs={12}>
                  <h6>Facilities</h6>
                  {farm.facilities && farm.facilities.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {farm.facilities.map((facility, index) => (
                        <Badge key={index} bg="info" className="d-flex align-items-center">
                          {facilityIcons[facility] || <FaTools className="me-1" />}
                          <span className="ms-1">{facility.replace('_', ' ')}</span>
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No facilities listed.</p>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="h-100" style={{
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e3e9f2',
            backgroundColor: '#f8fafc',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
            }
          }}>
            <Card.Body>
              <h5 className="mb-3 d-flex align-items-center"><FaClipboardCheck className="me-2" /> Recent Inspections</h5>
              {inspections.length > 0 ? (
                <ListGroup variant="flush">
                  {inspections.slice(0, 3).map(inspection => (
                    <ListGroup.Item key={inspection._id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <Link to={`/inspections/${inspection._id}`} className="fw-bold text-decoration-none">
                          {inspection.inspectionType.replace('_', ' ').toUpperCase()} ({new Date(inspection.inspectionDate).toLocaleDateString()})
                        </Link>
                        <p className="text-muted mb-0">Inspector: {inspection.inspectorId?.name || 'N/A'}</p>
                      </div>
                      <Badge bg={inspection.complianceStatus === 'compliant' ? 'success' : inspection.complianceStatus === 'conditional' ? 'warning' : 'danger'}>
                        {inspection.overallScore}/10 - {inspection.complianceStatus}
                      </Badge>
                    </ListGroup.Item>
                  ))}
                  {inspections.length > 3 && (
                    <ListGroup.Item className="text-center">
                      <Link to={`/inspections?farmId=${farm._id}`} className="btn btn-link">View All Inspections</Link>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              ) : (
                <Alert variant="info">No inspections found for this farm.</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Reports */}
      <Row>
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3 d-flex align-items-center"><FiFileText className="me-2" /> Recent Reports</h5>
              {reports.length > 0 ? (
                <ListGroup variant="flush">
                  {reports.slice(0, 3).map(report => (
                    <ListGroup.Item key={report._id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <Link to={`/reports/${report._id}`} className="fw-bold text-decoration-none">
                          {report.title} ({new Date(report.createdAt).toLocaleDateString()})
                        </Link>
                        <p className="text-muted mb-0">Type: {report.reportType.replace('_', ' ')}</p>
                      </div>
                      <Badge bg={report.status === 'final' ? 'success' : report.status === 'draft' ? 'info' : 'secondary'}>
                        {report.status}
                      </Badge>
                    </ListGroup.Item>
                  ))}
                  {reports.length > 3 && (
                    <ListGroup.Item className="text-center">
                      <Link to={`/reports?farmId=${farm._id}`} className="btn btn-link">View All Reports</Link>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              ) : (
                <Alert variant="info">No reports found for this farm.</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
                </div>
              </Tab>
              <Tab 
                eventKey="biosecurity" 
                title={
                  <span className={activeTab === 'biosecurity' ? 'text-white' : 'text-dark'}>
                    <FaShieldAlt className="me-1" /> Biosecurity
                  </span>
                }
                tabClassName={activeTab === 'biosecurity' ? 'active' : 'text-dark'}
              >
                <div className="mt-4">
                  <BiosecurityTab farm={farm} onUpdate={handleUpdateFarm} />
                </div>
              </Tab>
              <Tab 
                eventKey="inspections" 
                title={
                  <span className={activeTab === 'inspections' ? 'text-white' : 'text-dark'}>
                    <FaClipboardCheck className="me-1" /> Inspections
                  </span>
                }
                tabClassName={activeTab === 'inspections' ? 'active' : 'text-dark'}
              >
                <div className="mt-4">
                  <h4><FaClipboardCheck className="me-2" /> Farm Inspections</h4>
                  {inspections.length > 0 ? (
                    <div className="mt-3">
                      {inspections.map(inspection => (
                        <Card key={inspection._id} className="mb-3">
                          <Card.Body>
                            <div className="d-flex justify-content-between">
                              <div>
                                <h5>{inspection.inspectionType}</h5>
                                <p className="text-muted mb-1">
                                  {new Date(inspection.inspectionDate).toLocaleDateString()}
                                </p>
                                <p className="mb-0">
                                  Status: <Badge bg={inspection.status === 'passed' ? 'success' : 'danger'}>{inspection.status}</Badge>
                                </p>
                              </div>
                              <div>
                                <Button variant="outline-primary" size="sm" as={Link} to={`/inspections/${inspection._id}`}>
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Alert variant="info" className="mt-3">
                      No inspections found for this farm.
                    </Alert>
                  )}
                </div>
              </Tab>
              {(farm.farmType === 'poultry' || farm.farmType === 'both') && (
                <Tab 
                  eventKey="poultry-biosecurity" 
                  title={
                    <span><GiChickenOven className="me-1" /> Poultry Biosecurity</span>
                  }
                >
                  <div className="mt-4">
                    <BiosecurityTab 
                      farm={farm} 
                      onUpdate={handleUpdateFarm} 
                      farmType="poultry"
                    />
                  </div>
                </Tab>
              )}
              
              {(farm.farmType === 'pig' || farm.farmType === 'both') && (
                <Tab 
                  eventKey="pig-biosecurity" 
                  title={
                    <span><GiPig className="me-1" /> Pig Biosecurity</span>
                  }
                >
                  <div className="mt-4">
                    <BiosecurityTab 
                      farm={farm} 
                      onUpdate={handleUpdateFarm} 
                      farmType="pig"
                    />
                  </div>
                </Tab>
              )}
            </Tabs>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default FarmDetail;