import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { z } from "zod";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { getAdminSession } from "@/lib/admin-session";

const schema = z.object({
  email: z.string().trim().email().max(320),
  name: z.string().trim().max(80).default(""),
  password: z.string().min(8).max(128).optional(),
  role: z.enum(["owner", "admin", "editor"]).default("editor"),
}).strict();

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getAdminDb();
  const auth = await getAdminAuth();
  if (!db || !auth) return NextResponse.json({ error: "Firebase is not configured" }, { status: 503 });
  if (!(session.role === "owner" || session.role === "admin")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid Firebase Auth email and role." }, { status: 400 });
  if (session.role !== "owner" && parsed.data.role === "owner") return NextResponse.json({ error: "Only an owner can add another owner." }, { status: 403 });

  let createdAuthUser = false;
  try {
    let user;
    try {
      user = await auth.getUserByEmail(parsed.data.email);
    } catch (error) {
      const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
      if (code !== "auth/user-not-found") throw error;
      if (!parsed.data.password) return NextResponse.json({ error: "No Firebase Auth user was found. Enter a password to create a new account, or create the user in Firebase Authentication first." }, { status: 404 });
      user = await auth.createUser({ email: parsed.data.email, password: parsed.data.password, displayName: parsed.data.name || undefined });
      createdAuthUser = true;
    }
    const adminRef = db.collection("admins").doc(user.uid);
    const now = Timestamp.now();
    const admin = {
      email: user.email ?? parsed.data.email,
      name: user.displayName ?? parsed.data.name,
      role: parsed.data.role,
      active: true,
      createdAt: now,
      updatedAt: now,
      createdBy: session.uid,
      updatedBy: session.uid,
    };

    try {
      await adminRef.create(admin);
    } catch (error) {
      if (createdAuthUser) await auth.deleteUser(user.uid).catch(() => undefined);
      throw error;
    }
    return NextResponse.json({ admin: { uid: user.uid, email: admin.email, name: admin.name, role: admin.role, active: admin.active }, authUserCreated: createdAuthUser }, { status: 201 });
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
    if (code === "auth/email-already-exists") return NextResponse.json({ error: "This email was just created in Firebase Authentication. Try adding it again without a password." }, { status: 409 });
    if (code === 6 || code === "6") return NextResponse.json({ error: "This user is already an administrator." }, { status: 409 });
    return NextResponse.json({ error: "Unable to add administrator." }, { status: 500 });
  }
}
