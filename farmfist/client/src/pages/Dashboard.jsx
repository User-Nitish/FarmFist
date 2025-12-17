import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge, 
  Alert, 
  Spinner, 
  ProgressBar,
  ListGroup,
  Tab,
  Tabs,
  Dropdown
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import axios from 'axios';
import { 
  FiPlus, 
  FiMoreVertical, 
  FiArrowRight, 
  FiZap, 
  FiRefreshCw, 
  FiCalendar, 
  FiFileText, 
  FiUser, 
  FiAlertTriangle, 
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import { 
  FaTractor, 
  FaClipboardCheck, 
  FaChartLine, 
  FaExclamationTriangle, 
  FaRegClock,
  FaRegCalendarAlt,
  FaRegCheckCircle,
  FaLeaf, 
  FaTree, 
  FaHorse, 
  FaCarrot, 
  FaAppleAlt, 
  FaEgg, 
  FaFeather, 
  FaFish, 
  FaWater, 
  FaMountain, 
  FaMoon, 
  FaPaw, 
  FaUmbrella, 
  FaSeedling, 
  FaSnowflake, 
  FaBolt,
  FaTools, 
  FaWrench, 
  FaTint
} from 'react-icons/fa';
import { BsGraphUp, BsPeople, BsCalendarCheck } from 'react-icons/bs';
import styled from 'styled-components';
import FarmCharts from '../components/FarmCharts';

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

const MiddleLeftElement = styled(DecorativeElement)`
  top: 20%;
  left: 5%;
  transform: rotate(-15deg);
  font-size: 4vw;
  opacity: 0.12;
`;

const MiddleRightElement = styled(DecorativeElement)`
  top: 20%;
  right: 5%;
  transform: rotate(15deg);
  font-size: 4vw;
  opacity: 0.12;
`;

const TopCenterElement = styled(DecorativeElement)`
  top: 5%;
  left: 50%;
  transform: translateX(-50%) rotate(5deg);
  font-size: 3.5vw;
  opacity: 0.1;
`;

const BottomCenterElement = styled(DecorativeElement)`
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%) rotate(-5deg);
  font-size: 3.5vw;
  opacity: 0.1;
`;

const LeftMiddleElement = styled(DecorativeElement)`
  top: 40%;
  left: 2%;
  transform: rotate(-20deg);
  font-size: 2.5vw;
  opacity: 0.08;
`;

const RightMiddleElement = styled(DecorativeElement)`
  top: 40%;
  right: 2%;
  transform: rotate(20deg);
  font-size: 2.5vw;
  opacity: 0.08;
`;

const RandomElement1 = styled(DecorativeElement)`
  top: 30%;
  left: 20%;
  transform: rotate(25deg);
  font-size: 3vw;
  opacity: 0.1;
`;

const RandomElement2 = styled(DecorativeElement)`
  bottom: 30%;
  right: 20%;
  transform: rotate(-25deg);
  font-size: 3vw;
  opacity: 0.1;
`;

const RandomElement3 = styled(DecorativeElement)`
  top: 25%;
  right: 25%;
  transform: rotate(15deg);
  font-size: 2vw;
  opacity: 0.07;
`;

const RandomElement4 = styled(DecorativeElement)`
  bottom: 25%;
  left: 25%;
  transform: rotate(-15deg);
  font-size: 2vw;
  opacity: 0.07;
`;

// Additional random elements (12 more)
const RandomElement5 = styled(DecorativeElement)`
  top: 35%;
  left: 15%;
  transform: rotate(10deg);
  font-size: 1.8vw;
  opacity: 0.09;
`;

const RandomElement6 = styled(DecorativeElement)`
  bottom: 35%;
  right: 15%;
  transform: rotate(-10deg);
  font-size: 1.8vw;
  opacity: 0.09;
`;

const RandomElement7 = styled(DecorativeElement)`
  top: 15%;
  left: 35%;
  transform: rotate(20deg);
  font-size: 1.6vw;
  opacity: 0.08;
`;

const RandomElement8 = styled(DecorativeElement)`
  bottom: 15%;
  right: 35%;
  transform: rotate(-20deg);
  font-size: 1.6vw;
  opacity: 0.08;
`;

const RandomElement9 = styled(DecorativeElement)`
  top: 45%;
  left: 10%;
  transform: rotate(5deg);
  font-size: 1.4vw;
  opacity: 0.07;
`;

const RandomElement10 = styled(DecorativeElement)`
  bottom: 45%;
  right: 10%;
  transform: rotate(-5deg);
  font-size: 1.4vw;
  opacity: 0.07;
`;

const RandomElement11 = styled(DecorativeElement)`
  top: 10%;
  left: 45%;
  transform: rotate(15deg);
  font-size: 1.2vw;
  opacity: 0.06;
`;

const RandomElement12 = styled(DecorativeElement)`
  bottom: 10%;
  right: 45%;
  transform: rotate(-15deg);
  font-size: 1.2vw;
  opacity: 0.06;
`;

const RandomElement13 = styled(DecorativeElement)`
  top: 60%;
  left: 20%;
  transform: rotate(25deg);
  font-size: 1.8vw;
  opacity: 0.08;
`;

const RandomElement14 = styled(DecorativeElement)`
  bottom: 60%;
  right: 20%;
  transform: rotate(-25deg);
  font-size: 1.8vw;
  opacity: 0.08;
`;

const RandomElement15 = styled(DecorativeElement)`
  top: 20%;
  left: 60%;
  transform: rotate(10deg);
  font-size: 1.5vw;
  opacity: 0.07;
`;

const RandomElement16 = styled(DecorativeElement)`
  bottom: 20%;
  right: 60%;
  transform: rotate(-10deg);
  font-size: 1.5vw;
  opacity: 0.07;
`;

// Tiny decorative elements
const TinyElement1 = styled(DecorativeElement)`
  top: 15%;
  left: 15%;
  transform: rotate(5deg);
  font-size: 1vw;
  opacity: 0.05;
`;

const TinyElement2 = styled(DecorativeElement)`
  bottom: 15%;
  right: 15%;
  transform: rotate(-5deg);
  font-size: 1vw;
  opacity: 0.05;
`;

const TinyElement3 = styled(DecorativeElement)`
  top: 15%;
  right: 15%;
  transform: rotate(5deg);
  font-size: 1vw;
  opacity: 0.05;
`;

const TinyElement4 = styled(DecorativeElement)`
  bottom: 15%;
  left: 15%;
  transform: rotate(-5deg);
  font-size: 1vw;
  opacity: 0.05;
`;

const TinyElement5 = styled(DecorativeElement)`
  top: 50%;
  left: 30%;
  transform: rotate(10deg);
  font-size: 0.8vw;
  opacity: 0.04;
`;

const TinyElement6 = styled(DecorativeElement)`
  top: 50%;
  right: 30%;
  transform: rotate(-10deg);
  font-size: 0.8vw;
  opacity: 0.04;
`;

const TinyElement7 = styled(DecorativeElement)`
  top: 30%;
  left: 50%;
  transform: rotate(5deg);
  font-size: 0.8vw;
  opacity: 0.04;
`;

const TinyElement8 = styled(DecorativeElement)`
  bottom: 30%;
  right: 50%;
  transform: rotate(-5deg);
  font-size: 0.8vw;
  opacity: 0.04;
`;

// Farm-themed icon components
const FarmIcons = [
  FaLeaf, FaTree, FaTractor, FaHorse, FaCarrot, 
  FaAppleAlt, FaEgg, FaFeather, FaFish, FaWater, 
  FaMountain, FaMoon, FaPaw, FaUmbrella, FaSeedling, 
  FaSnowflake, FaBolt, FaTools, FaWrench, FaTint
];

// Get a random farm icon
const getRandomFarmIcon = () => {
  const RandomIcon = FarmIcons[Math.floor(Math.random() * FarmIcons.length)];
  return <RandomIcon />;
};

// Farm type icons mapping
const farmTypeIcons = {
  poultry: 'fa-egg',
  dairy: 'fa-cow',
  livestock: 'fa-paw',
  crop: 'fa-wheat-awn',
  mixed: 'fa-shapes',
  other: 'fa-tractor'
};

// Inline styles
const styles = {
  statCard: {
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
    border: '1px solid rgba(0, 0, 0, 0.03)',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 15px rgba(0, 0, 0, 0.08)',
      backgroundColor: '#fff'
    }
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem'
  },
  statValue: {
    fontSize: '1.8rem',
    fontWeight: '700',
    marginBottom: '0.25rem'
  },
  statLabel: {
    color: '#6c757d',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '0'
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1.25rem',
    color: '#2c3e50'
  },
  activityItem: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #f5f5f5',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    marginBottom: '0.5rem',
    '&:last-child': {
      marginBottom: 0
    }
  },
  activityIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '1rem',
    flexShrink: 0
  },
  activityContent: {
    flex: 1
  },
  activityTitle: {
    fontWeight: '500',
    marginBottom: '0.25rem',
    fontSize: '0.95rem'
  },
  activityTime: {
    fontSize: '0.8rem',
    color: '#6c757d'
  },
  progressContainer: {
    marginTop: '0.5rem'
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.25rem',
    fontSize: '0.85rem'
  }
};

const Dashboard = () => {
  // Get random icons for all decorative elements
  const [decorativeIcons] = React.useState({
    // Corners (4)
    topLeft: getRandomFarmIcon(),
    topRight: getRandomFarmIcon(),
    bottomLeft: getRandomFarmIcon(),
    bottomRight: getRandomFarmIcon(),
    
    // Middle sections (4)
    middleTop: getRandomFarmIcon(),
    middleBottom: getRandomFarmIcon(),
    middleLeft: getRandomFarmIcon(),
    middleRight: getRandomFarmIcon(),
    
    // Quarter positions (4)
    topCenter: getRandomFarmIcon(),
    bottomCenter: getRandomFarmIcon(),
    leftMiddle: getRandomFarmIcon(),
    rightMiddle: getRandomFarmIcon(),
    
    // Additional positions (16)
    random1: getRandomFarmIcon(),
    random2: getRandomFarmIcon(),
    random3: getRandomFarmIcon(),
    random4: getRandomFarmIcon(),
    random5: getRandomFarmIcon(),
    random6: getRandomFarmIcon(),
    random7: getRandomFarmIcon(),
    random8: getRandomFarmIcon(),
    random9: getRandomFarmIcon(),
    random10: getRandomFarmIcon(),
    random11: getRandomFarmIcon(),
    random12: getRandomFarmIcon(),
    random13: getRandomFarmIcon(),
    random14: getRandomFarmIcon(),
    random15: getRandomFarmIcon(),
    random16: getRandomFarmIcon(),
    
    // Tiny decorative elements (8)
    tiny1: getRandomFarmIcon(),
    tiny2: getRandomFarmIcon(),
    tiny3: getRandomFarmIcon(),
    tiny4: getRandomFarmIcon(),
    tiny5: getRandomFarmIcon(),
    tiny6: getRandomFarmIcon(),
    tiny7: getRandomFarmIcon(),
    tiny8: getRandomFarmIcon()
  });
  const farmTypeIcons = {
    poultry: 'fa-egg',
    dairy: 'fa-cow',
    livestock: 'fa-paw',
    crop: 'fa-wheat-awn',
    mixed: 'fa-shapes',
    other: 'fa-tractor'
  };

  const { user } = useAuth();
  const [farms, setFarms] = useState([]);
  const [allInspections, setAllInspections] = useState([]);
  const [recentInspections, setRecentInspections] = useState([]);
  const [upcomingInspections, setUpcomingInspections] = useState([]);
  const [stats, setStats] = useState({
    totalFarms: 0,
    totalInspections: 0,
    averageScore: 0,
    recentAlerts: 0,
    complianceRate: 0,
    pendingActions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('recent');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Simulated API calls - Replace with actual API calls
      const [farmsResponse, inspectionsResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/farms'),
        axios.get('http://localhost:5000/api/inspections')
      ]);

      const inspectionsData = inspectionsResponse.data.inspections || [];
      const recentInspectionsData = [...inspectionsData]
        .sort((a, b) => new Date(b.inspectionDate) - new Date(a.inspectionDate))
        .slice(0, 5);
      
      const upcomingInspectionsData = [...inspectionsData]
        .filter(insp => new Date(insp.nextInspectionDate) > new Date())
        .sort((a, b) => new Date(a.nextInspectionDate) - new Date(b.nextInspectionDate))
        .slice(0, 5);

      setFarms(farmsResponse.data.farms || []);
      setAllInspections(inspectionsData);
      setRecentInspections(recentInspectionsData);
      setUpcomingInspections(upcomingInspectionsData);

      // Calculate stats
      const totalFarms = farmsResponse.data.farms?.length || 0;
      const totalInspections = allInspections.length;
      const averageScore = allInspections.length > 0
        ? allInspections.reduce((sum, insp) => sum + (insp.overallScore || 0), 0) / allInspections.length
        : 0;
      
      const criticalIssues = allInspections.reduce((sum, insp) => 
        sum + (insp.issues?.filter(issue => issue.severity === 'critical').length || 0), 0);
      
      const compliantFarms = (farmsResponse.data.farms || []).filter(farm => 
        farm.complianceStatus === 'compliant').length;
      
      const complianceRate = totalFarms > 0 ? Math.round((compliantFarms / totalFarms) * 100) : 0;

      setStats({
        totalFarms,
        totalInspections,
        averageScore: Math.round(averageScore * 10) / 10, // Keep one decimal
        recentAlerts: criticalIssues,
        complianceRate,
        pendingActions: upcomingInspectionsData.length
      });

    } catch (error) {
      setError('Failed to load dashboard data. Please try again later.');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const getStatusText = (score) => {
    if (score >= 80) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Attention';
  };

  if (loading) {
    return (
      <div style={{ minHeight: '60vh' }} className="d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="border-0 shadow-sm">
          <div className="d-flex align-items-center">
            <FiAlertCircle className="me-2" size={24} />
            <div>
              <h5 className="alert-heading mb-1">Error loading dashboard</h5>
              <p className="mb-0">{error}</p>
            </div>
          </div>
          <div className="mt-3">
            <Button 
              variant="outline-danger" 
              onClick={fetchDashboardData}
              className="d-inline-flex align-items-center"
            >
              <FiRefreshCw className="me-1" /> Retry
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  // Helper function to format dates
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render inspection status badge
  const renderStatusBadge = (status) => {
    let variant = 'secondary';
    if (status === 'completed') variant = 'success';
    if (status === 'in-progress') variant = 'primary';
    if (status === 'pending') variant = 'warning';
    
    return (
      <Badge bg={variant} className="text-capitalize">
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  // Render activity item
  const renderActivityItem = (inspection, isUpcoming = false) => (
    <div style={styles.activityItem} key={inspection._id}>
      <div style={{...styles.activityIcon, backgroundColor: isUpcoming ? '#e3f2fd' : '#e8f5e9'}}>
        {isUpcoming ? (
          <FaRegCalendarAlt size={16} className="text-primary" />
        ) : (
          <FaRegCheckCircle size={16} className="text-success" />
        )}
      </div>
      <div style={styles.activityContent}>
        <div style={styles.activityTitle}>
          {isUpcoming 
            ? `Inspection scheduled for ${inspection.farmName || 'a farm'}`
            : `Inspection completed at ${inspection.farmName || 'a farm'}`}
        </div>
        <div style={styles.activityTime}>
          {isUpcoming 
            ? `Scheduled for ${formatDate(inspection.nextInspectionDate)}`
            : `Completed on ${formatDate(inspection.inspectionDate)}`}
        </div>
        <div className="mt-2">
          {renderStatusBadge(inspection.status)}
          {!isUpcoming && inspection.overallScore !== undefined && (
            <Badge bg="light" text="dark" className="ms-2">
              Score: {inspection.overallScore}%
            </Badge>
          )}
        </div>
    </div>
  </div>
);

return (
  <>
    {/* Decorative Elements - Corners (4) */}
    <TopLeftElement>{decorativeIcons.topLeft}</TopLeftElement>
    <TopRightElement>{decorativeIcons.topRight}</TopRightElement>
    <BottomLeftElement>{decorativeIcons.bottomLeft}</BottomLeftElement>
    <BottomRightElement>{decorativeIcons.bottomRight}</BottomRightElement>
    
    {/* Middle Sections (4) */}
    <MiddleTopElement>{decorativeIcons.middleTop}</MiddleTopElement>
    <MiddleBottomElement>{decorativeIcons.middleBottom}</MiddleBottomElement>
    <MiddleLeftElement>{decorativeIcons.middleLeft}</MiddleLeftElement>
    <MiddleRightElement>{decorativeIcons.middleRight}</MiddleRightElement>
    
    {/* Center Positions (4) */}
    <TopCenterElement>{decorativeIcons.topCenter}</TopCenterElement>
    <BottomCenterElement>{decorativeIcons.bottomCenter}</BottomCenterElement>
    <LeftMiddleElement>{decorativeIcons.leftMiddle}</LeftMiddleElement>
    <RightMiddleElement>{decorativeIcons.rightMiddle}</RightMiddleElement>
    
    {/* Random Positions (16) */}
    <RandomElement1>{decorativeIcons.random1}</RandomElement1>
    <RandomElement2>{decorativeIcons.random2}</RandomElement2>
    <RandomElement3>{decorativeIcons.random3}</RandomElement3>
    <RandomElement4>{decorativeIcons.random4}</RandomElement4>
    <RandomElement5>{decorativeIcons.random5}</RandomElement5>
    <RandomElement6>{decorativeIcons.random6}</RandomElement6>
    <RandomElement7>{decorativeIcons.random7}</RandomElement7>
    <RandomElement8>{decorativeIcons.random8}</RandomElement8>
    <RandomElement9>{decorativeIcons.random9}</RandomElement9>
    <RandomElement10>{decorativeIcons.random10}</RandomElement10>
    <RandomElement11>{decorativeIcons.random11}</RandomElement11>
    <RandomElement12>{decorativeIcons.random12}</RandomElement12>
    <RandomElement13>{decorativeIcons.random13}</RandomElement13>
    <RandomElement14>{decorativeIcons.random14}</RandomElement14>
    <RandomElement15>{decorativeIcons.random15}</RandomElement15>
    <RandomElement16>{decorativeIcons.random16}</RandomElement16>
    
    {/* Tiny Decorative Elements (8) */}
    <TinyElement1>{decorativeIcons.tiny1}</TinyElement1>
    <TinyElement2>{decorativeIcons.tiny2}</TinyElement2>
    <TinyElement3>{decorativeIcons.tiny3}</TinyElement3>
    <TinyElement4>{decorativeIcons.tiny4}</TinyElement4>
    <TinyElement5>{decorativeIcons.tiny5}</TinyElement5>
    <TinyElement6>{decorativeIcons.tiny6}</TinyElement6>
    <TinyElement7>{decorativeIcons.tiny7}</TinyElement7>
    <TinyElement8>{decorativeIcons.tiny8}</TinyElement8>
    
    <Container fluid className="py-4" style={{ position: 'relative', zIndex: 1 }}>
      {/* Welcome Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <h2 className="mb-1">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h2>
          <p className="text-muted mb-0">Here's what's happening with your farms today.</p>
        </div>
        <div className="mt-3 mt-md-0">
          {/* Buttons removed as per user request */}
        </div>
      </div>

      {/* Charts Section */}
      <FarmCharts farms={farms} inspections={allInspections} />
      
      {/* Stats Overview */}
      <Row className="g-4 mb-4">
        <Col md={6} lg={3}>
          <Card className="h-100 border-0" style={styles.statCard}>
            <Card.Body>
              <div style={{...styles.statIcon, backgroundColor: 'rgba(13, 110, 253, 0.1)'}}>
                <FaTractor size={24} className="text-primary" />
              </div>
              <h3 style={styles.statValue}>{stats.totalFarms}</h3>
              <p style={styles.statLabel}>Total Farms</p>
              <div className="text-success small">
                <FiTrendingUp className="me-1" /> 12% from last month
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3}>
          <Card className="h-100 border-0" style={styles.statCard}>
            <Card.Body>
              <div style={{...styles.statIcon, backgroundColor: 'rgba(25, 135, 84, 0.1)'}}>
                <FaClipboardCheck size={24} className="text-success" />
              </div>
              <h3 style={styles.statValue}>{stats.totalInspections}</h3>
              <p style={styles.statLabel}>Total Inspections</p>
              <div className="text-success small">
                <FiTrendingUp className="me-1" /> 8% from last month
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100 border-0" style={styles.statCard}>
            <Card.Body>
              <div style={{...styles.statIcon, backgroundColor: 'rgba(255, 193, 7, 0.1)'}}>
                <BsGraphUp size={24} className="text-warning" />
              </div>
              <h3 style={styles.statValue}>{stats.averageScore}%</h3>
              <p style={styles.statLabel}>Avg. Inspection Score</p>
              <div style={styles.progressContainer}>
                <div style={styles.progressLabel}>
                  <span>Target: 90%</span>
                  <span>{stats.averageScore}%</span>
                </div>
                <ProgressBar 
                  now={stats.averageScore} 
                  variant={stats.averageScore >= 90 ? 'success' : stats.averageScore >= 70 ? 'warning' : 'danger'}
                  style={{ height: '6px' }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100 border-0" style={styles.statCard}>
            <Card.Body>
              <div style={{...styles.statIcon, backgroundColor: 'rgba(220, 53, 69, 0.1)'}}>
                <FaExclamationTriangle size={24} className="text-danger" />
              </div>
              <h3 style={styles.statValue}>{stats.recentAlerts}</h3>
              <p style={styles.statLabel}>Critical Issues</p>
              <Button 
                variant="link" 
                size="sm" 
                className="p-0 text-decoration-none"
                as={Link}
                to="/issues"
              >
                View all issues <FiArrowRight size={16} className="ms-1" />
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Left Column */}
        <Col lg={8}>
          {/* Compliance Overview */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 style={styles.sectionTitle}>Compliance Overview</h5>
                {/* View Details button removed as per user request */}
              </div>
              
              <Row>
                <Col md={6} className="mb-3 mb-md-0">
                  <div className="d-flex align-items-center">
                    <div className="me-4">
                      <div className="position-relative" style={{ width: '80px', height: '80px' }}>
                        <svg className="circular-chart" viewBox="0 0 36 36" width="80" height="80">
                          <path
                            className="circle-bg"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#e9ecef"
                            strokeWidth="3"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h6 className="mb-1">Compliance Score</h6>
                      <h3 className="mb-0">85%</h3>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex flex-column h-100">
                    <div className="d-flex align-items-center mb-2">
                      <div className="bullet-indicator bg-success me-2"></div>
                      <small>Compliant: <strong>12/15</strong></small>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <div className="bullet-indicator bg-warning me-2"></div>
                      <small>Pending: <strong>2/15</strong></small>
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="bullet-indicator bg-danger me-2"></div>
                      <small>Overdue: <strong>1/15</strong></small>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Farms */}
        <Col xl={6} className="mb-4">
          <Card className="h-100">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0 fw-bold">Recent Farms</h5>
              <Link to="/farms" className="btn btn-sm btn-outline-primary">View All</Link>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2 mb-0">Loading farms...</p>
                </div>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <div className="list-group list-group-flush">
                  {farms.slice(0, 3).map((farm) => (
                    <div key={farm._id} className="list-group-item list-group-item-action border-0 px-0 py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <i className={`fas ${farmTypeIcons[farm.farmType] || 'fa-tractor'} fa-2x text-primary`}></i>
                          </div>
                          <div>
                            <h6 className="mb-1">{farm.farmName}</h6>
                            <div className="d-flex align-items-center">
                              <Badge bg={farm.status === 'active' ? 'success' : 'secondary'} className="me-2">
                                {farm.status.charAt(0).toUpperCase() + farm.status.slice(1)}
                              </Badge>
                              <small className="text-muted">{farm.farmType}</small>
                            </div>
                          </div>
                        </div>
                        <Dropdown>
                          <Dropdown.Toggle variant="link" className="text-muted p-0" id={`farm-actions-${farm._id}`}>
                            <FiMoreVertical size={20} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu align="end">
                            <li>
                              <Link className="dropdown-item" to={`/farms/${farm._id}`}>
                                <i className="far fa-eye me-2"></i>View Details
                              </Link>
                            </li>
                            <li>
                              <Link className="dropdown-item" to={`/farms/${farm._id}/edit`}>
                                <i className="far fa-edit me-2"></i>Edit
                              </Link>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                              <button className="dropdown-item text-danger">
                                <i className="far fa-trash-alt me-2"></i>Delete
                              </button>
                            </li>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
            {farms.length > 0 && (
              <Card.Footer className="bg-transparent border-top-0">
                <Link to="/farms" className="btn btn-sm btn-outline-primary w-100">
                  View All Farms
                </Link>
              </Card.Footer>
            )}
          </Card>
        </Col>

        {/* Recent Inspections */}
        <Col xl={6} className="mb-4">
          <Card className="h-100">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
              <h5 className="mb-0 fw-bold d-flex align-items-center">
                <FaClipboardCheck className="me-2 text-primary" />
                Recent Inspections
              </h5>
              <Link to="/inspections" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </Card.Header>
            <Card.Body className="p-0">
              {recentInspections.length === 0 ? (
                <div className="text-center p-5">
                  <div className="mb-3">
                    <FaClipboardCheck className="text-muted" size={48} />
                  </div>
                  <h5 className="mb-3">No inspections yet</h5>
                  <p className="text-muted mb-4">Schedule your first inspection to get started</p>
                  <Link to="/inspections/new" className="btn btn-primary">
                    <FiCalendar className="me-2" /> Schedule Inspection
                  </Link>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {recentInspections.map((inspection) => {
                    const score = inspection.overallScore || 0;
                    const statusVariant = getStatusVariant(score);
                    const statusText = getStatusText(score);
                    
                    return (
                      <div key={inspection._id} className="list-group-item list-group-item-action border-0 p-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              <div className={`bg-${statusVariant}-subtle rounded-circle d-flex align-items-center justify-content-center`} style={{ width: '48px', height: '48px' }}>
                                <FaClipboardCheck className={`text-${statusVariant}`} />
                              </div>
                            </div>
                            <div>
                              <h6 className="mb-1 fw-semibold">{inspection.farmId?.farmName || 'Unnamed Farm'}</h6>
                              <div className="d-flex flex-wrap align-items-center">
                                <span className="text-muted small me-3">
                                  <i className="far fa-calendar me-1"></i> 
                                  {inspection.inspectionDate ? new Date(inspection.inspectionDate).toLocaleDateString() : 'Date not set'}
                                </span>
                                <Badge bg={statusVariant} className="me-2 mb-1">
                                  {statusText}
                                </Badge>
                                <span className="text-muted small">
                                  Score: <strong>{score}/100</strong>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="dropdown">
                            <button 
                              className="btn btn-sm btn-outline-secondary rounded-circle"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i className="fas fa-ellipsis-v"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                              <li>
                                <Link className="dropdown-item" to={`/inspections/${inspection._id}`}>
                                  <i className="far fa-eye me-2"></i>View Details
                                </Link>
                              </li>
                              <li>
                                <Link className="dropdown-item" to={`/inspections/${inspection._id}/edit`}>
                                  <i className="far fa-edit me-2"></i>Edit
                                </Link>
                              </li>
                              <li><hr className="dropdown-divider" /></li>
                              <li>
                                <button className="dropdown-item text-danger">
                                  <i className="far fa-trash-alt me-2"></i>Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="d-flex justify-content-between small text-muted mb-1">
                            <span>Inspection Progress</span>
                            <span>{score}%</span>
                          </div>
                          <ProgressBar 
                            variant={statusVariant} 
                            now={score} 
                            className="mb-0" 
                            style={{ height: '6px' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card.Body>
            {recentInspections.length > 0 && (
              <Card.Footer className="bg-transparent border-top-0">
                <Link to="/inspections" className="btn btn-sm btn-outline-primary w-100">
                  View All Inspections
                </Link>
              </Card.Footer>
            )}
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <div className="mt-5 mb-4">
        <h4 className="mb-4 fw-bold d-flex align-items-center">
          <FiZap className="me-2 text-warning" />
          Quick Actions
        </h4>
        <Row className="g-4">
          <Col md={6} lg={3}>
            <Link to="/farms" className="text-decoration-none">
              <Card className="h-100 quick-action-card hover-shadow">
                <Card.Body className="text-center p-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <FiPlus className="text-primary" size={24} />
                  </div>
                  <h5 className="mb-2">Add New Farm</h5>
                  <p className="text-muted small mb-3">Register a new farm property to your account</p>
                  <div className="btn btn-outline-primary w-100">
                    Add Farm
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </Col>

          <Col md={6} lg={3}>
            <Link to="/inspections" className="text-decoration-none">
              <Card className="h-100 quick-action-card hover-shadow">
                <Card.Body className="text-center p-4">
                  <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <FiCalendar className="text-success" size={24} />
                  </div>
                  <h5 className="mb-2">Schedule Inspection</h5>
                  <p className="text-muted small mb-3">Plan and track your farm inspections</p>
                  <div className="btn btn-outline-success w-100">
                    Schedule Now
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </Col>

          <Col md={6} lg={3}>
            <Link to="/reports" className="text-decoration-none">
              <Card className="h-100 quick-action-card hover-shadow">
                <Card.Body className="text-center p-4">
                  <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <FiFileText className="text-info" size={24} />
                  </div>
                  <h5 className="mb-2">Generate Report</h5>
                  <p className="text-muted small mb-3">Create detailed biosecurity reports</p>
                  <div className="btn btn-outline-info w-100">
                    View Reports
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </Col>

          <Col md={6} lg={3}>
            <Card className="h-100 quick-action-card">
              <Card.Body className="text-center p-4">
                <div className="bg-purple bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                  <FiUser className="text-purple" size={24} />
                </div>
                <h5 className="mb-2">Update Profile</h5>
                <p className="text-muted small mb-3">Manage your account and preferences</p>
                <Link to="/profile" className="btn btn-outline-purple w-100">
                  Go to Profile
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      </Container>
    </>
  );
};

// Add some global styles for the circular progress
const style = document.createElement('style');
style.textContent = `
  .circular-chart {
    display: block;
    margin: 0 auto;
  }
  
  .circle-bg {
    fill: none;
  }
  
  .circle {
    fill: none;
    animation: progress 1s ease-out forwards;
  }
  
  @keyframes progress {
    0% {
      stroke-dasharray: 0, 100;
    }
  }
  
  .percentage {
    font-size: 0.5em;
    text-anchor: middle;
  }
`;
document.head.appendChild(style);

export default Dashboard;
