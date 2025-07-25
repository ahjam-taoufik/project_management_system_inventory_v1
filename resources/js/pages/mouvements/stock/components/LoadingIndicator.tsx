"use client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";

interface PageProps {
  processing?: boolean;
  [key: string]: unknown;
}

export function LoadingIndicator() {
  const processing = (usePage().props as PageProps)?.processing ?? false;
  const [isLoading, setIsLoading] = useState(false);

  // Détecte si la page est en cours de traitement
  useEffect(() => {
    setIsLoading(processing);

    // Événements pour détecter le début et la fin du chargement
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    document.addEventListener("inertia:start", handleStart);
    document.addEventListener("inertia:finish", handleComplete);

    return () => {
      document.removeEventListener("inertia:start", handleStart);
      document.removeEventListener("inertia:finish", handleComplete);
    };
  }, [processing]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-full shadow-md">
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      <span className="text-sm font-medium">Chargement...</span>
    </div>
  );
}
