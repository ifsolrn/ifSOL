
import React from "react";
import Link from "next/link";

type HeroSectionProps = {
  data: {
    heading: string;
    subheading: string;
  };
  totalNuclei?: number;
};

export function HeroSection({ data, totalNuclei = 13 }: HeroSectionProps) {
  if (!data) {
    return null;
  }
  
  return (
    <section className="ifsol-hero">
      <div className="ifsol-shell ifsol-hero__grid">
        <div className="ifsol-hero__copy">
          <h1>{data.heading}</h1>
          <p>{data.subheading}</p>
          <div className="ifsol-hero__actions">
            <Link href="/nucleos" className="ifsol-button ifsol-button--secondary">Ver núcleos</Link>
            <Link href="/sobreNos" className="ifsol-button ifsol-button--primary">Sobre Nós <span aria-hidden="true">⟶</span></Link>
          </div>
        </div>
        <div className="ifsol-stats" aria-label="Números da ifSOL">
          {/* <div><strong>{totalNuclei}</strong> núcleos ativos</div> */}
          <div><strong>14</strong> núcleos ativos</div>
          <div><strong>Atuando desde 2018</strong></div>
          <div>Economia <strong>Solidária</strong></div>
        </div>
      </div>
    </section>
  );
}
