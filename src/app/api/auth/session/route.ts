import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { ADMIN_COOKIE } from "@/lib/admin-session";

const schema = z.object({ idToken: z.string().min(20) });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  const auth = await getAdminAuth(); const db = getAdminDb();
  if (!parsed.success || !auth || !db) return NextResponse.json({ error: "Firebase Auth is not configured." }, { status: 503 });
  try {
    const decoded = await auth.verifyIdToken(parsed.data.idToken);
    const admin = await db.collection("admins").doc(decoded.uid).get();
    if (!admin.exists || admin.data()?.active !== true) return NextResponse.json({ error: "This account is not authorized." }, { status: 403 });
    const session = await auth.createSessionCookie(parsed.data.idToken, { expiresIn: 1000 * 60 * 60 * 24 * 5 });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, session, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 5 });
    return response;
  } catch { return NextResponse.json({ error: "Unable to establish a secure session." }, { status: 401 }); }
}
