import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Play, 
  Pause, 
  Square, 
  Plus, 
  Flame, 
  Clock, 
  Target,
  Timer
} from "lucide-react"
import { useAuthStore } from "@/stores/authStore";
import { exercises } from "@/lib/database";

const Workout = () => {
  const [isActive, setIsActive] = useState(false)
  const [duration, setDuration] = useState(0)
  const [calories, setCalories] = useState(0)
  const [currentExercise, setCurrentExercise] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [restTimer, setRestTimer] = useState(0)
  const [isResting, setIsResting] = useState(false)

  // Timer effect for workout duration
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive && !isResting) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1/60) // increment by 1 minute
        setCalories(prev => prev + 5) // roughly 5 calories per minute
      }, 60000)
    }
    return () => clearInterval(interval)
  }, [isActive, isResting])

  // Rest timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isResting, restTimer])

  const startWorkout = () => {
    setIsActive(true)
  }

  const pauseWorkout = () => {
    setIsActive(false)
  }

  const endWorkout = () => {
    setIsActive(false)
    setIsResting(false)
    setRestTimer(0)
  }

  const startRestTimer = (seconds: number) => {
    setRestTimer(seconds)
    setIsResting(true)
  }

  const addSet = () => {
    setCurrentSet(prev => prev + 1)
  }

  const sampleExercises = [
    { name: 'Push-ups', targetMuscles: ['Chest', 'Shoulders', 'Triceps'] },
    { name: 'Squats', targetMuscles: ['Legs', 'Glutes'] },
    { name: 'Plank', targetMuscles: ['Core', 'Abs'] }
  ];

  const nextExercise = () => {
    setCurrentExercise(prev => 
      prev < sampleExercises.length - 1 ? prev + 1 : prev
    )
    setCurrentSet(1)
  }

  const currentExerciseData = sampleExercises[currentExercise]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Workout Session</h1>
          <p className="text-muted-foreground">
            {isActive ? "Keep pushing! You're doing great." : "Ready to start your workout?"}
          </p>
        </div>
        <div className="flex gap-2">
          {!isActive ? (
            <Button onClick={startWorkout} className="bg-primary hover:bg-primary/90">
              <Play className="mr-2 h-4 w-4" />
              Start Workout
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={pauseWorkout}>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>
              <Button variant="destructive" onClick={endWorkout}>
                <Square className="mr-2 h-4 w-4" />
                End Workout
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Workout Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(duration)} min</div>
            {isActive && (
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground">Active</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(calories)}</div>
            <p className="text-xs text-muted-foreground">
              ~{Math.floor(calories * 0.7)} from fat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exercises</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentExercise + 1}/{sampleExercises.length}
            </div>
            <Progress 
              value={((currentExercise + 1) / sampleExercises.length) * 100}
              className="h-2 mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Rest Timer */}
      {isResting && (
        <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Timer className="h-5 w-5 text-orange-500" />
              <span className="font-medium">Rest Time</span>
            </div>
            <div className="text-4xl font-bold text-orange-500 mb-2">
              {Math.floor(restTimer / 60)}:{(restTimer % 60).toString().padStart(2, '0')}
            </div>
            <Button variant="outline" onClick={() => setIsResting(false)}>
              Skip Rest
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Current Exercise */}
      {isActive && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{currentExerciseData.name}</CardTitle>
              <div className="flex gap-1">
                {currentExerciseData.targetMuscles.map(muscle => (
                  <Badge key={muscle} variant="secondary" className="text-xs">
                    {muscle}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <span className="text-lg font-medium">Set {currentSet}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reps">Reps</Label>
                <Input id="reps" type="number" placeholder="12" />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" type="number" placeholder="60" />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={addSet} className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Complete Set
              </Button>
              <Button 
                variant="outline"
                onClick={() => startRestTimer(90)}
              >
                Rest 90s
              </Button>
              <Button 
                variant="outline"
                onClick={() => startRestTimer(120)}
              >
                Rest 2m
              </Button>
            </div>

            <Button 
              variant="secondary" 
              onClick={nextExercise}
              className="w-full"
              disabled={currentExercise >= sampleExercises.length - 1}
            >
              Next Exercise
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Exercise List */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Exercises</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sampleExercises.map((exercise, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${
                  index === currentExercise 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{exercise.name}</h4>
                    <div className="flex gap-1 mt-1">
                      {exercise.targetMuscles.map(muscle => (
                        <Badge key={muscle} variant="outline" className="text-xs">
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      3 sets planned
                    </div>
                    {index === currentExercise && isActive && (
                      <Badge variant="default" className="mt-1">Current</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Workout