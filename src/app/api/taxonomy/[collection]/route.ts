import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { getAdminSession } from "@/lib/admin-session";
import { taxonomySchema } from "@/lib/taxonomy-schema";
import { slugify } from "@/lib/utils";

const collections = ["categories", "tags", "authors"] as const;
function validCollection(value: string): value is (typeof collections)[number] { return collections.includes(value as (typeof collections)[number]); }

export async function POST(request: Request, { params }: { params: Promise<{ collection: string }> }) {
  const session = await getAdminSession(); const db = getAdminDb(); const collection = (await params).collection;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!db) return NextResponse.json({ error: "Firebase is not configured" }, { status: 503 });
  if (!validCollection(collection) || !["owner", "admin"].includes(String(session.role))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = taxonomySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid taxonomy data", details: parsed.error.flatten() }, { status: 400 });
  const slug = slugify(parsed.data.slug || parsed.data.name); const ref = db.collection(collection).doc(slug); if ((await ref.get()).exists) return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
  await ref.set({ ...parsed.data, slug, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
  return NextResponse.json({ id: ref.id }, { status: 201 });
}
