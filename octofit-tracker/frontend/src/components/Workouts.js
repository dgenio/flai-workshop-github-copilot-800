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

  if (loading) return <div className="container mt-4"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="container mt-4"><div className="alert alert-danger">Error: {error}</div></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Workouts</h2>
      <div className="row">
        {workouts.map((workout) => (
          <div key={workout._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{workout.name}</h5>
                <p className="card-text">{workout.description}</p>
                <ul className="list-unstyled">
                  <li><strong>Difficulty:</strong> <span className={`badge ${
                    workout.difficulty === 'Beginner' ? 'bg-success' :
                    workout.difficulty === 'Intermediate' ? 'bg-warning' :
                    workout.difficulty === 'Advanced' ? 'bg-danger' : 'bg-dark'
                  }`}>{workout.difficulty}</span></li>
                  <li><strong>Duration:</strong> {workout.duration} minutes</li>
                  <li><strong>Calories:</strong> ~{workout.calories_estimate}</li>
                  <li><strong>Category:</strong> {workout.category}</li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Workouts;
