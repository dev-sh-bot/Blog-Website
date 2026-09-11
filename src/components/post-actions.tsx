"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArchiveIcon, CheckIcon, EditIcon, EyeIcon, FileTextIcon, TrashIcon } from "@/components/icons";
import type { PostStatus } from "@/lib/types";

export function PostActions({ postId, status }: { postId: string; status: PostStatus }) {
  const router = useRouter();
  async function change(nextStatus: PostStatus) { if (!window.confirm(`${nextStatus === "archived" ? "Archive" : nextStatus === "draft" ? "Unpublish" : "Publish"} this article?`)) return; const response = await fetch(`/api/posts/${postId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: nextStatus }) }); if (!response.ok) window.alert((await response.json().catch(() => null))?.error ?? "Unable to update article."); else router.refresh(); }
  async function remove() { if (!window.confirm("Delete this article permanently? This cannot be undone.")) return; const response = await fetch(`/api/posts/${postId}`, { method: "DELETE" }); if (!response.ok) window.alert((await response.json().catch(() => null))?.error ?? "Unable to delete article."); else router.refresh(); }
  return <div className="admin-actions admin-row-actions"><Link className="text-link" href={`/admin/posts/${postId}/preview`}><EyeIcon size={14} /><span>Preview</span></Link><Link className="text-link" href={`/admin/posts/${postId}/edit`}><EditIcon size={14} /><span>Edit</span></Link>{status !== "published" && <button className="text-link" type="button" onClick={() => void change("published")}><CheckIcon size={14} /><span>Publish</span></button>}{status === "published" && <button className="text-link" type="button" onClick={() => void change("draft")}><FileTextIcon size={14} /><span>Unpublish</span></button>}{status !== "archived" && <button className="text-link" type="button" onClick={() => void change("archived")}><ArchiveIcon size={14} /><span>Archive</span></button>}{status === "archived" && <button className="text-link" type="button" onClick={() => void change("draft")}><FileTextIcon size={14} /><span>Restore</span></button>}<button className="text-link danger-link" type="button" onClick={() => void remove()}><TrashIcon size={14} /><span>Delete</span></button></div>;
}
