"use client";

import Image from "next/image";
import { useState } from "react";

type LightboxImage = {
  id: number;
  url: string;
  altText?: string | null;
};

type ImageLightboxProps = {
  images: LightboxImage[];
  title: string;
};

export default function ImageLightbox({ images, title }: ImageLightboxProps) {
  const [selectedImage, setSelectedImage] = useState<LightboxImage | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setSelectedImage(images[0])}
          className="relative h-80 w-full overflow-hidden rounded-xl bg-gray-100"
        >
          <Image
            src={images[0].url}
            alt={images[0].altText || title}
            fill
            className="object-cover"
          />
        </button>

        {images.length > 1 && (
          <div className="grid grid-cols-3 gap-3">
            {images.slice(1).map((image) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedImage(image)}
                className="relative h-28 overflow-hidden rounded-lg bg-gray-100"
              >
                <Image
                  src={image.url}
                  alt={image.altText || title}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-6 top-6 rounded-full bg-white px-4 py-2 text-sm font-medium text-black"
          >
            Cerrar
          </button>

          <div
            className="relative h-[80vh] w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedImage.url}
              alt={selectedImage.altText || title}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}