import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../config/api';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const apiUrl = getApiUrl('api/teams');
        console.log('Fetching teams from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Handle both paginated (.results) and plain array responses
        const teamData = data.results || data;
        console.log('Teams data fetched:', teamData);
        
        setTeams(teamData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading teams...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p className="mb-0">Failed to load teams: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Teams</h2>
      <div className="mb-3">
        <span className="badge bg-success">Total: {teams.length} teams</span>
      </div>
      <div className="row">
        {teams.map((team) => {
          // Calculate member count - members is an array
          const memberCount = Array.isArray(team.members) ? team.members.length : 0;
          
          return (
            <div key={team._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-header bg-primary text-white">
                  <h5 className="card-title mb-0">{team.name}</h5>
                </div>
                <div className="card-body">
                  <p className="card-text">{team.description}</p>
                </div>
                <div className="card-footer bg-light">
                  <small className="text-muted">
                    <i className="bi bi-people-fill"></i> Members: {memberCount}
                  </small>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Teams;
