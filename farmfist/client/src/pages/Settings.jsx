import React, { useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Form, Button,
  Alert, Spinner, Badge, Modal, Tabs, Tab,
  InputGroup, ListGroup, OverlayTrigger, Tooltip
} from 'react-bootstrap';
import {
  FiBell, FiShield, FiSettings, FiUser,
  FiGlobe, FiCalendar, FiMoon, FiSun,
  FiSave, FiRotateCw, FiDownload, FiUpload,
  FiCheck, FiAlertCircle, FiInfo, FiLock
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      inspectionReminders: true,
      reportNotifications: true,
      systemUpdates: false
    },
    privacy: {
      profileVisibility: 'private',
      dataSharing: false,
      analyticsTracking: true
    },
    preferences: {
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'DD/MM/YYYY',
      theme: 'light'
    }
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    // Load user settings from localStorage or API
    const savedSettings = localStorage.getItem('farmfist_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to load settings');
      }
    }
  }, []);

  const handleNotificationChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [setting]: value
      }
    }));
  };

  const handlePrivacyChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [setting]: value
      }
    }));
  };

  const handlePreferenceChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [setting]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Save to localStorage (in a real app, this would be an API call)
      localStorage.setItem('farmfist_settings', JSON.stringify(settings));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess('Settings saved successfully!');
    } catch (error) {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const defaultSettings = {
      notifications: {
        emailAlerts: true,
        inspectionReminders: true,
        reportNotifications: true,
        systemUpdates: false
      },
      privacy: {
        profileVisibility: 'private',
        dataSharing: false,
        analyticsTracking: true
      },
      preferences: {
        language: 'en',
        timezone: 'UTC',
        dateFormat: 'DD/MM/YYYY',
        theme: 'light'
      }
    };

    setSettings(defaultSettings);
    localStorage.setItem('farmfist_settings', JSON.stringify(defaultSettings));
    setSuccess('Settings reset to defaults!');
    setShowResetModal(false);
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = 'farmfist-settings.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          setSettings(importedSettings);
          localStorage.setItem('farmfist_settings', JSON.stringify(importedSettings));
          setSuccess('Settings imported successfully!');
        } catch (error) {
          setError('Failed to import settings. Invalid file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold text-primary mb-2">Account Settings</h1>
          <p className="text-muted mb-0">Manage your preferences and privacy settings</p>
        </div>
        <div className="d-flex gap-2">
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowResetModal(true)}
            className="d-flex align-items-center"
          >
            <FiRotateCw className="me-2" /> Reset to Defaults
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            disabled={saving}
            className="d-flex align-items-center"
          >
            {saving ? (
              <>
                <Spinner as="span" size="sm" animation="border" role="status" className="me-2" />
                Saving...
              </>
            ) : (
              <>
                <FiSave className="me-2" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => setError('')}>
          <FiAlertCircle className="me-2" />
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mb-4" dismissible onClose={() => setSuccess('')}>
          <FiCheck className="me-2" />
          {success}
        </Alert>
      )}

      <Tabs defaultActiveKey="notifications" className="mb-4">
        <Tab eventKey="notifications" title={
          <span className="d-flex align-items-center">
            <FiBell className="me-1" /> Notifications
          </span>
        }>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-4 d-flex align-items-center">
                <FiBell className="text-primary me-2" /> Notification Preferences
              </h5>
              <ListGroup variant="flush" className="mb-4">
                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                  <div>
                    <div className="fw-medium">Email Alerts</div>
                    <small className="text-muted">Receive important updates via email</small>
                  </div>
                  <Form.Check 
                    type="switch"
                    id="emailAlerts"
                    checked={settings.notifications.emailAlerts}
                    onChange={(e) => handleNotificationChange('emailAlerts', e.target.checked)}
                  />
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                  <div>
                    <div className="fw-medium">Inspection Reminders</div>
                    <small className="text-muted">Get reminders about upcoming farm inspections</small>
                  </div>
                  <Form.Check 
                    type="switch"
                    id="inspectionReminders"
                    checked={settings.notifications.inspectionReminders}
                    onChange={(e) => handleNotificationChange('inspectionReminders', e.target.checked)}
                  />
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                  <div>
                    <div className="fw-medium">Report Notifications</div>
                    <small className="text-muted">Get notified when new reports are ready</small>
                  </div>
                  <Form.Check 
                    type="switch"
                    id="reportNotifications"
                    checked={settings.notifications.reportNotifications}
                    onChange={(e) => handleNotificationChange('reportNotifications', e.target.checked)}
                  />
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                  <div>
                    <div className="fw-medium">System Updates</div>
                    <small className="text-muted">Receive notifications about system updates</small>
                  </div>
                  <Form.Check 
                    type="switch"
                    id="systemUpdates"
                    checked={settings.notifications.systemUpdates}
                    onChange={(e) => handleNotificationChange('systemUpdates', e.target.checked)}
                  />
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="privacy" title={
          <span className="d-flex align-items-center">
            <FiShield className="me-1" /> Privacy
          </span>
        }>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-4 d-flex align-items-center">
                <FiShield className="text-primary me-2" /> Privacy & Security
              </h5>
              
              <Form.Group className="mb-4">
                <Form.Label className="fw-medium">Profile Visibility</Form.Label>
                <Form.Select
                  value={settings.privacy.profileVisibility}
                  onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                  className="form-select-lg"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="farmers-only">Farmers Only</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  Control who can see your profile information
                </Form.Text>
              </Form.Group>

              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 mb-3">
                  <div>
                    <div className="fw-medium">Data Sharing</div>
                    <small className="text-muted">Help improve FarmFist by sharing anonymous data</small>
                  </div>
                  <Form.Check 
                    type="switch"
                    id="dataSharing"
                    checked={settings.privacy.dataSharing}
                    onChange={(e) => handlePrivacyChange('dataSharing', e.target.checked)}
                  />
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
                  <div>
                    <div className="fw-medium">Analytics Tracking</div>
                    <small className="text-muted">Allow us to track usage analytics</small>
                  </div>
                  <Form.Check 
                    type="switch"
                    id="analyticsTracking"
                    checked={settings.privacy.analyticsTracking}
                    onChange={(e) => handlePrivacyChange('analyticsTracking', e.target.checked)}
                  />
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="preferences" title={
          <span className="d-flex align-items-center">
            <FiSettings className="me-1" /> Preferences
          </span>
        }>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-4 d-flex align-items-center">
                <FiSettings className="text-primary me-2" /> Application Preferences
              </h5>
              
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Language</Form.Label>
                    <Form.Select
                      value={settings.preferences.language}
                      onChange={(e) => handlePreferenceChange('language', e.target.value)}
                      className="form-select-lg"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Timezone</Form.Label>
                    <Form.Select
                      value={settings.preferences.timezone}
                      onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                      className="form-select-lg"
                    >
                      <option value="UTC">UTC</option>
                      <option value="UTC+5:30">IST (UTC+5:30)</option>
                      <option value="UTC-5">EST (UTC-5)</option>
                      <option value="UTC-4">EDT (UTC-4)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Date Format</Form.Label>
                    <Form.Select
                      value={settings.preferences.dateFormat}
                      onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                      className="form-select-lg"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">Theme</Form.Label>
                    <div className="d-flex gap-3">
                      <div 
                        className={`theme-option ${settings.preferences.theme === 'light' ? 'active' : ''}`}
                        onClick={() => handlePreferenceChange('theme', 'light')}
                      >
                        <div className="theme-preview light">
                          <FiSun className="theme-icon" />
                        </div>
                        <span>Light</span>
                      </div>
                      
                      <div 
                        className={`theme-option ${settings.preferences.theme === 'dark' ? 'active' : ''}`}
                        onClick={() => handlePreferenceChange('theme', 'dark')}
                      >
                        <div className="theme-preview dark">
                          <FiMoon className="theme-icon" />
                        </div>
                        <span>Dark</span>
                      </div>
                      
                      <div 
                        className={`theme-option ${settings.preferences.theme === 'system' ? 'active' : ''}`}
                        onClick={() => handlePreferenceChange('theme', 'system')}
                      >
                        <div className="theme-preview system">
                          <FiSettings className="theme-icon" />
                        </div>
                        <span>System</span>
                      </div>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
        <div>
          <Button 
            variant="outline-secondary" 
            onClick={exportSettings}
            className="me-2"
          >
            <FiDownload className="me-2" /> Export Settings
          </Button>
          <Button 
            variant="outline-secondary" 
            as="label"
            htmlFor="import-settings"
            className="position-relative"
          >
            <FiUpload className="me-2" /> Import Settings
            <input
              type="file"
              id="import-settings"
              accept=".json"
              onChange={importSettings}
              style={{ display: 'none' }}
            />
          </Button>
        </div>
        
        <div>
          <Button 
            variant="outline-danger" 
            onClick={() => setShowResetModal(true)}
            className="me-2"
          >
            <FiRotateCw className="me-2" /> Reset All Settings
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            disabled={saving}
            className="px-4"
          >
            {saving ? (
              <>
                <Spinner as="span" size="sm" animation="border" role="status" className="me-2" />
                Saving...
              </>
            ) : (
              <>
                <FiSave className="me-2" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reset Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <div className="bg-danger bg-opacity-10 d-inline-flex p-3 rounded-circle mb-3">
              <FiAlertCircle className="text-danger" size={32} />
            </div>
            <h5>Are you sure?</h5>
            <p className="text-muted">
              This will reset all your settings to their default values. This action cannot be undone.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowResetModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => {
            handleReset();
            setShowResetModal(false);
          }}>
            Yes, Reset Settings
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx global>{`
        .theme-option {
          text-align: center;
          cursor: pointer;
          padding: 10px;
          border-radius: 8px;
          transition: all 0.2s;
        }
        
        .theme-option:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .theme-option.active {
          background-color: rgba(13, 110, 253, 0.1);
          border: 1px solid rgba(13, 110, 253, 0.3);
        }
        
        .theme-preview {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          border: 1px solid #dee2e6;
        }
        
        .theme-preview.light {
          background-color: #ffffff;
          color: #212529;
        }
        
        .theme-preview.dark {
          background-color: #212529;
          color: #f8f9fa;
        }
        
        .theme-preview.system {
          background: linear-gradient(135deg, #f8f9fa 50%, #212529 50%);
          color: #212529;
        }
        
        .theme-icon {
          font-size: 1.5rem;
        }
      `}</style>
    </Container>
  );
};

export default Settings;