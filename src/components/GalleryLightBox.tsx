"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface GalleryImage {
  url: string;
  alt?: string;
width: number;
  height: number;
}

interface GalleryLightboxProps {
  images: GalleryImage[];
}

export function GalleryLightbox({ images }: GalleryLightboxProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  const showPrevious = useCallback(() => {
    setSelectedIndex((currentIndex) => {
      if (currentIndex === null) return null;

      return currentIndex === 0
        ? images.length - 1
        : currentIndex - 1;
    });
  }, [images.length]);

  const showNext = useCallback(() => {
    setSelectedIndex((currentIndex) => {
      if (currentIndex === null) return null;

      return currentIndex === images.length - 1
        ? 0
        : currentIndex + 1;
    });
  }, [images.length]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, closeLightbox, showPrevious, showNext]);

  const selectedImage =
    selectedIndex !== null ? images[selectedIndex] : null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
        {images.map((image, index) => (
          <button
            type="button"
            key={`${image.url}-${index}`}
            onClick={() => setSelectedIndex(index)}
            className="group relative aspect-square overflow-hidden rounded-lg shadow-lg cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700"
            aria-label={`Ampliar ${image.alt || `foto ${index + 1}`}`}
          >
            <Image
              src={image.url}
              alt={image.alt || `Foto ${index + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
          </button>
        ))}
      </div>

      {selectedImage && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Visualização ampli da galeria"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-20 grid size-12 place-items-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/90 cursor-pointer"
            aria-label="Fechar imagem ampliada"
          >
            <X className="size-8" />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
              className="absolute left-2 md:left-6 z-20 grid size-12 place-items-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/90 cursor-pointer"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="size-9" />
            </button>
          )}

          {/* <div
            className="relative h-[82vh] w-[92vw] max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedImage.url}
              alt={selectedImage.alt || `Foto ${selectedIndex + 1}`}
              fill
              priority
              sizes="92vw"
              className="object-contain"
            />

            <div className="absolute inset-x-0 -bottom-10 flex justify-center">
              <p className="rounded-full bg-black/65 px-4 py-2 text-sm text-white">
                {selectedImage.alt || `Foto ${selectedIndex + 1}`}
                {" • "}
                {selectedIndex + 1} de {images.length}
              </p>
            </div>
          </div> */}
          <div
            className="relative h-fit w-fit max-h-[82vh] max-w-[92vw]"
            onClick={(event) => event.stopPropagation()}
            >
        <Image
            src={selectedImage.url}
            alt={selectedImage.alt || `Foto ${selectedIndex + 1}`}
            width={selectedImage.width}
            height={selectedImage.height}
            priority
            sizes="92vw"
            className="block h-auto max-h-[82vh] w-auto max-w-[92vw] object-contain"
        />

        <div className="absolute inset-x-0 -bottom-10 flex justify-center">
            <p className="rounded-full bg-black/65 px-4 py-2 text-sm text-white">
            {selectedImage.alt || `Foto ${selectedIndex + 1}`}
            {" • "}
            {selectedIndex + 1} de {images.length}
            </p>
        </div>
        </div>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              className="absolute right-2 md:right-6 z-20 grid size-12 place-items-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/90 cursor-pointer"
              aria-label="Próxima foto"
            >
              <ChevronRight className="size-9" />
            </button>
          )}
        </div>
      )}
    </>
  );
}