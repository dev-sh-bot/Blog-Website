import { NextResponse } from "next/server";
import { z } from "zod";
import { Timestamp } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";
import { getAdminSession } from "@/lib/admin-session";

const optionalUrl = z.string().url().or(z.literal(""));
const customLinkSchema = z.object({ label: z.string().trim().min(1).max(80), url: z.string().url().max(2048) }).strict();
const schema = z.object({ siteName: z.string().trim().min(2).max(80), siteDescription: z.string().trim().min(10).max(240), metaTitle: z.string().trim().min(2).max(70), metaDescription: z.string().trim().min(10).max(160), seoKeywords: z.array(z.string().trim().min(1).max(40)).max(30), googleSiteVerification: z.string().trim().max(200), contactEmail: z.string().trim().email(), defaultOgImage: optionalUrl, customLinks: z.array(customLinkSchema).max(30), socialLinks: z.object({ twitter: optionalUrl, linkedin: optionalUrl, instagram: optionalUrl, youtube: optionalUrl, facebook: optionalUrl, tiktok: optionalUrl, pinterest: optionalUrl }) });

export async function PATCH(request: Request) {
  const session = await getAdminSession(); const db = getAdminDb();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!db) return NextResponse.json({ error: "Firebase is not configured" }, { status: 503 });
  if (!["owner", "admin"].includes(String(session.role))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid settings", details: parsed.error.flatten() }, { status: 400 });
  await db.collection("settings").doc("site").set({ ...parsed.data, updatedAt: Timestamp.now(), updatedBy: session.uid }, { merge: true });
  return NextResponse.json({ ok: true });
}
