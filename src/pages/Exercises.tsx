import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { getAllExercises } from "@/lib/database"
import { Exercise } from "@/types"
import { 
  Search, 
  Filter, 
  Target, 
  Play,
  BookOpen,
  Dumbbell
} from "lucide-react"

const Exercises = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null)
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null)
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])

  useEffect(() => {
    const allExercises = getAllExercises()
    setExercises(allExercises)
  }, [])

  const muscleGroups = ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'cardio']
  const equipmentTypes = ['bodyweight', 'dumbbells', 'barbell', 'machine', 'cable', 'other']

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMuscle = !selectedMuscle || exercise.category.toLowerCase() === selectedMuscle.toLowerCase()
    const matchesEquipment = !selectedEquipment || exercise.category.toLowerCase().includes(selectedEquipment.toLowerCase())

    return matchesSearch && matchesMuscle && matchesEquipment
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "text-green-600 bg-green-100 dark:bg-green-900/20"
      case "intermediate": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
      case "advanced": return "text-red-600 bg-red-100 dark:bg-red-900/20"
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-900/20"
    }
  }

  const selectedExerciseData = exercises.find(ex => ex.id === selectedExercise)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Exercise Library</h1>
          <p className="text-muted-foreground">
            Discover exercises and learn proper form for maximum results
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Muscle Group Filter */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Target Muscles
            </h4>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedMuscle === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMuscle(null)}
              >
                All
              </Button>
              {muscleGroups.map(muscle => (
                <Button
                  key={muscle}
                  variant={selectedMuscle === muscle ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMuscle(muscle === selectedMuscle ? null : muscle)}
                >
                  {muscle.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>

          {/* Equipment Filter */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              Equipment
            </h4>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedEquipment === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedEquipment(null)}
              >
                All
              </Button>
              {equipmentTypes.map(equipment => (
                <Button
                  key={equipment}
                  variant={selectedEquipment === equipment ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedEquipment(equipment === selectedEquipment ? null : equipment)}
                >
                  {equipment.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exercise List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredExercises.map(exercise => (
            <Card 
              key={exercise.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedExercise === exercise.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedExercise(
                selectedExercise === exercise.id ? null : exercise.id
              )}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{exercise.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getDifficultyColor(exercise.difficulty)}>
                        {exercise.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        {exercise.category}
                      </Badge>
                      <Badge variant="secondary">
                        {exercise.equipment.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <img 
                    src={exercise.image} 
                    alt={exercise.name}
                    className="w-16 h-16 rounded-lg object-cover bg-muted"
                  />
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Target Muscles:</span>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {exercise.targetMuscles.map(muscle => (
                        <Badge key={muscle} variant="outline" className="text-xs">
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedExercise === exercise.id && (
                    <div className="border-t pt-3 space-y-3">
                      <div>
                        <h4 className="font-medium mb-2">Instructions:</h4>
                        <ol className="text-sm space-y-1">
                          {exercise.instructions.map((instruction, index) => (
                            <li key={index} className="flex gap-2">
                              <span className="text-primary font-medium">{index + 1}.</span>
                              <span>{instruction}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Play className="mr-2 h-4 w-4" />
                          Start Exercise
                        </Button>
                        <Button size="sm" variant="outline">
                          <BookOpen className="mr-2 h-4 w-4" />
                          View Demo
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredExercises.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No exercises found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Exercise Details Sidebar */}
        <div className="space-y-4">
          {selectedExerciseData ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedExerciseData.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <img 
                  src={selectedExerciseData.image} 
                  alt={selectedExerciseData.name}
                  className="w-full h-40 rounded-lg object-cover bg-muted"
                />
                
                <div>
                  <h4 className="font-medium mb-2">Quick Info</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Difficulty:</span>
                      <Badge className={getDifficultyColor(selectedExerciseData.difficulty)}>
                        {selectedExerciseData.difficulty}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Category:</span>
                      <span>{selectedExerciseData.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Equipment:</span>
                      <span>{selectedExerciseData.equipment.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Target Muscles</h4>
                  <div className="flex gap-1 flex-wrap">
                    {selectedExerciseData.targetMuscles.map(muscle => (
                      <Badge key={muscle} variant="secondary" className="text-xs">
                        {muscle}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  Add to Workout
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select an Exercise</h3>
                <p className="text-muted-foreground">
                  Click on any exercise to view detailed instructions and tips.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default Exercises