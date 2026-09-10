import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { getAdminSession } from "@/lib/admin-session";
import { taxonomySchema } from "@/lib/taxonomy-schema";
import { slugify } from "@/lib/utils";

const collections = ["categories", "tags", "authors"] as const;
function validCollection(value: string): value is (typeof collections)[number] { return collections.includes(value as (typeof collections)[number]); }

export async function PATCH(request: Request, { params }: { params: Promise<{ collection: string; id: string }> }) {
  const session = await getAdminSession(); const db = getAdminDb(); const { collection, id } = await params;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!db) return NextResponse.json({ error: "Firebase is not configured" }, { status: 503 });
  if (!validCollection(collection) || !["owner", "admin"].includes(String(session.role))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = taxonomySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid taxonomy data", details: parsed.error.flatten() }, { status: 400 });
  const ref = db.collection(collection).doc(id); if (!(await ref.get()).exists) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const slug = slugify(parsed.data.slug || parsed.data.name); const duplicate = await db.collection(collection).where("slug", "==", slug).limit(2).get(); if (duplicate.docs.some((doc) => doc.id !== id)) return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
  await ref.set({ ...parsed.data, slug, updatedAt: Timestamp.now() }, { merge: true });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ collection: string; id: string }> }) {
  const session = await getAdminSession(); const db = getAdminDb(); const { collection, id } = await params;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!db) return NextResponse.json({ error: "Firebase is not configured" }, { status: 503 });
  if (!validCollection(collection) || !["owner", "admin"].includes(String(session.role))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const references = collection === "tags" ? await db.collection("posts").where("tagIds", "array-contains", id).limit(1).get() : await db.collection("posts").where(collection === "categories" ? "categoryId" : "authorId", "==", id).limit(1).get();
  if (!references.empty) return NextResponse.json({ error: "This item is still used by a post." }, { status: 409 });
  await db.collection(collection).doc(id).delete();
  return NextResponse.json({ ok: true });
}
