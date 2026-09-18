"use client";

import { useCallback, useEffect, useState } from "react";

let audioContext: AudioContext | null = null;
const muteKey = "cafesite-order-sound-muted";

export function useOrderSound(): { muted: boolean; toggleMuted: () => void; unlock: () => Promise<void>; play: () => void } {
  const [muted, setMuted] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => setMuted(window.localStorage.getItem(muteKey) === "true"), 0); return () => window.clearTimeout(timer); }, []);
  const unlock = useCallback(async (): Promise<void> => {
    audioContext ??= new AudioContext();
    if (audioContext.state === "suspended") await audioContext.resume();
  }, []);
  const play = useCallback((): void => {
    if (window.localStorage.getItem(muteKey) === "true") return;
    audioContext ??= new AudioContext();
    if (audioContext.state !== "running") return;
    const start = audioContext.currentTime;
    [880, 660].forEach((frequency, index) => {
      const oscillator = audioContext!.createOscillator();
      const gain = audioContext!.createGain();
      const at = start + index * 0.16;
      oscillator.type = "sine"; oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, at); gain.gain.linearRampToValueAtTime(0.12, at + 0.02); gain.gain.exponentialRampToValueAtTime(0.001, at + 0.14);
      oscillator.connect(gain); gain.connect(audioContext!.destination); oscillator.start(at); oscillator.stop(at + 0.15);
    });
  }, []);
  const toggleMuted = useCallback((): void => { setMuted((current) => { const next = !current; window.localStorage.setItem(muteKey, String(next)); return next; }); }, []);
  return { muted, toggleMuted, unlock, play };
}
