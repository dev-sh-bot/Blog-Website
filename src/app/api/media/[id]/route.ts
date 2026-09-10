import { NextResponse } from "next/server";
import { getAdminDb, getAdminStorage } from "@/lib/firebase/admin";
import { getAdminSession } from "@/lib/admin-session";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  const db = getAdminDb();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!db) return NextResponse.json({ error: "Firebase is not configured" }, { status: 503 });
  const ref = db.collection("media").doc((await params).id);
  const snapshot = await ref.get();
  if (!snapshot.exists) return NextResponse.json({ error: "Media record not found" }, { status: 404 });
  const path = snapshot.data()?.path;
  if (typeof path === "string" && path.startsWith("media/")) {
    const storage = getAdminStorage();
    if (storage) await storage.bucket().file(path).delete({ ignoreNotFound: true });
  }
  await ref.delete();
  return NextResponse.json({ ok: true });
}
