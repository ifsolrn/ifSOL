"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ActivityCard } from "./ActivityCard";

interface Activity {
  _id: string;
  title: string;
  description: unknown[];
  icon: unknown;
  extraText: string;
}

export function ActivitiesCarousel({ activities }: { activities: Activity[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 5500, stopOnInteraction: true })]
  );
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!activities?.length) return null;

  return (
    <section className="ifsol-activities" aria-labelledby="activities-title">
      <div className="ifsol-shell">
        <h2 id="activities-title">Atividades da ifSOL</h2>
        <div className="ifsol-carousel">
          <button className="ifsol-carousel__arrow ifsol-carousel__arrow--left ifsol-carousel__arrow--dark" onClick={scrollPrev} aria-label="Atividade anterior">
            <ChevronLeft aria-hidden="true" />
          </button>
          <div className="ifsol-carousel__viewport" ref={emblaRef}>
            <div className="ifsol-carousel__track">
              {activities.map((activity) => (
                <div className="ifsol-carousel__slide ifsol-carousel__slide--activity" key={activity._id}>
                  <ActivityCard activity={activity} />
                </div>
              ))}
            </div>
          </div>
          <button className="ifsol-carousel__arrow ifsol-carousel__arrow--right ifsol-carousel__arrow--dark" onClick={scrollNext} aria-label="Próxima atividade">
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
        <p className="ifsol-carousel__hint">Deslize para ver mais atividades <span aria-hidden="true">→</span></p>
      </div>
    </section>
  );
}
