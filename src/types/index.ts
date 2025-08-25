export interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  fitnessGoal: 'weight_loss' | 'muscle_gain' | 'endurance' | 'maintenance';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  workoutReminders: boolean;
  hydrationReminders: boolean;
  workoutReminderTimes: string[];
  hydrationReminderInterval: number; // minutes
  weeklyGoal: number; // workouts per week
  dailyCalorieGoal: number;
}

export interface Workout {
  id: string;
  userId: string;
  name: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'sports' | 'other';
  duration: number; // minutes
  caloriesBurned: number;
  exercises: Exercise[];
  startTime: Date;
  endTime?: Date;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  notes?: string;
  isActive: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string;
  targetMuscles: string[];
  instructions: string[];
  image?: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number; // seconds
  distance?: number; // meters
  caloriesPerMinute: number;
}

export interface WorkoutSchedule {
  id: string;
  userId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  time: string; // HH:MM format
  workoutType: string;
  exercises: string[]; // exercise names
  isActive: boolean;
  reminderEnabled: boolean;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  workoutId?: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // minutes
  caloriesBurned: number;
  distance?: number; // meters
  avgHeartRate?: number;
  maxHeartRate?: number;
  exercises: SessionExercise[];
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  gpsTrack?: GpsPoint[];
  isActive: boolean;
}

export interface SessionExercise {
  exerciseId: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  restTime?: number;
  completed: boolean;
}

export interface GpsPoint {
  latitude: number;
  longitude: number;
  timestamp: Date;
  accuracy?: number;
}

export interface Gym {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  distance?: number; // from user location
  rating: number;
  amenities: string[];
  openingHours: {
    [key: string]: { open: string; close: string };
  };
  currentCapacity: number;
  maxCapacity: number;
  busyLevel: 'low' | 'moderate' | 'high';
  equipment: {
    total: number;
    available: number;
    popular: string[];
  };
}

export interface UserProgress {
  id: string;
  userId: string;
  date: Date;
  weight?: number;
  bodyFatPercentage?: number;
  musclePercentage?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
  photos?: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'workout' | 'streak' | 'calories' | 'distance' | 'time';
  requirement: number;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'workout_reminder' | 'hydration_reminder' | 'achievement' | 'goal_reached';
  title: string;
  message: string;
  scheduledFor: Date;
  sent: boolean;
  sentAt?: Date;
  data?: any;
}

export interface DashboardStats {
  todayCalories: number;
  todayWorkoutTime: number;
  todayExercises: number;
  weeklyWorkouts: number;
  monthlyWorkouts: number;
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  totalCalories: number;
  totalWorkoutTime: number;
}

export interface ChartData {
  date: string;
  calories: number;
  workouts: number;
  duration: number;
}
