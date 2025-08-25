import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';
import { 
  createWorkoutSchedule, 
  getUserWorkoutSchedules, 
  updateWorkoutSchedule, 
  deleteWorkoutSchedule,
  getAllExercises 
} from '@/lib/database';
import { notificationService } from '@/lib/notifications';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Bell,
  Target,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { WorkoutSchedule, Exercise } from '@/types';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday', short: 'Sun' },
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' }
];

const WORKOUT_TYPES = [
  'Strength Training',
  'Cardio',
  'HIIT',
  'Yoga',
  'Pilates',
  'Running',
  'Cycling',
  'Swimming',
  'CrossFit',
  'Flexibility'
];

const WorkoutScheduler = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  
  const [schedules, setSchedules] = useState<WorkoutSchedule[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<WorkoutSchedule | null>(null);
  
  const [formData, setFormData] = useState({
    dayOfWeek: 1,
    time: '09:00',
    workoutType: '',
    exercises: [] as string[],
    reminderEnabled: true
  });

  useEffect(() => {
    if (user) {
      loadSchedules();
      loadExercises();
    }
  }, [user]);

  const loadSchedules = () => {
    if (user) {
      const userSchedules = getUserWorkoutSchedules(user.id);
      setSchedules(userSchedules);
    }
  };

  const loadExercises = () => {
    const allExercises = getAllExercises();
    setExercises(allExercises);
  };

  const resetForm = () => {
    setFormData({
      dayOfWeek: 1,
      time: '09:00',
      workoutType: '',
      exercises: [],
      reminderEnabled: true
    });
    setEditingSchedule(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingSchedule) {
        // Update existing schedule
        const updated = updateWorkoutSchedule(editingSchedule.id, {
          dayOfWeek: formData.dayOfWeek,
          time: formData.time,
          workoutType: formData.workoutType,
          exercises: formData.exercises,
          reminderEnabled: formData.reminderEnabled,
          isActive: true
        });

        if (updated) {
          toast({
            title: 'Schedule Updated',
            description: 'Your workout schedule has been updated successfully.'
          });
        }
      } else {
        // Create new schedule
        createWorkoutSchedule({
          userId: user.id,
          dayOfWeek: formData.dayOfWeek,
          time: formData.time,
          workoutType: formData.workoutType,
          exercises: formData.exercises,
          reminderEnabled: formData.reminderEnabled,
          isActive: true
        });

        toast({
          title: 'Schedule Created',
          description: 'Your workout schedule has been created successfully.'
        });
      }

      // Schedule notifications if enabled
      if (formData.reminderEnabled) {
        scheduleWorkoutReminders();
      }

      loadSchedules();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save workout schedule.',
        variant: 'destructive'
      });
    }
  };

  const scheduleWorkoutReminders = () => {
    // Calculate next occurrence of the scheduled day and time
    const now = new Date();
    const scheduledDay = formData.dayOfWeek;
    const [hours, minutes] = formData.time.split(':').map(Number);
    
    const nextWorkout = new Date();
    const currentDay = now.getDay();
    const daysUntilWorkout = (scheduledDay - currentDay + 7) % 7;
    
    nextWorkout.setDate(now.getDate() + daysUntilWorkout);
    nextWorkout.setHours(hours, minutes, 0, 0);
    
    // If the time has passed today and it's the same day, schedule for next week
    if (daysUntilWorkout === 0 && nextWorkout <= now) {
      nextWorkout.setDate(nextWorkout.getDate() + 7);
    }

    // Schedule reminder 15 minutes before workout
    const reminderTime = new Date(nextWorkout.getTime() - 15 * 60 * 1000);
    
    notificationService.scheduleWorkoutReminder(formData.workoutType, reminderTime);
  };

  const handleEdit = (schedule: WorkoutSchedule) => {
    setEditingSchedule(schedule);
    setFormData({
      dayOfWeek: schedule.dayOfWeek,
      time: schedule.time,
      workoutType: schedule.workoutType,
      exercises: schedule.exercises,
      reminderEnabled: schedule.reminderEnabled
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (scheduleId: string) => {
    const success = deleteWorkoutSchedule(scheduleId);
    if (success) {
      toast({
        title: 'Schedule Deleted',
        description: 'Workout schedule has been removed.'
      });
      loadSchedules();
    }
  };

  const toggleScheduleActive = async (schedule: WorkoutSchedule) => {
    const updated = updateWorkoutSchedule(schedule.id, {
      isActive: !schedule.isActive
    });

    if (updated) {
      toast({
        title: schedule.isActive ? 'Schedule Disabled' : 'Schedule Enabled',
        description: `Workout schedule has been ${schedule.isActive ? 'disabled' : 'enabled'}.`
      });
      loadSchedules();
    }
  };

  const getSchedulesForDay = (dayOfWeek: number) => {
    return schedules.filter(s => s.dayOfWeek === dayOfWeek && s.isActive);
  };

  const addExerciseToForm = (exerciseName: string) => {
    if (!formData.exercises.includes(exerciseName)) {
      setFormData({
        ...formData,
        exercises: [...formData.exercises, exerciseName]
      });
    }
  };

  const removeExerciseFromForm = (exerciseName: string) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter(e => e !== exerciseName)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workout Scheduler</h1>
          <p className="text-muted-foreground">
            Plan your weekly workout routine
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSchedule ? 'Edit Workout Schedule' : 'Create Workout Schedule'}
              </DialogTitle>
              <DialogDescription>
                Set up your weekly workout routine with custom exercises
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Day of Week</Label>
                  <Select
                    value={formData.dayOfWeek.toString()}
                    onValueChange={(value) => setFormData({ ...formData, dayOfWeek: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS_OF_WEEK.map(day => (
                        <SelectItem key={day.value} value={day.value.toString()}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Workout Type</Label>
                <Select
                  value={formData.workoutType}
                  onValueChange={(value) => setFormData({ ...formData, workoutType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select workout type" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORKOUT_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Exercises</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                  {exercises.map(exercise => (
                    <Button
                      key={exercise.id}
                      type="button"
                      variant={formData.exercises.includes(exercise.name) ? "default" : "outline"}
                      size="sm"
                      onClick={() => 
                        formData.exercises.includes(exercise.name)
                          ? removeExerciseFromForm(exercise.name)
                          : addExerciseToForm(exercise.name)
                      }
                      className="justify-start"
                    >
                      {exercise.name}
                    </Button>
                  ))}
                </div>
                
                {formData.exercises.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm">Selected Exercises:</Label>
                    <div className="flex flex-wrap gap-1">
                      {formData.exercises.map(exercise => (
                        <Badge key={exercise} variant="secondary" className="text-xs">
                          {exercise}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified 15 minutes before workout
                  </p>
                </div>
                <Switch
                  checked={formData.reminderEnabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, reminderEnabled: checked })}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Weekly Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Schedule
          </CardTitle>
          <CardDescription>
            Your planned workouts for the week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {DAYS_OF_WEEK.map(day => {
              const daySchedules = getSchedulesForDay(day.value);
              const today = new Date().getDay();
              const isToday = day.value === today;
              
              return (
                <div
                  key={day.value}
                  className={`p-4 border rounded-lg space-y-3 ${
                    isToday ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="text-center">
                    <h3 className={`font-semibold ${isToday ? 'text-primary' : ''}`}>
                      {day.short}
                    </h3>
                    {isToday && (
                      <Badge variant="default" className="text-xs mt-1">
                        Today
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {daySchedules.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground">No workouts</p>
                      </div>
                    ) : (
                      daySchedules.map(schedule => (
                        <div
                          key={schedule.id}
                          className="p-3 bg-card border rounded-lg space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm font-medium">{schedule.time}</span>
                            </div>
                            <div className="flex gap-1">
                              {schedule.reminderEnabled && (
                                <Bell className="h-3 w-3 text-primary" />
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={() => handleEdit(schedule)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                onClick={() => handleDelete(schedule.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium">{schedule.workoutType}</p>
                            {schedule.exercises.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {schedule.exercises.slice(0, 2).map(exercise => (
                                  <Badge key={exercise} variant="outline" className="text-xs">
                                    {exercise}
                                  </Badge>
                                ))}
                                {schedule.exercises.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{schedule.exercises.length - 2} more
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Switch
                              checked={schedule.isActive}
                              onCheckedChange={() => toggleScheduleActive(schedule)}
                            />
                            <span className="text-xs text-muted-foreground">
                              {schedule.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{schedules.filter(s => s.isActive).length}</p>
                <p className="text-sm text-muted-foreground">Active Schedules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {schedules.filter(s => s.reminderEnabled).length}
                </p>
                <p className="text-sm text-muted-foreground">With Reminders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {7 - new Set(schedules.filter(s => s.isActive).map(s => s.dayOfWeek)).size}
                </p>
                <p className="text-sm text-muted-foreground">Rest Days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkoutScheduler;
