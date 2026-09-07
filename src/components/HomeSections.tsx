import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { urlFor } from "@/lib/urlFor";

interface Nucleus {
  _id: string;
  name: string;
  slug: { current: string };
  logo: unknown;
}

export function FeaturedNuclei({ nuclei }: { nuclei: Nucleus[] }) {
  if (!nuclei?.length) return null;

  return (
    <section className="ifsol-nuclei" aria-labelledby="nuclei-title">
      <div className="ifsol-shell">
        <div className="ifsol-section-heading">
          <h2 id="nuclei-title">Núcleos acadêmicos</h2>
          <Link href="/nucleos">Ver tudo <span aria-hidden="true">→</span></Link>
        </div>
        <div className="ifsol-nuclei__grid">
          {nuclei.map((nucleus) => (
            <Link
              className="ifsol-nucleus-card"
              href={`/nucleos/${nucleus.slug.current}`}
              key={nucleus._id}
            >
              <span className="ifsol-nucleus-card__sun" aria-hidden="true" />
              {nucleus.logo ? (
                <Image
                  src={urlFor(nucleus.logo).width(480).height(480).url()}
                  alt={`Logo do ${nucleus.name}`}
                  fill
                  sizes="(max-width: 767px) 42vw, 190px"
                  className="ifsol-nucleus-card__image"
                />
              ) : (
                <span>{nucleus.name}</span>
              )}
            </Link>
          ))}
        </div>
        <Link className="ifsol-nuclei__mobile-link" href="/nucleos">Ver tudo <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}

export function LocationSection({ image }: { image: unknown }) {
  const imageUrl = image ? urlFor(image).width(1200).url() : null;

  return (
    <section className="ifsol-location" aria-labelledby="location-title">
      <div className="ifsol-location__banner">
        <div>
          <h2 id="location-title">Onde estamos<br />localizados?</h2>
          <p>Presente em todas as regiões<br />do Rio Grande do Norte, do<br />litoral ao interior.</p>
        </div>
        <MapPin className="ifsol-location__pin" aria-hidden="true" />
      </div>
      {imageUrl && (
        <div className="ifsol-location__map">
          <Image
            src={imageUrl}
            alt="Mapa dos núcleos ifSOL no Rio Grande do Norte"
            fill
            sizes="(max-width: 767px) 100vw, 52vw"
            className="object-contain"
          />
        </div>
      )}
    </section>
  );
}
