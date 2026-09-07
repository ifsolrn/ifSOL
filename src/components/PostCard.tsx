import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/urlFor";

interface PostCardProps {
  post: {
    _id: string;
    slug: { current: string };
    title: string;
    mainImage: unknown;
  };
}

export function PostCard({ post }: PostCardProps) {
  const imageUrl = post.mainImage ? urlFor(post.mainImage).width(760).height(520).url() : null;

  return (
    <Link className="ifsol-post-card" href={`/noticias/${post.slug.current}`}>
      <div className="ifsol-post-card__media">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            sizes="(max-width: 767px) 68vw, 300px"
            className="object-cover"
          />
        ) : (
          <span>ifSOL</span>
        )}
      </div>
      <h3>{post.title}</h3>
    </Link>
  );
}
