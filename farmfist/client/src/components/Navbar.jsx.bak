import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Offcanvas, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext.jsx';

const NavigationBar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navbarRef = useRef(null);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const handleLogout = () => {
    logout();
    navigate('/');
    handleOffcanvasClose();
  };

  const handleOffcanvasClose = () => setShowOffcanvas(false);
  const handleOffcanvasShow = () => setShowOffcanvas(true);

  const navItems = [
    { path: '/', label: 'Home', icon: 'fas fa-home' },
    { path: '/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { path: '/farms', label: 'Farms', icon: 'fas fa-tractor' },
    { path: '/inspections', label: 'Inspections', icon: 'fas fa-clipboard-check' },
    { path: '/reports', label: 'Reports', icon: 'fas fa-chart-bar' },
    ...(user?.role === 'admin' ? [{ path: '/admin', label: 'Admin', icon: 'fas fa-shield-alt' }] : []),
  ];

  const accountItems = [
    { path: '/profile', label: 'Profile', icon: 'fas fa-user' },
    { path: '/settings', label: 'Settings', icon: 'fas fa-cog' },
  ];

  // Check if current path matches nav item
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <div className="fixed-top" style={{
        background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 2px 15px rgba(0, 0, 0, 0.05)',
        zIndex: 1030,
        width: '100%',
        overflow: 'visible',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0
      }}>
        <Container fluid className="px-3 px-lg-4" style={{ maxWidth: '1400px' }}>
          <Navbar 
            ref={navbarRef}
            expand="lg" 
            className={`${scrolled ? 'navbar-scrolled' : ''} ${isAuthenticated ? 'bg-transparent' : 'bg-transparent'}`}
            style={{
              minHeight: '70px',
              padding: '0 1rem',
              margin: '0 auto',
              transition: 'all 0.3s ease',
              lineHeight: '1',
              fontSize: '1rem',
              alignItems: 'center',
              background: 'transparent',
              width: '100%',
              maxWidth: '100%',
              position: 'relative',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center" style={{
            background: 'linear-gradient(90deg, #ffeb3b 0%, #fbc02d 100%)',
            padding: '0.4rem 1rem 0.4rem 0.8rem',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            marginRight: '1.5rem',
            transition: 'all 0.3s ease'
          }}>
            <div className="me-2 d-flex align-items-center" style={{
              transform: 'rotate(-5deg)',
              transition: 'transform 0.3s ease'
            }}>
              <i className="fas fa-seedling" style={{ 
                fontSize: '1.4rem', 
                color: '#1b5e20',
                lineHeight: '1',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
              }}></i>
            </div>
            <span className="fw-bold" style={{ 
              fontSize: '1.4rem', 
              color: '#1b5e20',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              letterSpacing: '0.5px'
            }}>FarmFist</span>
          </Navbar.Brand>

          <div className="d-flex align-items-center">
            {!isAuthenticated ? (
              <Nav className="d-flex align-items-center" style={{ gap: '0.5rem' }}>
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="px-3 py-1 rounded-3"
                  style={{
                    fontSize: '0.9rem',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    transition: 'all 0.2s ease',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <i className="fas fa-sign-in-alt me-2"></i>
                  <span>Login</span>
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/register"
                  className="px-3 py-1 rounded-3"
                  style={{
                    fontSize: '0.9rem',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    transition: 'all 0.2s ease',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  <i className="fas fa-user-plus me-2"></i>
                  <span>Register</span>
                </Nav.Link>
              </Nav>
            ) : (
              <>
                <div className="d-flex align-items-center">
                <Navbar.Toggle 
                  aria-controls="navbar-nav" 
                  onClick={handleOffcanvasShow}
                  className="border-0 p-2"
                  style={{ 
                    color: '#fff',
                    fontSize: '1.2rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <i className="fas fa-bars"></i>
                </Navbar.Toggle>
              </div>

              {/* Desktop Navigation */}
              <Navbar.Collapse id="navbar-nav" className="justify-content-between" style={{ 
                flexGrow: 1, 
                position: 'relative',
                overflow: 'visible',
                width: '100%',
                zIndex: 1031
              }}>
                <Nav className="mx-lg-4" style={{
                  padding: '0.5rem 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  margin: '0 auto'
                }}>
                  {navItems.map((item) => (
                    <Nav.Link
                      key={item.path}
                      as={Link}
                      to={item.path}
                      className={`mx-3 px-3 py-1 rounded-3 d-flex align-items-center ${isActive(item.path) ? 'active' : ''}`}
                      style={{
                        fontSize: '0.9rem',
                        height: '32px',
                        transition: 'all 0.2s ease-in-out',
                        position: 'relative',
                        overflow: 'hidden',
                        margin: '0 8px',
                        minWidth: '100px',
                        justifyContent: 'center'
                      }}
                    >
                      <i className={`${item.icon} me-2`} style={{
                        width: '20px',
                        textAlign: 'center',
                        fontSize: '1.1em',
                        minWidth: '20px'
                      }}></i>
                      <span style={{
                        position: 'relative',
                        top: '1px'
                      }}>{item.label}</span>
                      {isActive(item.path) && (
                        <div className="position-absolute bottom-0 start-50 translate-middle-x" 
                          style={{
                            width: '24px',
                            height: '3px',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '3px 3px 0 0'
                          }}
                        />
                      )}
                    </Nav.Link>
                  ))}
                </Nav>

                <Nav className="align-items-center" style={{ 
                  position: 'relative',
                  marginLeft: 'auto',
                  paddingRight: '1rem'
                }}>
                  <div style={{ 
                    position: 'relative', 
                    zIndex: 1032,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <NavDropdown
                      title={
                        <div 
                          className="d-flex align-items-center" 
                          style={{
                            padding: '0.5rem',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.15)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                            width: '40px',
                            height: '40px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative'
                          }}
                          title={user?.name || 'Profile'}
                        >
                          <i 
                            className="fas fa-user-circle" 
                            style={{ 
                              fontSize: '1.4rem',
                              color: '#fff',
                              margin: 0
                            }}
                          ></i>
                          <i 
                            className="fas fa-chevron-down" 
                            style={{
                              fontSize: '0.6rem',
                              color: 'rgba(255, 255, 255, 0.8)',
                              position: 'absolute',
                              bottom: '4px',
                              right: '4px',
                              background: 'rgba(0,0,0,0.3)',
                              borderRadius: '50%',
                              width: '14px',
                              height: '14px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              lineHeight: 1
                            }}
                          ></i>
                        </div>
                      }
                      id="user-dropdown"
                      align="end"
                      className="nav-account-dropdown"
                      style={{ 
                        zIndex: 1032,
                        position: 'static'
                      }}
                    >
                    <div className="px-3 py-2 border-bottom" style={{ zIndex: 1033 }}>
                      <div className="d-flex align-items-center">
                        <div className="avatar me-3">
                          {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="rounded-circle" width="40" height="40" />
                          ) : (
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                              <i className="fas fa-user text-muted"></i>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="fw-medium">{user?.name}</div>
                          <small className="text-muted">{user?.email}</small>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      {accountItems.map((item) => (
                        <NavDropdown.Item 
                          key={item.path} 
                          as={Link} 
                          to={item.path}
                          className="d-flex align-items-center py-2 px-3 rounded-2"
                          onClick={handleOffcanvasClose}
                        >
                          <i className={`${item.icon} me-3 text-muted`}></i>
                          {item.label}
                        </NavDropdown.Item>
                      ))}
                      <NavDropdown.Divider className="my-2" />
                      <NavDropdown.Item 
                        onClick={handleLogout} 
                        className="d-flex align-items-center py-2 px-3 text-danger rounded-2"
                      >
                        <i className="fas fa-sign-out-alt me-3"></i>
                        Logout
                      </NavDropdown.Item>
                    </div>
                  ) : (
                    <Nav className="align-items-center" style={{ 
                      position: 'relative',
                      marginLeft: 'auto',
                      paddingRight: '1rem'
                    }}>
                      <Nav.Link 
                        as={Link} 
                        to="/login" 
                        className="d-flex align-items-center py-2 px-3 rounded-2"
                        style={{
                          fontSize: '0.9rem',
                          height: '32px',
                          transition: 'all 0.2s ease-in-out',
                          position: 'relative',
                          overflow: 'hidden',
                          margin: '0 8px',
                          minWidth: '100px',
                          justifyContent: 'center'
                        }}
                      >
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Login
                      </Nav.Link>
                      <Nav.Link 
                        as={Link} 
                        to="/register" 
                        className="d-flex align-items-center py-2 px-3 rounded-2"
                        style={{
                          fontSize: '0.9rem',
                          height: '32px',
                          transition: 'all 0.2s ease-in-out',
                          position: 'relative',
                          overflow: 'hidden',
                          margin: '0 8px',
                          minWidth: '100px',
                          justifyContent: 'center'
                        }}
                      >
                        <i className="fas fa-user-plus me-2"></i>
                        Register
                      </Nav.Link>
                    </Nav>
                  )}
                </Nav>
              </Navbar.Collapse>

              {/* Mobile Offcanvas Navigation */}
              <Offcanvas
                show={showOffcanvas}
                onHide={handleOffcanvasClose}
                placement="end"
                style={{
                  background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
                  color: 'white'
                }}
              >
                <Offcanvas.Header closeButton className="border-bottom border-white">
                  <Offcanvas.Title className="d-flex align-items-center">
                    <div
                      className="me-2 d-flex align-items-center justify-content-center"
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: '6px'
                      }}
                    >
                      <i className="fas fa-fist-raised"></i>
                    </div>
                    FarmFist
                  </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-0">
                  <Nav className="flex-column p-3">
                    {navItems.map((item) => (
                      <Nav.Link
                        key={item.path}
                        as={Link}
                        to={item.path}
                        onClick={handleOffcanvasClose}
                        className={`nav-link d-flex align-items-center py-2 px-3 ${isActive(item.path) ? 'active' : ''}`}
                        style={{
                          color: isActive(item.path) ? '#fff' : 'rgba(255, 255, 255, 0.9)',
                          fontWeight: isActive(item.path) ? '600' : '500',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                          position: 'relative',
                          fontSize: '0.95rem',
                          background: isActive(item.path) ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                          border: isActive(item.path) ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent',
                          boxShadow: isActive(item.path) ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive(item.path)) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive(item.path)) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.boxShadow = 'none';
                          }
                        }}
                      >
                        <i className={`${item.icon} me-2`}></i>
                        {item.label}
                      </Nav.Link>
                    ))}
                    
                    {/* Account Links */}
                    <div className="mt-4 pt-3 border-top border-white-10">
                      <h6 className="text-uppercase text-white-50 small fw-bold px-3 mb-3">Account</h6>
                      {accountItems.map((item) => (
                        <Nav.Link
                          key={item.path}
                          as={Link}
                          to={item.path}
                          onClick={handleOffcanvasClose}
                          className="text-white mb-2 py-2 px-3 rounded d-flex align-items-center"
                          style={{
                            transition: 'all 0.3s ease',
                            border: '1px solid rgba(255,255,255,0.1)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <i className={`${item.icon} me-2`}></i>
                          {item.label}
                        </Nav.Link>
                      ))}
                      
                      {/* Logout Button */}
                      <Nav.Link
                        onClick={handleLogout}
                        className="text-danger mb-2 py-2 px-3 rounded d-flex align-items-center"
                        style={{
                          transition: 'all 0.3s ease',
                          border: '1px solid rgba(255,255,255,0.1)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Logout
                      </Nav.Link>
                    </div>
                  </Nav>
                </Offcanvas.Body>
              </Offcanvas>
            </>
          )}
          </Navbar>
        </Container>
      </div>
      </>
    );
  };

export default NavigationBar;
