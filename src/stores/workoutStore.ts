import { create } from 'zustand';
import { Workout, WorkoutSession, Exercise, GpsPoint } from '@/types';
import { 
  createWorkout, 
  createWorkoutSession, 
  getActiveWorkout, 
  getActiveWorkoutSession,
  updateWorkout,
  updateWorkoutSession,
  getAllExercises
} from '@/lib/database';

interface WorkoutState {
  currentWorkout: Workout | null;
  currentSession: WorkoutSession | null;
  exercises: Exercise[];
  isTracking: boolean;
  gpsPoints: GpsPoint[];
  startWorkout: (userId: string, workoutData: Partial<Workout>) => Promise<void>;
  endWorkout: () => Promise<void>;
  startSession: (userId: string, workoutId?: string) => Promise<void>;
  endSession: () => Promise<void>;
  addGpsPoint: (point: GpsPoint) => void;
  updateSessionExercise: (exerciseId: string, updates: any) => void;
  loadExercises: () => void;
  loadActiveWorkout: (userId: string) => void;
  loadActiveSession: (userId: string) => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  currentWorkout: null,
  currentSession: null,
  exercises: [],
  isTracking: false,
  gpsPoints: [],

  startWorkout: async (userId: string, workoutData: Partial<Workout>) => {
    const workout = createWorkout({
      userId,
      name: workoutData.name || 'Workout',
      type: workoutData.type || 'strength',
      duration: 0,
      caloriesBurned: 0,
      exercises: workoutData.exercises || [],
      startTime: new Date(),
      isActive: true,
      ...workoutData
    });

    set({ currentWorkout: workout });
  },

  endWorkout: async () => {
    const { currentWorkout } = get();
    if (currentWorkout) {
      const updatedWorkout = updateWorkout(currentWorkout.id, {
        endTime: new Date(),
        isActive: false,
        duration: Math.floor((new Date().getTime() - currentWorkout.startTime.getTime()) / 60000)
      });

      set({ currentWorkout: null });
    }
  },

  startSession: async (userId: string, workoutId?: string) => {
    const session = createWorkoutSession({
      userId,
      workoutId,
      startTime: new Date(),
      duration: 0,
      caloriesBurned: 0,
      exercises: [],
      isActive: true
    });

    set({ currentSession: session, isTracking: true, gpsPoints: [] });

    // Start GPS tracking if geolocation is available
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const point: GpsPoint = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date(),
            accuracy: position.coords.accuracy
          };
          get().addGpsPoint(point);
        },
        (error) => console.error('GPS tracking error:', error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 1000
        }
      );
    }
  },

  endSession: async () => {
    const { currentSession, gpsPoints } = get();
    if (currentSession) {
      const duration = Math.floor((new Date().getTime() - currentSession.startTime.getTime()) / 60000);
      
      // Calculate distance from GPS points
      let totalDistance = 0;
      for (let i = 1; i < gpsPoints.length; i++) {
        const prev = gpsPoints[i - 1];
        const curr = gpsPoints[i];
        const distance = calculateDistance(prev.latitude, prev.longitude, curr.latitude, curr.longitude);
        totalDistance += distance;
      }

      const updatedSession = updateWorkoutSession(currentSession.id, {
        endTime: new Date(),
        duration,
        distance: totalDistance,
        gpsTrack: gpsPoints,
        isActive: false
      });

      set({ 
        currentSession: null, 
        isTracking: false, 
        gpsPoints: [] 
      });
    }
  },

  addGpsPoint: (point: GpsPoint) => {
    set(state => ({
      gpsPoints: [...state.gpsPoints, point]
    }));
  },

  updateSessionExercise: (exerciseId: string, updates: any) => {
    const { currentSession } = get();
    if (currentSession) {
      const exerciseIndex = currentSession.exercises.findIndex(e => e.exerciseId === exerciseId);
      if (exerciseIndex !== -1) {
        const updatedExercises = [...currentSession.exercises];
        updatedExercises[exerciseIndex] = { ...updatedExercises[exerciseIndex], ...updates };
        
        updateWorkoutSession(currentSession.id, {
          exercises: updatedExercises
        });

        set({
          currentSession: {
            ...currentSession,
            exercises: updatedExercises
          }
        });
      }
    }
  },

  loadExercises: () => {
    const exercises = getAllExercises();
    set({ exercises });
  },

  loadActiveWorkout: (userId: string) => {
    const workout = getActiveWorkout(userId);
    set({ currentWorkout: workout });
  },

  loadActiveSession: (userId: string) => {
    const session = getActiveWorkoutSession(userId);
    set({ 
      currentSession: session,
      isTracking: session?.isActive || false
    });
  }
}));

// Helper function to calculate distance between two GPS points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}
