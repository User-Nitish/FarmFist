import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Alert, 
  Spinner, 
  Image, 
  Badge, 
  ProgressBar,
  OverlayTrigger,
  Tooltip,
  Modal,
  FormGroup,
  FormLabel,
  FormControl,
  FormSelect
} from 'react-bootstrap';
import styled from 'styled-components';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaUpload,
  FaCheckCircle,
  FaGraduationCap,
  FaLeaf,
  FaRuler,
  FaBolt,
  FaPlusCircle,
  FaCalendarAlt,
  FaChartLine,
  FaCog,
  FaTint,
  FaArrowUp,
  FaCheck,
  FaSun,
  FaInfoCircle,
  FaPlus,
  FaClock,
  FaEllipsisV,
  FaDove,
  FaPiggyBank,
  FaExclamationTriangle,
  FaClipboardCheck,
  FaClipboardList,
  FaUtensils,
  FaClinicMedical,
  FaTractor, 
  FaTree, 
  FaHorse, 
  FaCarrot, 
  FaAppleAlt, 
  FaEgg, 
  FaSeedling, 
  FaCloudRain, 
  FaTools, 
  FaCow, 
  FaArrowRight,
  FaEye,
  FaTrash,
  FaHistory,
  FaFeather,
  FaUmbrella
} from 'react-icons/fa';
import axios from 'axios';
import './Profile.css';

// Decorative Elements
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

// Positioned decorative elements
const TopLeftElement = styled(DecorativeElement)`
  top: 10px;
  left: 10px;
  transform: rotate(-15deg);
  font-size: 5vw;
  opacity: 0.15;
`;

const TopRightElement = styled(DecorativeElement)`
  top: 10px;
  right: 10px;
  transform: rotate(15deg);
  font-size: 5vw;
  opacity: 0.15;
`;

const BottomLeftElement = styled(DecorativeElement)`
  bottom: 10px;
  left: 10px;
  transform: rotate(-10deg);
  font-size: 4vw;
  opacity: 0.15;
`;

const BottomRightElement = styled(DecorativeElement)`
  bottom: 10px;
  right: 10px;
  transform: rotate(10deg);
  font-size: 4vw;
  opacity: 0.15;
`;

// Middle sections
const MiddleTopElement = styled(DecorativeElement)`
  top: 15%;
  left: 50%;
  transform: translateX(-50%) rotate(5deg);
  font-size: 6vw;
  opacity: 0.15;
`;

const MiddleBottomElement = styled(DecorativeElement)`
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%) rotate(-5deg);
  font-size: 6vw;
  opacity: 0.15;
`;

// Random positioned elements
const RandomElement1 = styled(DecorativeElement)`
  top: 15%;
  left: 15%;
  transform: rotate(25deg);
  font-size: 2.5vw;
  opacity: 0.1;
`;

const RandomElement2 = styled(DecorativeElement)`
  bottom: 20%;
  right: 15%;
  transform: rotate(-25deg);
  font-size: 2.5vw;
  opacity: 0.1;
`;

const RandomElement3 = styled(DecorativeElement)`
  top: 65%;
  left: 20%;
  transform: rotate(15deg);
  font-size: 2vw;
  opacity: 0.12;
`;

const RandomElement4 = styled(DecorativeElement)`
  top: 20%;
  right: 20%;
  transform: rotate(-15deg);
  font-size: 2vw;
  opacity: 0.12;
`;

// Additional decorative elements
const DecorativeElement5 = styled(DecorativeElement)`
  top: 40%;
  left: 10%;
  transform: rotate(10deg);
  font-size: 2.5vw;
  opacity: 0.08;
`;

const DecorativeElement6 = styled(DecorativeElement)`
  bottom: 40%;
  right: 10%;
  transform: rotate(-10deg);
  font-size: 2.5vw;
  opacity: 0.08;
`;

const DecorativeElement7 = styled(DecorativeElement)`
  top: 80%;
  right: 20%;
  transform: rotate(20deg);
  font-size: 1.8vw;
  opacity: 0.1;
`;

const DecorativeElement8 = styled(DecorativeElement)`
  top: 10%;
  left: 30%;
  transform: rotate(-20deg);
  font-size: 1.8vw;
  opacity: 0.1;
`;

const DecorativeElement9 = styled(DecorativeElement)`
  bottom: 10%;
  right: 30%;
  transform: rotate(15deg);
  font-size: 2.2vw;
  opacity: 0.09;
`;

const DecorativeElement10 = styled(DecorativeElement)`
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%) rotate(5deg);
  font-size: 3vw;
  opacity: 0.07;
`;

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);
  const [profileComplete, setProfileComplete] = useState(0);
  
  // State for managing UI elements
  const [activeTab, setActiveTab] = useState('week');
  const [livestock, setLivestock] = useState([
    { id: 1, type: 'poultry', breed: 'Broiler', age: '4 weeks', status: 'healthy', location: 'Coop A' },
    { id: 2, type: 'pig', breed: 'Large White', age: '6 months', status: 'healthy', location: 'Pen 3' },
    { id: 3, type: 'poultry', breed: 'Layer', age: '8 months', status: 'needs_check', location: 'Coop B' },
  ]);
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Morning Feeding - Broilers', time: 'Today, 6:00 AM', type: 'feeding', location: 'Coop A', completed: true },
    { id: 2, title: 'Vaccination - Piglets', time: 'Today, 10:00 AM', type: 'health', location: 'Pen 2', priority: 'high', completed: false },
    { id: 3, title: 'Evening Feeding - Layers', time: 'Today, 5:00 PM', type: 'feeding', location: 'Coop B', completed: false },
    { id: 4, title: 'Health Check - Sows', time: 'Tomorrow, 8:00 AM', type: 'health', location: 'Pen 3', priority: 'medium', completed: false },
  ]);
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', title: 'Vaccination Due', description: 'Poultry in Coop B - NDV Vaccine', time: 'Due: Tomorrow' },
    { id: 2, type: 'info', title: 'Routine Check', description: 'Pigs in Pen 3 - Deworming', time: 'Due: In 3 days' },
    { id: 3, type: 'light', title: 'Feed Inventory', description: 'Poultry feed running low', time: 'Order more soon' },
  ]);
  
  // Handle profile image change
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    
    // Here you would typically upload the image to your server
    // For now, we'll just simulate a successful upload
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('Profile image updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to upload image. Please try again.');
      console.error('Image upload error:', error);
    } finally {
      setSaving(false);
    }
  };

  // Decorative icons state with more variety
  const [decorativeIcons] = React.useState({
    // Main positioned elements
    topLeft: <FaTractor />,
    topRight: <FaSeedling />,
    bottomLeft: <FaHorse />,
    bottomRight: <FaCarrot />,
    middleTop: <FaAppleAlt />,
    middleBottom: <FaEgg />,
    
    // Random elements
    random1: <FaSeedling />,
    random2: <FaLeaf />,
    random3: <FaPiggyBank />,
    random4: <FaTools />,
    
    // Additional elements
    element5: <FaTree />,
    element6: <FaCloudRain />,
    element7: <FaSun />,
    element8: <FaFeather />,
    element9: <FaUmbrella />,
    element10: <FaTint />
  });

  // State for form data and other states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    experience: '',
    bio: '',
    specialization: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteLivestock = (id) => {
    setLivestock(livestock.filter(item => item.id !== id));
    setSuccess('Livestock removed successfully!');
  };

  // Task management
  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleAddTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }]);
    setShowScheduleModal(false);
    setSuccess('Task added to schedule!');
  };

  // Dismiss a single alert
  const dismissAlert = (id) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  };

  // State for modals
  const [showAddLivestockModal, setShowAddLivestockModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showFeedingModal, setShowFeedingModal] = useState(false);
  const [newLivestock, setNewLivestock] = useState({
    type: 'poultry',
    breed: '',
    age: '',
    status: 'healthy',
    location: ''
  });
  const [newSchedule, setNewSchedule] = useState({
    title: '',
    type: 'feeding',
    time: '',
    location: '',
    priority: 'medium'
  });
  const [feedings, setFeedings] = useState([]);
  const [newFeeding, setNewFeeding] = useState({
    livestockType: 'poultry',
    feedType: 'starter',
    amount: '',
    notes: '',
    time: new Date().toISOString().slice(0, 16) // Current date and time in local timezone
  });

  // Handle feeding input changes
  const handleFeedingInputChange = (e) => {
    const { name, value } = e.target;
    setNewFeeding(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle feeding submission
  const handleRecordFeeding = (e) => {
    e.preventDefault();
    const feedingRecord = {
      ...newFeeding,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    
    setFeedings(prev => [feedingRecord, ...prev]);
    setShowFeedingModal(false);
    setSuccess('Feeding recorded successfully!');
    
    // Reset form
    setNewFeeding({
      livestockType: 'poultry',
      feedType: 'starter',
      amount: '',
      notes: '',
      time: new Date().toISOString().slice(0, 16)
    });
    
    setTimeout(() => setSuccess(''), 3000);
  };

  // Handle quick action buttons
  const handleQuickAction = (action) => {
    switch(action) {
      case 'add_livestock':
        setShowAddLivestockModal(true);
        break;
      case 'schedule_health_check':
        setShowScheduleModal(true);
        break;
      case 'record_feeding':
        setShowFeedingModal(true);
        break;
      case 'view_reports':
        window.location.href = '/reports';
        break;
      case 'day':
      case 'week':
      case 'month':
        setActiveTab(action);
        setSuccess(`Viewing ${action}ly schedule`);
        setTimeout(() => setSuccess(''), 2000);
        break;
      default:
        console.log('Action not implemented:', action);
    }
  };

  // Handle livestock form input changes
  const handleLivestockInputChange = (e) => {
    const { name, value } = e.target;
    setNewLivestock(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle schedule form input changes
  const handleScheduleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle add livestock submission
  const handleAddLivestock = (e) => {
    e.preventDefault();
    const newLivestockItem = {
      id: Date.now(),
      ...newLivestock,
      age: newLivestock.age || '1 day',
      location: newLivestock.location || 'Default Location'
    };
    
    setLivestock(prev => [...prev, newLivestockItem]);
    setShowAddLivestockModal(false);
    setNewLivestock({
      type: 'poultry',
      breed: '',
      age: '',
      status: 'healthy',
      location: ''
    });
    setSuccess('Livestock added successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  // Handle add schedule submission
  const handleAddSchedule = (e) => {
    e.preventDefault();
    const newTask = {
      id: Date.now(),
      title: newSchedule.title || 'New Task',
      type: newSchedule.type,
      time: newSchedule.time || new Date().toLocaleTimeString(),
      location: newSchedule.location || 'Farm',
      priority: newSchedule.priority,
      completed: false
    };
    
    setTasks(prev => [...prev, newTask]);
    setShowScheduleModal(false);
    setNewSchedule({
      title: '',
      type: 'feeding',
      time: '',
      location: '',
      priority: 'medium'
    });
    setSuccess('Schedule added successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const calculateProfileCompletion = (userData) => {
    let completedFields = 0;
    const totalFields = 8; // Total number of fields we're tracking
    
    if (userData.name) completedFields++;
    if (userData.email) completedFields++;
    if (userData.phone) completedFields++;
    if (userData.address) completedFields++;
    if (userData.experience) completedFields++;
    if (userData.bio) completedFields++;
    if (userData.specialization) completedFields++;
    if (userData.profileImage) completedFields++;
    
    const completionPercentage = Math.round((completedFields / totalFields) * 100);
    setProfileComplete(completionPercentage);
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const formDataToSend = new FormData();
      const file = fileInputRef.current?.files[0];
      
      if (file) {
        formDataToSend.append('profileImage', file);
      }
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      const response = await axios.put(
        'http://localhost:5000/api/auth/profile',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          }
        }
      );
      
      const updatedUser = response.data.user || response.data;
      
      if (!updatedUser) {
        throw new Error('No user data received after update');
      }
      
      setProfile(prev => ({
        ...prev,
        ...updatedUser
      }));
      
      if (updatedUser.profileImage) {
        const imageUrl = updatedUser.profileImage.startsWith('http')
          ? updatedUser.profileImage
          : `http://localhost:5000/${updatedUser.profileImage.replace(/^\//, '')}?t=${new Date().getTime()}`;
        setImagePreview(imageUrl);
      }
      
      setSuccess('Profile updated successfully!');
      calculateProfileCompletion(updatedUser);
      
      setTimeout(() => {
        setIsEditing(false);
        setSuccess('');
      }, 2000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
      setProgress(0);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setLoading(false);
        return;
      }

      console.log('Fetching profile with token:', token.substring(0, 10) + '...');

      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Profile API response:', response.data);
      
      const userData = response.data.user || response.data;
      
      if (!userData) {
        throw new Error('No user data received from server');
      }
      
      console.log('User data:', userData);
      
      setProfile(userData);
      
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        experience: userData.experience || '',
        bio: userData.bio || '',
        specialization: userData.specialization || '',
        farmType: userData.farmType || '',
        farmSize: userData.farmSize || ''
      });
      
      if (userData.profileImage) {
        const imageUrl = userData.profileImage.startsWith('http') 
          ? userData.profileImage 
          : `http://localhost:5000/${userData.profileImage.replace(/^\//, '')}`;
        setImagePreview(imageUrl);
      } else if (userData.avatar) {
        const imageUrl = userData.avatar.startsWith('http')
          ? userData.avatar
          : `http://localhost:5000/${userData.avatar.replace(/^\//, '')}`;
        setImagePreview(imageUrl);
      }
      
      setError(''); // Clear any previous errors
      
    } catch (error) {
      console.error('Error fetching profile:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else {
        setError(`Failed to load profile: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

useEffect(() => {
  if (profile) {
    calculateProfileCompletion(profile);
  }
}, [profile]);
const renderProfileInfo = () => (
  <Card className="profile-card mb-4" style={{ backgroundColor: 'var(--primary-50)' }}>
    <Card.Body>
      <div className="text-center mb-4">
        <div className="text-center position-relative">
          <div className="position-relative d-inline-block">
            <div className="position-relative">
              <Image 
                src={imagePreview || '/default-avatar.png'} 
                roundedCircle 
                width={150} 
                height={150}
                style={{ border: '4px solid #4CAF50', borderRadius: '50%' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-avatar.png';
                }}
              />
              <div className="position-absolute top-50 start-50 translate-middle">
                <div className="p-2 rounded-circle" style={{ backgroundColor: 'rgba(76, 175, 80, 0.3)' }}>
                  <FaUser size={40} style={{ color: '#4CAF50', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                </div>
              </div>
                {isEditing && (
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Change Photo</Tooltip>}
                  >
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="position-absolute bottom-0 end-0 rounded-circle"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <FaUpload />
                    </Button>
                  </OverlayTrigger>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="d-none"
              />
            </div>
          </div>
          <h3 className="mt-3 mb-0">{profile?.name || 'User Name'}</h3>
          <p className="text-muted">{profile?.specialization || 'Farmer'}</p>
          <div className="d-flex justify-content-center gap-2">
            <Badge bg="success" className="px-3 py-2">
              <FaLeaf className="me-1" /> {profile?.farmType || 'Organic Farm'}
            </Badge>
            <Badge bg="info" className="px-3 py-2">
              <FaRuler className="me-1" /> {profile?.farmSize || '5 acres'}
            </Badge>
          </div>
        </div>

        <div className="profile-section">
          <h5 className="section-title">About</h5>
          <p className="text-muted">
            {profile?.bio || 'No bio available. Add a bio to tell others about yourself.'}
          </p>
        </div>

        <div className="profile-section">
          <h5 className="section-title">Contact Information</h5>
          <ul className="list-unstyled">
            <li className="mb-2">
              <FaEnvelope className="me-2 text-primary" />
              {profile?.email || 'No email provided'}
            </li>
            <li className="mb-2">
              <FaPhone className="me-2 text-primary" />
              {profile?.phone || 'No phone number provided'}
            </li>
            <li className="mb-2">
              <FaMapMarkerAlt className="me-2 text-primary" />
              {profile?.address || 'No address provided'}
            </li>
          </ul>
        </div>

        <div className="profile-section">
          <h5 className="section-title">Experience</h5>
          <div className="d-flex align-items-center">
            <FaBriefcase className="me-2 text-primary" />
            <span>{profile?.experience || 'No experience specified'}</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  const renderEditForm = () => (
    <Card className="mb-4" style={{ backgroundColor: 'var(--primary-50)' }}>
      <Card.Body>
        <div className="text-center mb-4">
          <div className="position-relative d-inline-block">
            <Image 
              src={imagePreview || '/default-avatar.png'} 
              roundedCircle 
              width={150} 
              height={150}
              className="border border-4 border-primary"
            />
            <Button 
              variant="primary" 
              size="sm" 
              className="position-absolute bottom-0 end-0 rounded-circle"
              onClick={() => fileInputRef.current.click()}
            >
              <FaUpload />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="d-none"
            />
          </div>
        </div>

        <Form>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group controlId="formName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  disabled
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formSpecialization">
                <Form.Label>Specialization</Form.Label>
                <Form.Control
                  as="select"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                >
                  <option value="">Select specialization</option>
                  <option value="Organic Farming">Organic Farming</option>
                  <option value="Dairy Farming">Dairy Farming</option>
                  <option value="Poultry Farming">Poultry Farming</option>
                  <option value="Horticulture">Horticulture</option>
                  <option value="Aquaculture">Aquaculture</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group controlId="formAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formFarmType">
                <Form.Label>Farm Type</Form.Label>
                <Form.Control
                  type="text"
                  name="farmType"
                  value={formData.farmType}
                  onChange={handleInputChange}
                  placeholder="e.g., Organic, Hydroponic"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formFarmSize">
                <Form.Label>Farm Size (acres)</Form.Label>
                <Form.Control
                  type="number"
                  name="farmSize"
                  value={formData.farmSize}
                  onChange={handleInputChange}
                  placeholder="e.g., 5"
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group controlId="formExperience">
                <Form.Label>Experience</Form.Label>
                <Form.Control
                  as="select"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                >
                  <option value="">Select years of experience</option>
                  <option value="Less than 1 year">Less than 1 year</option>
                  <option value="1-3 years">1-3 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5-10 years">5-10 years</option>
                  <option value="10+ years">10+ years</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group controlId="formBio">
                <Form.Label>Bio</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself and your farming experience..."
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>

        {progress > 0 && progress < 100 && (
          <div className="mt-3">
            <ProgressBar now={progress} label={`${progress}%`} className="mb-3" />
          </div>
        )}
      </Card.Body>
    </Card>
  );

  if (loading) {
    return (
      <Container fluid className="py-4 position-relative" style={{ overflow: 'hidden' }}>
        {/* Decorative Icons */}
        <TopLeftElement>{decorativeIcons.topLeft}</TopLeftElement>
        <TopRightElement>{decorativeIcons.topRight}</TopRightElement>
        <BottomLeftElement>{decorativeIcons.bottomLeft}</BottomLeftElement>
        <BottomRightElement>{decorativeIcons.bottomRight}</BottomRightElement>
        <MiddleTopElement>{decorativeIcons.middleTop}</MiddleTopElement>
        <MiddleBottomElement>{decorativeIcons.middleBottom}</MiddleBottomElement>
        <RandomElement1>{decorativeIcons.random1}</RandomElement1>
        <RandomElement2>{decorativeIcons.random2}</RandomElement2>
        <RandomElement3>{decorativeIcons.random3}</RandomElement3>
        <RandomElement4>{decorativeIcons.random4}</RandomElement4>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading your profile...</p>
        </div>
      </Container>
    );
  }

  // Main return statement
  return (
    <>
      {/* Add Livestock Modal */}
      <Modal show={showAddLivestockModal} onHide={() => setShowAddLivestockModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Livestock</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddLivestock}>
          <Modal.Body>
            <FormGroup className="mb-3">
              <FormLabel>Type</FormLabel>
              <FormSelect 
                name="type" 
                value={newLivestock.type}
                onChange={handleLivestockInputChange}
                required
              >
                <option value="poultry">Poultry</option>
                <option value="pig">Pig</option>
                <option value="cow">Cow</option>
                <option value="goat">Goat</option>
                <option value="sheep">Sheep</option>
              </FormSelect>
            </FormGroup>
            
            <FormGroup className="mb-3">
              <FormLabel>Breed</FormLabel>
              <FormControl
                type="text"
                name="breed"
                value={newLivestock.breed}
                onChange={handleLivestockInputChange}
                placeholder="E.g., Broiler, Large White"
                required
              />
            </FormGroup>
            
            <FormGroup className="mb-3">
              <FormLabel>Age</FormLabel>
              <FormControl
                type="text"
                name="age"
                value={newLivestock.age}
                onChange={handleLivestockInputChange}
                placeholder="E.g., 2 months, 1 year"
              />
            </FormGroup>
            
            <FormGroup className="mb-3">
              <FormLabel>Status</FormLabel>
              <FormSelect 
                name="status" 
                value={newLivestock.status}
                onChange={handleLivestockInputChange}
              >
                <option value="healthy">Healthy</option>
                <option value="needs_check">Needs Check</option>
                <option value="under_treatment">Under Treatment</option>
                <option value="recovering">Recovering</option>
              </FormSelect>
            </FormGroup>
            
            <FormGroup className="mb-3">
              <FormLabel>Location</FormLabel>
              <FormControl
                type="text"
                name="location"
                value={newLivestock.location}
                onChange={handleLivestockInputChange}
                placeholder="E.g., Coop A, Pen 1"
              />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddLivestockModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Livestock
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Feeding Record Modal */}
      <Modal show={showFeedingModal} onHide={() => setShowFeedingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Record Feeding</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleRecordFeeding}>
          <Modal.Body>
            <FormGroup className="mb-3">
              <FormLabel>Livestock Type</FormLabel>
              <FormSelect 
                name="livestockType"
                value={newFeeding.livestockType}
                onChange={handleFeedingInputChange}
                required
              >
                <option value="poultry">Poultry</option>
                <option value="cattle">Cattle</option>
                <option value="pigs">Pigs</option>
                <option value="goats">Goats</option>
                <option value="sheep">Sheep</option>
              </FormSelect>
            </FormGroup>
            
            <FormGroup className="mb-3">
              <FormLabel>Feed Type</FormLabel>
              <FormSelect 
                name="feedType"
                value={newFeeding.feedType}
                onChange={handleFeedingInputChange}
                required
              >
                <option value="starter">Starter Feed</option>
                <option value="grower">Grower Feed</option>
                <option value="finisher">Finisher Feed</option>
                <option value="layer">Layer Feed</option>
                <option value="supplement">Supplement</option>
              </FormSelect>
            </FormGroup>
            
            <FormGroup className="mb-3">
              <FormLabel>Amount (kg)</FormLabel>
              <FormControl
                type="number"
                name="amount"
                value={newFeeding.amount}
                onChange={handleFeedingInputChange}
                placeholder="Enter amount in kilograms"
                required
                min="0"
                step="0.1"
              />
            </FormGroup>
            
            <FormGroup className="mb-3">
              <FormLabel>Date & Time</FormLabel>
              <FormControl
                type="datetime-local"
                name="time"
                value={newFeeding.time}
                onChange={handleFeedingInputChange}
                required
              />
            </FormGroup>
            
            <FormGroup className="mb-3">
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl
                as="textarea"
                rows={2}
                name="notes"
                value={newFeeding.notes}
                onChange={handleFeedingInputChange}
                placeholder="Any additional notes about this feeding..."
              />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowFeedingModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Record Feeding
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Add Schedule Modal */}
      <Modal show={showScheduleModal} onHide={() => setShowScheduleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Schedule</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddSchedule}>
          <Modal.Body>
            <FormGroup className="mb-3">
              <FormLabel>Title</FormLabel>
              <FormControl
                type="text"
                name="title"
                value={newSchedule.title}
                onChange={handleScheduleInputChange}
                placeholder="E.g., Morning Feeding, Health Check"
                required
              />
            </FormGroup>
            
            <FormGroup className="mb-3">
              <FormLabel>Type</FormLabel>
              <FormSelect 
                name="type" 
                value={newSchedule.type}
                onChange={handleScheduleInputChange}
                required
              >
                <option value="feeding">Feeding</option>
                <option value="health">Health Check</option>
                <option value="cleaning">Cleaning</option>
                <option value="other">Other</option>
              </FormSelect>
            </FormGroup>
            
            <FormGroup className="mb-3">
              <FormLabel>Time</FormLabel>
              <FormControl
                type="time"
                name="time"
                value={newSchedule.time}
                onChange={handleScheduleInputChange}
                required
              />
            </FormGroup>
            
            <FormGroup className="mb-3">
              <FormLabel>Location</FormLabel>
              <FormControl
                type="text"
                name="location"
                value={newSchedule.location}
                onChange={handleScheduleInputChange}
                placeholder="E.g., Coop A, Pen 1"
              />
            </FormGroup>
            
            <FormGroup className="mb-3">
              <FormLabel>Priority</FormLabel>
              <FormSelect 
                name="priority" 
                value={newSchedule.priority}
                onChange={handleScheduleInputChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </FormSelect>
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowScheduleModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add to Schedule
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Container fluid className="profile-container px-4 py-5 position-relative" style={{ overflow: 'hidden', maxWidth: '1400px' }}>
      {/* Decorative Icons */}
      <TopLeftElement>{decorativeIcons.topLeft}</TopLeftElement>
      <TopRightElement>{decorativeIcons.topRight}</TopRightElement>
      <BottomLeftElement>{decorativeIcons.bottomLeft}</BottomLeftElement>
      <BottomRightElement>{decorativeIcons.bottomRight}</BottomRightElement>
      <MiddleTopElement>{decorativeIcons.middleTop}</MiddleTopElement>
      <MiddleBottomElement>{decorativeIcons.middleBottom}</MiddleBottomElement>
      
      {/* Random positioned elements */}
      <RandomElement1>{decorativeIcons.random1}</RandomElement1>
      <RandomElement2>{decorativeIcons.random2}</RandomElement2>
      <RandomElement3>{decorativeIcons.random3}</RandomElement3>
      <RandomElement4>{decorativeIcons.random4}</RandomElement4>
      
      {/* Additional decorative elements */}
      <DecorativeElement5>{decorativeIcons.element5}</DecorativeElement5>
      <DecorativeElement6>{decorativeIcons.element6}</DecorativeElement6>
      <DecorativeElement7>{decorativeIcons.element7}</DecorativeElement7>
      <DecorativeElement8>{decorativeIcons.element8}</DecorativeElement8>
      <DecorativeElement9>{decorativeIcons.element9}</DecorativeElement9>
      <DecorativeElement10>{decorativeIcons.element10}</DecorativeElement10>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">My Profile</h2>
        <div>
          {isEditing ? (
            <>
              <Button 
                variant="success" 
                className="me-2"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Spinner as="span" size="sm" animation="border" role="status" className="me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="me-1" /> Save Changes
                  </>
                )}
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => setIsEditing(false)}
                disabled={saving}
              >
                <FaTimes className="me-1" /> Cancel
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              <FaEdit className="me-1" /> Edit Profile
            </Button>
          )}
        </div>
      </div>

      {profileComplete < 100 && (
        <div className="mb-4">
          <div className="d-flex justify-content-between mb-1">
            <span>Profile Completion</span>
            <span>{profileComplete}%</span>
          </div>
          <ProgressBar now={profileComplete} variant={profileComplete < 50 ? 'warning' : 'success'} />
          <small className="text-muted">Complete your profile to unlock all features</small>
        </div>
      )}

      <Row className="g-4">
        <Col lg={5} xl={4}>
          <div className="sticky-top" style={{top: '20px'}}>
            {/* Profile Section */}
            <Card className="mb-4">
              <Card.Body>
                {isEditing ? renderEditForm() : renderProfileInfo()}
              </Card.Body>
            </Card>
            
            {/* Quick Actions */}
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3"><FaBolt className="text-warning me-2" /> Quick Actions</h5>
                <div className="d-grid gap-2">
                  <Button 
                    variant="outline-primary" 
                    className="text-start"
                    onClick={() => handleQuickAction('add_livestock')}
                  >
                    <FaPlusCircle className="me-2" /> Add Livestock
                  </Button>
                  <Button 
                    variant="outline-success" 
                    className="text-start"
                    onClick={() => handleQuickAction('schedule_health_check')}
                  >
                    <FaCalendarAlt className="me-2" /> Schedule Health Check
                  </Button>
                  <Button 
                    variant="outline-info" 
                    className="text-start"
                    onClick={() => handleQuickAction('record_feeding')}
                  >
                    <FaClipboardList className="me-2" /> Record Feeding
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    className="text-start"
                    onClick={() => handleQuickAction('view_reports')}
                  >
                    <FaChartLine className="me-2" /> View Reports
                  </Button>
                </div>
              </Card.Body>
            </Card>
            
            {/* Health Alerts */}
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0"><FaExclamationTriangle className="text-danger me-2" />Health Alerts</h5>
                  {alerts.length > 0 && <Badge bg="danger" pill>{alerts.length} New</Badge>}
                </div>
                {alerts.length === 0 ? (
                  <div className="text-center py-3 text-muted">
                    <FaCheckCircle className="text-success mb-2" size={24} />
                    <p className="mb-0">No new alerts</p>
                  </div>
                ) : (
                  <>
                    {alerts.map(alert => (
                      <div key={alert.id} className={`alert alert-${alert.type} p-2 mb-2 d-flex justify-content-between`}>
                        <div className="d-flex">
                          {alert.type === 'warning' ? (
                            <FaExclamationTriangle className="text-warning mt-1 me-2 flex-shrink-0" />
                          ) : alert.type === 'info' ? (
                            <FaClipboardCheck className="text-info mt-1 me-2 flex-shrink-0" />
                          ) : (
                            <FaClipboardList className="text-secondary mt-1 me-2 flex-shrink-0" />
                          )}
                          <div>
                            <div className="fw-bold">{alert.title}</div>
                            <small className="d-block">{alert.description}</small>
                            <small className="text-muted">{alert.time}</small>
                          </div>
                        </div>
                        <Button 
                          variant="link" 
                          className="text-muted p-0 align-self-start"
                          onClick={() => dismissAlert(alert.id)}
                          title="Dismiss"
                        >
                          <FaTimes />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="w-100 mt-2"
                      onClick={() => setAlerts([])}
                    >
                      Dismiss All Alerts
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </div>
        </Col>
        
        <Col lg={7} xl={8}>
          <div className="d-flex flex-column gap-4">
            {/* Livestock Overview */}
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="mb-0">Livestock Overview</h4>
                  <div className="btn-group">
                    <Button 
                      variant={activeTab === 'day' ? 'secondary' : 'outline-secondary'} 
                      size="sm"
                      onClick={() => handleQuickAction('day')}
                      active={activeTab === 'day'}
                    >
                      Day
                    </Button>
                    <Button 
                      variant={activeTab === 'week' ? 'secondary' : 'outline-secondary'} 
                      size="sm"
                      onClick={() => handleQuickAction('week')}
                      active={activeTab === 'week'}
                    >
                      Week
                    </Button>
                    <Button 
                      variant={activeTab === 'month' ? 'secondary' : 'outline-secondary'} 
                      size="sm"
                      onClick={() => handleQuickAction('month')}
                      active={activeTab === 'month'}
                    >
                      Month
                    </Button>
                  </div>
                </div>
                <Row>
                  <Col md={4} sm={6} className="mb-4">
                    <div className="stat-card bg-light p-3 rounded text-center h-100">
                      <div className="text-primary mb-2"><FaDove size={24} /></div>
                      <h3 className="text-primary">
                        {livestock.filter(l => l.type === 'poultry').length}
                      </h3>
                      <p className="text-muted mb-0 small">Total Poultry</p>
                      <small className="text-success">
                        {livestock.filter(l => l.type === 'poultry').length > 0 ? 
                         `+${Math.floor(livestock.filter(l => l.type === 'poultry').length * 0.1)} this week ` : 
                         'No poultry recorded '}
                        <FaArrowUp />
                      </small>
                    </div>
                  </Col>
                  <Col md={4} sm={6} className="mb-4">
                    <div className="stat-card bg-light p-3 rounded text-center h-100">
                      <div className="text-success mb-2"><FaPiggyBank size={24} /></div>
                      <h3 className="text-success">
                        {livestock.filter(l => l.type === 'pig').length}
                      </h3>
                      <p className="text-muted mb-0 small">Total Pigs</p>
                      <small className="text-success">
                        {livestock.filter(l => l.type === 'pig').length > 0 ? 
                         `+${Math.min(2, Math.floor(livestock.filter(l => l.type === 'pig').length * 0.2))} this month ` : 
                         'No pigs recorded '}
                        <FaArrowUp />
                      </small>
                    </div>
                  </Col>
                  <Col md={4} sm={6} className="mb-4">
                    <div className="stat-card bg-light p-3 rounded text-center h-100">
                      <div className="text-info mb-2"><FaChartLine size={24} /></div>
                      <h3 className="text-info">
                        {livestock.length > 0 ? 
                         `${Math.round((livestock.filter(l => l.status === 'healthy').length / livestock.length) * 100)}%` : 
                         'N/A'}
                      </h3>
                      <p className="text-muted mb-0 small">Health Status</p>
                      <small className={livestock.length > 0 && 
                        (livestock.filter(l => l.status === 'healthy').length / livestock.length) > 0.8 ? 
                        'text-success' : 'text-warning'}>
                        {livestock.length > 0 ? 
                         (livestock.filter(l => l.status === 'healthy').length / livestock.length) > 0.8 ? 
                         'Excellent ' : 'Needs Attention ' : 'No Data '}
                        <FaCheck />
                      </small>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Livestock Inventory */}
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="mb-0">Livestock Inventory</h4>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleQuickAction('add_livestock')}
                  >
                    <FaPlus className="me-1" /> Add Livestock
                  </Button>
                </div>
                <div className="table-responsive">
                  {livestock.length === 0 ? (
                    <div className="text-center py-4">
                      <FaDove className="text-muted mb-3" size={48} />
                      <h5>No Livestock Added</h5>
                      <p className="text-muted">Add your first livestock to get started</p>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleQuickAction('add_livestock')}
                      >
                        <FaPlus className="me-1" /> Add Livestock
                      </Button>
                    </div>
                  ) : (
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Breed</th>
                          <th>Age</th>
                          <th>Status</th>
                          <th>Location</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {livestock.map(animal => (
                          <tr key={animal.id}>
                            <td>
                              {animal.type === 'poultry' ? (
                                <FaDove className="text-primary me-1" />
                              ) : (
                                <FaPiggyBank className="text-success me-1" />
                              )}
                              {animal.type === 'poultry' ? 'Poultry' : 'Pig'}
                            </td>
                            <td>{animal.breed}</td>
                            <td>{animal.age}</td>
                            <td>
                              <Badge 
                                bg={animal.status === 'healthy' ? 'success' : 'warning'}
                                text={animal.status === 'healthy' ? 'white' : 'dark'}
                              >
                                {animal.status === 'healthy' ? 'Healthy' : 'Needs Check'}
                              </Badge>
                            </td>
                            <td>{animal.location}</td>
                            <td>
                              <div className="d-flex gap-1">
                                <Button 
                                  size="sm" 
                                  variant="outline-primary"
                                  title="View Details"
                                  onClick={() => {
                                    // Implement view details functionality
                                    setSuccess(`Viewing details for ${animal.type} (${animal.breed})`);
                                  }}
                                >
                                  <FaEye />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline-danger"
                                  title="Remove"
                                  onClick={() => handleDeleteLivestock(animal.id)}
                                >
                                  <FaTrash />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </Card.Body>
            </Card>

            {/* Feeding & Health Schedule */}
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h4 className="mb-0">Daily Schedule</h4>
                    <small className="text-muted">Upcoming tasks and activities</small>
                  </div>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleQuickAction('schedule_health_check')}
                  >
                    <FaPlus className="me-1" /> Add Schedule
                  </Button>
                </div>
                <div className="task-list">
                  {tasks.length === 0 ? (
                    <div className="text-center py-4">
                      <FaCalendarAlt className="text-muted mb-3" size={48} />
                      <h5>No Scheduled Tasks</h5>
                      <p className="text-muted">Add your first task to get started</p>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleQuickAction('schedule_health_check')}
                      >
                        <FaPlus className="me-1" /> Add Task
                      </Button>
                    </div>
                  ) : (
                    tasks.map(task => (
                      <div key={task.id} className={`task-item d-flex align-items-center p-3 ${task.completed ? 'bg-light' : ''} border-bottom`}>
                        <div className={`icon-container me-3 ${task.type === 'feeding' ? 'text-success' : 'text-primary'}`}>
                          {task.type === 'feeding' ? <FaUtensils size={20} /> : <FaClinicMedical size={20} />}
                        </div>
                        <div className="flex-grow-1">
                          <div className={`mb-1 ${task.completed ? 'text-decoration-line-through text-muted' : ''}`}>
                            {task.title}
                          </div>
                          <div className="small text-muted">
                            <FaClock className="me-1" /> {task.time}
                            <span className="ms-2"><FaMapMarkerAlt className="me-1" /> {task.location}</span>
                            {task.priority === 'high' && <Badge bg="danger" className="ms-2">High Priority</Badge>}
                            {task.priority === 'medium' && <Badge bg="warning" text="dark" className="ms-2">Medium Priority</Badge>}
                          </div>
                        </div>
                        <Form.Check 
                          type="checkbox" 
                          className="me-2" 
                          checked={task.completed}
                          onChange={() => toggleTaskCompletion(task.id)}
                          id={`task-${task.id}`}
                        />
                        <OverlayTrigger
                          trigger="click"
                          placement="left"
                          overlay={
                            <Tooltip id={`task-menu-${task.id}`} className="p-0">
                              <div className="list-group">
                                <button 
                                  className="list-group-item list-group-item-action"
                                  onClick={() => {
                                    // Implement edit functionality
                                    setSuccess(`Editing task: ${task.title}`);
                                  }}
                                >
                                  <FaEdit className="me-2" /> Edit
                                </button>
                                <button 
                                  className="list-group-item list-group-item-action text-danger"
                                  onClick={() => {
                                    setTasks(tasks.filter(t => t.id !== task.id));
                                    setSuccess('Task removed successfully!');
                                  }}
                                >
                                  <FaTrash className="me-2" /> Delete
                                </button>
                              </div>
                            </Tooltip>
                          }
                        >
                          <Button variant="link" size="sm" className="text-muted p-0">
                            <FaEllipsisV />
                          </Button>
                        </OverlayTrigger>
                      </div>
                    ))
                  )}
                </div>
              </Card.Body>
            </Card>

            {/* Recent Activities */}
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="mb-0">Recent Activities</h4>
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => {
                      // In a real app, this would navigate to a full activities page
                      setSuccess('Viewing all activities...');
                    }}
                  >
                    View All
                  </Button>
                </div>
                <div className="activity-feed">
                  {[
                    {
                      id: 1,
                      icon: <FaCheckCircle size={20} />,
                      bg: 'primary',
                      title: 'Profile Updated',
                      description: 'Your profile information has been updated successfully',
                      time: '2 hours ago'
                    },
                    {
                      id: 2,
                      icon: <FaLeaf size={20} />,
                      bg: 'success',
                      title: 'New Project Started',
                      description: 'You\'ve started a new organic farming project',
                      time: '1 day ago'
                    },
                    {
                      id: 3,
                      icon: <FaGraduationCap size={20} />,
                      bg: 'info',
                      title: 'Completed Training',
                      description: 'You\'ve completed the Advanced Organic Farming course',
                      time: '1 week ago'
                    },
                    ...(tasks.some(t => t.completed) ? [{
                      id: 4,
                      icon: <FaClipboardCheck size={20} />,
                      bg: 'warning',
                      title: 'Task Completed',
                      description: `You've completed ${tasks.filter(t => t.completed).length} tasks`,
                      time: 'Just now',
                      highlight: true
                    }] : []),
                    ...(livestock.length > 0 ? [{
                      id: 5,
                      icon: <FaDove size={20} />,
                      bg: 'secondary',
                      title: 'Livestock Added',
                      description: `You've added ${livestock.length} animals to your inventory`,
                      time: 'Recently',
                      highlight: true
                    }] : [])
                  ]
                  .sort((a, b) => a.highlight ? -1 : 1) // Sort highlighted items to top
                  .slice(0, 5) // Show max 5 activities
                  .map((activity, index) => (
                    <div 
                      key={activity.id} 
                      className={`activity-item d-flex mb-3 ${activity.highlight ? 'activity-highlight' : ''}`}
                    >
                      <div 
                        className={`activity-icon bg-${activity.bg} text-white rounded-circle d-flex align-items-center justify-content-center me-3`} 
                        style={{width: '40px', height: '40px'}}
                      >
                        {activity.icon}
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <h6 className="mb-1">{activity.title}</h6>
                          <small className="text-muted">{activity.time}</small>
                        </div>
                        <p className="text-muted mb-0 small">{activity.description}</p>
                        {activity.action && (
                          <Button variant="link" size="sm" className="p-0 mt-1">
                            {activity.action} <FaArrowRight className="ms-1" size={10} />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {tasks.length === 0 && livestock.length === 0 && (
                    <div className="text-center py-3">
                      <FaHistory className="text-muted mb-2" size={32} />
                      <p className="text-muted mb-0">No recent activities to show</p>
                      <small>Your activities will appear here</small>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default Profile;
