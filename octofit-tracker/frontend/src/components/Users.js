import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../config/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    team: ''
  });



  useEffect(() => {
    fetchUsers();
    fetchTeams();
  }, []);

  const fetchUsers = async () => {
    try {
      const apiUrl = getApiUrl('api/users');
      console.log('Fetching users from:', apiUrl);
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      const userData = data.results || data;
      console.log('Users data fetched:', userData);
      
      setUsers(userData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const apiUrl = getApiUrl('api/teams');
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTeams(data.results || data);
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      team: user.team || ''
    });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', team: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = getApiUrl(`api/users/${editingUser._id}`);
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh users list
      await fetchUsers();
      handleClose();
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Failed to update user: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading users...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p className="mb-0">Failed to load users: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Users</h2>
      <div className="mb-3">
        <span className="badge bg-info">Total: {users.length} users</span>
      </div>
      <div className="row">
        {users.map((user) => (
          <div key={user._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-person-circle"></i> {user.name}
                </h5>
                <div className="card-text">
                  <p className="mb-2">
                    <strong>Email:</strong><br />
                    <a href={`mailto:${user.email}`} className="text-decoration-none">{user.email}</a>
                  </p>
                  <p className="mb-0">
                    <strong>Team:</strong><br />
                    <span className="badge bg-primary">{user.team || 'No team'}</span>
                  </p>
                </div>
              </div>
              <div className="card-footer text-center">
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={() => handleEdit(user)}
                >
                  <i className="bi bi-pencil"></i> Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit User Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button type="button" className="btn-close" onClick={handleClose}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="team" className="form-label">Team</label>
                    <select
                      className="form-select"
                      id="team"
                      name="team"
                      value={formData.team}
                      onChange={handleChange}
                    >
                      <option value="">No team</option>
                      {teams.map((team) => (
                        <option key={team._id} value={team.name}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
