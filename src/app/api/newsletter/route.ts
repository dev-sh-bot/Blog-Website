import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminDb } from "@/lib/firebase/admin";

const schema = z.object({ email: z.string().trim().toLowerCase().email() });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  const db = getAdminDb();
  if (!db) return NextResponse.json({ ok: true, demo: true });
  const ref = db.collection("subscribers").doc(encodeURIComponent(parsed.data.email));
  const existing = await ref.get();
  if (existing.exists) return NextResponse.json({ duplicate: true });
  await ref.set({ email: parsed.data.email, createdAt: new Date().toISOString(), source: "website" });
  return NextResponse.json({ ok: true });
}
