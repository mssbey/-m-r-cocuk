import { Breadcrumbs } from "./Breadcrumbs";

export function PageIntro({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="flow-page-intro">
      <Breadcrumbs items={[{ name: title }]} />
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}
