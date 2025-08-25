// Mock data for the FitTrack Pro app

export const mockUser = {
  id: "1",
  name: "Alex Johnson",
  email: "alex@example.com",
  age: 28,
  weight: 75, // kg
  height: 178, // cm
  fitnessLevel: "intermediate",
  goals: ["lose_weight", "build_muscle"],
  bodyFatPercentage: 15.2,
  bmi: 23.7,
}

export const mockWorkoutSession = {
  id: "1",
  startTime: "2024-01-06T09:00:00Z",
  endTime: null,
  isActive: true,
  totalCalories: 245,
  duration: 45, // minutes
  exercises: [
    {
      id: "1",
      name: "Bench Press",
      sets: [
        { reps: 12, weight: 60 },
        { reps: 10, weight: 65 },
        { reps: 8, weight: 70 }
      ],
      targetMuscles: ["chest", "triceps", "shoulders"]
    },
    {
      id: "2", 
      name: "Lat Pulldown",
      sets: [
        { reps: 12, weight: 45 },
        { reps: 10, weight: 50 }
      ],
      targetMuscles: ["back", "biceps"]
    }
  ]
}

export const mockGyms = [
  {
    id: "1",
    name: "FitZone Downtown",
    address: "123 Main St, Downtown",
    currentCapacity: 45,
    maxCapacity: 80,
    distance: 0.8, // km
    rating: 4.5,
    busyLevel: "moderate", // low, moderate, high
    equipment: {
      available: 12,
      total: 20,
      popular: ["treadmill", "bench_press", "lat_pulldown"]
    }
  },
  {
    id: "2", 
    name: "PowerHouse Gym",
    address: "456 Oak Ave, Midtown",
    currentCapacity: 62,
    maxCapacity: 100,
    distance: 1.2,
    rating: 4.8,
    busyLevel: "high",
    equipment: {
      available: 8,
      total: 25,
      popular: ["squat_rack", "deadlift_platform", "cable_machine"]
    }
  },
  {
    id: "3",
    name: "Flex Fitness Center", 
    address: "789 Pine Rd, Uptown",
    currentCapacity: 23,
    maxCapacity: 60,
    distance: 2.1,
    rating: 4.2,
    busyLevel: "low",
    equipment: {
      available: 18,
      total: 22,
      popular: ["elliptical", "rowing_machine", "leg_press"]
    }
  }
]

export const mockExercises = [
  {
    id: "1",
    name: "Bench Press",
    category: "strength",
    targetMuscles: ["chest", "triceps", "shoulders"],
    equipment: "barbell",
    difficulty: "intermediate",
    instructions: [
      "Lie on the bench with your eyes under the bar",
      "Grip the bar with hands slightly wider than shoulder-width",
      "Lower the bar to your chest with control",
      "Press the bar back up to starting position"
    ],
    image: "/placeholder.svg"
  },
  {
    id: "2",
    name: "Lat Pulldown", 
    category: "strength",
    targetMuscles: ["back", "biceps"],
    equipment: "cable_machine",
    difficulty: "beginner",
    instructions: [
      "Sit at the lat pulldown machine",
      "Grip the bar with wide overhand grip",
      "Pull the bar down to your upper chest",
      "Slowly return to starting position"
    ],
    image: "/placeholder.svg"
  },
  {
    id: "3",
    name: "Treadmill Running",
    category: "cardio", 
    targetMuscles: ["legs", "cardiovascular"],
    equipment: "treadmill",
    difficulty: "beginner",
    instructions: [
      "Step onto the treadmill belt",
      "Start with a slow walking pace",
      "Gradually increase speed as comfortable",
      "Maintain good posture throughout"
    ],
    image: "/placeholder.svg"
  },
  {
    id: "4",
    name: "Squats",
    category: "strength",
    targetMuscles: ["legs", "glutes", "core"],
    equipment: "bodyweight",
    difficulty: "beginner",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Lower your body by bending knees and hips",
      "Keep your chest up and knees over toes", 
      "Return to standing position"
    ],
    image: "/placeholder.svg"
  }
]

export const mockAnalytics = {
  weeklyStats: {
    workouts: 4,
    totalCalories: 1245,
    totalDuration: 180, // minutes
    avgHeartRate: 142
  },
  monthlyProgress: [
    { week: "Week 1", calories: 890, duration: 135 },
    { week: "Week 2", calories: 1050, duration: 160 },
    { week: "Week 3", calories: 1200, duration: 175 },
    { week: "Week 4", calories: 1245, duration: 180 }
  ],
  bodyComposition: [
    { date: "2024-01-01", weight: 77, bodyFat: 16.1, muscleMass: 64.3 },
    { date: "2024-01-08", weight: 76.5, bodyFat: 15.8, muscleMass: 64.5 },
    { date: "2024-01-15", weight: 76.2, bodyFat: 15.5, muscleMass: 64.7 },
    { date: "2024-01-22", weight: 75.8, bodyFat: 15.2, muscleMass: 64.9 }
  ],
  caloriesBurned: [
    { date: "Mon", calories: 350 },
    { date: "Tue", calories: 420 },
    { date: "Wed", calories: 0 },
    { date: "Thu", calories: 385 },
    { date: "Fri", calories: 410 },
    { date: "Sat", calories: 520 },
    { date: "Sun", calories: 290 }
  ]
}

export const muscleGroups = [
  "chest", "back", "shoulders", "arms", "biceps", "triceps", 
  "legs", "glutes", "core", "cardiovascular", "full_body"
]

export const equipmentTypes = [
  "barbell", "dumbbell", "cable_machine", "machine", "bodyweight",
  "treadmill", "elliptical", "bike", "rowing_machine", "free_weights"
]