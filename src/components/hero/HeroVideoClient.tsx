"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, CheckCircle2, Volume2, VolumeX, Play, Pause } from "lucide-react";

export function HeroVideoClient() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [videoSrc, setVideoSrc] = useState<string>("/hero-video.mp4");
  const [isUploading, setIsUploading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  // Guarantee smooth autoplay across modern desktop and mobile browsers
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay was prevented by browser policy:", err);
      });
    }
  }, [videoSrc]);

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

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setNotice("Uploading video file directly...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/settings/hero-video", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        const newSrc = `/hero-video.mp4?v=${Date.now()}`;
        setVideoSrc(newSrc);
        if (videoRef.current) {
          videoRef.current.src = newSrc;
          videoRef.current.load();
          videoRef.current.play().catch(() => {});
        }
        setNotice("Hero video updated and auto-playing smoothly.");
        setTimeout(() => setNotice(null), 5000);
      } else {
        setNotice(data.error || "Upload failed");
      }
    } catch {
      setNotice("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="absolute right-0 top-0 bottom-0 w-full md:w-[62%] lg:w-[58%] overflow-hidden bg-black">
      {/* HTML5 Native Video configured for strict silent background Autoplay at right end */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        controls={false}
        className="h-full w-full object-cover object-right"
      />

      {/* Seamless blend from solid black left background into the video */}
      <div className="hidden md:block absolute inset-y-0 left-0 w-32 lg:w-48 bg-gradient-to-r from-black via-black/70 to-transparent pointer-events-none" />

      {/* Mobile contrast overlay for readability */}
      <div className="block md:hidden absolute inset-0 bg-black/60 pointer-events-none" />

      {/* Media Controls & Video File Selector in Bottom-Right Corner */}
      <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2">
        {/* Play / Pause toggle */}
        <button
          type="button"
          onClick={togglePlay}
          className="h-9 w-9 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/90 transition active:scale-95"
          title={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
        </button>

        {/* Audio Mute / Unmute toggle */}
        <button
          type="button"
          onClick={toggleMute}
          className="h-9 w-9 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/90 transition active:scale-95"
          title={isMuted ? "Unmute audio" : "Mute audio"}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-champagne" />}
        </button>

        {/* Upload / Replace Video File Button */}
        <input
          type="file"
          ref={fileInputRef}
          accept="video/mp4,video/webm,video/quicktime"
          className="hidden"
          onChange={handleVideoUpload}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="group flex items-center gap-2 rounded-full border border-white/30 bg-black/70 backdrop-blur-md px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-white shadow-xl transition hover:bg-black/95 hover:border-white/60 active:scale-95"
          title="Upload or replace the hero video with your CapCut/MP4 file"
        >
          <UploadCloud className="h-3.5 w-3.5 text-champagne group-hover:scale-110 transition-transform" />
          <span>{isUploading ? "Uploading..." : "Upload Hero Video (.mp4)"}</span>
        </button>

        {notice && (
          <div className="absolute bottom-12 right-0 flex items-center gap-2 rounded-lg bg-black/90 border border-emerald-500/50 px-3 py-2 text-xs text-emerald-300 shadow-2xl whitespace-nowrap animate-fadeIn">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>{notice}</span>
          </div>
        )}
      </div>
    </div>
  );
}
