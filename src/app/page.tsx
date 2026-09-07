export const revalidate = 60;

import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { PostCarousel } from "@/components/PostCarousel"; 
import { client } from "@/lib/sanity.client";
import groq from "groq";
import { ActivitiesCarousel } from "@/components/ActivityCarousel";
import { Footer } from "@/components/Footer";
import { BackToTopButton } from "@/components/BackToTopButton";
import { FeaturedNuclei, LocationSection } from "@/components/HomeSections";

const homeQuery = groq`{
  "homepage": *[_type == "homepage"][0]{
    heroSection,
    "locationImage": aboutSections[_type == "singleImageBlock"][0].image,
    "activities": activities[]->{
      _id,
      title,
      description,
      icon,
      extraText
    }
  },
  "posts": *[_type == "post"] | order(_createdAt desc) [0..6]{
    _id,
    title,
    slug,
    mainImage
  },
  "nuclei": *[_type == "nucleoAcademico"] | order(name asc) [0...4]{
    _id,
    name,
    slug,
    logo
  },
  "totalNuclei": count(*[_type == "nucleoAcademico"])
}`;

export default async function Home() {
  const data = await client.fetch(homeQuery);

  return (
    <main className="ifsol-home">
      <Navbar />
      <HeroSection data={data?.homepage?.heroSection} totalNuclei={data?.totalNuclei} />
      <PostCarousel posts={data?.posts} />
      <FeaturedNuclei nuclei={data?.nuclei} />
      <LocationSection image={data?.homepage?.locationImage} />
      <ActivitiesCarousel activities={data?.homepage?.activities}/>
      <Footer/>
      <BackToTopButton/>
    </main>
  );
}
