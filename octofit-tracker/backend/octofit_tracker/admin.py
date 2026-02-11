from django.contrib import admin
from .models import User, Team, Activity, Leaderboard, Workout


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'team', 'created_at')
    list_filter = ('team', 'created_at')
    search_fields = ('name', 'email', 'team')
    ordering = ('-created_at',)


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('-created_at',)


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'activity_type', 'duration', 'calories', 'distance', 'date', 'created_at')
    list_filter = ('activity_type', 'date', 'created_at')
    search_fields = ('user_id', 'activity_type')
    ordering = ('-date',)


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ('rank', 'user_name', 'team', 'total_calories', 'total_activities', 'updated_at')
    list_filter = ('team', 'updated_at')
    search_fields = ('user_name', 'team')
    ordering = ('rank',)


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('name', 'activity_type', 'difficulty', 'duration', 'calories_estimate', 'created_at')
    list_filter = ('activity_type', 'difficulty', 'created_at')
    search_fields = ('name', 'activity_type', 'description')
    ordering = ('-created_at',)
