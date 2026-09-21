"use client";

import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const displayImages = images && images.length > 0 ? images : [];
  const currentImage = displayImages[activeIndex] || displayImages[0];

  return (
    <div className="flex flex-col lg:flex-row-reverse gap-4">
      {/* Main Image Area */}
      <div className="flex-1">
        <div className="aspect-[3/4] w-full bg-taupe/10 rounded-sm overflow-hidden relative border border-taupe/15">
          {currentImage ? (
            <img
              src={currentImage}
              alt={`${productName} view ${activeIndex + 1}`}
              className="h-full w-full object-cover transition-all duration-500 ease-out"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-taupe/40 text-xs uppercase tracking-widest">
              Luxury Hair Gallery
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible no-scrollbar w-full lg:w-20 shrink-0">
          {displayImages.map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`aspect-[3/4] w-16 lg:w-full rounded-xs overflow-hidden border transition shrink-0 ${
                activeIndex === idx
                  ? "border-obsidian ring-1 ring-obsidian opacity-100"
                  : "border-taupe/20 opacity-70 hover:opacity-100 hover:border-champagne"
              }`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
