"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Button from "./components/ui/Button";
import { useTheme } from "./contexts/ThemeContext";

export default function Home() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading resources
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    router.push("/designer");
  };

  return (
    <main className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">
            Tailornova
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </Button>
          <Button variant="primary" onClick={handleGetStarted}>
            Get Started
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg">Loading resources...</p>
          </div>
        ) : (
          <div className="max-w-2xl flex flex-col gap-6">
            <h1 className="text-4xl font-bold">Design Your Dream Clothing</h1>
            <p className="text-xl">
              Create custom clothing designs with our intuitive interface.
              Choose from various styles, materials, and details to bring your
              vision to life.
            </p>
            <div className="flex gap-4 justify-center mt-4">
              <Button variant="primary" size="lg" onClick={handleGetStarted}>
                Start Designing
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        )}
      </div>

      <footer className="p-4 text-center border-t border-[var(--color-border)] text-sm text-[var(--color-text-light)]">
        &copy; {new Date().getFullYear()} Tailornova Clone. All rights reserved.
      </footer>
    </main>
  );
}
