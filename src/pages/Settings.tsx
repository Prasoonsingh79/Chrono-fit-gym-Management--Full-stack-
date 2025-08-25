import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ThemeProvider";
import { useAuthStore } from "@/stores/authStore";
import { notificationService } from "@/lib/notifications";
import { updateUser, updateUserSettings } from "@/lib/database";
import { 
  User, 
  Bell, 
  Palette, 
  Target, 
  TestTube,
  Clock,
  Plus,
  X,
  Save
} from 'lucide-react';

const Settings = () => {
  const { user, settings, updateSettings } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    age: user?.age || '',
    weight: user?.weight || '',
    height: user?.height || '',
    fitnessGoal: user?.fitnessGoal || 'maintenance'
  });

  // App settings
  const [appSettings, setAppSettings] = useState({
    theme: settings?.theme || 'system',
    notificationsEnabled: settings?.notificationsEnabled || false,
    workoutReminders: settings?.workoutReminders || false,
    hydrationReminders: settings?.hydrationReminders || false,
    hydrationReminderInterval: settings?.hydrationReminderInterval || 60,
    weeklyGoal: settings?.weeklyGoal || 3,
    dailyCalorieGoal: settings?.dailyCalorieGoal || 400
  });

  // Workout reminder times
  const [reminderTimes, setReminderTimes] = useState<string[]>(
    settings?.workoutReminderTimes || ['09:00', '18:00']
  );
  const [newReminderTime, setNewReminderTime] = useState('');

  useEffect(() => {
    // Initialize notification service
    notificationService.initialize();
  }, []);

  const handleProfileSave = async () => {
    if (!user) return;

    try {
      const updatedUser = updateUser(user.id, {
        name: profileData.name,
        age: profileData.age ? parseInt(String(profileData.age)) : undefined,
        weight: profileData.weight ? parseFloat(String(profileData.weight)) : undefined,
        height: profileData.height ? parseFloat(String(profileData.height)) : undefined,
        fitnessGoal: profileData.fitnessGoal as 'weight_loss' | 'muscle_gain' | 'endurance' | 'maintenance'
      });

      if (updatedUser) {
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been saved successfully.'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile.',
        variant: 'destructive'
      });
    }
  };

  const handleSettingsSave = async () => {
    if (!user) return;

    try {
      const updatedSettings = updateUserSettings(user.id, {
        ...appSettings,
        workoutReminderTimes: reminderTimes
      });

      if (updatedSettings) {
        updateSettings(updatedSettings);

        // Request notification permission if enabling notifications
        if (appSettings.notificationsEnabled) {
          await notificationService.requestPermission();
        }

        // Set up hydration reminders if enabled
        if (appSettings.hydrationReminders) {
          notificationService.scheduleHydrationReminder(appSettings.hydrationReminderInterval);
        }

        toast({
          title: 'Settings Updated',
          description: 'Your preferences have been saved successfully.'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update settings.',
        variant: 'destructive'
      });
    }
  };

  const addReminderTime = () => {
    if (newReminderTime && !reminderTimes.includes(newReminderTime)) {
      setReminderTimes([...reminderTimes, newReminderTime]);
      setNewReminderTime('');
    }
  };

  const removeReminderTime = (time: string) => {
    setReminderTimes(reminderTimes.filter(t => t !== time));
  };

  const testNotification = async () => {
    try {
      await notificationService.showNotification({
        title: '🏋️ Test Notification',
        body: 'Notifications are working correctly!'
      });
    } catch (error) {
      toast({
        title: 'Notification Error',
        description: 'Please enable notifications in your browser settings.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Goals
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and fitness details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profileData.age}
                    onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={profileData.weight}
                    onChange={(e) => setProfileData({ ...profileData, weight: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={profileData.height}
                    onChange={(e) => setProfileData({ ...profileData, height: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fitnessGoal">Primary Fitness Goal</Label>
                <Select
                  value={profileData.fitnessGoal}
                  onValueChange={(value: 'weight_loss' | 'muscle_gain' | 'endurance' | 'maintenance') => setProfileData({ ...profileData, fitnessGoal: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight_loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                    <SelectItem value="endurance">Endurance</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleProfileSave} className="w-full md:w-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure when and how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow the app to send you notifications
                  </p>
                </div>
                <Switch
                  checked={appSettings.notificationsEnabled}
                  onCheckedChange={(checked) => 
                    setAppSettings({ ...appSettings, notificationsEnabled: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Workout Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminded about scheduled workouts
                  </p>
                </div>
                <Switch
                  checked={appSettings.workoutReminders}
                  onCheckedChange={(checked) => 
                    setAppSettings({ ...appSettings, workoutReminders: checked })
                  }
                  disabled={!appSettings.notificationsEnabled}
                />
              </div>

              {appSettings.workoutReminders && (
                <div className="space-y-4 ml-4 p-4 border rounded-lg">
                  <Label>Reminder Times</Label>
                  <div className="flex flex-wrap gap-2">
                    {reminderTimes.map((time) => (
                      <Badge key={time} variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {time}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => removeReminderTime(time)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="time"
                      value={newReminderTime}
                      onChange={(e) => setNewReminderTime(e.target.value)}
                      className="w-32"
                    />
                    <Button size="sm" onClick={addReminderTime}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Hydration Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminded to stay hydrated
                  </p>
                </div>
                <Switch
                  checked={appSettings.hydrationReminders}
                  onCheckedChange={(checked) => 
                    setAppSettings({ ...appSettings, hydrationReminders: checked })
                  }
                  disabled={!appSettings.notificationsEnabled}
                />
              </div>

              {appSettings.hydrationReminders && (
                <div className="space-y-2 ml-4">
                  <Label htmlFor="hydrationInterval">Reminder Interval (minutes)</Label>
                  <Input
                    id="hydrationInterval"
                    type="number"
                    min="15"
                    max="240"
                    value={appSettings.hydrationReminderInterval}
                    onChange={(e) => 
                      setAppSettings({ 
                        ...appSettings, 
                        hydrationReminderInterval: parseInt(e.target.value) 
                      })
                    }
                    className="w-32"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleSettingsSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
                <Button variant="outline" onClick={testNotification}>
                  Test Notification
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the app looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select
                  value={appSettings.theme}
                  onValueChange={(value) => setAppSettings({ ...appSettings, theme: value as any })}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred color scheme
                </p>
              </div>

              <Button onClick={handleSettingsSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Appearance
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals Settings */}
        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Fitness Goals</CardTitle>
              <CardDescription>
                Set your weekly and daily targets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weeklyGoal">Weekly Workout Goal</Label>
                  <Input
                    id="weeklyGoal"
                    type="number"
                    min="1"
                    max="7"
                    value={appSettings.weeklyGoal}
                    onChange={(e) => 
                      setAppSettings({ 
                        ...appSettings, 
                        weeklyGoal: parseInt(e.target.value) 
                      })
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Number of workouts per week
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calorieGoal">Daily Calorie Goal</Label>
                  <Input
                    id="calorieGoal"
                    type="number"
                    min="100"
                    max="2000"
                    value={appSettings.dailyCalorieGoal}
                    onChange={(e) => 
                      setAppSettings({ 
                        ...appSettings, 
                        dailyCalorieGoal: parseInt(e.target.value) 
                      })
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Calories to burn per day
                  </p>
                </div>
              </div>

              <Button onClick={handleSettingsSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Goals
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
