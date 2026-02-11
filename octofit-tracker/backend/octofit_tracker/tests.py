from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from .models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime


class UserModelTest(TestCase):
    """Test User model."""
    
    def setUp(self):
        self.user = User.objects.create(
            name='Test Hero',
            email='testhero@test.com',
            password='test_password',
            team='Test Team'
        )
    
    def test_user_creation(self):
        """Test user is created correctly."""
        self.assertEqual(self.user.name, 'Test Hero')
        self.assertEqual(self.user.email, 'testhero@test.com')
        self.assertEqual(self.user.team, 'Test Team')
    
    def test_user_str(self):
        """Test user string representation."""
        self.assertEqual(str(self.user), 'Test Hero')


class TeamModelTest(TestCase):
    """Test Team model."""
    
    def setUp(self):
        self.team = Team.objects.create(
            name='Test Avengers',
            description='Test team of heroes',
            members=['hero1@test.com', 'hero2@test.com']
        )
    
    def test_team_creation(self):
        """Test team is created correctly."""
        self.assertEqual(self.team.name, 'Test Avengers')
        self.assertEqual(len(self.team.members), 2)
    
    def test_team_str(self):
        """Test team string representation."""
        self.assertEqual(str(self.team), 'Test Avengers')


class ActivityModelTest(TestCase):
    """Test Activity model."""
    
    def setUp(self):
        self.activity = Activity.objects.create(
            user_email='testhero@test.com',
            activity_type='Running',
            duration=30,
            calories=300,
            date=datetime.now()
        )
    
    def test_activity_creation(self):
        """Test activity is created correctly."""
        self.assertEqual(self.activity.user_email, 'testhero@test.com')
        self.assertEqual(self.activity.activity_type, 'Running')
        self.assertEqual(self.activity.duration, 30)
        self.assertEqual(self.activity.calories, 300)


class WorkoutModelTest(TestCase):
    """Test Workout model."""
    
    def setUp(self):
        self.workout = Workout.objects.create(
            name='Test Workout',
            description='A test workout routine',
            difficulty='Intermediate',
            duration=45,
            calories_estimate=400,
            category='Cardio'
        )
    
    def test_workout_creation(self):
        """Test workout is created correctly."""
        self.assertEqual(self.workout.name, 'Test Workout')
        self.assertEqual(self.workout.difficulty, 'Intermediate')
        self.assertEqual(self.workout.category, 'Cardio')
    
    def test_workout_str(self):
        """Test workout string representation."""
        self.assertEqual(str(self.workout), 'Test Workout')


class UserAPITest(APITestCase):
    """Test User API endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(
            name='API Test Hero',
            email='apitest@test.com',
            password='test_password',
            team='Test Team'
        )
    
    def test_get_users(self):
        """Test retrieving list of users."""
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_get_user_detail(self):
        """Test retrieving a single user."""
        url = reverse('user-detail', args=[str(self.user._id)])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'API Test Hero')


class TeamAPITest(APITestCase):
    """Test Team API endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.team = Team.objects.create(
            name='API Test Team',
            description='A test team',
            members=['test1@test.com']
        )
    
    def test_get_teams(self):
        """Test retrieving list of teams."""
        url = reverse('team-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_get_team_detail(self):
        """Test retrieving a single team."""
        url = reverse('team-detail', args=[str(self.team._id)])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'API Test Team')


class ActivityAPITest(APITestCase):
    """Test Activity API endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.activity = Activity.objects.create(
            user_email='apitest@test.com',
            activity_type='Swimming',
            duration=60,
            calories=500,
            date=datetime.now()
        )
    
    def test_get_activities(self):
        """Test retrieving list of activities."""
        url = reverse('activity-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_get_activity_detail(self):
        """Test retrieving a single activity."""
        url = reverse('activity-detail', args=[str(self.activity._id)])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['activity_type'], 'Swimming')


class WorkoutAPITest(APITestCase):
    """Test Workout API endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.workout = Workout.objects.create(
            name='API Test Workout',
            description='Test workout description',
            difficulty='Advanced',
            duration=50,
            calories_estimate=450,
            category='Strength'
        )
    
    def test_get_workouts(self):
        """Test retrieving list of workouts."""
        url = reverse('workout-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_get_workout_detail(self):
        """Test retrieving a single workout."""
        url = reverse('workout-detail', args=[str(self.workout._id)])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'API Test Workout')


class LeaderboardAPITest(APITestCase):
    """Test Leaderboard API endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.leaderboard_entry = Leaderboard.objects.create(
            user_email='leader@test.com',
            user_name='Test Leader',
            team='Test Team',
            total_calories=5000,
            total_activities=20,
            rank=1
        )
    
    def test_get_leaderboard(self):
        """Test retrieving leaderboard."""
        url = reverse('leaderboard-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_get_top_ten(self):
        """Test retrieving top 10 from leaderboard."""
        url = reverse('leaderboard-top-ten')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
