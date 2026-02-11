import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../config/api';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const apiUrl = getApiUrl('api/activities');
        console.log('Fetching activities from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Handle both paginated (.results) and plain array responses
        const activityData = data.results || data;
        console.log('Activities data fetched:', activityData);
        
        setActivities(activityData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading activities...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p className="mb-0">Failed to load activities: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Activities</h2>
      <div className="mb-3">
        <span className="badge bg-primary">Total: {activities.length} activities</span>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">User Email</th>
              <th scope="col">Activity Type</th>
              <th scope="col">Duration (min)</th>
              <th scope="col">Calories</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            {activities.slice(0, 50).map((activity) => {
              // Parse the date properly
              const activityDate = new Date(activity.date);
              const formattedDate = activityDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              });
              
              return (
                <tr key={activity._id}>
                  <td>{activity.user_email}</td>
                  <td><span className="badge bg-info">{activity.activity_type}</span></td>
                  <td>{activity.duration}</td>
                  <td><strong>{activity.calories}</strong></td>
                  <td>{formattedDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {activities.length > 50 && (
        <div className="alert alert-info" role="alert">
          Showing 50 of {activities.length} activities
        </div>
      )}
    </div>
  );
};

export default Activities;
