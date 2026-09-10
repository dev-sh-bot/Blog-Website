import { AdminShell } from "@/components/admin-shell";
import { AdminUsersManager } from "@/components/admin-users-manager";
import { ensureAdminPage } from "@/lib/admin-page";
import { getAdminUsers } from "@/lib/data";

export const metadata = { title: "Administrators", robots: { index: false, follow: false } };

export default async function AdminsPage() {
  await ensureAdminPage(["owner", "admin"]);
  const users = await getAdminUsers();
  return <AdminShell title="Administrators" description="Add Firebase Auth users to the CMS allowlist and manage editorial roles."><AdminUsersManager initialUsers={users} /></AdminShell>;
}
