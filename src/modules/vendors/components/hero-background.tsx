"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type HeroBackgroundProps = {
  src: string;
  poster: string;
};

export function HeroBackground({ src, poster }: HeroBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      video.muted = true;
      if (motion.matches) {
        video.pause();
        return;
      }
      void video.play().catch(() => undefined);
    };

    const startWhenVisible = () => {
      syncPlayback();
      motion.addEventListener("change", syncPlayback);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        startWhenVisible();
        observer.disconnect();
      },
      { rootMargin: "200px" },
    );
    observer.observe(video);

    return () => {
      observer.disconnect();
      motion.removeEventListener("change", syncPlayback);
    };
  }, []);

  return (
    <>
      <Image
        src={poster}
        alt=""
        fill
        sizes="100vw"
        loading="lazy"
        className="object-cover"
      />
      <video
        ref={videoRef}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
      >
        <source src={src} type="video/mp4" />
      </video>
    </>
  );
}
