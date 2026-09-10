import { sanitizeArticleHtml } from "@/lib/sanitize";

export function ArticleContent({ html }: { html: string }) {
  return <div className="article-content" dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(html) }} />;
}
