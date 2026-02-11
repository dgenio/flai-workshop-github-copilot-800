import React, { useState, useEffect } from 'react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        // Determine the API URL based on environment
        const codespace_name = process.env.REACT_APP_CODESPACE_NAME;
        const apiUrl = codespace_name
          ? `https://${codespace_name}-8000.app.github.dev/api/workouts/`
          : 'http://localhost:8000/api/workouts/';
        
        console.log('Fetching workouts from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Handle both paginated (.results) and plain array responses
        const workoutData = data.results || data;
        console.log('Workouts data fetched:', workoutData);
        
        setWorkouts(workoutData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading workouts...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p className="mb-0">Failed to load workouts: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">💪 Workouts</h2>
      <div className="mb-3">
        <span className="badge bg-warning">Total: {workouts.length} workouts</span>
      </div>
      <div className="row">
        {workouts.map((workout) => (
          <div key={workout._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-header bg-gradient">
                <h5 className="card-title mb-0">{workout.name}</h5>
              </div>
              <div className="card-body">
                <p className="card-text">{workout.description}</p>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Difficulty:</strong> 
                    <span className={`badge ms-2 ${
                      workout.difficulty === 'Beginner' ? 'bg-success' :
                      workout.difficulty === 'Intermediate' ? 'bg-warning text-dark' :
                      workout.difficulty === 'Advanced' ? 'bg-danger' : 'bg-dark'
                    }`}>{workout.difficulty}</span>
                  </li>
                  <li className="list-group-item">
                    <strong>Duration:</strong> {workout.duration} minutes
                  </li>
                  <li className="list-group-item">
                    <strong>Calories:</strong> ~{workout.calories_estimate}
                  </li>
                  <li className="list-group-item">
                    <strong>Category:</strong> 
                    <span className="badge bg-info ms-2">{workout.category}</span>
                  </li>
                </ul>
              </div>
              <div className="card-footer text-center">
                <button className="btn btn-sm btn-primary">Start Workout</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Workouts;
