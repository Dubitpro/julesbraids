"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

export function HeroVideoClient() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Version query parameter guarantees immediate online cache-busting for the user-uploaded video
  const [videoSrc] = useState<string>("/hero-video.mp4?v=final");
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  // Guarantee seamless silent background Autoplay across all mobile and desktop devices
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback if browser requires user gesture
        });
      }
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <div className="absolute inset-0 md:left-auto md:right-0 md:w-[62%] lg:w-[58%] overflow-hidden bg-black">
      {/* HTML5 Native Video: centered on mobile, right-aligned on desktop */}
      <video
        ref={videoRef}
        key={videoSrc}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        controls={false}
        className="h-full w-full object-cover object-center md:object-right"
      />

      {/* Seamless blend from solid black left background into the video */}
      <div className="hidden md:block absolute inset-y-0 left-0 w-32 lg:w-48 bg-gradient-to-r from-black via-black/70 to-transparent pointer-events-none" />

      {/* Mobile contrast overlay for readability */}
      <div className="block md:hidden absolute inset-0 bg-black/60 pointer-events-none" />

      {/* Discreet Audio & Playback Controls in Bottom-Right Corner (Upload button removed) */}
      <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2">
        {/* Play / Pause toggle */}
        <button
          type="button"
          onClick={togglePlay}
          className="h-8 w-8 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition active:scale-95"
          title={isPlaying ? "Pause video" : "Play video"}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-white" />}
        </button>

        {/* Audio Mute / Unmute toggle */}
        <button
          type="button"
          onClick={toggleMute}
          className="h-8 w-8 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition active:scale-95"
          title={isMuted ? "Unmute audio" : "Mute audio"}
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        >
          {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-champagne" />}
        </button>
      </div>
    </div>
  );
}
