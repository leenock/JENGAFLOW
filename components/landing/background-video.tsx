"use client";

import { useEffect, useRef } from "react";

type BackgroundVideoProps = {
  src: string;
  active?: boolean;
  className?: string;
};

export function BackgroundVideo({
  src,
  active = true,
  className = "",
}: BackgroundVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (active) {
      const play = video.play();
      if (play) play.catch(() => undefined);
    } else {
      video.pause();
    }
  }, [active, src]);

  return (
    <video
      ref={ref}
      className={`landing-video ${className}`}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
    />
  );
}
