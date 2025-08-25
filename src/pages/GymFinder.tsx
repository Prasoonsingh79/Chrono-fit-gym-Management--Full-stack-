import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { getAllGyms, getNearbyGyms } from "@/lib/database"
import { Gym } from "@/types"
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Star, 
  Users, 
  Dumbbell,
  Filter,
  Search,
  Loader2
} from "lucide-react"

const GymFinder = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGym, setSelectedGym] = useState<string | null>(null)
  const [gyms, setGyms] = useState<Gym[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadGyms()
  }, [])

  const loadGyms = () => {
    const allGyms = getAllGyms()
    setGyms(allGyms)
  }

  const handleNearMe = () => {
    setIsLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          const nearbyGyms = getNearbyGyms(latitude, longitude, 10)
          setGyms(nearbyGyms)
          setIsLoading(false)
          toast({
            title: "Location Found",
            description: `Found ${nearbyGyms.length} gyms within 10km`
          })
        },
        (error) => {
          setIsLoading(false)
          toast({
            title: "Location Error",
            description: "Unable to get your location. Please enable location services.",
            variant: "destructive"
          })
        }
      )
    } else {
      setIsLoading(false)
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive"
      })
    }
  }

  const filteredGyms = gyms.filter(gym =>
    gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gym.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getBusyLevelColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-500"
      case "moderate": return "bg-yellow-500"
      case "high": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getBusyLevelVariant = (level: string) => {
    switch (level) {
      case "low": return "default"
      case "moderate": return "secondary"
      case "high": return "destructive"
      default: return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Find Gyms</h1>
          <p className="text-muted-foreground">
            Discover nearby gyms and check real-time availability
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search gyms by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" onClick={handleNearMe} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="mr-2 h-4 w-4" />
              )}
              Near Me
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gym List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGyms.map((gym) => (
          <Card 
            key={gym.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedGym === gym.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedGym(selectedGym === gym.id ? null : gym.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{gym.name}</CardTitle>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{gym.address}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{gym.rating}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {gym.distance} km away
                    </div>
                  </div>
                </div>
                <Badge variant={getBusyLevelVariant(gym.busyLevel)}>
                  {gym.busyLevel}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Capacity */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Current Capacity
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {gym.currentCapacity}/{gym.maxCapacity}
                  </span>
                </div>
                <Progress 
                  value={(gym.currentCapacity / gym.maxCapacity) * 100}
                  className="h-2"
                />
              </div>

              {/* Equipment Availability */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Dumbbell className="h-4 w-4" />
                    Equipment Available
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {gym.equipment.available}/{gym.equipment.total}
                  </span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {gym.equipment.popular.map(equipment => (
                    <Badge key={equipment} variant="outline" className="text-xs">
                      {equipment.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Expanded Details */}
              {selectedGym === gym.id && (
                <div className="border-t pt-4 space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Popular Equipment</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>Treadmills:</span>
                        <span className="text-green-600">Available</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bench Press:</span>
                        <span className="text-yellow-600">2 min wait</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Squat Racks:</span>
                        <span className="text-green-600">Available</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cable Machines:</span>
                        <span className="text-red-600">5 min wait</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Peak Hours</h4>
                    <div className="text-sm text-muted-foreground">
                      Busiest: 6:00-8:00 AM, 5:00-7:00 PM
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Quietest: 10:00 AM-3:00 PM, 9:00-11:00 PM
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Navigation className="mr-2 h-4 w-4" />
                      Get Directions
                    </Button>
                    <Button variant="outline">
                      <Clock className="mr-2 h-4 w-4" />
                      Reserve Equipment
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGyms.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No gyms found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or location filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default GymFinder