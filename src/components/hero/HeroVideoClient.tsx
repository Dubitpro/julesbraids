"use client";

import { useRef, useEffect } from "react";

export function HeroVideoClient() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Enforce strict muted and inline playback for mobile & desktop autoplay policies
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const attemptPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If iOS Low Power Mode or strict browser policy restricts initial play,
          // play seamlessly upon the very first user touch or scroll
          const handleFirstTouch = () => {
            video.play().catch(() => {});
            window.removeEventListener("touchstart", handleFirstTouch);
            window.removeEventListener("scroll", handleFirstTouch);
            window.removeEventListener("click", handleFirstTouch);
          };
          window.addEventListener("touchstart", handleFirstTouch, { passive: true, once: true });
          window.addEventListener("scroll", handleFirstTouch, { passive: true, once: true });
          window.addEventListener("click", handleFirstTouch, { passive: true, once: true });
        });
      }
    };

    attemptPlay();
  }, []);

  return (
    <div className="absolute inset-0 md:left-auto md:right-0 md:w-[62%] lg:w-[58%] overflow-hidden bg-black pointer-events-none">
      {/* HTML5 Native Video: centered on mobile, right-aligned on desktop. Faststart streaming enabled */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        className="h-full w-full object-cover object-center md:object-right"
      >
        <source src="/hero-video.mp4?v=faststart" type="video/mp4" />
      </video>

      {/* Seamless blend from solid black left background into the video */}
      <div className="hidden md:block absolute inset-y-0 left-0 w-32 lg:w-48 bg-gradient-to-r from-black via-black/70 to-transparent pointer-events-none" />

      {/* Mobile contrast overlay for readability */}
      <div className="block md:hidden absolute inset-0 bg-black/60 pointer-events-none" />
    </div>
  );
}
