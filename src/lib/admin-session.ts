import "server-only";

import { cookies } from "next/headers";
import { getAdminAuth, getAdminDb } from "./firebase/admin";

export const ADMIN_COOKIE = "insightly_admin_session";

export async function getAdminSession() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const auth = getAdminAuth(); const db = getAdminDb();
  if (!auth || !db) return null;
  try {
    const decoded = await auth.verifySessionCookie(token, true);
    const admin = await db.collection("admins").doc(decoded.uid).get();
    if (!admin.exists || admin.data()?.active !== true) return null;
    const data = admin.data() ?? {};
    const role = data.role === "owner" || data.role === "editor" || data.role === "admin" ? data.role : "editor";
    return { ...data, uid: decoded.uid, email: decoded.email ?? "", role };
  } catch { return null; }
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) return null;
  return session;
}
