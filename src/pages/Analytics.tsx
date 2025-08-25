import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Target,
  Flame,
  Clock,
  Activity
} from "lucide-react"
import { useAuthStore } from "@/stores/authStore";
import { getUserWorkoutSessions } from "@/lib/database";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"

const Analytics = () => {
  const { user } = useAuthStore();
  
  // Mock data for analytics (replace with real data from database)
  const weeklyStats = {
    workouts: 5,
    totalCalories: 1850,
    totalDuration: 240,
    avgHeartRate: 142
  };

  const monthlyProgress = [
    { week: 'Week 1', calories: 1200, duration: 180 },
    { week: 'Week 2', calories: 1400, duration: 210 },
    { week: 'Week 3', calories: 1600, duration: 240 },
    { week: 'Week 4', calories: 1850, duration: 270 }
  ];

  const bodyComposition = [
    { date: '2024-01-01', weight: 72, bodyFat: 18, muscleMass: 58 },
    { date: '2024-01-15', weight: 71.5, bodyFat: 17.5, muscleMass: 58.2 },
    { date: '2024-02-01', weight: 71, bodyFat: 17, muscleMass: 58.5 },
    { date: '2024-02-15', weight: 70.5, bodyFat: 16.5, muscleMass: 58.8 }
  ];

  const caloriesBurned = [
    { date: 'Mon', calories: 320 },
    { date: 'Tue', calories: 280 },
    { date: 'Wed', calories: 450 },
    { date: 'Thu', calories: 380 },
    { date: 'Fri', calories: 420 },
    { date: 'Sat', calories: 0 },
    { date: 'Sun', calories: 350 }
  ];

  const latestBodyComp = bodyComposition[bodyComposition.length - 1];
  const previousBodyComp = bodyComposition[bodyComposition.length - 2];
  
  const weightChange = latestBodyComp.weight - previousBodyComp.weight;
  const bodyFatChange = latestBodyComp.bodyFat - previousBodyComp.bodyFat;

  const weeklyCaloriesData = [
    { name: 'Fat', value: Math.floor(weeklyStats.totalCalories * 0.7), color: '#ef4444' },
    { name: 'Carbs', value: Math.floor(weeklyStats.totalCalories * 0.3), color: '#3b82f6' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Progress</h1>
          <p className="text-muted-foreground">
            Track your fitness journey and see your improvements over time
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            This Week
          </Button>
          <Button variant="outline">Export Data</Button>
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workouts</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyStats.workouts}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +2 from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calories</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyStats.totalCalories}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +185 from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workout Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyStats.totalDuration}m</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +25m from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Heart Rate</CardTitle>
            <Target className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyStats.avgHeartRate}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 text-red-500" />
              -3 from last week
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis yAxisId="calories" orientation="left" />
                  <YAxis yAxisId="duration" orientation="right" />
                  <Tooltip />
                  <Line 
                    yAxisId="calories"
                    type="monotone" 
                    dataKey="calories" 
                    stroke="hsl(var(--chart-1))" 
                    strokeWidth={2}
                    name="Calories"
                  />
                  <Line 
                    yAxisId="duration"
                    type="monotone" 
                    dataKey="duration" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    name="Duration (min)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Daily Calories */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Calories Burned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={caloriesBurned}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="calories" 
                    fill="hsl(var(--chart-1))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Body Composition */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Body Composition Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bodyComposition}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="hsl(var(--chart-1))" 
                    strokeWidth={2}
                    name="Weight (kg)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bodyFat" 
                    stroke="hsl(var(--chart-4))" 
                    strokeWidth={2}
                    name="Body Fat %"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="muscleMass" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    name="Muscle Mass (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Current Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Current Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Weight</span>
                <div className="flex items-center gap-1">
                  <span className="font-bold">{latestBodyComp.weight} kg</span>
                  <Badge variant={weightChange < 0 ? "default" : "destructive"} className="text-xs">
                    {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Body Fat</span>
                <div className="flex items-center gap-1">
                  <span className="font-bold">{latestBodyComp.bodyFat}%</span>
                  <Badge variant={bodyFatChange < 0 ? "default" : "destructive"} className="text-xs">
                    {bodyFatChange > 0 ? '+' : ''}{bodyFatChange.toFixed(1)}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Muscle Mass</span>
                <span className="font-bold">{latestBodyComp.muscleMass} kg</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">BMI</span>
                <span className="font-bold">24.2</span>
              </div>
            </div>

            {/* Calorie Breakdown */}
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Weekly Calorie Breakdown</h4>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={weeklyCaloriesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      dataKey="value"
                    >
                      {weeklyCaloriesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded" />
                  <span>Fat ({weeklyCaloriesData[0].value} cal)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded" />
                  <span>Carbs ({weeklyCaloriesData[1].value} cal)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Analytics