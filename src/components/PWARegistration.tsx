import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

export function PWARegistration() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true);
      },
      onOfflineReady() {
        setOfflineReady(true);
      },
    });

    // Auto hide the refresh notification after 5 seconds
    if (offlineReady) {
      const timer = setTimeout(() => setOfflineReady(false), 5000);
      return () => clearTimeout(timer);
    }

    // Auto hide the need refresh notification after 10 seconds
    if (needRefresh) {
      const timer = setTimeout(() => setNeedRefresh(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [needRefresh, offlineReady]);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  const refresh = () => {
    window.location.reload();
  };

  return (
    <>
      {(offlineReady || needRefresh) && (
        <div className="fixed bottom-4 right-4 z-50 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          {offlineReady && (
            <div className="flex items-center gap-2">
              <span>App ready to work offline</span>
              <button 
                onClick={close}
                className="ml-4 px-2 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded"
              >
                Close
              </button>
            </div>
          )}
          {needRefresh && (
            <div className="flex items-center gap-2">
              <span>New content available, click on reload button to update.</span>
              <button 
                onClick={refresh}
                className="ml-4 px-2 py-1 text-sm bg-blue-500 text-white rounded"
              >
                Reload
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}