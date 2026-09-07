export const dynamic = 'force-static'; //era revalidate = 0, mas para o github pages, que é um host de site estático, precisamos forçar a geração estática completa, sem revalidação. Assim, garantimos que o site funcione corretamente no ambiente do github pages, onde não há suporte para funcionalidades dinâmicas ou revalidação incremental.

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackToTopButton } from "@/components/BackToTopButton";
import { client } from "@/lib/sanity.client";
import groq from "groq";
// import Image from "next/image";
import { GalleryLightbox } from "@/components/GalleryLightBox";
import { notFound } from "next/navigation";

// export const revalidate = 0;
export async function generateStaticParams() {
  const query = groq`*[_type == "galleryAlbum"]{ "slug": slug.current }`;
  const albums = await client.fetch(query);

  return albums.map((album: { slug: string }) => ({
    slug: album.slug,
  }));
} //novo

interface AlbumImage {
  url: string;
  alt: string;
  width: number; /*new*/
  height: number; /*new*/
}

interface Album {
  _id: string;
  title: string;
  year: number;
  campusName: string;
  images: AlbumImage[];
}

const albumQuery = groq`*[_type == "galleryAlbum" && slug.current == $slug][0]{
  _id,
  title,
  year,
  "campusName": campus->name,
  images[]{
    "url": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    alt
  }
}`;


export default async function AlbumPage({ params }: { params: Promise<{ slug: string }> }) { 
  
  const resolvedParams = await params; 
  const album: Album = await client.fetch(albumQuery, { slug: resolvedParams.slug }); 

  if (!album || !album.images || album.images.length === 0) {
    
    notFound(); 
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-8 py-12 flex-grow">
        
        
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-green-800">
                {album.title}
            </h1>
            <p className="text-lg text-gray-600">
                {album.campusName} • {album.year} ({album.images.length} fotos)
            </p>
        </div>

       
        {/* <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {album.images.map((image, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
              <Image
                src={image.url}
                alt={image.alt || `Foto ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div> */}
        <GalleryLightbox images={album.images} />
      </div>
      <Footer />
      <BackToTopButton />
    </main>
  );
}