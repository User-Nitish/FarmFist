import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Alert, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    farmType: '',
    farmSize: '',
    experience: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }

      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }

      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      }
    } else if (currentStep === 2) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (currentStep === 3) {
      if (!formData.farmType) {
        newErrors.farmType = 'Please select your farm type';
      }

      if (!formData.farmSize) {
        newErrors.farmSize = 'Please select your farm size';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep < 3) {
      if (validateForm()) {
        setCurrentStep(currentStep + 1);
      }
      return;
    }
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      await register({
        ...registerData,
        farmType: registerData.farmType,
        farmSize: registerData.farmSize,
        experience: registerData.experience ? parseInt(registerData.experience) : 0
      });
      navigate('/dashboard');
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.match(/[a-z]/)) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    return Math.min(100, strength);
  };

  const getPasswordStrengthVariant = (strength) => {
    if (strength < 50) return 'danger';
    if (strength < 75) return 'warning';
    return 'success';
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordStrengthVariant = getPasswordStrengthVariant(passwordStrength);

    const renderStepIndicator = () => (
    <div className="step-indicator mb-4">
      {[1, 2, 3].map((step) => (
        <div 
          key={step} 
          className={`step ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
          onClick={() => currentStep > step && setCurrentStep(step)}
        >
          <div className="step-number">{step}</div>
          <div className="step-label">
            {step === 1 ? 'Personal' : step === 2 ? 'Account' : 'Farm'}
          </div>
        </div>
      ))}
      <div className="step-connector"></div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-user"></i>
                </span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-envelope"></i>
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-phone"></i>
                </span>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="step-content">
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-lock"></i>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Create a password"
                />
                <button 
                  type="button" 
                  className="input-group-text"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              
              {formData.password && (
                <div className="password-strength mt-2">
                  <div className="d-flex justify-content-between mb-1">
                    <small>Password Strength:</small>
                    <small>{passwordStrength}%</small>
                  </div>
                  <ProgressBar 
                    now={passwordStrength} 
                    variant={passwordStrengthVariant} 
                    className="mb-3"
                    style={{ height: '5px' }}
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-lock"></i>
                </span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder="Confirm your password"
                />
                <button 
                  type="button" 
                  className="input-group-text"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="step-content">
            <div className="form-group">
              <label htmlFor="farmType" className="form-label">Farm Type</label>
              <select
                id="farmType"
                name="farmType"
                value={formData.farmType}
                onChange={handleChange}
                className={`form-select ${errors.farmType ? 'is-invalid' : ''}`}
              >
                <option value="">Select farm type</option>
                <option value="poultry">Poultry</option>
                <option value="dairy">Dairy</option>
                <option value="livestock">Livestock</option>
                <option value="pig">Pig Farming</option>
                <option value="crop">Crop</option>
                <option value="mixed">Mixed Farming</option>
                <option value="other">Other</option>
              </select>
              {errors.farmType && <div className="invalid-feedback">{errors.farmType}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="farmSize" className="form-label">Farm Size</label>
              <select
                id="farmSize"
                name="farmSize"
                value={formData.farmSize}
                onChange={handleChange}
                className={`form-select ${errors.farmSize ? 'is-invalid' : ''}`}
              >
                <option value="">Select farm size</option>
                <option value="small">Small (1-10 acres)</option>
                <option value="medium">Medium (11-50 acres)</option>
                <option value="large">Large (51+ acres)</option>
              </select>
              {errors.farmSize && <div className="invalid-feedback">{errors.farmSize}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="experience" className="form-label">Years of Farming Experience</label>
              <input
                type="number"
                id="experience"
                name="experience"
                min="0"
                value={formData.experience}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter years of experience (optional)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address" className="form-label">Farm Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-control"
                rows="3"
                placeholder="Enter your farm address (optional)"
              ></textarea>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="auth-container register-page">
      <div className="auth-card">
        <div className="auth-card-inner">
          <div className="auth-image">
            <img 
              src="/images/newfarm.jpg" 
              alt="Farm landscape" 
              className="img-fluid"
            />
          </div>
          
          <div className="auth-content">
            <div className="auth-header">
              <div className="auth-logo">
                <i className="fas fa-seedling"></i>
              </div>
              <h1 className="auth-title">Create Account</h1>
              <p className="auth-subtitle">Join FarmFist to manage your farm's biosecurity</p>
            </div>
            
            <div className="auth-body">
              {errors.general && (
                <Alert variant="danger" className="mb-4">
                  {errors.general}
                </Alert>
              )}

              {renderStepIndicator()}

              <Form onSubmit={handleSubmit}>
                {renderStepContent()}
                
                <div className="d-flex justify-content-between mt-4">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
                    disabled={currentStep === 1}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back
                  </button>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-auth"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {currentStep === 3 ? 'Creating Account...' : 'Continue'}
                      </>
                    ) : currentStep === 3 ? 'Create Account' : 'Continue'}
                    {currentStep < 3 && <i className="fas fa-arrow-right ms-2"></i>}
                  </button>
                </div>
              </Form>

              <div className="auth-footer text-center mt-4">
                Already have an account?{' '}
                <Link to="/login" className="text-primary text-decoration-none fw-medium">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;