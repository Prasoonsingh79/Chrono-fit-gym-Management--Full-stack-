import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Activity, 
  Calendar, 
  Clock, 
  Flame, 
  MapPin, 
  Play, 
  Target,
  TrendingUp,
  Award,
  Zap,
  ChevronRight,
  Trophy,
  Star
} from "lucide-react"
import { useAuthStore } from "@/stores/authStore";
import { getUserWorkoutSessions, gyms } from "@/lib/database";
import { useNavigate } from "react-router-dom"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate()
  const isWorkoutActive = false;

  const todayStats = {
    caloriesBurned: 245,
    workoutTime: 45,
    exercisesCompleted: 8,
    calorieGoal: 500
  }

  const nearestGym = gyms[0]

  // Weekly progress data for charts
  const weeklyData = [
    { day: 'Mon', calories: 320, workouts: 1 },
    { day: 'Tue', calories: 280, workouts: 1 },
    { day: 'Wed', calories: 0, workouts: 0 },
    { day: 'Thu', calories: 450, workouts: 1 },
    { day: 'Fri', calories: 380, workouts: 1 },
    { day: 'Sat', calories: 520, workouts: 2 },
    { day: 'Sun', calories: 245, workouts: 1 }
  ]

  const recentWorkouts = [
    { name: 'Upper Body Strength', date: 'Today', duration: '45 min', calories: 245 },
    { name: 'HIIT Cardio', date: 'Yesterday', duration: '30 min', calories: 380 },
    { name: 'Full Body', date: '2 days ago', duration: '60 min', calories: 520 }
  ]

  const achievements = [
    { title: '7-Day Streak', icon: Trophy, unlocked: true },
    { title: 'Calorie Crusher', icon: Flame, unlocked: true },
    { title: 'Early Bird', icon: Star, unlocked: false }
  ]

  const motivationalTips = [
    "Consistency beats perfection every time!",
    "Your only competition is who you were yesterday.",
    "Strong is the new skinny.",
    "Progress, not perfection."
  ]

  const currentTip = motivationalTips[Math.floor(Math.random() * motivationalTips.length)]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.name || 'Demo User'}!
          </h1>
          <p className="text-muted-foreground">
            Ready to crush your fitness goals today?
          </p>
        </div>
        <Button 
          onClick={() => navigate('/workout')}
          className="bg-primary hover:bg-primary/90"
          size="lg"
        >
          {isWorkoutActive ? (
            <>
              <Activity className="mr-2 h-4 w-4" />
              Continue Workout
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start Workout
            </>
          )}
        </Button>
      </div>

      {/* Active Workout Banner */}
      {isWorkoutActive && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                  <span className="font-medium">Workout in progress</span>
                </div>
                <Badge variant="secondary">
                  45 minutes
                </Badge>
                <Badge variant="outline">
                  320 calories
                </Badge>
              </div>
              <Button onClick={() => navigate('/workout')}>
                View Workout
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.caloriesBurned}</div>
            <div className="mt-2">
              <Progress 
                value={(todayStats.caloriesBurned / todayStats.calorieGoal) * 100} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {todayStats.calorieGoal - todayStats.caloriesBurned} left to goal
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workout Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.workoutTime}</div>
            <p className="text-xs text-muted-foreground">minutes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exercises</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.exercisesCompleted}</div>
            <p className="text-xs text-muted-foreground">completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">workouts</p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress Chart */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-between group hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => navigate('/exercises')}
            >
              <div className="flex items-center">
                <Target className="mr-2 h-4 w-4" />
                Browse Exercises
              </div>
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-between group hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => navigate('/gym-finder')}
            >
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Find Nearby Gyms
              </div>
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-between group hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => navigate('/analytics')}
            >
              <div className="flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Progress
              </div>
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>

        {/* Recent Workouts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Workouts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentWorkouts.map((workout, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{workout.name}</h4>
                    <p className="text-xs text-muted-foreground">{workout.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{workout.duration}</p>
                    <p className="text-xs text-muted-foreground">{workout.calories} cal</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Nearest Gym */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Nearest Gym
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h3 className="font-medium">{nearestGym.name}</h3>
                <p className="text-sm text-muted-foreground">{nearestGym.address}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-muted-foreground">Capacity: </span>
                  <span className="font-medium">
                    {nearestGym.currentCapacity}/{nearestGym.maxCapacity}
                  </span>
                </div>
                <Badge 
                  variant={
                    nearestGym.busyLevel === "low" ? "default" :
                    nearestGym.busyLevel === "moderate" ? "secondary" : "destructive"
                  }
                >
                  {nearestGym.busyLevel}
                </Badge>
              </div>

              <Progress 
                value={(nearestGym.currentCapacity / nearestGym.maxCapacity) * 100}
                className="h-2"
              />

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/gym-finder')}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements & Motivation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon
                return (
                  <div 
                    key={index} 
                    className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                      achievement.unlocked 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-muted bg-muted/20 text-muted-foreground'
                    }`}
                  >
                    <Icon className={`h-8 w-8 mb-2 ${
                      achievement.unlocked ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <span className="text-xs text-center font-medium">{achievement.title}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Daily Motivation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Daily Motivation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
                <p className="text-lg font-medium italic text-foreground">
                  "{currentTip}"
                </p>
              </div>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Flame className="h-4 w-4" />
                  <span>7-day streak</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  <span>Level 12</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard