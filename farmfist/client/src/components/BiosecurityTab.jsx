import React, { useState } from 'react';
import { Card, ListGroup, Badge, Button, Form, Row, Col, Alert, Tab, Nav } from 'react-bootstrap';
import { 
  FaUserShield, FaTruck, FaUsers, FaPaw, FaBroom, FaClipboardCheck, FaPlus, 
  FaEdit, FaUserMd, FaSign, FaLock, FaVideo, FaLightbulb, FaTshirt, 
  FaHandsWash, FaPumpSoap, FaShoePrints, FaClipboardList, FaUserCheck, 
  FaChalkboardTeacher, FaSprayCan, FaCarSide, FaParking, FaTools, 
  FaProcedures, FaExchangeAlt, FaBug, FaCrow, FaTrashAlt, FaSkull, 
  FaBox, FaBoxOpen, FaLeaf, FaBreadSlice, FaMouse, FaBabyCarriage, 
  FaDoorClosed, FaSave, FaTimes, FaInfoCircle, FaCheckCircle, FaChartPie, 
  FaEgg, FaSyringe, FaPills, FaMicroscope, FaCalendarAlt, FaDove, 
  FaShieldAlt, FaTint, FaHands, FaFilePdf, FaHome, FaWind, FaHeartbeat, FaUtensils
} from 'react-icons/fa';
import { GiFarmTractor, GiBarn, GiChickenOven, GiPig } from 'react-icons/gi';

const BiosecurityTab = ({ farm, onUpdate }) => {
  console.log('BiosecurityTab rendering with farm:', farm);
  console.log('Biosecurity data:', farm?.biosecurity);
  const [activeTab, setActiveTab] = useState(farm?.farmType === 'pig' ? 'pigs' : 'poultry');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    // Perimeter Security
    perimeterControl: {
      fencing: farm?.biosecurity?.perimeterControl?.fencing || false,
      fencingType: farm?.biosecurity?.perimeterControl?.fencingType || 'none', // none, electric, chainlink, etc.
      signage: farm?.biosecurity?.perimeterControl?.signage || false,
      controlledAccess: farm?.biosecurity?.perimeterControl?.controlledAccess || false,
      securityCameras: farm?.biosecurity?.perimeterControl?.securityCameras || false,
      lighting: farm?.biosecurity?.perimeterControl?.lighting || false,
      notes: farm?.biosecurity?.perimeterControl?.notes || ''
    },
    
    // Personnel & Visitors
    personnel: {
      dedicatedClothing: farm?.biosecurity?.personnel?.dedicatedClothing || false,
      clothingProvided: farm?.biosecurity?.personnel?.clothingProvided || false,
      handwashingStations: farm?.biosecurity?.personnel?.handwashingStations || false,
      handSanitizerAvailable: farm?.biosecurity?.personnel?.handSanitizerAvailable || false,
      footbaths: farm?.biosecurity?.personnel?.footbaths || false,
      footbathSolution: farm?.biosecurity?.personnel?.footbathSolution || 'none', // none, quat, iodine, etc.
      visitorLogs: farm?.biosecurity?.personnel?.visitorLogs || false,
      visitorScreening: farm?.biosecurity?.personnel?.visitorScreening || false,
      trainingProvided: farm?.biosecurity?.personnel?.trainingProvided || false,
      trainingFrequency: farm?.biosecurity?.personnel?.trainingFrequency || 'none', // none, monthly, quarterly, etc.
      notes: farm?.biosecurity?.personnel?.notes || ''
    },
    
    // Vehicle & Equipment
    vehicleHygiene: {
      disinfection: farm?.biosecurity?.vehicleHygiene?.disinfection || false,
      disinfectionFrequency: farm?.biosecurity?.vehicleHygiene?.disinfectionFrequency || 'none', // none, daily, weekly, etc.
      wheelWash: farm?.biosecurity?.vehicleHygiene?.wheelWash || false,
      designatedParking: farm?.biosecurity?.vehicleHygiene?.designatedParking || false,
      equipmentCleaning: farm?.biosecurity?.vehicleHygiene?.equipmentCleaning || false,
      equipmentStorage: farm?.biosecurity?.vehicleHygiene?.equipmentStorage || 'shared', // shared, dedicated, none
      notes: farm?.biosecurity?.vehicleHygiene?.notes || ''
    },
    
    // Animal Management
    animalManagement: {
      quarantineArea: farm?.biosecurity?.animalManagement?.quarantineArea || false,
      quarantineDuration: farm?.biosecurity?.animalManagement?.quarantineDuration || 0, // in days
      allInAllOut: farm?.biosecurity?.animalManagement?.allInAllOut || false,
      ageGroupSeparation: farm?.biosecurity?.animalManagement?.ageGroupSeparation || false,
      pestControl: farm?.biosecurity?.animalManagement?.pestControl || false,
      pestControlMethod: farm?.biosecurity?.animalManagement?.pestControlMethod || 'none', // none, chemical, traps, etc.
      wildlifeDeterrents: farm?.biosecurity?.animalManagement?.wildlifeDeterrents || false,
      deadstockRemoval: farm?.biosecurity?.animalManagement?.deadstockRemoval || 'none', // none, daily, weekly, etc.
      notes: farm?.biosecurity?.animalManagement?.notes || ''
    },
    
    // Cleaning & Sanitation
    cleaningSanitation: {
      regularDisinfection: farm?.biosecurity?.cleaningSanitation?.regularDisinfection || false,
      disinfectionFrequency: farm?.biosecurity?.cleaningSanitation?.disinfectionFrequency || 'none',
      wasteManagement: farm?.biosecurity?.cleaningSanitation?.wasteManagement || false,
      wasteDisposalMethod: farm?.biosecurity?.cleaningSanitation?.wasteDisposalMethod || 'none',
      mortalityDisposal: farm?.biosecurity?.cleaningSanitation?.mortalityDisposal || false,
      mortalityMethod: farm?.biosecurity?.cleaningSanitation?.mortalityMethod || 'none', // burial, incineration, etc.
      equipmentCleaning: farm?.biosecurity?.cleaningSanitation?.equipmentCleaning || false,
      waterSanitization: farm?.biosecurity?.cleaningSanitation?.waterSanitization || false,
      notes: farm?.biosecurity?.cleaningSanitation?.notes || ''
    },
    
    // Poultry Housing
    poultryHousing: farm?.biosecurity?.poultryHousing || {
      housingType: '',
      stockingDensity: '',
      litterManagement: '',
      ventilation: '',
      notes: ''
    },
    
    // Poultry Biosecurity
    poultryBiosecurity: farm?.biosecurity?.poultryBiosecurity || {
      footbathAtEntry: false,
      visitorRestriction: false,
      rodentControl: false,
      wildlifeControl: false,
      notes: ''
    },
    
    // Poultry Vaccination
    poultryVaccination: farm?.biosecurity?.poultryVaccination || {
      vaccinationSchedule: '',
      commonVaccines: [],
      vaccinationRecords: false,
      notes: ''
    },
    
    // Poultry Health Monitoring
    poultryHealthMonitoring: farm?.biosecurity?.poultryHealthMonitoring || {
      mortalityRate: '',
      feedIntake: '',
      waterQuality: '',
      veterinaryVisits: '',
      notes: ''
    },
    
    // Poultry Specific
    poultrySpecific: {
      eggCollection: farm?.biosecurity?.poultrySpecific?.eggCollection || false,
      eggStorage: farm?.biosecurity?.poultrySpecific?.eggStorage || false,
      nestBoxManagement: farm?.biosecurity?.poultrySpecific?.nestBoxManagement || false,
      litterManagement: farm?.biosecurity?.poultrySpecific?.litterManagement || false,
      waterSystem: farm?.biosecurity?.poultrySpecific?.waterSystem || 'open', // open, nipple, etc.
      feedStorage: farm?.biosecurity?.poultrySpecific?.feedStorage || false,
      rodentControl: farm?.biosecurity?.poultrySpecific?.rodentControl || false,
      wildBirdControl: farm?.biosecurity?.poultrySpecific?.wildBirdControl || false,
      notes: farm?.biosecurity?.poultrySpecific?.notes || ''
    },
    
    // Poultry Health
    poultryHealth: {
      vaccinationProgram: farm?.biosecurity?.poultryHealth?.vaccinationProgram || false,
      vaccinationRecords: farm?.biosecurity?.poultryHealth?.vaccinationRecords || false,
      dewormingSchedule: farm?.biosecurity?.poultryHealth?.dewormingSchedule || false,
      diseaseSurveillance: farm?.biosecurity?.poultryHealth?.diseaseSurveillance || false,
      veterinaryVisits: farm?.biosecurity?.poultryHealth?.veterinaryVisits || false,
      mortalityRate: farm?.biosecurity?.poultryHealth?.mortalityRate || 0,
      biosecurityAudit: farm?.biosecurity?.poultryHealth?.biosecurityAudit || false,
      auditFrequency: farm?.biosecurity?.poultryHealth?.auditFrequency || 'none',
      notes: farm?.biosecurity?.poultryHealth?.notes || ''
    },
    
    // Pig Specific
    pigSpecific: {
      farrowingArea: farm?.biosecurity?.pigSpecific?.farrowingArea || false,
      farrowingHygiene: farm?.biosecurity?.pigSpecific?.farrowingHygiene || 'basic', // basic, intermediate, advanced
      sickBay: farm?.biosecurity?.pigSpecific?.sickBay || false,
      isolationArea: farm?.biosecurity?.pigSpecific?.isolationArea || false,
      rodentControl: farm?.biosecurity?.pigSpecific?.rodentControl || false,
      feedStorage: farm?.biosecurity?.pigSpecific?.feedStorage || false,
      feedQualityControl: farm?.biosecurity?.pigSpecific?.feedQualityControl || false,
      waterQuality: farm?.biosecurity?.pigSpecific?.waterQuality || false,
      manureManagement: farm?.biosecurity?.pigSpecific?.manureManagement || 'none',
      notes: farm?.biosecurity?.pigSpecific?.notes || ''
    },
    
    // Pig Health
    pigHealth: {
      vaccinationProgram: farm?.biosecurity?.pigHealth?.vaccinationProgram || false,
      vaccinationRecords: farm?.biosecurity?.pigHealth?.vaccinationRecords || false,
      dewormingSchedule: farm?.biosecurity?.pigHealth?.dewormingSchedule || false,
      diseaseSurveillance: farm?.biosecurity?.pigHealth?.diseaseSurveillance || false,
      veterinaryVisits: farm?.biosecurity?.pigHealth?.veterinaryVisits || false,
      mortalityRate: farm?.biosecurity?.pigHealth?.mortalityRate || 0,
      biosecurityAudit: farm?.biosecurity?.pigHealth?.biosecurityAudit || false,
      auditFrequency: farm?.biosecurity?.pigHealth?.auditFrequency || 'none',
      notes: farm?.biosecurity?.pigHealth?.notes || ''
    }
  });

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ biosecurity: formData });
    setEditing(false);
  };

  const renderField = (section, field, label, icon, type = 'switch', options = []) => (
    <ListGroup.Item className="d-flex flex-column" style={{ color: '#212529' }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          {icon} <strong>{label}</strong>
        </div>
        {editing ? (
          type === 'switch' ? (
            <Form.Check
              type="switch"
              id={`${section}-${field}`}
              checked={formData[section][field]}
              onChange={(e) => handleChange(section, field, e.target.checked)}
            />
          ) : type === 'select' ? (
            <Form.Select
              size="sm"
              value={formData[section][field]}
              onChange={(e) => handleChange(section, field, e.target.value)}
              style={{ width: '200px' }}
            >
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          ) : type === 'number' ? (
            <Form.Control
              type="number"
              size="sm"
              value={formData[section][field]}
              onChange={(e) => handleChange(section, field, parseFloat(e.target.value) || 0)}
              style={{ width: '100px' }}
            />
          ) : null
        ) : (
          <Badge bg={type === 'switch' && formData[section][field] ? 'success' : 'secondary'}>
            {type === 'switch' ? 
              (formData[section][field] ? 'Yes' : 'No') : 
              (formData[section][field] || 'Not specified')}
          </Badge>
        )}
      </div>
      {editing && type === 'switch' && formData[section][field] && field === 'fencing' && (
        <div className="mt-2">
          <Form.Label>Fencing Type</Form.Label>
          <Form.Select
            size="sm"
            value={formData.perimeterControl.fencingType}
            onChange={(e) => handleChange('perimeterControl', 'fencingType', e.target.value)}
          >
            <option value="none">Select type</option>
            <option value="electric">Electric</option>
            <option value="chainlink">Chainlink</option>
            <option value="wooden">Wooden</option>
            <option value="wire">Wire</option>
            <option value="other">Other</option>
          </Form.Select>
        </div>
      )}
    </ListGroup.Item>
  );

  const renderNotes = (section) => (
    editing ? (
      <Form.Group className="mb-3">
        <Form.Label>Notes</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={formData[section].notes}
          onChange={(e) => handleChange(section, 'notes', e.target.value)}
        />
      </Form.Group>
    ) : formData[section].notes ? (
      <div className="mt-2">
        <strong>Notes:</strong>
        <p className="text-muted">{formData[section].notes}</p>
      </div>
    ) : null
  );

  const renderSection = (title, section, icon, items) => {
    const sectionIcons = {
      perimeterControl: <FaShieldAlt className="text-primary me-2" />,
      personnel: <FaUsers className="text-info me-2" />,
      vehicleHygiene: <FaTruck className="text-warning me-2" />,
      animalManagement: <FaPaw className="text-success me-2" />,
      cleaningSanitation: <FaBroom className="text-secondary me-2" />,
      poultrySpecific: <GiChickenOven className="text-danger me-2" />,
      poultryHealth: <FaClipboardCheck className="text-primary me-2" />,
      pigSpecific: <GiPig className="text-danger me-2" />,
      pigHealth: <FaUserMd className="text-info me-2" />
    };

    return (
      <Card className="mb-4" style={{ backgroundColor: '#f8f9fa' }}>
        <Card.Header className="d-flex justify-content-between align-items-center" style={{ backgroundColor: '#e9ecef', color: '#212529' }}>
          <h5 className="mb-0">{sectionIcons[section] || icon} {title}</h5>
          {editing && (
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={handleSubmit}
            >
              Save Changes
            </Button>
          )}
        </Card.Header>
        <Card.Body style={{ color: '#212529' }}>
          <ListGroup variant="flush" className="mb-3">
            {items.map(([field, label, itemIcon, type = 'switch', options = []]) => 
              renderField(section, field, label, itemIcon, type, options)
            )}
          </ListGroup>
          {renderNotes(section)}
        </Card.Body>
      </Card>
    );
  };

  // Define field configurations for each section
  const sectionConfig = {
    perimeterControl: [
      ['fencing', 'Perimeter Fencing', <FaShieldAlt />],
      ['signage', 'Warning Signage', <FaSign />],
      ['controlledAccess', 'Controlled Access Points', <FaLock />],
      ['securityCameras', 'Security Cameras', <FaVideo />],
      ['lighting', 'Adequate Lighting', <FaLightbulb />]
    ],
    personnel: [
      ['dedicatedClothing', 'Dedicated Work Clothing', <FaTshirt />],
      ['clothingProvided', 'Clothing Provided', <FaTshirt />],
      ['handwashingStations', 'Handwashing Stations', <FaHandsWash />],
      ['handSanitizerAvailable', 'Hand Sanitizer Available', <FaPumpSoap />],
      ['footbaths', 'Footbaths at Entry', <FaShoePrints />, 'select', [
        { value: 'none', label: 'No Footbath' },
        { value: 'quat', label: 'Quat Solution' },
        { value: 'iodine', label: 'Iodine Solution' },
        { value: 'chlorine', label: 'Chlorine Solution' },
        { value: 'other', label: 'Other' }
      ]],
      ['visitorLogs', 'Visitor Logs Maintained', <FaClipboardList />],
      ['visitorScreening', 'Visitor Screening', <FaUserCheck />],
      ['trainingProvided', 'Staff Training Provided', <FaChalkboardTeacher />]
    ],
    vehicleHygiene: [
      ['disinfection', 'Vehicle Disinfection', <FaSprayCan />],
      ['wheelWash', 'Wheel Wash Station', <FaCarSide />],
      ['designatedParking', 'Designated Parking Areas', <FaParking />],
      ['equipmentCleaning', 'Equipment Cleaning', <FaTools />]
    ],
    animalManagement: [
      ['quarantineArea', 'Quarantine Area', <FaProcedures />],
      ['quarantineDuration', 'Quarantine Duration (days)', <FaCalendarAlt />, 'number'],
      ['allInAllOut', 'All-in/All-out Management', <FaExchangeAlt />],
      ['ageGroupSeparation', 'Age Group Separation', <FaUsers />],
      ['pestControl', 'Pest Control Program', <FaBug />],
      ['wildlifeDeterrents', 'Wildlife Deterrents', <FaCrow />]
    ],
    cleaningSanitation: [
      ['regularDisinfection', 'Regular Disinfection', <FaBroom />],
      ['wasteManagement', 'Waste Management', <FaTrashAlt />],
      ['mortalityDisposal', 'Mortality Disposal', <FaSkull />],
      ['equipmentCleaning', 'Equipment Cleaning', <FaTools />],
      ['waterSanitization', 'Water Sanitization', <FaTint />]
    ],
    poultrySpecific: [
      ['eggCollection', 'Egg Collection Protocol', <FaEgg />],
      ['eggStorage', 'Egg Storage', <FaBox />],
      ['nestBoxManagement', 'Nest Box Management', <FaBoxOpen />],
      ['litterManagement', 'Litter Management', <FaLeaf />],
      ['waterSystem', 'Water System Type', <FaTint />, 'select', [
        { value: 'open', label: 'Open Water System' },
        { value: 'nipple', label: 'Nipple Drinkers' },
        { value: 'bell', label: 'Bell Drinkers' },
        { value: 'cup', label: 'Cup Drinkers' },
        { value: 'other', label: 'Other' }
      ]],
      ['feedStorage', 'Feed Storage', <FaBreadSlice />],
      ['rodentControl', 'Rodent Control', <FaMouse />],
      ['wildBirdControl', 'Wild Bird Control', <FaDove />]
    ],
    pigSpecific: [
      ['farrowingArea', 'Farrowing Area', <FaBabyCarriage />],
      ['farrowingHygiene', 'Farrowing Hygiene', <FaBroom />, 'select', [
        { value: 'basic', label: 'Basic' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' }
      ]],
      ['sickBay', 'Sick Bay', <FaProcedures />],
      ['isolationArea', 'Isolation Area', <FaDoorClosed />],
      ['rodentControl', 'Rodent Control', <FaMouse />],
      ['feedStorage', 'Feed Storage', <FaBreadSlice />],
      ['feedQualityControl', 'Feed Quality Control', <FaClipboardCheck />],
      ['waterQuality', 'Water Quality Monitoring', <FaTint />],
      ['manureManagement', 'Manure Management', <FaTrashAlt />, 'select', [
        { value: 'none', label: 'No Management' },
        { value: 'lagoon', label: 'Lagoon System' },
        { value: 'composting', label: 'Composting' },
        { value: 'directApplication', label: 'Direct Application' },
        { value: 'other', label: 'Other' }
      ]]
    ]
  };

  return (
    <div className="biosecurity-tab">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4><FaShieldAlt className="me-2" /> Biosecurity Management</h4>
        <div>
          {!editing ? (
            <Button variant="primary" onClick={() => setEditing(true)}>
              <FaEdit className="me-1" /> Edit Biosecurity
            </Button>
          ) : (
            <div>
              <Button variant="success" className="me-2" onClick={handleSubmit}>
                <FaSave className="me-1" /> Save All Changes
              </Button>
              <Button variant="outline-secondary" onClick={() => setEditing(false)}>
                <FaTimes className="me-1" /> Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      <Tab.Container 
        activeKey={activeTab} 
        onSelect={(k) => setActiveTab(k)}
        style={{
          '--bs-nav-tabs-link-active-bg': '#0d6efd',
          '--bs-nav-tabs-link-active-color': '#fff',
          '--bs-nav-tabs-border-color': '#dee2e6',
          '--bs-nav-tabs-link-hover-border-color': '#e9ecef #e9ecef #dee2e6',
          '--bs-nav-tabs-link-color': '#212529',
          '--bs-nav-tabs-link-hover-color': '#0a58ca'
        }}
      >
        <Nav 
          variant="tabs" 
          activeKey={activeTab} 
          onSelect={setActiveTab} 
          className="mb-4" 
          style={{
            borderBottom: '1px solid #dee2e6',
            '--bs-nav-tabs-link-active-bg': '#0d6efd',
            '--bs-nav-tabs-link-active-color': '#fff',
            '--bs-nav-tabs-border-color': '#dee2e6',
            '--bs-nav-tabs-link-hover-border-color': '#e9ecef #e9ecef #dee2e6',
            '--bs-nav-tabs-link-color': '#212529',
            '--bs-nav-tabs-link-hover-color': '#0a58ca'
          }}
        >
          <Nav.Item>
            <Nav.Link 
              eventKey="vehicles" 
              className={activeTab === 'vehicles' ? 'active' : ''}
              style={{
                color: activeTab === 'vehicles' ? '#fff' : '#0d6efd',
                backgroundColor: activeTab === 'vehicles' ? '#0d6efd' : 'transparent',
                borderColor: '#dee2e6 #dee2e6 #fff'
              }}
            >
              <FaTruck className="me-1" /> Vehicles
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              eventKey="animals" 
              className={activeTab === 'animals' ? 'active' : ''}
              style={{
                color: activeTab === 'animals' ? '#fff' : '#0d6efd',
                backgroundColor: activeTab === 'animals' ? '#0d6efd' : 'transparent',
                borderColor: '#dee2e6 #dee2e6 #fff'
              }}
            >
              <FaPaw className="me-1" /> Animal Management
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              eventKey="cleaning" 
              className={activeTab === 'cleaning' ? 'active' : ''}
              style={{
                color: activeTab === 'cleaning' ? '#fff' : '#0d6efd',
                backgroundColor: activeTab === 'cleaning' ? '#0d6efd' : 'transparent',
                borderColor: '#dee2e6 #dee2e6 #fff'
              }}
            >
              <FaBroom className="me-1" /> Cleaning
            </Nav.Link>
          </Nav.Item>
          
          {/* Poultry Tab */}
          {(farm?.farmType === 'poultry' || farm?.farmType === 'both') && (
            <Nav.Item>
              <Nav.Link 
                eventKey="poultry" 
                className={activeTab === 'poultry' ? 'active' : 'text-dark'}
                style={{
                  color: activeTab === 'poultry' ? '#fff' : '#212529',
                  backgroundColor: activeTab === 'poultry' ? '#0d6efd' : 'transparent',
                  border: '1px solid #dee2e6',
                  borderBottom: activeTab === 'poultry' ? '1px solid #0d6efd' : '1px solid #dee2e6',
                  marginBottom: '-1px',
                  borderRadius: '0.25rem 0.25rem 0 0',
                  marginRight: '0.25rem'
                }}
              >
                <GiChickenOven className="me-1" /> Poultry
              </Nav.Link>
            </Nav.Item>
          )}
          {farm?.farmType === 'poultry' || farm?.farmType === 'both' ? (
            <Nav.Item>
              <Nav.Link 
                eventKey="poultryHealth" 
                className={activeTab === 'poultryHealth' ? 'active' : 'text-dark'}
                style={{
                  color: activeTab === 'poultryHealth' ? '#fff' : '#212529',
                  backgroundColor: activeTab === 'poultryHealth' ? '#0d6efd' : 'transparent',
                  border: '1px solid #dee2e6',
                  borderBottom: activeTab === 'poultryHealth' ? '1px solid #0d6efd' : '1px solid #dee2e6',
                  marginBottom: '-1px',
                  borderRadius: '0.25rem 0.25rem 0 0',
                  marginRight: '0.25rem'
                }}
              >
                <FaSyringe className="me-1" /> Poultry Health
              </Nav.Link>
            </Nav.Item>
          ) : null}
          {farm?.farmType === 'pig' || farm?.farmType === 'both' ? (
            <Nav.Item>
              <Nav.Link 
                eventKey="pigs" 
                className={activeTab === 'pigs' ? 'active' : ''}
                style={{
                  color: activeTab === 'pigs' ? '#fff' : '#0d6efd',
                  backgroundColor: activeTab === 'pigs' ? '#0d6efd' : 'transparent',
                  borderColor: '#dee2e6 #dee2e6 #fff'
                }}
              >
                <GiPig className="me-1" /> Pigs
              </Nav.Link>
            </Nav.Item>
          ) : null}
          {farm?.farmType === 'pig' || farm?.farmType === 'both' ? (
            <Nav.Item>
              <Nav.Link 
                eventKey="pigHealth" 
                className={activeTab === 'pigHealth' ? 'active' : ''}
                style={{
                  color: activeTab === 'pigHealth' ? '#fff' : '#0d6efd',
                  backgroundColor: activeTab === 'pigHealth' ? '#0d6efd' : 'transparent',
                  borderColor: '#dee2e6 #dee2e6 #fff'
                }}
              >
                <FaSyringe className="me-1" /> Pig Health
              </Nav.Link>
            </Nav.Item>
          ) : null}
        </Nav>

        <Tab.Content>
          {/* Overview Tab */}
          <Tab.Pane eventKey="overview">
            <div className="d-flex justify-content-end mb-3">
              {editing ? (
                <>
                  <Button variant="success" className="me-2" onClick={handleSubmit}>
                    Save Changes
                  </Button>
                  <Button variant="secondary" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="primary" onClick={() => setEditing(true)}>
                  <FaEdit className="me-2" />
                  Edit Biosecurity
                </Button>
              )}
            </div>
            <Card className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center" style={{ backgroundColor: '#e9ecef', color: '#212529' }}>
                <h5 className="mb-0"><FaChartPie className="me-2" /> Biosecurity Overview</h5>
              </Card.Header>
              <Card.Body style={{ color: '#212529' }}>
                <p>This is a comprehensive overview of your farm's biosecurity measures. Use the tabs above to navigate between different sections.</p>
                <div className="row">
                  <div className="col-md-6">
                    <h6>Key Metrics</h6>
                    <ul>
                      <li>Overall Biosecurity Score: <strong>85%</strong></li>
                      <li>Last Inspection: <strong>2023-11-15</strong></li>
                      <li>Next Scheduled Audit: <strong>2024-01-15</strong></li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>Quick Actions</h6>
                    <div className="d-grid gap-2">
                      <Button variant="outline-primary" size="sm">
                        <FaClipboardCheck className="me-1" /> Start New Inspection
                      </Button>
                      <Button variant="outline-secondary" size="sm">
                        <FaFilePdf className="me-1" /> Generate Report
                      </Button>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Perimeter Tab */}
          <Tab.Pane eventKey="perimeter">
            <div className="d-flex justify-content-end mb-3">
              {editing ? (
                <>
                  <Button variant="success" className="me-2" onClick={handleSubmit}>
                    Save Changes
                  </Button>
                  <Button variant="secondary" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="primary" onClick={() => setEditing(true)}>
                  <FaEdit className="me-2" />
                  Edit Perimeter Controls
                </Button>
              )}
            </div>
            {renderSection(
              'Perimeter Security',
              'perimeterControl',
              <FaShieldAlt className="me-2" />,
              [
                ['fencing', 'Perimeter Fencing', <FaClipboardCheck />],
                ['fencingType', 'Fencing Type', <FaClipboardCheck />, 'select', [
                  { value: 'none', label: 'None' },
                  { value: 'electric', label: 'Electric' },
                  { value: 'chainlink', label: 'Chainlink' },
                  { value: 'wooden', label: 'Wooden' },
                  { value: 'other', label: 'Other' }
                ]],
                ['signage', 'Warning Signage', <FaSign />],
                ['controlledAccess', 'Controlled Access Points', <FaLock />],
                ['securityCameras', 'Security Cameras', <FaVideo />],
                ['lighting', 'Adequate Lighting', <FaLightbulb />]
              ]
            )}
          </Tab.Pane>

          {/* Personnel Tab */}
          <Tab.Pane eventKey="personnel">
            <div className="d-flex justify-content-end mb-3">
              {editing ? (
                <>
                  <Button variant="success" className="me-2" onClick={handleSubmit}>
                    Save Changes
                  </Button>
                  <Button variant="secondary" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="primary" onClick={() => setEditing(true)}>
                  <FaEdit className="me-2" />
                  Edit Personnel Controls
                </Button>
              )}
            </div>
            {renderSection(
              'Personnel & Visitors',
              'personnel',
              <FaUsers className="me-2" />,
              [
                ['dedicatedClothing', 'Dedicated Work Clothing', <FaTshirt />],
                ['clothingProvided', 'Clothing Provided', <FaTshirt />],
                ['handwashingStations', 'Handwashing Stations', <FaHandsWash />],
                ['handSanitizerAvailable', 'Hand Sanitizer Available', <FaPumpSoap />],
                ['footbaths', 'Footbaths at Entry', <FaShoePrints />, 'select', [
                  { value: 'none', label: 'No Footbath' },
                  { value: 'quat', label: 'Quat Solution' },
                  { value: 'iodine', label: 'Iodine Solution' },
                  { value: 'chlorine', label: 'Chlorine Solution' },
                  { value: 'other', label: 'Other' }
                ]],
                ['visitorLogs', 'Visitor Logs Maintained', <FaClipboardList />],
                ['visitorScreening', 'Visitor Screening', <FaUserCheck />],
                ['trainingProvided', 'Staff Training Provided', <FaChalkboardTeacher />],
                ['trainingFrequency', 'Training Frequency', <FaCalendarAlt />, 'select', [
                  { value: 'none', label: 'No Training' },
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'quarterly', label: 'Quarterly' },
                  { value: 'biannually', label: 'Biannually' },
                  { value: 'annually', label: 'Annually' }
                ]]
              ]
            )}
          </Tab.Pane>

          {/* Vehicles Tab */}
          <Tab.Pane eventKey="vehicles">
            <div className="d-flex justify-content-end mb-3">
              {editing ? (
                <>
                  <Button variant="success" className="me-2" onClick={handleSubmit}>
                    Save Changes
                  </Button>
                  <Button variant="secondary" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="primary" onClick={() => setEditing(true)}>
                  <FaEdit className="me-2" />
                  Edit Vehicle Controls
                </Button>
              )}
            </div>
            {renderSection(
              'Vehicle & Equipment Hygiene',
              'vehicleHygiene',
              <FaTruck className="me-2" />,
              [
                ['disinfection', 'Vehicle Disinfection', <FaSprayCan />],
                ['disinfectionFrequency', 'Disinfection Frequency', <FaCalendarAlt />, 'select', [
                  { value: 'none', label: 'Never' },
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'asNeeded', label: 'As Needed' }
                ]],
                ['wheelWash', 'Wheel Wash Station', <FaCarSide />],
                ['designatedParking', 'Designated Parking Areas', <FaParking />],
                ['equipmentCleaning', 'Equipment Cleaning', <FaTools />]
              ]
            )}
          </Tab.Pane>

          {/* Animals Tab */}
          <Tab.Pane eventKey="animals">
            <div className="d-flex justify-content-end mb-3">
              {editing ? (
                <>
                  <Button variant="success" className="me-2" onClick={handleSubmit}>
                    Save Changes
                  </Button>
                  <Button variant="secondary" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="primary" onClick={() => setEditing(true)}>
                  <FaEdit className="me-2" />
                  Edit Animal Management
                </Button>
              )}
            </div>
            {renderSection(
              'Animal Management',
              'animalManagement',
              <FaPaw className="me-2" />,
              [
                ['quarantineArea', 'Quarantine Area', <FaProcedures />],
                ['quarantineDuration', 'Quarantine Duration (days)', <FaCalendarAlt />, 'number'],
                ['allInAllOut', 'All-in/All-out Management', <FaExchangeAlt />],
                ['ageGroupSeparation', 'Age Group Separation', <FaUsers />],
                ['pestControl', 'Pest Control Program', <FaBug />],
                ['wildlifeDeterrents', 'Wildlife Deterrents', <FaCrow />]
              ]
            )}
          </Tab.Pane>

          {/* Cleaning Tab */}
          <Tab.Pane eventKey="cleaning">
            <div className="d-flex justify-content-end mb-3">
              {editing ? (
                <>
                  <Button variant="success" className="me-2" onClick={handleSubmit}>
                    Save Changes
                  </Button>
                  <Button variant="secondary" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="primary" onClick={() => setEditing(true)}>
                  <FaEdit className="me-2" />
                  Edit Cleaning Protocols
                </Button>
              )}
            </div>
            {renderSection(
              'Cleaning & Sanitation',
              'cleaningSanitation',
              <FaBroom className="me-2" />,
              [
                ['regularDisinfection', 'Regular Disinfection', <FaBroom />],
                ['wasteManagement', 'Waste Management', <FaTrashAlt />],
                ['mortalityDisposal', 'Mortality Disposal', <FaSkull />],
                ['equipmentCleaning', 'Equipment Cleaning', <FaTools />],
                ['waterSanitization', 'Water Sanitization', <FaTint />]
              ]
            )}
          </Tab.Pane>

          {/* Poultry Tab */}
          <Tab.Pane eventKey="poultry">
            <div className="d-flex justify-content-end mb-3">
              {editing ? (
                <>
                  <Button variant="success" className="me-2" onClick={handleSubmit}>
                    Save Changes
                  </Button>
                  <Button variant="secondary" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="primary" onClick={() => setEditing(true)}>
                  <FaEdit className="me-2" />
                  Edit Poultry Biosecurity
                </Button>
              )}
            </div>

            {renderSection(
              'Poultry Housing',
              'poultryHousing',
              <FaHome className="me-2" />,
              [
                ['housingType', 'Housing Type', <FaClipboardCheck />, 'select', [
                  { value: 'open', label: 'Open Housing' },
                  { value: 'closed', label: 'Closed Housing' },
                  { value: 'freeRange', label: 'Free Range' },
                  { value: 'barn', label: 'Barn System' },
                  { value: 'cage', label: 'Cage System' }
                ]],
                ['stockingDensity', 'Stocking Density', <FaUsers />],
                ['litterManagement', 'Litter Management', <FaBroom />],
                ['ventilation', 'Ventilation System', <FaWind />]
              ]
            )}

            {renderSection(
              'Biosecurity Measures',
              'poultryBiosecurity',
              <FaShieldAlt className="me-2" />,
              [
                ['footbathAtEntry', 'Footbath at Entry', <FaShoePrints />],
                ['visitorRestriction', 'Visitor Restrictions', <FaUserShield />],
                ['rodentControl', 'Rodent Control Program', <FaBug />],
                ['wildlifeControl', 'Wildlife Deterrents', <FaCrow />]
              ]
            )}
          </Tab.Pane>

          {/* Poultry Health Tab */}
          <Tab.Pane eventKey="poultryHealth">
            <div className="d-flex justify-content-end mb-3">
              {editing ? (
                <>
                  <Button variant="success" className="me-2" onClick={handleSubmit}>
                    Save Changes
                  </Button>
                  <Button variant="secondary" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="primary" onClick={() => setEditing(true)}>
                  <FaEdit className="me-2" />
                  Edit Poultry Health
                </Button>
              )}
            </div>

            {renderSection(
              'Vaccination Program',
              'poultryVaccination',
              <FaSyringe className="me-2" />,
              [
                ['vaccinationSchedule', 'Vaccination Schedule', <FaCalendarAlt />],
                ['commonVaccines', 'Common Vaccines Administered', <FaSyringe />, 'multiselect', [
                  { value: 'nd', label: 'Newcastle Disease' },
                  { value: 'ib', label: 'Infectious Bronchitis' },
                  { value: 'ibd', label: 'Gumboro (IBD)' },
                  { value: 'ai', label: 'Avian Influenza' },
                  { value: 'eds', label: 'Egg Drop Syndrome' }
                ]],
                ['vaccinationRecords', 'Vaccination Records Maintained', <FaClipboardList />]
              ]
            )}

            {renderSection(
              'Health Monitoring',
              'poultryHealthMonitoring',
              <FaHeartbeat className="me-2" />,
              [
                ['mortalityRate', 'Daily Mortality Rate', <FaSkull />, 'number'],
                ['feedIntake', 'Feed Intake Monitoring', <FaUtensils />],
                ['waterQuality', 'Water Quality Testing', <FaTint />],
                ['veterinaryVisits', 'Regular Veterinary Visits', <FaUserMd />]
              ]
            )}
          </Tab.Pane>

          <Tab.Pane eventKey="pigs">
            <div className="d-flex justify-content-end mb-3">
              {editing ? (
                <>
                  <Button variant="success" className="me-2" onClick={handleSubmit}>
                    Save Changes
                  </Button>
                  <Button variant="secondary" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="primary" onClick={() => setEditing(true)}>
                  <FaEdit className="me-2" />
                  Edit Biosecurity
                </Button>
              )}
            </div>

            {renderSection(
              'Pig-Specific Biosecurity',
              'pigSpecific',
              <FaPaw className="me-2" />,
              [
                ['farrowingArea', 'Dedicated Farrowing Area', <FaClipboardCheck />],
                ['sickBay', 'Isolation/Sick Bay', <FaClipboardCheck />],
                ['rodentControl', 'Rodent Control Program', <FaClipboardCheck />],
                ['feedStorage', 'Secure Feed Storage', <FaClipboardCheck />]
              ]
            )}

            {renderSection(
              'Pig Health Management',
              'pigHealth',
              <FaUserMd className="me-2" />,
              [
                ['vaccinationProgram', 'Vaccination Program', <FaClipboardCheck />],
                ['dewormingSchedule', 'Deworming Schedule', <FaClipboardCheck />],
                ['diseaseSurveillance', 'Disease Surveillance', <FaClipboardCheck />],
                ['veterinaryVisits', 'Regular Veterinary Visits', <FaClipboardCheck />]
              ]
            )}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default BiosecurityTab;
