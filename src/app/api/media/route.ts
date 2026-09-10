import { NextResponse } from "next/server";
import { z } from "zod";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { getAdminSession } from "@/lib/admin-session";

const mediaSchema = z.object({ name: z.string().min(1).max(240), path: z.string().regex(/^media\/public\/[A-Za-z0-9._-]+$/, "Media must be stored under media/public."), url: z.string().url(), contentType: z.enum(["image/jpeg", "image/png", "image/webp"]), size: z.number().int().nonnegative().max(5 * 1024 * 1024), alt: z.string().trim().min(1).max(240) }).superRefine((value, context) => {
  const extension = value.path.split(".").pop()?.toLowerCase();
  const allowed = { jpeg: "image/jpeg", jpg: "image/jpeg", png: "image/png", webp: "image/webp" } as const;
  if (!extension || allowed[extension as keyof typeof allowed] !== value.contentType) context.addIssue({ code: "custom", path: ["path"], message: "The file extension and MIME type must match." });
});

export async function POST(request: Request) {
  const session = await getAdminSession();
  const db = getAdminDb();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!db) return NextResponse.json({ error: "Firebase is not configured" }, { status: 503 });
  const parsed = mediaSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid media metadata" }, { status: 400 });
  const ref = await db.collection("media").add({ ...parsed.data, createdAt: Timestamp.now(), uploadedBy: session.uid });
  return NextResponse.json({ id: ref.id }, { status: 201 });
}
