from django.core.management.base import BaseCommand
from django.utils import timezone
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Deleting existing data...')
        
        # Delete existing data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        
        self.stdout.write(self.style.SUCCESS('Existing data deleted'))

        # Create Teams
        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(
            name='Team Marvel',
            description='Earth\'s Mightiest Heroes unite for fitness!'
        )
        team_dc = Team.objects.create(
            name='Team DC',
            description='Justice League members committed to peak performance!'
        )
        self.stdout.write(self.style.SUCCESS('Teams created'))

        # Create Users
        self.stdout.write('Creating users...')
        marvel_heroes = [
            {'name': 'Iron Man', 'email': 'ironman@marvel.com'},
            {'name': 'Captain America', 'email': 'captainamerica@marvel.com'},
            {'name': 'Thor', 'email': 'thor@marvel.com'},
            {'name': 'Black Widow', 'email': 'blackwidow@marvel.com'},
            {'name': 'Hulk', 'email': 'hulk@marvel.com'},
            {'name': 'Spider-Man', 'email': 'spiderman@marvel.com'},
        ]
        
        dc_heroes = [
            {'name': 'Batman', 'email': 'batman@dc.com'},
            {'name': 'Superman', 'email': 'superman@dc.com'},
            {'name': 'Wonder Woman', 'email': 'wonderwoman@dc.com'},
            {'name': 'The Flash', 'email': 'flash@dc.com'},
            {'name': 'Aquaman', 'email': 'aquaman@dc.com'},
            {'name': 'Green Lantern', 'email': 'greenlantern@dc.com'},
        ]

        marvel_users = []
        for hero in marvel_heroes:
            user = User.objects.create(
                name=hero['name'],
                email=hero['email'],
                team=team_marvel.name
            )
            marvel_users.append(user)

        dc_users = []
        for hero in dc_heroes:
            user = User.objects.create(
                name=hero['name'],
                email=hero['email'],
                team=team_dc.name
            )
            dc_users.append(user)

        all_users = marvel_users + dc_users
        self.stdout.write(self.style.SUCCESS(f'Created {len(all_users)} users'))

        # Create Activities
        self.stdout.write('Creating activities...')
        activity_types = ['Running', 'Cycling', 'Swimming', 'Weightlifting', 'Yoga', 'Boxing']
        activities_count = 0
        
        for user in all_users:
            # Create 5-10 activities per user
            num_activities = random.randint(5, 10)
            for i in range(num_activities):
                activity_type = random.choice(activity_types)
                duration = random.randint(20, 120)
                calories = duration * random.randint(5, 15)
                distance = round(random.uniform(1, 20), 2) if activity_type in ['Running', 'Cycling', 'Swimming'] else None
                
                Activity.objects.create(
                    user_id=str(user._id),
                    activity_type=activity_type,
                    duration=duration,
                    calories=calories,
                    distance=distance,
                    date=timezone.now() - timedelta(days=random.randint(0, 30))
                )
                activities_count += 1

        self.stdout.write(self.style.SUCCESS(f'Created {activities_count} activities'))

        # Create Leaderboard entries
        self.stdout.write('Creating leaderboard...')
        leaderboard_data = []
        
        for user in all_users:
            user_activities = Activity.objects.filter(user_id=str(user._id))
            total_calories = sum(activity.calories for activity in user_activities)
            total_activities = user_activities.count()
            
            leaderboard_data.append({
                'user': user,
                'total_calories': total_calories,
                'total_activities': total_activities
            })

        # Sort by total calories and assign ranks
        leaderboard_data.sort(key=lambda x: x['total_calories'], reverse=True)
        
        for idx, data in enumerate(leaderboard_data, start=1):
            Leaderboard.objects.create(
                user_id=str(data['user']._id),
                user_name=data['user'].name,
                team=data['user'].team,
                total_calories=data['total_calories'],
                total_activities=data['total_activities'],
                rank=idx
            )

        self.stdout.write(self.style.SUCCESS(f'Created {len(leaderboard_data)} leaderboard entries'))

        # Create Workouts
        self.stdout.write('Creating workouts...')
        workouts_data = [
            {
                'name': 'Stark Industries Power Hour',
                'description': 'High-intensity interval training designed by Tony Stark himself',
                'activity_type': 'Weightlifting',
                'difficulty': 'Advanced',
                'duration': 60,
                'calories_estimate': 500
            },
            {
                'name': 'Super Soldier Sprint',
                'description': 'Captain America\'s legendary running routine',
                'activity_type': 'Running',
                'difficulty': 'Intermediate',
                'duration': 45,
                'calories_estimate': 450
            },
            {
                'name': 'Asgardian Warrior Workout',
                'description': 'Thor\'s hammer-swinging strength training',
                'activity_type': 'Weightlifting',
                'difficulty': 'Advanced',
                'duration': 90,
                'calories_estimate': 700
            },
            {
                'name': 'Widow\'s Flexibility Flow',
                'description': 'Black Widow\'s yoga and flexibility routine',
                'activity_type': 'Yoga',
                'difficulty': 'Intermediate',
                'duration': 60,
                'calories_estimate': 300
            },
            {
                'name': 'Bat Cave Circuit',
                'description': 'Batman\'s intense cave training circuit',
                'activity_type': 'Boxing',
                'difficulty': 'Advanced',
                'duration': 75,
                'calories_estimate': 600
            },
            {
                'name': 'Kryptonian Strength Builder',
                'description': 'Superman\'s strength and endurance workout',
                'activity_type': 'Weightlifting',
                'difficulty': 'Advanced',
                'duration': 90,
                'calories_estimate': 750
            },
            {
                'name': 'Amazonian Warrior Training',
                'description': 'Wonder Woman\'s complete combat fitness routine',
                'activity_type': 'Boxing',
                'difficulty': 'Advanced',
                'duration': 80,
                'calories_estimate': 650
            },
            {
                'name': 'Speed Force Sprint',
                'description': 'The Flash\'s speed and agility training',
                'activity_type': 'Running',
                'difficulty': 'Intermediate',
                'duration': 30,
                'calories_estimate': 400
            },
            {
                'name': 'Atlantean Aquatic Session',
                'description': 'Aquaman\'s underwater endurance swimming',
                'activity_type': 'Swimming',
                'difficulty': 'Intermediate',
                'duration': 60,
                'calories_estimate': 500
            },
            {
                'name': 'Green Lantern Willpower Cycle',
                'description': 'Green Lantern\'s mental and physical cycling challenge',
                'activity_type': 'Cycling',
                'difficulty': 'Intermediate',
                'duration': 50,
                'calories_estimate': 425
            },
        ]

        for workout_data in workouts_data:
            Workout.objects.create(**workout_data)

        self.stdout.write(self.style.SUCCESS(f'Created {len(workouts_data)} workouts'))

        self.stdout.write(self.style.SUCCESS('Database population completed successfully!'))
        self.stdout.write(self.style.SUCCESS(f'Total users: {len(all_users)}'))
        self.stdout.write(self.style.SUCCESS(f'Total teams: 2'))
        self.stdout.write(self.style.SUCCESS(f'Total activities: {activities_count}'))
        self.stdout.write(self.style.SUCCESS(f'Total workouts: {len(workouts_data)}'))
