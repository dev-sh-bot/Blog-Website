import Link from "next/link";

export function EditorialPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro: string;
  children: React.ReactNode;
}) {
  return <>
    <section className="page-hero"><div className="container"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{intro}</p></div></section>
    <div className="container editorial-content">{children}</div>
  </>;
}

export function EditorialCallout({ title, children, href, label }: { title: string; children: React.ReactNode; href?: string; label?: string }) {
  return <section className="editorial-callout"><div><span className="eyebrow">A note from Insightly</span><h2>{title}</h2><p>{children}</p></div>{href && label && <Link href={href} className="button button-light">{label} ↗</Link>}</section>;
}

export function DetailColumns({ items }: { items: Array<{ title: string; body: string }> }) {
  return <div className="detail-columns">{items.map((item, index) => <article key={item.title}><span className="detail-number">0{index + 1}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>;
}
