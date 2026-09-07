import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { Store } from "lucide-react";
import { urlFor } from "@/lib/urlFor";

interface ActivityCardProps {
  activity: {
    _id: string;
    title: string;
    description: unknown[];
    icon: unknown;
    extraText: string;
  };
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const iconUrl = activity.icon ? urlFor(activity.icon).width(128).height(128).url() : null;

  return (
    <article className="ifsol-activity-card">
      <div className="ifsol-activity-card__icon" aria-hidden="true">
        {iconUrl ? (
          <Image src={iconUrl} alt="" width={58} height={58} className="object-contain" />
        ) : (
          <Store />
        )}
      </div>
      <h3>{activity.title}</h3>
      <div className="ifsol-activity-card__description">
        <PortableText value={activity.description as never} />
      </div>
      {activity.extraText && <p className="ifsol-activity-card__extra">{activity.extraText}</p>}
    </article>
  );
}
