import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { 
  User, 
  Settings, 
  Target, 
  Award,
  Camera,
  Save,
  Edit3
} from "lucide-react"
import { useAuthStore } from "@/stores/authStore";

const Profile = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || 'Demo User',
    email: user?.email || 'demo@chronofit.com',
    age: user?.age || 28,
    weight: user?.weight || 70,
    height: user?.height || 175,
    fitnessLevel: 'intermediate',
    goals: ['muscle_gain', 'improve_endurance']
  })

  const handleSave = () => {
    // Here you would save to the database
    setIsEditing(false)
  }

  const achievements = [
    { id: 1, title: "First Workout", description: "Completed your first workout session", earned: true },
    { id: 2, title: "Week Warrior", description: "Worked out 5 times in one week", earned: true },
    { id: 3, title: "Calorie Crusher", description: "Burned 500+ calories in a single session", earned: false },
    { id: 4, title: "Month Master", description: "Completed 20 workouts in one month", earned: false },
    { id: 5, title: "Consistency King", description: "30-day workout streak", earned: false }
  ]

  const fitnessGoals = [
    "lose_weight",
    "build_muscle", 
    "improve_endurance",
    "increase_strength",
    "maintain_health",
    "improve_flexibility"
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and fitness goals
          </p>
        </div>
        <Button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={isEditing ? "bg-primary hover:bg-primary/90" : ""}
        >
          {isEditing ? (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          ) : (
            <>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder.svg" alt={formData.name} />
                  <AvatarFallback>{formData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="icon"
                    variant="outline" 
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium">{formData.name}</h3>
                <p className="text-muted-foreground">{formData.email}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: parseInt(e.target.value)})}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="fitness-level">Fitness Level</Label>
                <select
                  id="fitness-level"
                  value={formData.fitnessLevel}
                  onChange={(e) => setFormData({...formData, fitnessLevel: e.target.value})}
                  disabled={!isEditing}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Body Metrics */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Body Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-lg font-bold">24.2</div>
                  <div className="text-sm text-muted-foreground">BMI</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-lg font-bold">16.5%</div>
                  <div className="text-sm text-muted-foreground">Body Fat</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-lg font-bold">64.9 kg</div>
                  <div className="text-sm text-muted-foreground">Muscle Mass</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-lg font-bold">Normal</div>
                  <div className="text-sm text-muted-foreground">BMI Category</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fitness Goals & Achievements */}
        <div className="space-y-6">
          {/* Fitness Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Fitness Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {fitnessGoals.map(goal => (
                  <div key={goal} className="flex items-center justify-between">
                    <span className="text-sm capitalize">
                      {goal.replace('_', ' ')}
                    </span>
                    <Badge 
                      variant={formData.goals.includes(goal) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        if (!isEditing) return
                        const newGoals = formData.goals.includes(goal)
                          ? formData.goals.filter(g => g !== goal)
                          : [...formData.goals, goal]
                        setFormData({...formData, goals: newGoals})
                      }}
                    >
                      {formData.goals.includes(goal) ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.map(achievement => (
                  <div 
                    key={achievement.id}
                    className={`p-3 rounded-lg border ${
                      achievement.earned 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`font-medium text-sm ${
                          achievement.earned ? 'text-primary' : 'text-muted-foreground'
                        }`}>
                          {achievement.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.earned && (
                        <Award className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile