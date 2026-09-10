import "server-only";
import { redirect } from "next/navigation";
import { getAdminSession } from "./admin-session";

export async function ensureAdminPage(allowedRoles?: Array<"owner" | "admin" | "editor">) {
  if (process.env.INSIGHTLY_DEMO_ADMIN === "true") return null;
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (allowedRoles && !allowedRoles.includes(session.role)) redirect("/admin");
  return session;
}
