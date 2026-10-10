import Image from "next/image";

export function BrandIdentity({ siteName }: { siteName: string }) {
  return <>
    <span className="brand-emblem" aria-hidden="true">
      <Image src="/geovaulthq-logo.png" alt="" width={1024} height={1024} sizes="72px" />
    </span>
    <span className="brand-copy">
      <span className="brand-name">{siteName}</span>
      <span className="brand-tagline">Unlocking the World</span>
    </span>
  </>;
}
