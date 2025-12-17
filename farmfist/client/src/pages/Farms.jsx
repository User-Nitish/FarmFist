import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, Row, Col, Button, Modal,
  Form, Alert, Spinner, Badge, Card,
  InputGroup, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext.jsx';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaTrash, FaEdit, FaPlus, FaSearch, 
  FaLeaf, FaTractor, FaEgg, FaHorse, 
  FaSeedling, FaShapes, FaInfoCircle,
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope,
  FaUser, FaCalendarAlt, FaRulerCombined,
  FaTools, FaCheckCircle, FaUserMd, 
  FaWarehouse, FaTint, FaShieldAlt, FaTrashAlt, FaProcedures,
  FaExclamationTriangle, FaChevronDown, FaLightbulb, FaChevronRight
} from 'react-icons/fa';
import { GiBarn, GiFarmer, GiFarmTractor } from 'react-icons/gi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaChartLine, FaClipboardCheck, FaUsers, FaChartPie, FaRegClock, FaRegCalendarAlt, FaRegChartBar, FaRegLightbulb, FaBolt } from 'react-icons/fa';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// Farm type icons mapping with React Icons
const farmTypeIcons = {
  poultry: <FaEgg className="text-warning" />,
  dairy: <FaHorse className="text-primary" />,
  livestock: <GiBarn className="text-secondary" />,
  pig: <FaSeedling className="text-danger" />,
  crop: <FaSeedling className="text-success" />,
  mixed: <FaShapes className="text-info" />,
  other: <FaTractor className="text-muted" />
};

// Farm type colors for badges
const farmTypeColors = {
  poultry: 'warning',
  dairy: 'primary',
  livestock: 'secondary',
  pig: 'danger',
  crop: 'success',
  mixed: 'info',
  other: 'dark'
};

// Facility icons mapping with React Icons
const facilityIcons = {
  'Veterinary Services': <FaUserMd className="text-danger" />,
  'Feed Storage': <FaWarehouse className="text-warning" />,
  'Water Supply': <FaTint className="text-info" />,
  'Biosecurity': <FaShieldAlt className="text-success" />,
  'Waste Management': <FaTrashAlt className="text-secondary" />,
  'Quarantine Area': <FaProcedures className="text-danger" />
};

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// FarmCard Component
const FarmCard = React.memo(({ farm, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const getFarmTypeColor = (type) => {
    const colors = {
      dairy: 'primary',
      poultry: 'warning',
      livestock: 'secondary',
      crop: 'success',
      mixed: 'info',
      other: 'dark'
    };
    return colors[type] || 'primary';
  };

  return (
    <motion.div 
      className="h-100"
      variants={itemVariants}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="h-100" style={{
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e3e9f2',
        backgroundColor: '#f8fafc',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }
      }}>
        <div 
          className="farm-header"
          style={{
            background: `linear-gradient(135deg, 
              var(--bs-${getFarmTypeColor(farm.farmType)}-bg-subtle) 0%, 
              var(--bs-${getFarmTypeColor(farm.farmType)}-bg-subtle) 100%)`,
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            padding: '1.5rem 0',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div className="farm-avatar">
            {farmTypeIcons[farm.farmType] || farmTypeIcons.other}
          </div>
        </div>
        
        <Card.Body className="pt-5 px-4 pb-4">
          <div className="text-center mb-4">
            <h5 className="mb-1">{farm.farmName}</h5>
            <Badge 
              bg={`${getFarmTypeColor(farm.farmType)}-subtle`} 
              text={getFarmTypeColor(farm.farmType)}
              className="mb-2"
            >
              {farm.farmType ? farm.farmType.charAt(0).toUpperCase() + farm.farmType.slice(1) : 'Farm'}
            </Badge>
          </div>
          
          <div className="mb-4">
            <div className="d-flex align-items-center mb-2 text-muted">
              <FaMapMarkerAlt className="me-2" />
              <small>{farm.address}, {farm.city}, {farm.state}</small>
            </div>
            
            <div className="d-flex justify-content-between mb-2">
              <div className="d-flex align-items-center text-muted">
                <GiFarmer className="me-2" />
                <small>Manager</small>
              </div>
              <span className="fw-medium">{farm.contactPerson || 'Not specified'}</span>
            </div>
            
            <div className="d-flex justify-content-between mb-2">
              <div className="d-flex align-items-center text-muted">
                <FaRulerCombined className="me-2" />
                <small>Size</small>
              </div>
              <span className="fw-medium">{farm.farmSize || 'N/A'} acres</span>
            </div>
            
            <div className="d-flex justify-content-between">
              <div className="d-flex align-items-center text-muted">
                <FaCalendarAlt className="me-2" />
                <small>Established</small>
              </div>
              <span className="fw-medium">
                {farm.establishedDate ? new Date(farm.establishedDate).getFullYear() : 'N/A'}
              </span>
            </div>
          </div>
          
          {farm.facilities && farm.facilities.length > 0 && (
            <div className="mb-4">
              <h6 className="text-uppercase small fw-bold text-muted mb-3">
                <FaTools className="me-1" /> Facilities
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {farm.facilities.slice(0, 3).map((facility, idx) => (
                  <OverlayTrigger
                    key={idx}
                    placement="top"
                    overlay={<Tooltip>{facility}</Tooltip>}
                  >
                    <Badge 
                      bg="light" 
                      text="dark" 
                      className="d-flex align-items-center px-3 py-2 rounded-pill"
                    >
                      <span className="me-1">
                        {facilityIcons[facility] || <FaCheckCircle />}
                      </span>
                      <span className="text-truncate" style={{maxWidth: '80px'}}>
                        {facility}
                      </span>
                    </Badge>
                  </OverlayTrigger>
                ))}
              </div>
            </div>
          )}
          
          <div className="d-flex justify-content-between align-items-center mt-3">
            <Badge bg={getFarmTypeColor(farm.farmType)} className="text-uppercase">
              {farm.farmType}
            </Badge>
            <div>
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={() => navigate(`/farms/${farm._id}`)}
                className="me-2"
                title="View Details"
              >
                <FaInfoCircle />
              </Button>
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={() => onEdit(farm)} 
                className="me-2"
                title="Edit Farm"
              >
                <FaEdit />
              </Button>
              <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={() => onDelete(farm._id)}
                title="Delete Farm"
              >
                <FaTrash />
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
});

// Add display name for better debugging
FarmCard.displayName = 'FarmCard';

// StatsCard Component
const StatsCard = ({ title, value, icon, color, progress = null }) => (
  <Card className="border-0 shadow-sm h-100">
    <Card.Body className="p-3">
      <div className="d-flex align-items-center">
        <div className="rounded-circle p-3 me-3" style={{ backgroundColor: `${color}15` }}>
          {React.cloneElement(icon, { className: `text-${color}`, size: 24 })}
        </div>
        <div>
          <h3 className="mb-0">{value}</h3>
          <p className="text-muted mb-0 small">{title}</p>
          {progress !== null && (
            <div className="mt-2">
              <div className="progress" style={{ height: '6px' }}>
                <div 
                  className={`progress-bar bg-${color}`} 
                  role="progressbar" 
                  style={{ width: `${progress}%` }}
                  aria-valuenow={progress} 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                ></div>
              </div>
              <small className="text-muted">{progress}% of target</small>
            </div>
          )}
        </div>
      </div>
    </Card.Body>
  </Card>
);

// QuickAction Component
const QuickAction = ({ icon, title, variant = 'primary', onClick }) => (
  <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
    <Button 
      variant={`outline-${variant}`} 
      className="d-flex flex-column align-items-center justify-content-center p-3 w-100 h-100 border-0 shadow-sm"
      onClick={onClick}
    >
      <div className="mb-2">{icon}</div>
      <span className="small">{title}</span>
    </Button>
  </motion.div>
);

// ActivityItem Component
const ActivityItem = ({ icon, title, time, color = 'primary' }) => (
  <div className="d-flex align-items-start mb-3">
    <div className={`bg-soft-${color} rounded-circle p-2 me-3`}>
      {React.cloneElement(icon, { className: `text-${color}`, size: 16 })}
    </div>
    <div className="flex-grow-1">
      <p className="mb-0 small">{title}</p>
      <small className="text-muted">{time}</small>
    </div>
  </div>
);

// Styles for the page with background image
const farmsPageStyles = {
  minHeight: '100vh',
backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.75)), url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80)',  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  backgroundRepeat: 'no-repeat',
  padding: '2rem',
  borderRadius: '16px',
  margin: '1rem',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'visible',
  border: '1px solid rgba(0, 0, 0, 0.08)'
};

const Farms = () => {
  const { logout } = useAuth();
  
  // State management
  const [farms, setFarms] = useState([]);
  const [filteredFarms, setFilteredFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [filters, setFilters] = useState({
    farmType: '',
    status: ''
  });
  
  // Inspection modal state
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [inspectionDate, setInspectionDate] = useState('');
  const [inspectionType, setInspectionType] = useState('routine');
  
  // State for threats and solutions
  const [selectedFarmForThreats, setSelectedFarmForThreats] = useState(null);
  const [threats, setThreats] = useState([]);
  const [loadingThreats, setLoadingThreats] = useState(false);
  const [threatError, setThreatError] = useState('');

  // Form state with initial values
  const initialFormData = {
    farmName: '',
    farmType: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    farmSize: '',
    capacity: {
      pigs: 0,
      poultry: 0,
      cattle: 0
    },
    establishedDate: new Date().toISOString().split('T')[0],
    status: 'active',
    contactPerson: '',
    contactNumber: '',
    email: '',
    biosecurityLevel: 'basic',
    facilities: [],
    description: '',
    biosecurity: {
      perimeterControl: {
        fencing: false,
        signage: false,
        controlledAccess: false,
        notes: ''
      },
      personnel: {
        dedicatedClothing: false,
        handwashingStations: false,
        footbaths: false,
        visitorLogs: false,
        notes: ''
      },
      vehicleHygiene: {
        disinfection: false,
        wheelWash: false,
        designatedParking: false,
        notes: ''
      },
      animalManagement: {
        quarantineArea: false,
        allInAllOut: false,
        ageGroupSeparation: false,
        pestControl: false,
        notes: ''
      },
      cleaningSanitation: {
        regularDisinfection: false,
        wasteManagement: false,
        mortalityDisposal: false,
        equipmentCleaning: false,
        notes: ''
      },
      pigSpecific: {
        farrowingArea: false,
        sickBay: false,
        rodentControl: false,
        feedStorage: false,
        notes: ''
      },
      pigHealth: {
        vaccinationProgram: false,
        dewormingSchedule: false,
        diseaseSurveillance: false,
        veterinaryVisits: false,
        notes: ''
      }
    }
  };
  
  const [formData, setFormData] = useState(initialFormData);

  // Fetch farms data
  const fetchFarms = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/farms`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // Ensure we're setting an array
      const farmsData = Array.isArray(response.data) ? response.data : (response.data.farms || []);
      setFarms(farmsData);
      setFilteredFarms(farmsData);
    } catch (error) {
      console.error('Error fetching farms:', error);
      setFarms([]); // Ensure farms is always an array
      setFilteredFarms([]);
      if (error.response?.status === 401) {
        logout();
        toast.error('Session expired. Please login again.');
      } else {
        toast.error('Failed to load farms. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    fetchFarms();
  }, [fetchFarms]);

  useEffect(() => {
    let result = [...farms];
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(farm => {
        const farmName = farm.farmName ? farm.farmName.toString().toLowerCase() : '';
        const farmType = farm.farmType ? farm.farmType.toString().toLowerCase() : '';
        const address = farm.address ? farm.address.toString().toLowerCase() : '';
        const contactPerson = farm.contactPerson ? farm.contactPerson.toString().toLowerCase() : '';
        
        return (
          farmName.includes(term) ||
          farmType.includes(term) ||
          address.includes(term) ||
          contactPerson.includes(term)
        );
      });
    }
    
    // Apply filters
    if (filters.farmType) {
      result = result.filter(farm => farm.farmType === filters.farmType);
    }
    
    setFilteredFarms(result);
  }, [searchTerm, filters, farms]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested objects like capacity
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Toggle facility selection
  const toggleFacility = (facility) => {
    setFormData(prev => {
      const facilities = prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility];
      return { ...prev, facilities };
    });
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setFormErrors({});
    setError('');
    setSuccess('');
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.farmName.trim()) newErrors.farmName = 'Farm name is required';
    if (!formData.farmType) newErrors.farmType = 'Please select a farm type';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.farmSize) newErrors.farmSize = 'Farm size is required';
    if (formData.farmSize && isNaN(formData.farmSize)) newErrors.farmSize = 'Farm size must be a number';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid 10-digit phone number';
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formIsValid = validateForm();
    if (!formIsValid) {
      toast.error('Please fix the form errors before submitting.');
      return;
    }
    
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const farmData = {
        farmName: formData.farmName,
        farmType: formData.farmType,
        location: {
          address: formData.address || undefined,
          city: formData.city || undefined,
          state: formData.state || undefined,
          pincode: formData.pincode || undefined,
        },
        farmSize: formData.farmSize || undefined,
        capacity: {
          pigs: formData.capacity.pigs ? parseInt(formData.capacity.pigs) : 0,
          poultry: formData.capacity.poultry ? parseInt(formData.capacity.poultry) : 0,
          cattle: formData.capacity.cattle ? parseInt(formData.capacity.cattle) : 0
        },
        establishedDate: formData.establishedDate || undefined,
        status: formData.status || undefined,
        contactPerson: formData.contactPerson || undefined,
        contactNumber: formData.contactNumber || undefined,
        email: formData.email || undefined,
        biosecurityLevel: formData.biosecurityLevel || undefined,
        facilities: formData.facilities.length > 0 ? formData.facilities : undefined,
        description: formData.description || undefined,
        biosecurity: formData.biosecurity || undefined
      };


      if (editingFarm) {
        // Update existing farm
        await axios.put(
          `${API_URL}/farms/${editingFarm._id}`, 
          farmData,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        toast.success('Farm updated successfully!');
      } else {
        // Create new farm
        await axios.post(
          `${API_URL}/farms`, 
          farmData,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        toast.success('Farm added successfully!');
      }
      
      // Refresh farms list and close modal
      fetchFarms();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving farm:', err);
      setError(err.response?.data?.message || 'Failed to save farm. Please try again.');
      toast.error(err.response?.data?.message || 'Failed to save farm. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle edit farm
  const handleEdit = (farm) => {
    setEditingFarm(farm);
    setFormData({
      farmName: farm.farmName || '',
      farmType: farm.farmType || '',
      address: farm.location?.address || '',
      city: farm.location?.city || '',
      state: farm.location?.state || '',
      pincode: farm.location?.pincode || '',
      farmSize: farm.farmSize || '',
      capacity: {
        pigs: farm.capacity?.pigs || 0,
        poultry: farm.capacity?.poultry || 0,
        cattle: farm.capacity?.cattle || 0
      },
      establishedDate: farm.establishedDate ? new Date(farm.establishedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      status: farm.status || 'active',
      contactPerson: farm.contactPerson || '',
      contactNumber: farm.contactNumber || '',
      email: farm.email || '',
      biosecurityLevel: farm.biosecurityLevel || 'basic',
      facilities: farm.facilities || [],
      description: farm.description || '',
      biosecurity: farm.biosecurity || {
        perimeterControl: {
          fencing: false,
          signage: false,
          controlledAccess: false,
          notes: ''
        },
        personnel: {
          dedicatedClothing: false,
          handwashingStations: false,
          footbaths: false,
          visitorLogs: false,
          notes: ''
        },
        vehicleHygiene: {
          disinfection: false,
          wheelWash: false,
          designatedParking: false,
          notes: ''
        },
        animalManagement: {
          quarantineArea: false,
          allInAllOut: false,
          ageGroupSeparation: false,
          pestControl: false,
          notes: ''
        },
        cleaningSanitation: {
          regularDisinfection: false,
          wasteManagement: false,
          mortalityDisposal: false,
          equipmentCleaning: false,
          notes: ''
        },
        pigSpecific: {
          farrowingArea: false,
          sickBay: false,
          rodentControl: false,
          feedStorage: false,
          notes: ''
        },
        pigHealth: {
          vaccinationProgram: false,
          dewormingSchedule: false,
          diseaseSurveillance: false,
          veterinaryVisits: false,
          notes: ''
        }
      }
    });
    setShowModal(true);
  };

  // Handle delete farm
  const handleDelete = async (farmId) => {
    if (window.confirm('Are you sure you want to delete this farm? This action cannot be undone.')) {
      try {
        await axios.delete(`${API_URL}/farms/${farmId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Farm deleted successfully');
        fetchFarms();
      } catch (err) {
        console.error('Error deleting farm:', err);
        toast.error('Failed to delete farm. Please try again.');
      }
    }
  };

  // Close modal and reset form
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFarm(null);
  };

  // Render the farms list
  if (loading && farms.length === 0) {
    return (
      <Container className="py-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <Spinner animation="border" variant="primary" />
          <span className="ms-3">Loading farms...</span>
        </div>
        <div className="text-center mt-4">
          <Button 
            variant="primary" 
            onClick={() => setShowModal(true)}
            className="d-inline-flex align-items-center"
          >
            <FaPlus className="me-2" /> Add New Farm
          </Button>
        </div>
      </Container>
    );
  }

  // Calculate farm stats
  const farmStats = {
    totalFarms: farms.length,
    totalArea: farms.reduce((sum, farm) => sum + (parseFloat(farm.farmSize) || 0), 0),
    avgFarmSize: farms.length > 0 ? (farms.reduce((sum, farm) => sum + (parseFloat(farm.farmSize) || 0), 0) / farms.length).toFixed(1) : 0,
    activeInspections: 0, // This would come from your API in a real app
    pendingTasks: 0, // This would come from your API in a real app
  };

  // Handle quick actions
  const handleQuickAction = (actionId) => {
    switch(actionId) {
      case 1: // Schedule Inspection
        // Navigate to the Inspections page
        window.location.href = '/inspections';
        break;
      case 2: // Add Livestock
        // Show a message or navigate to the livestock page
        toast.info('Livestock management feature is coming soon!');
        break;
      case 3: // View Reports
        // Navigate to the Reports page
        if (!window.location.pathname.includes('/reports')) {
          window.location.href = '/reports';
        }
        break;
      case 4: // Manage Workers
        // Show a message or navigate to the workers management page
        toast.info('Workers management feature is coming soon!');
        break;
      default:
        break;
    }
  };

  // Fetch potential threats and solutions using Gemini API
  const fetchThreatsForFarm = async (farm) => {
    setSelectedFarmForThreats(farm);
    setLoadingThreats(true);
    setThreatError('');
    
    try {
      // Call the Gemini API to get threats analysis
      const apiUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/gemini/threats`;
      console.log('Calling API:', apiUrl);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const requestData = {
        farmAddress: `${farm.address || ''} ${farm.city || ''} ${farm.state || ''} ${farm.pincode || ''}`.trim(),
        farmType: farm.farmType || 'general'
      };

      console.log('Request data:', JSON.stringify(requestData, null, 2));
      
      const response = await axios.post(
        apiUrl,
        requestData,
        { 
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          timeout: 30000, // 30 second timeout
          validateStatus: (status) => status < 500 // Don't throw for 4xx errors
        }
      );
      
      console.log('API Response:', response);
      
      if (response.status === 401) {
        throw new Error('Session expired. Please log in again.');
      }
      
      if (response.status === 200 && response.data && response.data.threats) {
        setThreats(response.data.threats);
      } else {
        const errorMsg = response.data?.message || 'No threats data received';
        console.error('Unexpected response:', response);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Error fetching threats:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });
      
      let errorMessage = 'Failed to fetch threats. ';
      if (error.response) {
        // Server responded with a status other than 2xx
        errorMessage += `Server responded with status ${error.response.status}: ${error.response.data?.message || 'Unknown error'}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage += 'No response from server. Please check your connection.';
      } else {
        // Something happened in setting up the request
        errorMessage += error.message;
      }
      
      setThreatError(errorMessage);
      setThreats([]);
    } finally {
      setLoadingThreats(false);
    }
  };

  // Handle inspection submission
  const handleScheduleInspection = () => {
    if (!inspectionDate) {
      toast.error('Please select a date for the inspection');
      return;
    }
    
    // Here you would typically make an API call to schedule the inspection
    console.log('Scheduling inspection:', { date: inspectionDate, type: inspectionType });
    
    // Show success message
    toast.success(`Inspection scheduled for ${new Date(inspectionDate).toLocaleDateString()}`);
    
    // Reset form and close modal
    setInspectionDate('');
    setInspectionType('routine');
    setShowInspectionModal(false);
  };

  // Quick actions configuration
  const quickActions = [
    { 
      id: 1, 
      title: 'Schedule Inspection', 
      icon: <FaClipboardCheck className="text-primary" />, 
      variant: 'primary',
      description: 'Schedule a new farm inspection'
    },
    { 
      id: 2, 
      title: 'Add Livestock', 
      icon: <GiFarmTractor className="text-success" />, 
      variant: 'success',
      description: 'Add new livestock to your farm'
    },
    { 
      id: 3, 
      title: 'View Reports', 
      icon: <FaChartLine className="text-info" />, 
      variant: 'info',
      description: 'View and analyze farm reports'
    },
    { 
      id: 4, 
      title: 'Manage Workers', 
      icon: <FaUsers className="text-warning" />, 
      variant: 'warning',
      description: 'Manage farm workers and permissions'
    }
  ];

  // Recent activities (in a real app, this would come from your API)
  const recentActivities = [
    { 
      id: 1, 
      title: 'New inspection scheduled for Poultry Farm', 
      time: '2 hours ago', 
      icon: <FaClipboardCheck />,
      color: 'primary'
    },
    { 
      id: 2, 
      title: 'Livestock count updated', 
      time: '5 hours ago', 
      icon: <GiFarmTractor />,
      color: 'success'
    },
    { 
      id: 3, 
      title: 'New worker added to Dairy Farm', 
      time: '1 day ago', 
      icon: <FaUsers />,
      color: 'info'
    },
    { 
      id: 4, 
      title: 'Crop rotation plan updated', 
      time: '2 days ago', 
      icon: <FaSeedling />,
      color: 'success'
    }
  ];

  return (
    <div style={farmsPageStyles}>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Container fluid className="py-4">
      {/* Stats Overview */}
      <Row className="mb-4 g-3">
        <Col xs={12} md={6} lg={3}>
          <StatsCard 
            title="Total Farms" 
            value={farmStats.totalFarms} 
            icon={<GiFarmTractor />} 
            color="primary"
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <StatsCard 
            title="Total Area (acres)" 
            value={farmStats.totalArea} 
            icon={<FaRulerCombined />} 
            color="success"
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <StatsCard 
            title="Active Inspections" 
            value={farmStats.activeInspections} 
            icon={<FaClipboardCheck />} 
            color="warning"
            progress={60}
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <StatsCard 
            title="Pending Tasks" 
            value={farmStats.pendingTasks} 
            icon={<FaRegClock />} 
            color="danger"
            progress={75}
          />
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <h5 className="card-title d-flex align-items-center">
                <FaBolt className="text-warning me-2" />
                Quick Actions
              </h5>
              <Row className="g-3">
                {quickActions.map(action => (
                  <Col xs={6} sm={4} md={3} key={action.id}>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>{action.description}</Tooltip>}
                    >
                      <div>
                        <QuickAction 
                          icon={action.icon}
                          title={action.title}
                          variant={action.variant}
                          onClick={() => handleQuickAction(action.id)}
                        />
                      </div>
                    </OverlayTrigger>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Inspection Scheduling Modal */}
      <Modal show={showInspectionModal} onHide={() => setShowInspectionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Schedule New Inspection</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Inspection Date</Form.Label>
              <Form.Control 
                type="date" 
                value={inspectionDate}
                onChange={(e) => setInspectionDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Inspection Type</Form.Label>
              <Form.Select 
                value={inspectionType}
                onChange={(e) => setInspectionType(e.target.value)}
              >
                <option value="routine">Routine Check</option>
                <option value="safety">Safety Inspection</option>
                <option value="compliance">Compliance Check</option>
                <option value="special">Special Inspection</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInspectionModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleScheduleInspection}>
            Schedule Inspection
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Search and Filter Bar */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body className="pb-0">
          <Row className="g-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0">
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search farms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-start-0"
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filters.farmType}
                onChange={(e) => setFilters({...filters, farmType: e.target.value})}
              >
                <option value="">All Farm Types</option>
                <option value="poultry">Poultry</option>
                <option value="dairy">Dairy</option>
                <option value="livestock">Livestock</option>
                <option value="pig">Pig</option>
                <option value="crop">Crop</option>
                <option value="mixed">Mixed</option>
                <option value="other">Other</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Under Maintenance</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className="g-4" style={{ alignItems: 'flex-start' }}>
        <Col lg={8} style={{ 
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto',
          position: 'sticky',
          top: '20px'
        }}>
          {/* Farms Grid */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">
                  <FaLeaf className="text-success me-2" />
                  My Farms
                </h5>
                <div className="d-flex">
                  <InputGroup className="me-2" style={{ width: '250px' }}>
                    <InputGroup.Text className="bg-white">
                      <FaSearch className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Search farms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-start-0"
                    />
                  </InputGroup>
                  <Button 
                    variant="primary" 
                    onClick={() => setShowModal(true)}
                    className="d-inline-flex align-items-center"
                  >
                    <FaPlus className="me-2" /> Add Farm
                  </Button>
                </div>
              </div>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading farms...</p>
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : filteredFarms.length === 0 ? (
                <div className="text-center py-5">
                  <FaTractor size={48} className="text-muted mb-3" />
                  <h5>No farms found</h5>
                  <p className="text-muted">Add a new farm to get started</p>
                  <Button 
                    variant="primary" 
                    onClick={() => setShowModal(true)}
                    className="mt-2"
                  >
                    <FaPlus className="me-1" /> Add Farm
                  </Button>
                </div>
              ) : (
                <Row xs={1} md={2} className="g-4">
                  {filteredFarms.map(farm => (
                    <Col key={farm._id}>
                      <FarmCard 
                        farm={farm} 
                        onEdit={handleEdit} 
                        onDelete={handleDelete} 
                      />
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>

          {/* Farm Tips & Recommendations Section */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <h5 className="card-title d-flex align-items-center">
                <FaLightbulb className="text-warning me-2" />
                Farm Tips & Recommendations
              </h5>
              <div className="mt-3">
                <div className="alert alert-info">
                  <strong>Seasonal Tip:</strong> Consider rotating your crops to maintain soil health and prevent pest buildup.
                </div>
                <div className="alert alert-light border">
                  <strong>Best Practice:</strong> Regular soil testing can help optimize fertilizer use and improve yields.
                </div>
                <div className="alert alert-light border">
                  <strong>Maintenance:</strong> Schedule equipment maintenance before the busy season to avoid breakdowns.
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4} style={{ 
          maxHeight: 'calc(100vh - 200px)',
          overflowY: 'auto',
          position: 'sticky',
          top: '20px'
        }}>
          {/* Add a bit of padding to prevent content from touching the scrollbar */}
          <div className="pe-2">
          {/* Recent Activities */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <h5 className="card-title d-flex align-items-center">
                <FaRegClock className="text-primary me-2" />
                Recent Activities
              </h5>
              <div className="mt-3">
                {recentActivities.map(activity => (
                  <ActivityItem 
                    key={activity.id}
                    icon={activity.icon}
                    title={activity.title}
                    time={activity.time}
                    color={activity.color}
                  />
                ))}
              </div>
            </Card.Body>
          </Card>
          
          {/* Farm Statistics */}
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="card-title d-flex align-items-center">
                <FaChartPie className="text-success me-2" />
                Farm Statistics
              </h5>
              <div className="mt-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted small">Poultry</span>
                  <span className="fw-medium small">35%</span>
                </div>
                <div className="progress mb-3" style={{ height: '6px' }}>
                  <div className="progress-bar bg-warning" style={{ width: '35%' }}></div>
                </div>
                
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted small">Dairy</span>
                  <span className="fw-medium small">25%</span>
                </div>
                <div className="progress mb-3" style={{ height: '6px' }}>
                  <div className="progress-bar bg-primary" style={{ width: '25%' }}></div>
                </div>
                
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted small">Crop</span>
                  <span className="fw-medium small">20%</span>
                </div>
                <div className="progress mb-3" style={{ height: '6px' }}>
                  <div className="progress-bar bg-success" style={{ width: '20%' }}></div>
                </div>
                
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted small">Livestock</span>
                  <span className="fw-medium small">15%</span>
                </div>
                <div className="progress mb-3" style={{ height: '6px' }}>
                  <div className="progress-bar bg-secondary" style={{ width: '15%' }}></div>
                </div>
                
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted small">Other</span>
                  <span className="fw-medium small">5%</span>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div className="progress-bar bg-dark" style={{ width: '5%' }}></div>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Row className="mt-4">
            {/* Farm Threats & Solutions Section - Full Width */}
            <Col md={12}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <h5 className="card-title d-flex align-items-center">
                    <FaShieldAlt className="text-danger me-2" />
                    Farm Threats & Solutions
                  </h5>
                  
                  {selectedFarmForThreats && (
                    <div className="alert alert-info mb-3">
                      Showing threats and solutions for: <strong>{selectedFarmForThreats.farmName}</strong>
                    </div>
                  )}
                  
                  {threatError && <Alert variant="warning">{threatError}</Alert>}
                  
                  {loadingThreats ? (
                    <div className="text-center py-4">
                      <Spinner animation="border" variant="primary" />
                      <p className="mt-2">Analyzing potential threats for your farm...</p>
                    </div>
                  ) : threats.length > 0 ? (
                    <div className="threats-container">
                      {threats.map((threat, index) => (
                        <Card key={index} className="mb-3">
                          <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                            <h6 className="mb-0">
                              <FaExclamationTriangle className="text-warning me-2" />
                              {threat.title}
                            </h6>
                            <Badge bg={threat.severity === 'High' ? 'danger' : threat.severity === 'Medium' ? 'warning' : 'info'}>
                              {threat.severity} Risk
                            </Badge>
                          </Card.Header>
                          <Card.Body>
                            <div className="mb-3">
                              <h6>Description:</h6>
                              <p>{threat.description}</p>
                            </div>
                            <div>
                              <h6>Recommended Solutions:</h6>
                              <ul className="mb-0">
                                {threat.solutions.map((solution, idx) => (
                                  <li key={idx}>{solution}</li>
                                ))}
                              </ul>
                            </div>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  ) : selectedFarmForThreats ? (
                    <Alert variant="info">
                      No specific threats detected for this location. This is a good sign, but always stay vigilant!
                    </Alert>
                  ) : (
                    <Alert variant="secondary">
                      Select a farm to analyze potential threats and get recommended solutions.
                    </Alert>
                  )}
                  
                  <div className="mt-3">
                    <h6>Analyze threats for a farm:</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {farms.slice(0, 3).map(farm => (
                        <Button 
                          key={farm._id}
                          variant={selectedFarmForThreats?._id === farm._id ? 'primary' : 'outline-primary'}
                          size="sm"
                          onClick={() => fetchThreatsForFarm(farm)}
                          disabled={loadingThreats}
                          className="d-flex align-items-center"
                        >
                          {farm.farmName}
                          {selectedFarmForThreats?._id === farm._id && loadingThreats && (
                            <Spinner size="sm" className="ms-2" />
                          )}
                        </Button>
                      ))}
                      {farms.length > 3 && (
                        <OverlayTrigger
                          placement="bottom"
                          overlay={
                            <Tooltip id="more-farms-tooltip">
                              {farms.slice(3).map(farm => (
                                <div key={farm._id} className="mb-1">
                                  <Button 
                                    variant="link" 
                                    className="p-0 text-white"
                                    onClick={() => fetchThreatsForFarm(farm)}
                                  >
                                    {farm.farmName}
                                  </Button>
                                </div>
                              ))}
                            </Tooltip>
                          }
                        >
                          <Button variant="outline-secondary" size="sm">
                            More Farms <FaChevronDown className="ms-1" />
                          </Button>
                        </OverlayTrigger>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          </div> {/* Close the padding div */}
        </Col>
      </Row>

      {/* Add/Edit Farm Modal */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="w-100">
            <div className="d-flex align-items-center">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, var(--bs-primary) 0%, var(--bs-primary-bg-subtle) 100%)'
                }}
              >
                <FaTractor className="text-white" />
              </div>
              <div>
                <h4 className="mb-0">{editingFarm ? 'Edit Farm' : 'Add New Farm'}</h4>
                <small className="text-muted">
                  {editingFarm ? 'Update your farm details' : 'Add a new farm to your account'}
                </small>
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="pt-0">
            <Row className="g-3">
              <Col md={6}>
                <Form.Group controlId="farmName" className="mb-3">
                  <Form.Label>Farm Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="farmName"
                    value={formData.farmName}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.farmName}
                    placeholder="Enter farm name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.farmName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="farmType" className="mb-3">
                  <Form.Label>Farm Type <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="farmType"
                    value={formData.farmType}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.farmType}
                  >
                    <option value="">Select farm type</option>
                    {Object.entries(farmTypeIcons).map(([type]) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.farmType}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="address" className="mb-3">
                  <Form.Label>Address <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.address}
                    placeholder="Enter farm address"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.address}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="farmSize" className="mb-3">
                  <Form.Label>Farm Size (acres) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    name="farmSize"
                    value={formData.farmSize}
                    onChange={handleInputChange}
                    isInvalid={!!formErrors.farmSize}
                    placeholder="Enter farm size in acres"
                    min="1"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.farmSize}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="contactPerson" className="mb-3">
                  <Form.Label>Contact Person <span className="text-danger">*</span></Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaUser /></InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.contactPerson}
                      placeholder="Enter contact person name"
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.contactPerson}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="contactNumber" className="mb-3">
                  <Form.Label>Contact Number <span className="text-danger">*</span></Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaPhoneAlt /></InputGroup.Text>
                    <Form.Control
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      isInvalid={!!formErrors.contactNumber}
                      placeholder="Enter contact number"
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.contactNumber}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Facilities</Form.Label>
                  <div className="d-flex flex-wrap gap-3">
                    {Object.entries(facilityIcons).map(([facility, icon]) => (
                      <Form.Check
                        key={facility}
                        type="checkbox"
                        id={facility}
                        label={
                          <span className="d-flex align-items-center">
                            {React.cloneElement(icon, { className: 'me-2' })}
                            {facility}
                          </span>
                        }
                        checked={formData.facilities.includes(facility)}
                        onChange={() => toggleFacility(facility)}
                      />
                    ))}
                  </div>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter farm description"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="mt-4">
            <Button variant="secondary" onClick={handleCloseModal} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={saving || !formData.farmName || !formData.farmType || !formData.address || !formData.contactPerson || !formData.contactNumber}
            >
              {saving ? (
                <>
                  <Spinner as="span" size="sm" animation="border" role="status" className="me-2" />
                  {editingFarm ? 'Updating...' : 'Creating...'}
                </>
              ) : editingFarm ? (
                'Update Farm'
              ) : (
                'Create Farm'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      </Container>
    </div>
  );
};

export default Farms;