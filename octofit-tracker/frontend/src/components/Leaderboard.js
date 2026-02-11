import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../config/api';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const apiUrl = getApiUrl('api/leaderboard');
        console.log('Fetching leaderboard from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Handle both paginated (.results) and plain array responses
        const leaderboardData = data.results || data;
        console.log('Leaderboard data fetched:', leaderboardData);
        
        setLeaderboard(leaderboardData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading leaderboard...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p className="mb-0">Failed to load leaderboard: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🏆 Leaderboard</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">User Name</th>
              <th scope="col">Email</th>
              <th scope="col">Team</th>
              <th scope="col">Total Calories</th>
              <th scope="col">Total Activities</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => (
              <tr key={entry._id} className={entry.rank <= 3 ? 'table-warning' : ''}>
                <td>
                  <strong className={entry.rank <= 3 ? 'text-warning' : ''}>
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                  </strong>
                </td>
                <td><strong>{entry.user_name}</strong></td>
                <td>{entry.user_email}</td>
                <td><span className="badge bg-primary">{entry.team || 'No Team'}</span></td>
                <td><strong className="text-success">{(entry.total_calories || 0).toLocaleString()}</strong></td>
                <td>{entry.total_activities || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
