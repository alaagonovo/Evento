"use client";

import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type InstallPromptProps = {
  installLabel: string;
  dismissLabel: string;
};

export function InstallPrompt({ installLabel, dismissLabel }: InstallPromptProps) {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(
    null,
  );

  useEffect(() => {
    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  if (!installEvent) {
    return null;
  }

  async function install() {
    if (!installEvent) {
      return;
    }

    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-[min(32rem,calc(100%-2rem))] items-center justify-between gap-3 rounded-xl border bg-card p-3 text-card-foreground shadow-lg">
      <p className="text-sm font-medium">{installLabel}</p>
      <div className="flex gap-2">
        <Button type="button" size="sm" variant="ghost" onClick={() => setInstallEvent(null)}>
          {dismissLabel}
        </Button>
        <Button type="button" size="sm" onClick={install}>
          {installLabel}
        </Button>
      </div>
    </div>
  );
}
