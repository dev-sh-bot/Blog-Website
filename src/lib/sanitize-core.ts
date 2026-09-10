import DOMPurify from "isomorphic-dompurify";
import { createHeadingId, stripMarkup } from "./headings";

export function sanitizeArticleHtml(html: string) {
  const clean = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ["target", "rel"],
    FORBID_TAGS: ["style", "script", "iframe", "object", "embed"],
    FORBID_ATTR: ["onerror", "onclick", "onload", "style"],
  });
  const used = new Map<string, number>();
  return clean.replace(/<h([2-3])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_match, level: string, attrs: string, text: string) => {
    const safeAttrs = attrs.replace(/\s+id\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
    const id = createHeadingId(stripMarkup(text), used);
    return `<h${level}${safeAttrs} id="${id}">${text}</h${level}>`;
  });
}
