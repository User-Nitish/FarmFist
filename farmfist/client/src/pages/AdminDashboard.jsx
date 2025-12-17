import React, { useState, useEffect, useCallback } from 'react';
import { Container, Table, Button, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { FiUsers, FiUserX, FiRefreshCw } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updating, setUpdating] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${user?.token || localStorage.getItem('token')}` }
      });
      setUsers(response.data.users);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersMemoized = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${user?.token || localStorage.getItem('token')}` }
      });
      setUsers(response.data.users);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsersMemoized();
    }
  }, [user, fetchUsersMemoized]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdating(userId);
      setError('');
      setSuccess('');

      await axios.patch(
        `${API_URL}/admin/users/${userId}/role`,
        { role: newRole },
        {
          headers: { 
            'Authorization': `Bearer ${user?.token || localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update local state
      setUsers(users.map(u => 
        u._id === userId ? { ...u, role: newRole } : u
      ));
      
      setSuccess('User role updated successfully');
    } catch (err) {
      console.error('Error updating role:', err);
      setError(err.response?.data?.message || 'Failed to update user role');
    } finally {
      setUpdating('');
    }
  };

  const getRoleBadge = (role) => {
    const variants = {
      admin: 'danger',
      inspector: 'primary',
      farmer: 'success'
    };
    return <Badge bg={variants[role]} className={`badge-${role}`} pill>{role.toUpperCase()}</Badge>;
  };

  if (user?.role !== 'admin') {
    return (
      <Container className="py-5 text-center">
        <h2><FiUserX className="me-2" /> Access Denied</h2>
        <p className="lead">You don't have permission to access the admin dashboard.</p>
      </Container>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--primary-50)', minHeight: '100vh', padding: '2rem 0' }}>
      <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white rounded shadow-sm">
        <h2 className="m-0"><FiUsers className="me-2" /> User Management</h2>
        <Button 
          variant="outline-primary" 
          onClick={fetchUsers}
          disabled={loading}
        >
          <FiRefreshCw className={loading ? 'me-2 fa-spin' : 'me-2'} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      {loading ? (
        <div className="text-center py-5 bg-white p-4 rounded shadow-sm">
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">Loading user data...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Current Role</th>
                <th>Change Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td>
                      <Form.Select 
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        disabled={updating === user._id}
                      >
                        <option value="farmer">Farmer</option>
                        <option value="inspector">Inspector</option>
                        <option value="admin">Admin</option>
                      </Form.Select>
                    </td>
                    <td>
                      {updating === user._id ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          className="btn-action"
                          onClick={() => handleRoleChange(user._id, user.role)}
                          disabled={updating === user._id}
                        >
                          {updating === user._id ? 'Updating...' : 'Update'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No users found</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}
      </Container>
    </div>
  );
};

export default AdminDashboard;
