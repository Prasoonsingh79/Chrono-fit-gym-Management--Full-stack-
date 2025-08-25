import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';
import { useWorkoutStore } from '@/stores/workoutStore';
import { 
  Play, 
  Pause, 
  Square, 
  MapPin, 
  Clock, 
  Flame, 
  Activity,
  Target,
  Plus,
  Minus,
  CheckCircle2,
  Timer
} from 'lucide-react';
import { formatTime } from '@/lib/utils';

const WorkoutSession = () => {
  const { user } = useAuthStore();
  const { 
    currentSession, 
    exercises, 
    isTracking, 
    gpsPoints,
    startSession, 
    endSession, 
    updateSessionExercise,
    loadExercises 
  } = useWorkoutStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [sessionTime, setSessionTime] = useState(0);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadExercises();
    if (user) {
      // Check if there's an active session
      if (currentSession?.isActive) {
        startTimer();
      }
    }
  }, [user, currentSession]);

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error('Location error:', error)
      );
    }
  }, []);

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleStartSession = async () => {
    if (!user) return;

    try {
      await startSession(user.id);
      startTimer();
      
      // Initialize with some basic exercises
      const basicExercises = exercises.slice(0, 3).map(exercise => ({
        exerciseId: exercise.id,
        name: exercise.name,
        sets: 0,
        reps: 0,
        weight: 0,
        duration: 0,
        restTime: 60,
        completed: false
      }));
      
      setSelectedExercises(basicExercises);
      
      toast({
        title: 'Workout Started',
        description: 'Your workout session has begun. Good luck!'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start workout session.',
        variant: 'destructive'
      });
    }
  };

  const handleEndSession = async () => {
    try {
      await endSession();
      stopTimer();
      
      toast({
        title: 'Workout Completed',
        description: `Great job! You worked out for ${formatTime(sessionTime)}.`
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to end workout session.',
        variant: 'destructive'
      });
    }
  };

  const updateExercise = (exerciseId: string, field: string, value: any) => {
    setSelectedExercises(prev => 
      prev.map(ex => 
        ex.exerciseId === exerciseId 
          ? { ...ex, [field]: value }
          : ex
      )
    );
    
    updateSessionExercise(exerciseId, { [field]: value });
  };

  const toggleExerciseComplete = (exerciseId: string) => {
    const exercise = selectedExercises.find(ex => ex.exerciseId === exerciseId);
    if (exercise) {
      updateExercise(exerciseId, 'completed', !exercise.completed);
    }
  };

  const addExercise = (exercise: any) => {
    const newExercise = {
      exerciseId: exercise.id,
      name: exercise.name,
      sets: 0,
      reps: 0,
      weight: 0,
      duration: 0,
      restTime: 60,
      completed: false
    };
    
    setSelectedExercises(prev => [...prev, newExercise]);
  };

  const removeExercise = (exerciseId: string) => {
    setSelectedExercises(prev => prev.filter(ex => ex.exerciseId !== exerciseId));
  };

  const calculateCaloriesBurned = () => {
    return selectedExercises.reduce((total, exercise) => {
      const exerciseData = exercises.find(e => e.id === exercise.exerciseId);
      if (exerciseData && exercise.completed) {
        const timeInMinutes = exercise.duration > 0 ? exercise.duration / 60 : exercise.sets * 2; // Estimate 2 min per set
        return total + (exerciseData.caloriesPerMinute * timeInMinutes);
      }
      return total;
    }, 0);
  };

  const getCompletedExercises = () => {
    return selectedExercises.filter(ex => ex.completed).length;
  };

  const getTotalDistance = () => {
    if (gpsPoints.length < 2) return 0;
    
    let distance = 0;
    for (let i = 1; i < gpsPoints.length; i++) {
      const prev = gpsPoints[i - 1];
      const curr = gpsPoints[i];
      
      // Simple distance calculation
      const R = 6371e3; // Earth's radius in meters
      const φ1 = prev.latitude * Math.PI / 180;
      const φ2 = curr.latitude * Math.PI / 180;
      const Δφ = (curr.latitude - prev.latitude) * Math.PI / 180;
      const Δλ = (curr.longitude - prev.longitude) * Math.PI / 180;

      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

      distance += R * c;
    }
    
    return Math.round(distance);
  };

  if (!currentSession?.isActive) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Start Your Workout</h1>
          <p className="text-muted-foreground">
            Ready to get moving? Start a new workout session to track your progress.
          </p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>New Workout Session</CardTitle>
            <CardDescription>
              Track your exercises, calories, and location in real-time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentLocation && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Location tracking enabled</span>
              </div>
            )}
            
            <Button onClick={handleStartSession} className="w-full" size="lg">
              <Play className="mr-2 h-5 w-5" />
              Start Workout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Active Workout</h1>
          <p className="text-muted-foreground">
            Keep pushing! You're doing great.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Pause className="mr-2 h-4 w-4" />
            Pause
          </Button>
          <Button variant="destructive" size="sm" onClick={handleEndSession}>
            <Square className="mr-2 h-4 w-4" />
            End Workout
          </Button>
        </div>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatTime(sessionTime)}</p>
                <p className="text-sm text-muted-foreground">Duration</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <Flame className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.round(calculateCaloriesBurned())}</p>
                <p className="text-sm text-muted-foreground">Calories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{getCompletedExercises()}</p>
                <p className="text-sm text-muted-foreground">Exercises</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{getTotalDistance()}m</p>
                <p className="text-sm text-muted-foreground">Distance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exercise List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Exercises</CardTitle>
              <CardDescription>
                Track your sets, reps, and progress
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const availableExercises = exercises.filter(
                  e => !selectedExercises.some(se => se.exerciseId === e.id)
                );
                if (availableExercises.length > 0) {
                  addExercise(availableExercises[0]);
                }
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Exercise
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedExercises.map((exercise) => (
            <div
              key={exercise.exerciseId}
              className={`p-4 border rounded-lg space-y-4 ${
                exercise.completed ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant={exercise.completed ? "default" : "outline"}
                    onClick={() => toggleExerciseComplete(exercise.exerciseId)}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                  <div>
                    <h3 className="font-semibold">{exercise.name}</h3>
                    <Badge variant={exercise.completed ? "default" : "secondary"}>
                      {exercise.completed ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeExercise(exercise.exerciseId)}
                  className="text-destructive hover:text-destructive"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sets</label>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateExercise(exercise.exerciseId, 'sets', Math.max(0, exercise.sets - 1))}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{exercise.sets}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateExercise(exercise.exerciseId, 'sets', exercise.sets + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Reps</label>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateExercise(exercise.exerciseId, 'reps', Math.max(0, exercise.reps - 1))}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{exercise.reps}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateExercise(exercise.exerciseId, 'reps', exercise.reps + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Weight (kg)</label>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateExercise(exercise.exerciseId, 'weight', Math.max(0, exercise.weight - 2.5))}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-12 text-center">{exercise.weight}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateExercise(exercise.exerciseId, 'weight', exercise.weight + 2.5)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Rest (sec)</label>
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{exercise.restTime}s</span>
                  </div>
                </div>
              </div>

              {exercise.sets > 0 && exercise.reps > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    Total Volume: {exercise.sets} × {exercise.reps} = {exercise.sets * exercise.reps} reps
                    {exercise.weight > 0 && ` @ ${exercise.weight}kg`}
                  </p>
                </div>
              )}
            </div>
          ))}

          {selectedExercises.length === 0 && (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Add exercises to start tracking your workout
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Session Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Exercises Completed</span>
              <span>{getCompletedExercises()} / {selectedExercises.length}</span>
            </div>
            <Progress 
              value={selectedExercises.length > 0 ? (getCompletedExercises() / selectedExercises.length) * 100 : 0} 
            />
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Session Time</p>
              <p className="font-semibold">{formatTime(sessionTime)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Estimated Calories</p>
              <p className="font-semibold">{Math.round(calculateCaloriesBurned())}</p>
            </div>
            <div>
              <p className="text-muted-foreground">GPS Points</p>
              <p className="font-semibold">{gpsPoints.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Distance</p>
              <p className="font-semibold">{getTotalDistance()}m</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutSession;
