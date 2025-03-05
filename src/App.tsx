import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './components/ThemeContext';
import ErrorBoundary from './components/ErroeBoundary';
import Weather from './components/Weather';
import "./components/Weather.css";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => void;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const App: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        if ("serviceWorker" in navigator) {
            window.addEventListener("load", () => {
                navigator.serviceWorker
                    .register("/service-worker.js")
                    .then((reg) => console.log("Service Worker Registered:", reg))
                    .catch((err) => console.log(" Service Worker Registration Failed:", err));
            });
        }

        const handleBeforeInstallPrompt = (event: Event) => {
            event.preventDefault();
            setDeferredPrompt(event as BeforeInstallPromptEvent);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choice: { outcome: "accepted" | "dismissed" }) => {
                if (choice.outcome === "accepted") {
                    console.log("✅ User installed the app");
                }
                setDeferredPrompt(null);
            });
        }
    };

    return (
        <ThemeProvider>
            <ErrorBoundary>
                <div className="install">
                    <h1>Weather App</h1>
                    {deferredPrompt && (
                        <button className="instal" onClick={handleInstallClick}>
                            Install App
                        </button>
                    )}
                    <Weather />
                </div>
            </ErrorBoundary>
        </ThemeProvider>
    );
};

export default App;
