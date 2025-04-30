import { useState, useEffect } from 'react';

// Define BeforeInstallPromptEvent since it's not in the standard TypeScript types
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Store the event for later use
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    await installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Clear the saved prompt since it can't be used again
    setInstallPrompt(null);
    setIsVisible(false);
  };

  const dismissPrompt = () => {
    setIsVisible(false);
    // Save to localStorage to prevent showing again for some time
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  };

  // Check if prompt was recently dismissed
  useEffect(() => {
    const dismissedTime = localStorage.getItem('installPromptDismissed');
    if (dismissedTime) {
      const dismissedDate = new Date(parseInt(dismissedTime));
      const now = new Date();
      // If it's been less than 7 days since dismissal, don't show
      if ((now.getTime() - dismissedDate.getTime()) < 7 * 24 * 60 * 60 * 1000) {
        setIsVisible(false);
      }
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-sm">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <img src="/logo192.png" alt="App logo" className="w-12 h-12 rounded" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 dark:text-white">Install Our App</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Install this app on your device for quick and easy access.
          </p>
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <button 
          onClick={dismissPrompt}
          className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Not now
        </button>
        <button 
          onClick={handleInstallClick}
          className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Install
        </button>
      </div>
    </div>
  );
}