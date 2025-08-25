// Push notification service
interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

class NotificationService {
  private registration: ServiceWorkerRegistration | null = null;

  async initialize(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications not supported');
      return false;
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered');
      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported');
    }

    let permission = Notification.permission;

    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }

    return permission;
  }

  async showNotification(options: NotificationOptions): Promise<void> {
    const permission = await this.requestPermission();
    
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }

    if (this.registration) {
      await this.registration.showNotification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        badge: options.badge || '/favicon.ico',
        tag: options.tag,
        data: options.data,
        actions: options.actions,
        requireInteraction: true,
        vibrate: [200, 100, 200]
      });
    } else {
      // Fallback to regular notification
      new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        tag: options.tag,
        data: options.data
      });
    }
  }

  async scheduleWorkoutReminder(workoutName: string, time: Date): Promise<void> {
    const now = new Date();
    const delay = time.getTime() - now.getTime();

    if (delay > 0) {
      setTimeout(() => {
        this.showNotification({
          title: '🏋️ Workout Reminder',
          body: `Time for your ${workoutName} workout!`,
          tag: 'workout-reminder',
          data: { type: 'workout', workoutName },
          actions: [
            { action: 'start', title: 'Start Workout' },
            { action: 'snooze', title: 'Snooze 10min' }
          ]
        });
      }, delay);
    }
  }

  async scheduleHydrationReminder(intervalMinutes: number): Promise<void> {
    const scheduleNext = () => {
      setTimeout(() => {
        this.showNotification({
          title: '💧 Hydration Reminder',
          body: 'Time to drink some water! Stay hydrated!',
          tag: 'hydration-reminder',
          data: { type: 'hydration' },
          actions: [
            { action: 'done', title: 'Done' },
            { action: 'snooze', title: 'Remind later' }
          ]
        });
        scheduleNext(); // Schedule the next one
      }, intervalMinutes * 60 * 1000);
    };

    scheduleNext();
  }

  async showAchievementNotification(achievementName: string, description: string): Promise<void> {
    await this.showNotification({
      title: '🏆 Achievement Unlocked!',
      body: `${achievementName}: ${description}`,
      tag: 'achievement',
      data: { type: 'achievement', achievementName }
    });
  }

  async showGoalReachedNotification(goalType: string, value: number): Promise<void> {
    await this.showNotification({
      title: '🎯 Goal Reached!',
      body: `Congratulations! You've reached your ${goalType} goal of ${value}!`,
      tag: 'goal-reached',
      data: { type: 'goal', goalType, value }
    });
  }
}

export const notificationService = new NotificationService();

// Service Worker code (to be placed in public/sw.js)
export const serviceWorkerCode = `
self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/favicon.ico'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('ChronoFit Sync', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'start') {
    event.waitUntil(
      clients.openWindow('/workout')
    );
  }
});

self.addEventListener('notificationclose', function(event) {
  console.log('Notification was closed', event);
});
`;
