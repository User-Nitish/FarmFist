import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Carousel, Badge } from 'react-bootstrap';
import { 
  FaShieldAlt, 
  FaBrain, 
  FaClipboardCheck, 
  FaTractor, 
  FaChartLine, 
  FaMobileAlt, 
  FaSync, 
  FaStar, 
  FaCheckCircle,
  FaPhoneAlt,
  FaPlayCircle,
  FaLeaf,
  FaSeedling,
  FaCloudSun,
  FaDollarSign,
  FaUsers,
  FaCog,
  FaPlay,
  FaHeartbeat,
  FaUtensils,
  FaMapMarkedAlt,
  FaTint,
  FaCalendarAlt,
  FaProjectDiagram,
  FaRocket,
  FaEgg,
  FaPiggyBank,
  FaCogs,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaChevronRight,
  FaUser,
  FaBell
} from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const features = [
    {
      icon: <FaShieldAlt />,
      title: "Biosecurity Management",
      description: "Implement and monitor comprehensive biosecurity protocols for pig and poultry farms to prevent disease outbreaks.",
      color: "#1E8449",
      gradient: "linear-gradient(135deg, #1E8449 0%, #186A3B 100%)",
      link: "/biosecurity"
    },
    {
      icon: <FaHeartbeat />,
      title: "Health Monitoring",
      description: "Track animal health in real-time with our advanced monitoring system for early disease detection.",
      color: "#E74C3C",
      gradient: "linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)",
      link: "/health-monitoring"
    },
    {
      icon: <FaClipboardCheck />,
      title: "Inspection & Compliance",
      description: "Schedule and track farm inspections with automated compliance reporting for regulatory requirements.",
      color: "#3498DB",
      gradient: "linear-gradient(135deg, #3498DB 0%, #2980B9 100%)",
      link: "/inspections"
    },
    {
      icon: <FaUsers />,
      title: "Personnel Management",
      description: "Control and monitor farm access with our comprehensive personnel tracking system.",
      color: "#8E44AD",
      gradient: "linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)",
      link: "/personnel"
    },
    {
      icon: <FaChartLine />,
      title: "Analytics Dashboard",
      description: "Gain valuable insights into your farm's biosecurity status with real-time analytics.",
      color: "#E67E22",
      gradient: "linear-gradient(135deg, #E67E22 0%, #D35400 100%)",
      link: "/analytics"
    },
    {
      icon: <FaMobileAlt />,
      title: "Mobile Access",
      description: "Access critical biosecurity data and receive alerts on-the-go with our mobile app.",
      color: "#2C3E50",
      gradient: "linear-gradient(135deg, #2C3E50 0%, #1A252F 100%)",
      link: "/mobile"
    }
  ];

  const testimonials = [
    {
      quote: "The biosecurity management system has been a game-changer for our poultry farm. We've seen a 40% reduction in disease outbreaks.",
      author: "John D., Poultry Farm Manager",
      rating: 5
    },
    {
      quote: "Implementing this digital solution helped us maintain strict biosecurity protocols across all our pig farms with ease.",
      author: "Sarah M., Swine Production Director",
      rating: 5
    },
    {
      quote: "The real-time health monitoring and alert system has significantly improved our farm's biosecurity standards.",
      author: "Dr. Robert K., Veterinary Consultant",
      rating: 5
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Farm Assessment',
      description: 'Complete our comprehensive biosecurity assessment for your pig or poultry farm.',
      icon: <FaClipboardCheck className="text-primary" />
    },
    {
      number: '02',
      title: 'Custom Implementation',
      description: 'Our team will help you implement tailored biosecurity measures for your specific needs.',
      icon: <FaSync className="text-primary" />
    },
    {
      number: '03',
      title: 'Ongoing Monitoring',
      description: 'Continuously monitor and improve your biosecurity protocols with our digital tools.',
      icon: <FaChartLine className="text-primary" />
    }
  ];

  const farmTypes = [
    {
      title: 'Poultry Farms',
      icon: <FaEgg className="text-warning mb-3" size={40} />,
      features: ['Biosecurity Zoning', 'Disease Prevention', 'Vaccination Tracking'],
      color: "#F39C12"
    },
    {
      title: 'Pig Farms',
      icon: <FaPiggyBank className="text-danger mb-3" size={40} />,
      features: ['Herd Health Monitoring', 'Biocontainment', 'Waste Management'],
      color: "#E74C3C"
    },
    {
      title: 'Integrated Systems',
      icon: <FaCogs className="text-success mb-3" size={40} />,
      features: ['Cross-Contamination Control', 'Personnel Tracking', 'Supply Chain Security'],
      color: "#27AE60"
    }
  ];

  return (
    <div className="home-page">
      {/* Animated Background Elements */}
      <div className="floating-elements">
        {[...Array(10)].map((_, i) => (
          <div key={i} className={`floating-element element-${i % 4}`}>
            {i % 4 === 0 ? <FaLeaf /> : i % 4 === 1 ? <FaSeedling /> : i % 4 === 2 ? <FaTractor /> : <FaCloudSun />}
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="hero-section py-5">
        <Container>
          <Row className="align-items-center min-vh-80">
            <Col lg={6} className="mb-5 mb-lg-0">
              <div className="mb-4">
                <Badge bg="success" className="px-3 py-2 rounded-pill mb-3 d-inline-flex align-items-center">
                  <FaSync className="me-2" /> Now with AI-Powered Analytics
                </Badge>
                <h1 className="display-4 fw-bold mb-4">
                  Digital Farm Management <br />
                  <span className="text-primary">for Biosecurity</span> in Pig & Poultry Farms
                </h1>
                <p className="lead mb-4 text-muted" style={{maxWidth: '90%'}}>
                  Transform your farm's biosecurity with our comprehensive digital platform. 
                  Monitor, manage, and enhance disease prevention measures with real-time data 
                  and AI-powered insights for pig and poultry operations.
                </p>
                <div className="d-flex align-items-center text-muted">
                  <div className="d-flex me-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-warning me-1" />
                    ))}
                  </div>
                  <div>
                    <div>Rated 4.9/5 by 1000+ farmers</div>
                    <small className="text-muted">No credit card required • 14-day free trial</small>
                  </div>
                </div>
                <div className="mt-4">
                  <Link to="/register" className="btn btn-primary btn-lg px-5">
                    Get Started Free
                  </Link>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="position-relative">
                <div className="hero-image-container">
                  <img 
                    src="/images/biosecurity-dashboard.svg" 
                    alt="Biosecurity Management Dashboard" 
                    className="img-fluid rounded-4 shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = e.target.nextElementSibling;
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                  <div className="dashboard-preview-fallback" style={{ display: 'none' }}>
                    <svg width="100%" height="auto" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
                      <rect width="800" height="500" fill="#f8f9fa" rx="8"/>
                      <rect x="20" y="20" width="760" height="60" rx="4" fill="#fff" stroke="#e9ecef" strokeWidth="1"/>
                      <rect x="20" y="100" width="200" height="380" rx="4" fill="#fff" stroke="#e9ecef" strokeWidth="1"/>
                      <rect x="240" y="100" width="540" height="200" rx="4" fill="#fff" stroke="#e9ecef" strokeWidth="1"/>
                      
                      {/* Biosecurity Status Cards */}
                      <rect x="240" y="320" width="170" height="160" rx="4" fill="rgba(30, 132, 73, 0.1)" stroke="rgba(30, 132, 73, 0.2)" strokeWidth="1"/>
                      <text x="250" y="350" fontFamily="Arial" fontSize="14" fontWeight="bold" fill="#1E8449">Biosecurity Score</text>
                      <text x="250" y="380" fontFamily="Arial" fontSize="24" fontWeight="bold" fill="#1E8449">92%</text>
                      <text x="250" y="410" fontFamily="Arial" fontSize="12" fill="#495057">+5% from last week</text>
                      
                      <rect x="430" y="320" width="170" height="160" rx="4" fill="rgba(231, 76, 60, 0.1)" stroke="rgba(231, 76, 60, 0.2)" strokeWidth="1"/>
                      <text x="440" y="350" fontFamily="Arial" fontSize="14" fontWeight="bold" fill="#E74C3C">Active Alerts</text>
                      <text x="440" y="380" fontFamily="Arial" fontSize="24" fontWeight="bold" fill="#E74C3C">3</text>
                      <text x="440" y="410" fontFamily="Arial" fontSize="12" fill="#495057">Requires attention</text>
                      
                      <rect x="620" y="320" width="160" height="160" rx="4" fill="rgba(52, 152, 219, 0.1)" stroke="rgba(52, 152, 219, 0.2)" strokeWidth="1"/>
                      <text x="630" y="350" fontFamily="Arial" fontSize="14" fontWeight="bold" fill="#3498DB">Compliance</text>
                      <text x="630" y="380" fontFamily="Arial" fontSize="24" fontWeight="bold" fill="#3498DB">98%</text>
                      <text x="630" y="410" fontFamily="Arial" fontSize="12" fill="#495057">Regulatory standards</text>
                      
                      {/* Menu Items */}
                      <text x="40" y="135" fontFamily="Arial" fontSize="14" fill="#1E8449" fontWeight="600">Dashboard</text>
                      <text x="40" y="165" fontFamily="Arial" fontSize="14" fill="#495057">Poultry Farms</text>
                      <text x="40" y="195" fontFamily="Arial" fontSize="14" fill="#495057">Pig Farms</text>
                      <text x="40" y="225" fontFamily="Arial" fontSize="14" fill="#495057">Biosecurity Checks</text>
                      <text x="40" y="255" fontFamily="Arial" fontSize="14" fill="#495057">Health Monitoring</text>
                      <text x="40" y="285" fontFamily="Arial" fontSize="14" fill="#495057">Reports</text>
                      
                      {/* Main Dashboard Title */}
                      <text x="260" y="135" fontFamily="Arial" fontSize="18" fontWeight="bold" fill="#212529">Biosecurity Dashboard</text>
                      
                      {/* Main Chart Area */}
                      <rect x="260" y="160" width="500" height="120" rx="4" fill="#f8f9fa" stroke="#e9ecef" strokeWidth="1"/>
                      <text x="270" y="185" fontFamily="Arial" fontSize="14" fill="#495057">Biosecurity Performance (Last 30 Days)</text>
                      <line x1="270" y1="200" x2="730" y2="200" stroke="#e9ecef" strokeWidth="1" strokeDasharray="2,2"/>
                      <line x1="270" y1="230" x2="730" y2="230" stroke="#e9ecef" strokeWidth="1" strokeDasharray="2,2"/>
                      <line x1="270" y1="260" x2="730" y2="260" stroke="#e9ecef" strokeWidth="1" strokeDasharray="2,2"/>
                      
                      {/* Sample Data Points */}
                      <circle cx="300" cy="250" r="4" fill="#1E8449"/>
                      <circle cx="350" cy="220" r="4" fill="#1E8449"/>
                      <circle cx="400" cy="210" r="4" fill="#1E8449"/>
                      <circle cx="450" cy="230" r="4" fill="#E74C3C"/>
                      <circle cx="500" cy="200" r="4" fill="#1E8449"/>
                      <circle cx="550" cy="190" r="4" fill="#1E8449"/>
                      <circle cx="600" cy="180" r="4" fill="#1E8449"/>
                      
                      {/* Connect the dots */}
                      <path d="M300,250 L350,220 L400,210 L450,230 L500,200 L550,190 L600,180" 
                            stroke="#1E8449" 
                            strokeWidth="2" 
                            fill="none" 
                            strokeDasharray="0"/>
                    </svg>
                  </div>
                  <div className="floating-badge bg-success text-white">
                    <FaShieldAlt className="me-2" />
                    <span>Live Biosecurity Monitoring Active</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Image Left - Text Right */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="mb-4 mb-md-0">
              <img 
                src="/images/poultry.jpg" 
                alt="Biosecure Poultry Farm" 
                className="img-fluid rounded-3 shadow-sm w-100"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1587593810169-a84920ea0781?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
                }}
              />
            </Col>
            <Col md={6} className="ps-md-5">
              <Badge bg="success" className="px-3 py-2 rounded-pill mb-3 d-inline-flex align-items-center">
                <FaShieldAlt className="me-2" /> Biosecurity First
              </Badge>
              <h2 className="h2 fw-bold mb-4">Comprehensive Biosecurity Solutions for Modern Farms</h2>
              <p className="text-muted mb-4">Our digital platform is specifically designed to address the unique biosecurity challenges faced by pig and poultry farms. From disease prevention to compliance management, we provide the tools you need to protect your livestock and your livelihood.</p>
              
              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex align-items-start">
                  <div className="me-3 text-success">
                    <FaCheckCircle size={20} />
                  </div>
                  <div>
                    <h5 className="mb-1">Disease Prevention</h5>
                    <p className="text-muted small mb-0">Implement robust biosecurity protocols to prevent disease outbreaks before they start.</p>
                  </div>
                </div>
                <div className="d-flex align-items-start">
                  <div className="me-3 text-success">
                    <FaCheckCircle size={20} />
                  </div>
                  <div>
                    <h5 className="mb-1">Real-time Monitoring</h5>
                    <p className="text-muted small mb-0">Track farm conditions and animal health indicators in real-time.</p>
                  </div>
                </div>
                <div className="d-flex align-items-start">
                  <div className="me-3 text-success">
                    <FaCheckCircle size={20} />
                  </div>
                  <div>
                    <h5 className="mb-1">Regulatory Compliance</h5>
                    <p className="text-muted small mb-0">Stay compliant with industry standards and government regulations.</p>
                  </div>
                </div>
              </div>
              
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-7 position-relative overflow-hidden">
        <div className="position-absolute w-100 h-100" style={{ 
          background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 .895 2 2 2zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM57 67c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm-3-30c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm5.44 6.929c-.562.225-1.16.393-1.788.497a5 5 0 0 0 6.108 7.779l.002-.001.006-.003a5 5 0 0 0 3.293-6.474 12.96 12.96 0 0 1-7.613-2.798zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%232c7be5\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          opacity: 0.5
        }}></div>
        <Container className="position-relative">
          <Row className="justify-content-center text-center mb-6">
            <Col lg={8} xl={7}>
              <Badge bg="rgba(44, 123, 229, 0.1)" className="px-3 py-2 rounded-pill mb-3 d-inline-flex align-items-center text-primary fw-medium">
                <FaStar className="me-2" /> Key Features
              </Badge>
              <h2 className="display-5 fw-bold mb-3">Powerful Tools for <span className="text-gradient">Modern Farming</span></h2>
              <p className="lead text-muted mb-0">Comprehensive solutions designed to optimize every aspect of your farming operations</p>
            </Col>
          </Row>
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col md={6} lg={4} key={index} data-aos="fade-up" data-aos-delay={index * 50}>
                <div className="h-100">
                  <div className="feature-card h-100 p-0 border-0 overflow-hidden">
                    <div className="position-relative h-100">
                      <div className="position-absolute w-100 h-100" style={{
                        background: feature.gradient,
                        opacity: 0.1,
                        zIndex: 0
                      }}></div>
                      <div className="position-relative p-4 p-xl-5 h-100 d-flex flex-column" style={{ zIndex: 1 }}>
                        <div 
                          className="d-inline-flex align-items-center justify-content-center mb-4 rounded-3" 
                          style={{
                            width: '64px',
                            height: '64px',
                            background: `${feature.gradient}, ${feature.color}`,
                            color: 'white',
                            fontSize: '1.75rem',
                            boxShadow: `0 8px 20px -5px ${feature.color}40`
                          }}
                        >
                          {React.cloneElement(feature.icon, { 
                            style: { 
                              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' 
                            }
                          })}
                        </div>
                        <h3 className="h4 fw-bold mb-3">{feature.title}</h3>
                        <p className="text-muted mb-4 flex-grow-1">{feature.description}</p>
                      </div>
                      <div className="position-absolute top-0 end-0 m-3">
                        <div className="bg-white bg-opacity-20 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Text Left - Image Right */}
      <section className="py-5 bg-white">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="pe-md-5 mb-4 mb-md-0">
              <Badge bg="primary" className="px-3 py-2 rounded-pill mb-3 d-inline-flex align-items-center">
                <FaChartLine className="me-2" /> Farm Analytics
              </Badge>
              <h2 className="h2 fw-bold mb-4">Data-Driven Biosecurity Management</h2>
              <p className="text-muted mb-4">Harness the power of data to make informed decisions about your farm's biosecurity. Our platform provides actionable insights to optimize your operations and protect your livestock.</p>
              
              <div className="d-flex flex-column gap-3 mb-4">
                <div className="d-flex align-items-start">
                  <div className="me-3 text-primary">
                    <FaChartLine size={20} />
                  </div>
                  <div>
                    <h5 className="mb-1">Performance Analytics</h5>
                    <p className="text-muted small mb-0">Track key biosecurity metrics and identify areas for improvement.</p>
                  </div>
                </div>
                <div className="d-flex align-items-start">
                  <div className="me-3 text-primary">
                    <FaBell size={20} />
                  </div>
                  <div>
                    <h5 className="mb-1">Real-time Alerts</h5>
                    <p className="text-muted small mb-0">Get instant notifications about potential biosecurity risks.</p>
                  </div>
                </div>
                <div className="d-flex align-items-start">
                  <div className="me-3 text-primary">
                    <FaClipboardCheck size={20} />
                  </div>
                  <div>
                    <h5 className="mb-1">Compliance Reporting</h5>
                    <p className="text-muted small mb-0">Generate comprehensive reports for regulatory compliance and audits.</p>
                  </div>
                </div>
              </div>
              
            </Col>
            <Col md={6}>
              <div className="position-relative">
                <img 
                  src="/images/dashboard-preview.svg" 
                  alt="Biosecurity Analytics Dashboard" 
                  className="img-fluid rounded-3 shadow-lg w-100"
                  style={{ maxHeight: '500px', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';
                  }}
                />
                <div className="position-absolute bottom-0 end-0 m-3">
                  <div className="bg-white rounded-pill px-3 py-2 shadow-sm d-flex align-items-center">
                    <div className="bg-success rounded-circle me-2" style={{width: '10px', height: '10px'}}></div>
                    <small className="text-muted">Live Data</small>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>


      {/* How It Works Section */}
      <section className="py-5 bg-light">
        <Container className="py-5">
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <Badge bg="primary" className="px-3 py-2 rounded-pill mb-3 d-inline-flex align-items-center">
                <FaCog className="me-2" /> Our Process
              </Badge>
              <h2 className="display-5 fw-bold mb-3">Implementing Biosecurity Made Simple</h2>
              <p className="lead text-muted">Our streamlined process ensures effective biosecurity implementation for your pig or poultry farm</p>
            </Col>
          </Row>
          <Row className="g-4">
            {steps.map((step, index) => (
              <Col md={4} key={index}>
                <div className="h-100 p-4 text-center">
                  <div className="position-relative mb-4">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10" style={{width: '80px', height: '80px'}}>
                      {step.icon}
                    </div>
                    <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-primary">
                      {step.number}
                    </span>
                  </div>
                  <h4 className="h5 fw-bold mb-3">{step.title}</h4>
                  <p className="text-muted mb-0">{step.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Farm Types Section */}
      <section className="py-6 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
        <div className="position-absolute w-100 h-100" style={{ 
          background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 .895 2 2 2zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM57 67c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm-3-30c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm5.44 6.929c-.562.225-1.16.393-1.788.497a5 5 0 0 0 6.108 7.779l.002-.001.006-.003a5 5 0 0 0 3.293-6.474 12.96 12.96 0 0 1-7.613-2.798zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%232c7be5\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          opacity: 0.7
        }}></div>
        <Container className="position-relative">
          <Row className="justify-content-center text-center mb-6">
            <Col lg={8} xl={7}>
              <Badge bg="rgba(44, 123, 229, 0.1)" className="px-3 py-2 rounded-pill mb-3 d-inline-flex align-items-center text-primary fw-medium">
                <FaLeaf className="me-2" /> Farm Solutions
              </Badge>
              <h2 className="display-5 fw-bold mb-3">Perfect for <span className="text-gradient">Every Farm Type</span></h2>
              <p className="lead text-muted mb-0">Tailored solutions designed for different agricultural operations and needs</p>
            </Col>
          </Row>
          <Row className="g-4">
            {farmTypes.map((type, index) => (
              <Col md={4} key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="farm-type-card h-100">
                  <div className="card h-100 border-0 shadow-sm overflow-hidden transition-all hover-scale">
                    <div 
                      className="card-header bg-transparent border-0 p-4 text-center position-relative"
                      style={{
                        background: index === 0 ? 'linear-gradient(135deg, #2c7be5 0%, #1a5cb8 100%)' : 
                                  index === 1 ? 'linear-gradient(135deg, #00a854 0%, #008a3c 100%)' : 
                                  'linear-gradient(135deg, #f0ad4e 0%, #e69a00 100%)',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div className="position-absolute w-100 h-100 bg-white opacity-10" style={{top: 0, left: 0}}></div>
                      <div className="position-relative">
                        <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-3">
                          {React.cloneElement(type.icon, { 
                            style: { 
                              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                              color: type.color
                            }
                          })}
                        </div>
                        <h3 className="h3 mb-0 fw-bold">{type.title}</h3>
                      </div>
                    </div>
                    <div className="card-body p-4">
                      <ul className="list-unstyled mb-0">
                        {type.features.map((feature, i) => (
                          <li key={i} className="mb-3 d-flex align-items-center">
                            <div 
                              className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                              style={{ 
                                width: '36px', 
                                height: '36px', 
                                minWidth: '36px',
                                background: index === 0 ? 'rgba(44, 123, 229, 0.1)' : 
                                           index === 1 ? 'rgba(0, 168, 84, 0.1)' : 
                                           'rgba(240, 173, 78, 0.1)'
                              }}
                            >
                              <FaCheckCircle 
                                className={index === 0 ? 'text-primary' : index === 1 ? 'text-success' : 'text-warning'} 
                                size={16}
                              />
                            </div>
                            <span className="fw-medium text-muted">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="card-footer bg-transparent border-0 p-4 pt-0">
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-5 bg-primary text-white">
        <Container className="py-5">
          <Row className="text-center">
            <Col md={3} className="mb-4 mb-md-0">
              <div className="stat-item p-4">
                <div className="display-3 fw-bold">95%</div>
                <p className="mb-0">Disease Prevention</p>
              </div>
            </Col>
            <Col md={3} className="mb-4 mb-md-0">
              <div className="stat-item p-4">
                <div className="display-3 fw-bold">24/7</div>
                <p className="mb-0">Monitoring</p>
              </div>
            </Col>
            <Col md={3} className="mb-4 mb-md-0">
              <div className="stat-item p-4">
                <div className="display-3 fw-bold">1000+</div>
                <p className="mb-0">Happy Farmers</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="stat-item p-4">
                <div className="display-3 fw-bold">99.9%</div>
                <p className="mb-0">Uptime</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-5 bg-white">
        <Container className="py-5">
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <Badge bg="primary" className="px-3 py-2 rounded-pill mb-3 d-inline-flex align-items-center">
                <FaStar className="me-2" /> Success Stories
              </Badge>
              <h2 className="display-5 fw-bold mb-3">Trusted by Leading Pig & Poultry Farms</h2>
              <p className="lead text-muted">See how farms of all sizes are transforming their biosecurity with our digital platform</p>
            </Col>
          </Row>
          <Row>
            <Col lg={10} className="mx-auto">
              <Carousel indicators={false} interval={5000} className="testimonial-carousel">
                {testimonials.map((testimonial, index) => (
                  <Carousel.Item key={index}>
                    <Card className="border-0 shadow-sm p-4 p-lg-5 text-center h-100">
                      <div className="mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <FaStar key={i} className="text-warning mx-1" />
                        ))}
                      </div>
                      <blockquote className="blockquote mb-4">
                        <p className="lead fst-italic">"{testimonial.quote}"</p>
                      </blockquote>
                      <footer className="blockquote-footer mt-4">
                        <div className="d-flex flex-column align-items-center">
                          <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                            <FaUser className="text-primary" size={24} />
                          </div>
                          <div>
                            <div className="h6 mb-0 fw-bold">{testimonial.author}</div>
                            <small className="text-muted">Verified User</small>
                          </div>
                        </div>
                      </footer>
                    </Card>
                  </Carousel.Item>
                ))}
              </Carousel>
              
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-8 position-relative overflow-hidden" style={{ 
        background: 'linear-gradient(135deg, #1a5276 0%, #1e8449 100%)',
        color: 'white',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div className="position-absolute w-100 h-100" style={{ 
          background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 .895 2 2 2zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM57 67c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm-3-30c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm5.44 6.929c-.562.225-1.16.393-1.788.497a5 5 0 0 0 6.108 7.779l.002-.001.006-.003a5 5 0 0 0 3.293-6.474 12.96 12.96 0 0 1-7.613-2.798zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          opacity: 0.5
        }}></div>
        <Container className="position-relative">
          <Row className="justify-content-center text-center">
            <Col lg={8} xl={7}>
              <Badge 
                bg="rgba(255, 255, 255, 0.2)" 
                className="px-3 py-2 rounded-pill mb-3 d-inline-flex align-items-center text-white fw-medium"
                style={{
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <FaRocket className="me-2" /> Get Started
              </Badge>
              <h2 className="display-5 fw-bold mb-4">Ready to Enhance Your Farm's Biosecurity?</h2>
              <p className="lead mb-5 opacity-75">Join leading pig and poultry farms in implementing robust biosecurity measures. Start your 14-day free trial and experience the difference.</p>
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
              </div>
              <div className="d-flex align-items-center justify-content-center gap-3 mt-4">
                <div className="d-flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} className="text-warning" />
                  ))}
                </div>
                <div className="text-white-50">Rated 4.9/5 by 500+ farmers</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="position-relative overflow-hidden" style={{
        background: 'linear-gradient(to bottom, #1a5276 0%, #1e8449 100%)',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div className="position-absolute w-100 h-100" style={{ 
          background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 .895 2 2 2zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM57 67c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm-3-30c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm5.44 6.929c-.562.225-1.16.393-1.788.497a5 5 0 0 0 6.108 7.779l.002-.001.006-.003a5 5 0 0 0 3.293-6.474 12.96 12.96 0 0 1-7.613-2.798zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.03\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          opacity: 0.3
        }}></div>
        <Container className="position-relative py-8">
          <Row className="g-5">
            <Col lg={4} className="mb-5 mb-lg-0">
              <div className="d-flex align-items-center mb-4">
                <FaLeaf className="text-success me-2" size={28} />
                <span className="h4 mb-0 fw-bold">FarmFist</span>
              </div>
              <p className="text-muted mb-4">Empowering farmers with modern technology solutions for better agricultural management and sustainable farming practices.</p>
              <div className="d-flex gap-3">
                {[
                  { icon: <FaFacebookF />, url: 'https://www.facebook.com/login/' },
                  { icon: <FaTwitter />, url: 'https://twitter.com/i/flow/login' },
                  { icon: <FaLinkedinIn />, url: 'https://www.linkedin.com/login' },
                  { icon: <FaInstagram />, url: 'https://www.instagram.com/accounts/login/' },
                  { icon: <FaYoutube />, url: 'https://accounts.google.com/ServiceLogin?service=youtube' }
                ].map((social, index) => (
                  <a 
                    key={index} 
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-flex align-items-center justify-content-center rounded-circle" 
                    style={{
                      width: '40px',
                      height: '40px',
                      background: 'rgba(255,255,255,0.05)',
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.1)';
                      e.target.style.color = 'white';
                      e.target.style.transform = 'translateY(-3px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.05)';
                      e.target.style.color = 'rgba(255,255,255,0.7)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </Col>
            
            <Col md={4} lg={2} className="mb-4 mb-md-0">
              <h6 className="text-uppercase fw-bold mb-4">Product</h6>
              <ul className="list-unstyled">
                {['Features', 'Pricing', 'Updates', 'Roadmap', 'Changelog'].map((item, index) => (
                  <li key={index} className="mb-2">
                    <a 
                      href="#" 
                      className="text-muted text-decoration-none d-flex align-items-center"
                      style={{
                        transition: 'all 0.2s ease',
                        padding: '0.25rem 0'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.paddingLeft = '8px';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = '#adb5bd';
                        e.currentTarget.style.paddingLeft = '0';
                      }}
                    >
                      <FaChevronRight className="me-2" size={10} />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </Col>
            
            <Col md={4} lg={2} className="mb-4 mb-md-0">
              <h6 className="text-uppercase fw-bold mb-4">Company</h6>
              <ul className="list-unstyled">
                {['About Us', 'Careers', 'Blog', 'Press', 'Partners'].map((item, index) => (
                  <li key={index} className="mb-2">
                    <a 
                      href="#" 
                      className="text-muted text-decoration-none d-flex align-items-center"
                      style={{
                        transition: 'all 0.2s ease',
                        padding: '0.25rem 0'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.paddingLeft = '8px';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = '#adb5bd';
                        e.currentTarget.style.paddingLeft = '0';
                      }}
                    >
                      <FaChevronRight className="me-2" size={10} />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </Col>
            
            <Col md={4} lg={3}>
              <h6 className="text-uppercase fw-bold mb-4">Stay Updated</h6>
              <p className="text-muted mb-4">Subscribe to our newsletter for the latest updates and news.</p>
              <div className="input-group mb-3">
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="Enter your email" 
                  style={{
                    borderTopLeftRadius: '50px',
                    borderBottomLeftRadius: '50px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRight: 'none',
                    boxShadow: 'none',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    transition: 'all 0.3s ease',
                    height: '50px'
                  }}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.15)';
                    e.target.style.borderColor = 'var(--accent-light)';
                    e.target.style.boxShadow = '0 0 0 0.2rem rgba(105, 240, 174, 0.25)';
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button 
                  className="btn" 
                  type="button"
                  style={{
                    borderTopRightRadius: '50px',
                    borderBottomRightRadius: '50px',
                    padding: '0 1.5rem',
                    height: '50px',
                    fontWeight: '600',
                    background: 'var(--accent)',
                    color: 'var(--primary-dark)',
                    border: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
                    e.target.style.background = 'var(--accent-light)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                    e.target.style.background = 'var(--accent)';
                  }}
                >
                  Subscribe
                </button>
              </div>
              <div className="d-flex align-items-center text-muted">
                <FaShieldAlt className="me-2 text-success" />
                <small>We respect your privacy. Unsubscribe anytime.</small>
              </div>
            </Col>
          </Row>
          
          <hr className="my-5 border-secondary" />
          
          <Row className="align-items-center">
            <Col md={6} className="mb-3 mb-md-0">
              <p className="mb-0 text-muted">
                © {new Date().getFullYear()} FarmFist. All rights reserved.
              </p>
            </Col>
            <Col md={6} className="text-md-end">
              <div className="d-flex justify-content-md-end gap-4">
                <a href="#" className="text-muted text-decoration-none">Privacy Policy</a>
                <a href="#" className="text-muted text-decoration-none">Terms of Service</a>
                <a href="#" className="text-muted text-decoration-none">Cookies</a>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Home;