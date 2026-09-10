import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";
import { getAdminDb } from "@/lib/firebase/admin";
import { getAdminSession } from "@/lib/admin-session";

const schema = z.object({ role: z.enum(["owner", "admin", "editor"]), active: z.boolean() });

export async function PATCH(request: Request, { params }: { params: Promise<{ uid: string }> }) {
  const session = await getAdminSession();
  const db = getAdminDb();
  const uid = (await params).uid;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!db) return NextResponse.json({ error: "Firebase is not configured" }, { status: 503 });
  if (!(["owner", "admin"] as string[]).includes(String(session.role))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid administrator data" }, { status: 400 });
  const ref = db.collection("admins").doc(uid);
  const current = await ref.get();
  if (!current.exists) return NextResponse.json({ error: "Administrator record not found" }, { status: 404 });
  const currentData = current.data() ?? {};
  if (uid === session.uid && !parsed.data.active) return NextResponse.json({ error: "You cannot deactivate your own session." }, { status: 400 });
  if (session.role !== "owner" && (currentData.role === "owner" || parsed.data.role === "owner")) return NextResponse.json({ error: "Only an owner can change owner records." }, { status: 403 });
  if (currentData.role === "owner" && currentData.active === true && (parsed.data.role !== "owner" || !parsed.data.active)) {
    const owners = await db.collection("admins").where("role", "==", "owner").where("active", "==", true).get();
    if (owners.size <= 1) return NextResponse.json({ error: "Keep at least one active owner." }, { status: 400 });
  }
  await ref.set({ ...parsed.data, updatedAt: Timestamp.now(), updatedBy: session.uid }, { merge: true });
  return NextResponse.json({ ok: true });
}
