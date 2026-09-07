"use client";

import { useCallback } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PostCard } from "./PostCard";

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage: unknown;
}

export function PostCarousel({ posts }: { posts: Post[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!posts?.length) return null;

  return (
    <section className="ifsol-news" aria-labelledby="news-title">
      <span className="ifsol-news__sun ifsol-news__sun--left" aria-hidden="true" />
      <span className="ifsol-news__sun ifsol-news__sun--right" aria-hidden="true" />
      <div className="ifsol-shell">
        <div className="ifsol-section-heading ifsol-section-heading--light">
          <h2 id="news-title">Notícias</h2>
          <Link href="/noticias">Ver tudo <span aria-hidden="true">→</span></Link>
        </div>
        <div className="ifsol-carousel">
          <button className="ifsol-carousel__arrow ifsol-carousel__arrow--left" onClick={scrollPrev} aria-label="Notícia anterior">
            <ChevronLeft aria-hidden="true" />
          </button>
          <div className="ifsol-carousel__viewport" ref={emblaRef}>
            <div className="ifsol-carousel__track">
              {posts.map((post) => (
                <div className="ifsol-carousel__slide ifsol-carousel__slide--news" key={post._id}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          </div>
          <button className="ifsol-carousel__arrow ifsol-carousel__arrow--right" onClick={scrollNext} aria-label="Próxima notícia">
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
        <Link className="ifsol-carousel__hint ifsol-carousel__hint--light" href="/noticias">
          Deslize para ver mais posts <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
