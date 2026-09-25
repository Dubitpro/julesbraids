"use client";

import { useState, useRef } from "react";
import { UploadCloud, CheckCircle2 } from "lucide-react";

export function HeroImageClient() {
  const [imgSrc, setImgSrc] = useState<string>("/hero-desktop.jpg");
  const [isUploading, setIsUploading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setNotice("Uploading original file byte-for-byte...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/settings/hero", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setImgSrc(`/hero-desktop.jpg?v=${Date.now()}`);
        setNotice("Original image applied successfully (100% untouched).");
        setTimeout(() => setNotice(null), 4000);
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
    <>
      {/* Normal HTML img element rendering the original source asset directly */}
      <img
        src={imgSrc}
        alt="JulesBraid and Hair Hero"
        className="h-full w-full object-cover object-right"
        loading="eager"
      />

      {/* Quick Original File Selector Overlay for Store Owners */}
      <div className="absolute bottom-6 right-6 z-30">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="group flex items-center gap-2 rounded-full border border-white/30 bg-black/60 backdrop-blur-md px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-white shadow-lg transition hover:bg-black/90 hover:border-white/60 active:scale-95"
          title="Select and apply your original image directly (Zero AI alterations)"
        >
          <UploadCloud className="h-3.5 w-3.5 text-champagne group-hover:scale-110 transition-transform" />
          <span>{isUploading ? "Uploading..." : "Select Original Image (mmm.jpg)"}</span>
        </button>

        {notice && (
          <div className="absolute bottom-12 right-0 flex items-center gap-2 rounded-lg bg-black/90 border border-emerald-500/50 px-3 py-2 text-xs text-emerald-300 shadow-xl whitespace-nowrap animate-fadeIn">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>{notice}</span>
          </div>
        )}
      </div>
    </>
  );
}
