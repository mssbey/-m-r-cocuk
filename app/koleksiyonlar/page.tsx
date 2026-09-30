import Link from "next/link";
import { collectionGroups } from "@/lib/data/collection-groups";
import { buildMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/shared/PageIntro";

export const metadata = buildMetadata({
  title: "Koleksiyonlar",
  description: "Ömür Çocuk koleksiyonlarını keşfedin.",
  path: "/koleksiyonlar",
});
export default function CollectionsPage() {
  return (
    <div className="container-brand flow-page">
      <PageIntro
        title="Koleksiyonlar"
        description="Hayalinizdeki oda için farklı tasarım yaklaşımlarını keşfedin."
      />
      <div className="flow-directory">
        {collectionGroups.map((group) => (
          <Link href={`/koleksiyonlar/${group.slug}`} key={group.slug}>
            <div>
              <h2>{group.name}</h2>
              {group.subtitle && <p>{group.subtitle}</p>}
              <p>{group.description}</p>
            </div>
            <span aria-hidden="true">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
