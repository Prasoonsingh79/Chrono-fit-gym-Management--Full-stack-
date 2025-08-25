// Simple in-memory database for demo purposes
// In production, this would be replaced with a real database like PostgreSQL with Prisma

import { User, UserSettings, Workout, WorkoutSession, Exercise, Gym, UserProgress, Achievement, Notification, WorkoutSchedule } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = 'your-secret-key-change-in-production';

// In-memory storage
let users: User[] = [];
let userSettings: UserSettings[] = [];
let workouts: Workout[] = [];
let workoutSessions: WorkoutSession[] = [];
let exercises: Exercise[] = [];
let gyms: Gym[] = [];
let userProgress: UserProgress[] = [];
let achievements: Achievement[] = [];
let notifications: Notification[] = [];
let workoutSchedules: WorkoutSchedule[] = [];

// Initialize with demo data
export const initializeDatabase = () => {
  // Demo exercises
  exercises = [
    {
      id: '1',
      name: 'Push-ups',
      category: 'Strength',
      difficulty: 'beginner',
      equipment: 'bodyweight',
      targetMuscles: ['chest', 'shoulders', 'triceps'],
      instructions: [
        'Start in a plank position with hands shoulder-width apart',
        'Lower your body until your chest nearly touches the floor',
        'Push back up to the starting position',
        'Keep your core tight throughout the movement'
      ],
      image: '/placeholder.svg',
      caloriesPerMinute: 8
    },
    {
      id: '2',
      name: 'Squats',
      category: 'Strength',
      difficulty: 'beginner',
      equipment: 'bodyweight',
      targetMuscles: ['quadriceps', 'glutes', 'hamstrings'],
      instructions: [
        'Stand with feet shoulder-width apart',
        'Lower your body as if sitting back into a chair',
        'Keep your chest up and knees behind your toes',
        'Return to standing position'
      ],
      image: '/placeholder.svg',
      caloriesPerMinute: 6
    },
    {
      id: '3',
      name: 'Running',
      category: 'Cardio',
      difficulty: 'intermediate',
      equipment: 'none',
      targetMuscles: ['legs', 'cardiovascular'],
      instructions: [
        'Start with a light warm-up walk',
        'Gradually increase pace to a comfortable run',
        'Maintain steady breathing',
        'Cool down with walking'
      ],
      image: '/placeholder.svg',
      caloriesPerMinute: 12
    },
    {
      id: '4',
      name: 'Cycling',
      category: 'Cardio',
      difficulty: 'beginner',
      equipment: 'bicycle',
      targetMuscles: ['legs', 'cardiovascular'],
      instructions: [
        'Adjust seat height properly',
        'Start pedaling at a comfortable pace',
        'Maintain proper posture',
        'Gradually increase intensity'
      ],
      image: '/placeholder.svg',
      caloriesPerMinute: 10
    },
    {
      id: '5',
      name: 'Plank',
      category: 'Core',
      difficulty: 'intermediate',
      equipment: 'bodyweight',
      targetMuscles: ['core', 'shoulders', 'back'],
      instructions: [
        'Start in a push-up position',
        'Lower onto your forearms',
        'Keep your body in a straight line',
        'Hold the position while breathing normally'
      ],
      image: '/placeholder.svg',
      caloriesPerMinute: 5
    },
    {
      id: '6',
      name: 'Burpees',
      category: 'HIIT',
      difficulty: 'advanced',
      equipment: 'bodyweight',
      targetMuscles: ['full body', 'cardiovascular'],
      instructions: [
        'Start standing, then squat down',
        'Jump feet back into plank position',
        'Do a push-up',
        'Jump feet back to squat, then jump up with arms overhead'
      ],
      image: '/placeholder.svg',
      caloriesPerMinute: 15
    }
  ];

  // Demo gyms
  gyms = [
    {
      id: '1',
      name: 'FitZone Gym',
      address: '123 Fitness St, City Center',
      latitude: 40.7128,
      longitude: -74.0060,
      rating: 4.5,
      amenities: ['Free Weights', 'Cardio Equipment', 'Pool', 'Sauna'],
      openingHours: {
        monday: { open: '06:00', close: '22:00' },
        tuesday: { open: '06:00', close: '22:00' },
        wednesday: { open: '06:00', close: '22:00' },
        thursday: { open: '06:00', close: '22:00' },
        friday: { open: '06:00', close: '22:00' },
        saturday: { open: '08:00', close: '20:00' },
        sunday: { open: '08:00', close: '20:00' }
      },
      currentCapacity: 45,
      maxCapacity: 100,
      busyLevel: 'moderate',
      equipment: {
        total: 150,
        available: 120,
        popular: ['treadmills', 'bench_press', 'squat_racks', 'dumbbells']
      }
    },
    {
      id: '2',
      name: 'PowerHouse Fitness',
      address: '456 Muscle Ave, Downtown',
      latitude: 40.7589,
      longitude: -73.9851,
      rating: 4.8,
      amenities: ['Free Weights', 'Machines', 'Group Classes', 'Personal Training'],
      openingHours: {
        monday: { open: '05:00', close: '23:00' },
        tuesday: { open: '05:00', close: '23:00' },
        wednesday: { open: '05:00', close: '23:00' },
        thursday: { open: '05:00', close: '23:00' },
        friday: { open: '05:00', close: '23:00' },
        saturday: { open: '07:00', close: '21:00' },
        sunday: { open: '07:00', close: '21:00' }
      },
      currentCapacity: 25,
      maxCapacity: 80,
      busyLevel: 'low',
      equipment: {
        total: 200,
        available: 180,
        popular: ['cable_machines', 'leg_press', 'rowing_machines', 'kettlebells']
      }
    }
  ];

  // Demo achievements
  achievements = [
    {
      id: '1',
      name: 'First Workout',
      description: 'Complete your first workout',
      icon: 'trophy',
      category: 'workout',
      requirement: 1,
      unlocked: false
    },
    {
      id: '2',
      name: '7-Day Streak',
      description: 'Work out for 7 consecutive days',
      icon: 'flame',
      category: 'streak',
      requirement: 7,
      unlocked: false
    },
    {
      id: '3',
      name: 'Calorie Crusher',
      description: 'Burn 1000 calories in a single workout',
      icon: 'zap',
      category: 'calories',
      requirement: 1000,
      unlocked: false
    }
  ];
};

// Simple hash function for demo (NOT for production)
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
};

// Simple token generation for demo (NOT for production)
const generateToken = (userId: string): string => {
  return btoa(`${userId}:${Date.now()}`);
};

// Auth functions
export const registerUser = async (email: string, password: string, name: string): Promise<{ user: User; token: string }> => {
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = simpleHash(password);
  const userId = uuidv4();
  
  const user: User = {
    id: userId,
    email,
    name,
    fitnessGoal: 'maintenance',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Store password separately (in real app, this would be in the user record)
  (user as any).password = hashedPassword;
  
  users.push(user);

  // Create default settings
  const settings: UserSettings = {
    id: uuidv4(),
    userId,
    theme: 'system',
    notificationsEnabled: true,
    workoutReminders: true,
    hydrationReminders: true,
    workoutReminderTimes: ['09:00', '18:00'],
    hydrationReminderInterval: 60,
    weeklyGoal: 3,
    dailyCalorieGoal: 400
  };

  userSettings.push(settings);

  const token = generateToken(userId);
  
  // Remove password from returned user
  const { password: _, ...userWithoutPassword } = user as any;
  return { user: userWithoutPassword, token };
};

export const loginUser = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  const user = users.find(u => u.email === email) as any;
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = simpleHash(password) === user.password;
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  const token = generateToken(user.id);
  
  // Remove password from returned user
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

export const verifyToken = (token: string): { userId: string } => {
  try {
    const decoded = atob(token);
    const [userId] = decoded.split(':');
    return { userId };
  } catch {
    throw new Error('Invalid token');
  }
};

// User functions
export const getUserById = (id: string): User | undefined => {
  const user = users.find(u => u.id === id) as any;
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return undefined;
};

export const updateUser = (id: string, updates: Partial<User>): User | undefined => {
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) return undefined;

  users[userIndex] = { ...users[userIndex], ...updates, updatedAt: new Date() };
  const { password: _, ...userWithoutPassword } = users[userIndex] as any;
  return userWithoutPassword;
};

// Settings functions
export const getUserSettings = (userId: string): UserSettings | undefined => {
  return userSettings.find(s => s.userId === userId);
};

export const updateUserSettings = (userId: string, updates: Partial<UserSettings>): UserSettings | undefined => {
  const settingsIndex = userSettings.findIndex(s => s.userId === userId);
  if (settingsIndex === -1) return undefined;

  userSettings[settingsIndex] = { ...userSettings[settingsIndex], ...updates };
  return userSettings[settingsIndex];
};

// Workout functions
export const createWorkout = (workout: Omit<Workout, 'id'>): Workout => {
  const newWorkout: Workout = {
    ...workout,
    id: uuidv4()
  };
  workouts.push(newWorkout);
  return newWorkout;
};

export const getUserWorkouts = (userId: string): Workout[] => {
  return workouts.filter(w => w.userId === userId);
};

export const getActiveWorkout = (userId: string): Workout | undefined => {
  return workouts.find(w => w.userId === userId && w.isActive);
};

export const updateWorkout = (id: string, updates: Partial<Workout>): Workout | undefined => {
  const workoutIndex = workouts.findIndex(w => w.id === id);
  if (workoutIndex === -1) return undefined;

  workouts[workoutIndex] = { ...workouts[workoutIndex], ...updates };
  return workouts[workoutIndex];
};

// Workout session functions
export const createWorkoutSession = (session: Omit<WorkoutSession, 'id'>): WorkoutSession => {
  const newSession: WorkoutSession = {
    ...session,
    id: uuidv4()
  };
  workoutSessions.push(newSession);
  return newSession;
};

export const getUserWorkoutSessions = (userId: string): WorkoutSession[] => {
  return workoutSessions.filter(s => s.userId === userId);
};

export const getActiveWorkoutSession = (userId: string): WorkoutSession | undefined => {
  return workoutSessions.find(s => s.userId === userId && s.isActive);
};

export const updateWorkoutSession = (id: string, updates: Partial<WorkoutSession>): WorkoutSession | undefined => {
  const sessionIndex = workoutSessions.findIndex(s => s.id === id);
  if (sessionIndex === -1) return undefined;

  workoutSessions[sessionIndex] = { ...workoutSessions[sessionIndex], ...updates };
  return workoutSessions[sessionIndex];
};

// Exercise functions
export const getAllExercises = (): Exercise[] => {
  return exercises;
};

export const getExerciseById = (id: string): Exercise | undefined => {
  return exercises.find(e => e.id === id);
};

// Gym functions
export const getAllGyms = (): Gym[] => {
  return gyms;
};

export const getNearbyGyms = (latitude: number, longitude: number, radius: number = 10): Gym[] => {
  // Simple distance calculation (in a real app, use proper geospatial queries)
  return gyms.map(gym => ({
    ...gym,
    distance: Math.sqrt(
      Math.pow(gym.latitude - latitude, 2) + Math.pow(gym.longitude - longitude, 2)
    ) * 111 // Rough conversion to km
  })).filter(gym => gym.distance! <= radius);
};

// Workout schedule functions
export const createWorkoutSchedule = (schedule: Omit<WorkoutSchedule, 'id'>): WorkoutSchedule => {
  const newSchedule: WorkoutSchedule = {
    ...schedule,
    id: uuidv4()
  };
  workoutSchedules.push(newSchedule);
  return newSchedule;
};

export const getUserWorkoutSchedules = (userId: string): WorkoutSchedule[] => {
  return workoutSchedules.filter(s => s.userId === userId);
};

export const updateWorkoutSchedule = (id: string, updates: Partial<WorkoutSchedule>): WorkoutSchedule | undefined => {
  const scheduleIndex = workoutSchedules.findIndex(s => s.id === id);
  if (scheduleIndex === -1) return undefined;

  workoutSchedules[scheduleIndex] = { ...workoutSchedules[scheduleIndex], ...updates };
  return workoutSchedules[scheduleIndex];
};

export const deleteWorkoutSchedule = (id: string): boolean => {
  const scheduleIndex = workoutSchedules.findIndex(s => s.id === id);
  if (scheduleIndex === -1) return false;

  workoutSchedules.splice(scheduleIndex, 1);
  return true;
};

// Progress functions
export const createUserProgress = (progress: Omit<UserProgress, 'id'>): UserProgress => {
  const newProgress: UserProgress = {
    ...progress,
    id: uuidv4()
  };
  userProgress.push(newProgress);
  return newProgress;
};

export const getUserProgress = (userId: string): UserProgress[] => {
  return userProgress.filter(p => p.userId === userId);
};

// Achievement functions
export const getUserAchievements = (userId: string): Achievement[] => {
  // In a real app, this would track user-specific achievements
  return achievements;
};

// Notification functions
export const createNotification = (notification: Omit<Notification, 'id'>): Notification => {
  const newNotification: Notification = {
    ...notification,
    id: uuidv4()
  };
  notifications.push(newNotification);
  return newNotification;
};

export const getUserNotifications = (userId: string): Notification[] => {
  return notifications.filter(n => n.userId === userId);
};

// Initialize demo user account
export const initializeDemoUser = async () => {
  try {
    // Check if demo user already exists
    const existingUser = users.find(u => u.email === 'demo@chronofit.com');
    if (!existingUser) {
      // Create demo user
      await registerUser('demo@chronofit.com', 'demo123', 'Demo User');
      
      // Get the demo user
      const demoUser = users.find(u => u.email === 'demo@chronofit.com');
      if (demoUser) {
        // Update demo user with sample data
        updateUser(demoUser.id, {
          age: 28,
          weight: 70,
          height: 175,
          fitnessGoal: 'muscle_gain'
        });

        // Create sample workout sessions
        const sampleSessions = [
          {
            userId: demoUser.id,
            startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            duration: 45,
            caloriesBurned: 320,
            exercises: [
              { exerciseId: '1', name: 'Push-ups', sets: 3, reps: 15, weight: 0, duration: 0, restTime: 60, completed: true },
              { exerciseId: '2', name: 'Squats', sets: 3, reps: 20, weight: 0, duration: 0, restTime: 60, completed: true }
            ],
            isActive: false
          },
          {
            userId: demoUser.id,
            startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            duration: 30,
            caloriesBurned: 280,
            exercises: [
              { exerciseId: '3', name: 'Running', sets: 1, reps: 1, weight: 0, duration: 1800, restTime: 0, completed: true }
            ],
            isActive: false
          },
          {
            userId: demoUser.id,
            startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            duration: 60,
            caloriesBurned: 450,
            exercises: [
              { exerciseId: '1', name: 'Push-ups', sets: 4, reps: 12, weight: 0, duration: 0, restTime: 60, completed: true },
              { exerciseId: '5', name: 'Plank', sets: 3, reps: 1, weight: 0, duration: 60, restTime: 30, completed: true },
              { exerciseId: '6', name: 'Burpees', sets: 3, reps: 10, weight: 0, duration: 0, restTime: 90, completed: true }
            ],
            isActive: false
          }
        ];

        sampleSessions.forEach(session => createWorkoutSession(session));

        // Create sample workout schedule
        const sampleSchedules = [
          {
            userId: demoUser.id,
            dayOfWeek: 1, // Monday
            time: '07:00',
            workoutType: 'Strength Training',
            exercises: ['Push-ups', 'Squats', 'Plank'],
            reminderEnabled: true,
            isActive: true
          },
          {
            userId: demoUser.id,
            dayOfWeek: 3, // Wednesday
            time: '18:00',
            workoutType: 'Cardio',
            exercises: ['Running'],
            reminderEnabled: true,
            isActive: true
          },
          {
            userId: demoUser.id,
            dayOfWeek: 5, // Friday
            time: '07:00',
            workoutType: 'HIIT',
            exercises: ['Burpees', 'Push-ups', 'Squats'],
            reminderEnabled: true,
            isActive: true
          }
        ];

        sampleSchedules.forEach(schedule => createWorkoutSchedule(schedule));

        console.log('Demo user and sample data created successfully!');
      }
    }
  } catch (error) {
    console.error('Error creating demo user:', error);
  }
};

// Export gyms and exercises for components to use
export { gyms, exercises };

// Initialize the database
initializeDatabase();
initializeDemoUser();
