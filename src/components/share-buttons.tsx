"use client";

import { useState } from "react";

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const share = (network: string) => { const url = encodeURIComponent(window.location.href); const text = encodeURIComponent(title); const links: Record<string, string> = { x: `https://x.com/intent/post?text=${text}&url=${url}`, linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`, facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}` }; window.open(links[network], "share", "width=650,height=500"); };
  async function copy() { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1800); }
  return <div className="share-buttons" aria-label="Share article"><span>Share</span><button type="button" onClick={() => share("x")} aria-label="Share on X">X</button><button type="button" onClick={() => share("linkedin")} aria-label="Share on LinkedIn">in</button><button type="button" onClick={() => share("facebook")} aria-label="Share on Facebook">f</button><button type="button" onClick={copy} aria-label="Copy article link">{copied ? "✓" : "↗"}</button></div>;
}
