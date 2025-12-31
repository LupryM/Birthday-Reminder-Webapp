"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Something went wrong!
        </h1>
        <p className="text-muted-foreground mb-6">
          We encountered an error. Please try again.
        </p>
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}
