from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from .models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime


class UserModelTest(TestCase):
    def test_create_user(self):
        user = User.objects.create(
            name="Test User",
            email="test@example.com",
            team="Test Team"
        )
        self.assertEqual(user.name, "Test User")
        self.assertEqual(user.email, "test@example.com")


class TeamModelTest(TestCase):
    def test_create_team(self):
        team = Team.objects.create(
            name="Test Team",
            description="A test team"
        )
        self.assertEqual(team.name, "Test Team")
        self.assertEqual(team.description, "A test team")


class ActivityModelTest(TestCase):
    def test_create_activity(self):
        activity = Activity.objects.create(
            user_id="123",
            activity_type="running",
            duration=30,
            calories=300,
            distance=5.0,
            date=datetime.now()
        )
        self.assertEqual(activity.activity_type, "running")
        self.assertEqual(activity.duration, 30)


class LeaderboardModelTest(TestCase):
    def test_create_leaderboard_entry(self):
        entry = Leaderboard.objects.create(
            user_id="123",
            user_name="Test User",
            team="Test Team",
            total_calories=1000,
            total_activities=10,
            rank=1
        )
        self.assertEqual(entry.rank, 1)
        self.assertEqual(entry.total_calories, 1000)


class WorkoutModelTest(TestCase):
    def test_create_workout(self):
        workout = Workout.objects.create(
            name="Morning Run",
            description="A quick morning run",
            activity_type="running",
            difficulty="medium",
            duration=30,
            calories_estimate=300
        )
        self.assertEqual(workout.name, "Morning Run")
        self.assertEqual(workout.difficulty, "medium")


class APIRootTest(APITestCase):
    def test_api_root(self):
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('users', response.data)
        self.assertIn('teams', response.data)
        self.assertIn('activities', response.data)
        self.assertIn('leaderboard', response.data)
        self.assertIn('workouts', response.data)


class UserAPITest(APITestCase):
    def test_create_user(self):
        data = {
            'name': 'API Test User',
            'email': 'apitest@example.com',
            'team': 'API Test Team'
        }
        response = self.client.post('/api/users/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_users(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TeamAPITest(APITestCase):
    def test_create_team(self):
        data = {
            'name': 'API Test Team',
            'description': 'Team created via API'
        }
        response = self.client.post('/api/teams/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_teams(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ActivityAPITest(APITestCase):
    def test_list_activities(self):
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class LeaderboardAPITest(APITestCase):
    def test_list_leaderboard(self):
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class WorkoutAPITest(APITestCase):
    def test_list_workouts(self):
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
