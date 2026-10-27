import { useEffect, useState } from 'react';
interface InstallEvent extends Event { prompt(): Promise<void>; userChoice: Promise<{ outcome: string }> }
export function usePwa() {
  const [offline, setOffline] = useState(!navigator.onLine);
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [install, setInstall] = useState<InstallEvent | null>(null);
  const [installMessage, setInstallMessage] = useState('');
  useEffect(() => {
    const online = () => setOffline(false), offline = () => setOffline(true);
    const prompt = (event: Event) => { event.preventDefault(); setInstall(event as InstallEvent); };
    const installed = () => { setInstall(null); setInstallMessage('Installation completed.'); };
    window.addEventListener('online', online); window.addEventListener('offline', offline);
    window.addEventListener('beforeinstallprompt', prompt); window.addEventListener('appinstalled', installed);
    let active = true;
    if (import.meta.env.PROD && 'serviceWorker' in navigator) {
      void navigator.serviceWorker.register('/sw.js').then(registration => {
        if (!active) return;
        if (registration.waiting) setWaiting(registration.waiting);
        registration.addEventListener('updatefound', () => {
          const worker = registration.installing;
          worker?.addEventListener('statechange', () => {
            if (active && worker.state === 'installed' && navigator.serviceWorker.controller) setWaiting(worker);
          });
        });
      }).catch(() => { if (active) setInstallMessage('Offline support could not start. You can keep using the browser.'); });
    }
    return () => { active = false; window.removeEventListener('online', online); window.removeEventListener('offline', offline); window.removeEventListener('beforeinstallprompt', prompt); window.removeEventListener('appinstalled', installed); };
  }, []);
  return { offline, waiting, install, installMessage,
    requestInstall: async () => { if (!install) return; await install.prompt(); const choice = await install.userChoice; setInstallMessage(choice.outcome === 'accepted' ? 'Installation requested. Your browser will finish the process.' : 'You can install later from your browser menu.'); setInstall(null); },
    update: () => { navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload(), { once: true }); waiting?.postMessage({ type: 'ACTIVATE_UPDATE' }); },
  };
}
