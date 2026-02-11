from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting database population...'))
        
        # Clear existing data
        self.stdout.write('Clearing existing data...')
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        
        # Create teams
        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(
            name='Team Marvel',
            description='Avengers assemble! The mightiest heroes of Earth.',
            members=[]
        )
        
        team_dc = Team.objects.create(
            name='Team DC',
            description='Justice League united! Guardians of justice.',
            members=[]
        )
        
        # Create users (superheroes)
        self.stdout.write('Creating users...')
        marvel_heroes = [
            {'name': 'Tony Stark', 'email': 'ironman@marvel.com', 'password': 'arc_reactor_3000'},
            {'name': 'Steve Rogers', 'email': 'captain@marvel.com', 'password': 'super_soldier'},
            {'name': 'Thor Odinson', 'email': 'thor@marvel.com', 'password': 'mjolnir_worthy'},
            {'name': 'Natasha Romanoff', 'email': 'blackwidow@marvel.com', 'password': 'red_room'},
            {'name': 'Bruce Banner', 'email': 'hulk@marvel.com', 'password': 'gamma_smash'},
            {'name': 'Peter Parker', 'email': 'spiderman@marvel.com', 'password': 'web_slinger'},
        ]
        
        dc_heroes = [
            {'name': 'Clark Kent', 'email': 'superman@dc.com', 'password': 'kryptonite_free'},
            {'name': 'Bruce Wayne', 'email': 'batman@dc.com', 'password': 'dark_knight'},
            {'name': 'Diana Prince', 'email': 'wonderwoman@dc.com', 'password': 'amazonian'},
            {'name': 'Barry Allen', 'email': 'flash@dc.com', 'password': 'speed_force'},
            {'name': 'Arthur Curry', 'email': 'aquaman@dc.com', 'password': 'atlantis_king'},
            {'name': 'Hal Jordan', 'email': 'greenlantern@dc.com', 'password': 'willpower_ring'},
        ]
        
        marvel_users = []
        for hero in marvel_heroes:
            user = User.objects.create(
                name=hero['name'],
                email=hero['email'],
                password=hero['password'],
                team='Team Marvel'
            )
            marvel_users.append(user)
        
        dc_users = []
        for hero in dc_heroes:
            user = User.objects.create(
                name=hero['name'],
                email=hero['email'],
                password=hero['password'],
                team='Team DC'
            )
            dc_users.append(user)
        
        all_users = marvel_users + dc_users
        
        # Update teams with member emails
        team_marvel.members = [u.email for u in marvel_users]
        team_marvel.save()
        
        team_dc.members = [u.email for u in dc_users]
        team_dc.save()
        
        # Create activities
        self.stdout.write('Creating activities...')
        activity_types = ['Running', 'Cycling', 'Swimming', 'Weightlifting', 'Yoga', 'Boxing', 'HIIT']
        
        for user in all_users:
            # Each user has 5-10 activities
            num_activities = random.randint(5, 10)
            for i in range(num_activities):
                activity_type = random.choice(activity_types)
                duration = random.randint(20, 90)
                calories = duration * random.randint(5, 12)
                days_ago = random.randint(0, 30)
                
                Activity.objects.create(
                    user_email=user.email,
                    activity_type=activity_type,
                    duration=duration,
                    calories=calories,
                    date=datetime.now() - timedelta(days=days_ago)
                )
        
        # Create workouts
        self.stdout.write('Creating workouts...')
        workouts_data = [
            {
                'name': 'Arc Reactor Cardio',
                'description': 'High-intensity cardio workout to power up like Iron Man',
                'difficulty': 'Advanced',
                'duration': 45,
                'calories_estimate': 500,
                'category': 'Cardio'
            },
            {
                'name': 'Super Soldier Training',
                'description': 'Build strength and endurance like Captain America',
                'difficulty': 'Advanced',
                'duration': 60,
                'calories_estimate': 600,
                'category': 'Strength'
            },
            {
                'name': 'Asgardian Hammer Swings',
                'description': 'Hammer-inspired strength training',
                'difficulty': 'Expert',
                'duration': 50,
                'calories_estimate': 550,
                'category': 'Strength'
            },
            {
                'name': 'Spider Agility Drills',
                'description': 'Improve flexibility and agility like Spider-Man',
                'difficulty': 'Intermediate',
                'duration': 30,
                'calories_estimate': 350,
                'category': 'Agility'
            },
            {
                'name': 'Kryptonian Core Blast',
                'description': 'Core workout with Superman-level intensity',
                'difficulty': 'Advanced',
                'duration': 40,
                'calories_estimate': 450,
                'category': 'Core'
            },
            {
                'name': 'Dark Knight Circuit',
                'description': 'Batman-inspired full-body circuit training',
                'difficulty': 'Expert',
                'duration': 55,
                'calories_estimate': 580,
                'category': 'Circuit'
            },
            {
                'name': 'Amazonian Warrior Yoga',
                'description': 'Flexibility and balance training inspired by Wonder Woman',
                'difficulty': 'Intermediate',
                'duration': 35,
                'calories_estimate': 280,
                'category': 'Yoga'
            },
            {
                'name': 'Speed Force Sprints',
                'description': 'Lightning-fast interval training like The Flash',
                'difficulty': 'Advanced',
                'duration': 25,
                'calories_estimate': 400,
                'category': 'Cardio'
            },
            {
                'name': 'Atlantean Swim Session',
                'description': 'Aquatic training inspired by Aquaman',
                'difficulty': 'Intermediate',
                'duration': 45,
                'calories_estimate': 420,
                'category': 'Swimming'
            },
            {
                'name': 'Gamma Strength Builder',
                'description': 'Hulk-smash level weightlifting routine',
                'difficulty': 'Expert',
                'duration': 50,
                'calories_estimate': 550,
                'category': 'Strength'
            },
        ]
        
        for workout_data in workouts_data:
            Workout.objects.create(**workout_data)
        
        # Create leaderboard
        self.stdout.write('Creating leaderboard...')
        user_stats = []
        for user in all_users:
            activities = Activity.objects.filter(user_email=user.email)
            total_calories = sum(a.calories for a in activities)
            total_activities = activities.count()
            
            user_stats.append({
                'user': user,
                'total_calories': total_calories,
                'total_activities': total_activities
            })
        
        # Sort by calories (descending)
        user_stats.sort(key=lambda x: x['total_calories'], reverse=True)
        
        for rank, stats in enumerate(user_stats, start=1):
            Leaderboard.objects.create(
                user_email=stats['user'].email,
                user_name=stats['user'].name,
                team=stats['user'].team,
                total_calories=stats['total_calories'],
                total_activities=stats['total_activities'],
                rank=rank
            )
        
        self.stdout.write(self.style.SUCCESS(f'Successfully populated database!'))
        self.stdout.write(self.style.SUCCESS(f'Created {User.objects.count()} users'))
        self.stdout.write(self.style.SUCCESS(f'Created {Team.objects.count()} teams'))
        self.stdout.write(self.style.SUCCESS(f'Created {Activity.objects.count()} activities'))
        self.stdout.write(self.style.SUCCESS(f'Created {Workout.objects.count()} workouts'))
        self.stdout.write(self.style.SUCCESS(f'Created {Leaderboard.objects.count()} leaderboard entries'))
