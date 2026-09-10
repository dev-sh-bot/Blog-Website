import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { getAdminSession } from "@/lib/admin-session";
import { postInputSchema } from "@/lib/post-schema";
import { resolvePublicationDate } from "@/lib/publishing";

export async function POST(request: Request) {
  const session = await getAdminSession(); const db = getAdminDb();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!db) return NextResponse.json({ error: "Firebase is not configured" }, { status: 503 });
  const parsed = postInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid post data", details: parsed.error.flatten() }, { status: 400 });
  const [author, category, tags] = await Promise.all([db.collection("authors").doc(parsed.data.authorId).get(), db.collection("categories").doc(parsed.data.categoryId).get(), Promise.all(parsed.data.tagIds.map((tagId) => db.collection("tags").doc(tagId).get()))]);
  if (!author.exists || !category.exists || tags.some((tag) => !tag.exists)) return NextResponse.json({ error: "Choose existing author, category and tag records." }, { status: 400 });
  const duplicate = await db.collection("posts").where("slug", "==", parsed.data.slug).limit(1).get();
  if (!duplicate.empty) return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
  const publishedAt = new Date(parsed.data.publishedAt);
  if (Number.isNaN(publishedAt.getTime())) return NextResponse.json({ error: "Invalid publish date." }, { status: 400 });
  if (parsed.data.status === "scheduled" && publishedAt.getTime() <= Date.now()) return NextResponse.json({ error: "Scheduled posts must have a future publish date." }, { status: 400 });
  const effectivePublishedAt = resolvePublicationDate(parsed.data.status, publishedAt);
  const now = Timestamp.now(); const ref = await db.collection("posts").add({ ...parsed.data, publishedAt: Timestamp.fromDate(effectivePublishedAt), createdAt: now, updatedAt: now, viewCount: 0, readingTime: Math.max(1, Math.ceil(parsed.data.content.replace(/<[^>]+>/g, " ").split(/\s+/).length / 200)) });
  return NextResponse.json({ id: ref.id }, { status: 201 });
}
