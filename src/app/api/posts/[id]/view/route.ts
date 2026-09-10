import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase/admin";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const db = getAdminDb();
  if (db) {
    const ref = db.collection("posts").doc((await params).id);
    const snapshot = await ref.get();
    const data = snapshot.data();
    const publishDate = data?.publishedAt && typeof data.publishedAt.toDate === "function" ? data.publishedAt.toDate() : new Date(data?.publishedAt ?? "");
    const visible = snapshot.exists && data?.status === "published" && !Number.isNaN(publishDate.getTime()) && publishDate.getTime() <= Date.now();
    if (visible) await ref.update({ viewCount: FieldValue.increment(1) });
  }
  return NextResponse.json({ ok: true });
}
