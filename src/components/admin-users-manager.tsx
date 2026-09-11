"use client";

import { useState } from "react";
import { SaveIcon, ShieldIcon, UsersIcon } from "@/components/icons";
import type { AdminRecord } from "@/lib/types";

export function AdminUsersManager({ initialUsers }: { initialUsers: AdminRecord[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRecord["role"]>("editor");
  const [adding, setAdding] = useState(false);

  async function addAdministrator(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAdding(true);
    setMessage("");
    const response = await fetch("/api/admins", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name, password: password || undefined, role }) });
    const result = await response.json().catch(() => null) as { admin?: AdminRecord; authUserCreated?: boolean; error?: string } | null;
    if (!response.ok || !result?.admin) {
      setMessage(result?.error ?? "Unable to add administrator.");
      setAdding(false);
      return;
    }
    setUsers((current) => [...current, result.admin!].sort((left, right) => (left.email || left.uid).localeCompare(right.email || right.uid)));
    setEmail("");
    setName("");
    setPassword("");
    setRole("editor");
    setMessage(result.authUserCreated ? "Firebase Auth user and administrator added." : "Administrator added.");
    setAdding(false);
  }

  async function save(user: AdminRecord, patch: Pick<AdminRecord, "role" | "active">) {
    const response = await fetch(`/api/admins/${user.uid}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    if (!response.ok) { setMessage((await response.json().catch(() => null))?.error ?? "Unable to update administrator."); return; }
    setUsers((current) => current.map((item) => item.uid === user.uid ? { ...item, ...patch } : item));
    setMessage("Administrator updated.");
  }

  return <div className="admin-card admin-users-card"><div className="card-heading-with-icon"><span className="card-heading-icon"><ShieldIcon size={19} /></span><div><h2>Add administrator</h2><p>Invite a teammate into the editorial workspace.</p></div></div><p className="form-note">Use an existing Firebase Auth account, or create a new Email/Password account here. Passwords are used only during account creation and are never stored in Firestore. Leave the password blank for Google or other existing accounts.</p><form className="admin-form" onSubmit={(event) => void addAdministrator(event)}><div className="form-row"><div className="form-field"><label htmlFor="new-admin-email">Email address</label><input className="admin-input" id="new-admin-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="editor@example.com" /></div><div className="form-field"><label htmlFor="new-admin-name">Display name</label><input className="admin-input" id="new-admin-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Editorial name" /></div></div><div className="form-row"><div className="form-field"><label htmlFor="new-admin-password">Password for new account</label><input className="admin-input" id="new-admin-password" type="password" minLength={8} maxLength={128} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimum 8 characters" /><small className="form-note">Leave blank when the user already exists in Firebase Auth or will use Google sign-in.</small></div><div className="form-field"><label htmlFor="new-admin-role">Role</label><select className="admin-select" id="new-admin-role" value={role} onChange={(event) => setRole(event.target.value as AdminRecord["role"])}><option value="editor">Editor</option><option value="admin">Admin</option><option value="owner">Owner</option></select></div></div><div className="admin-actions"><button className="button button-dark" type="submit" disabled={adding}><UsersIcon size={16} /><span>{adding ? "Adding…" : "Add administrator"}</span></button></div></form>{message && <p className="form-note" role="status">{message}</p>}<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>User</th><th>UID</th><th>Role</th><th>Active</th><th>Action</th></tr></thead><tbody>{users.map((user) => <AdminUserRow key={user.uid} user={user} onSave={save} />)}</tbody></table></div>{users.length === 0 && <p className="form-note">No administrator records are available. Provision the first owner using the README instructions.</p>}</div>;
}

function AdminUserRow({ user, onSave }: { user: AdminRecord; onSave: (user: AdminRecord, patch: Pick<AdminRecord, "role" | "active">) => Promise<void> }) {
  const [role, setRole] = useState<AdminRecord["role"]>(user.role);
  const [active, setActive] = useState(user.active);
  return <tr><td><strong>{user.name || "Unnamed administrator"}</strong><br /><small>{user.email}</small></td><td><code>{user.uid}</code></td><td><select className="admin-select" aria-label={`Role for ${user.email || user.uid}`} value={role} onChange={(event) => setRole(event.target.value as AdminRecord["role"])}><option value="owner">Owner</option><option value="admin">Admin</option><option value="editor">Editor</option></select></td><td><label className="checkbox-label"><input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} /> Active</label></td><td><button className="text-link" type="button" onClick={() => void onSave(user, { role, active })}><SaveIcon size={14} /><span>Save</span></button></td></tr>;
}
