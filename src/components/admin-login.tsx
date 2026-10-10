"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { clientAuth } from "@/lib/firebase/client";
import { BrandIdentity } from "./brand-identity";

function authErrorMessage(error: unknown, provider: "Email/Password" | "Google") {
  const code = error && typeof error === "object" && "code" in error ? error.code : undefined;
  if (code === "auth/operation-not-allowed") return `${provider} sign-in is disabled in Firebase Authentication. Enable this provider in Firebase Console → Authentication → Sign-in method.`;
  if (code === "auth/invalid-credential" || code === "auth/invalid-login-credentials") return "The email or password is incorrect.";
  return error instanceof Error ? error.message : `Unable to sign in with ${provider}.`;
}

export function AdminLogin() {
  const router = useRouter(); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  function requireAuth() {
    if (!clientAuth) throw new Error("Firebase is not configured yet. Follow the setup guide in README.md, then add your environment variables.");
    return clientAuth;
  }

  async function createSession(idToken: string) {
    const response = await fetch("/api/auth/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken }) });
    if (!response.ok) throw new Error((await response.json()).error ?? "You are not authorized.");
    router.push("/admin");
  }

  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError("");
    try { const credential = await signInWithEmailAndPassword(requireAuth(), email, password); await createSession(await credential.user.getIdToken()); }
    catch (err) { setError(authErrorMessage(err, "Email/Password")); setLoading(false); }
  }

  async function signInWithGoogle() {
    setLoading(true); setError("");
    try { const credential = await signInWithPopup(requireAuth(), new GoogleAuthProvider()); await createSession(await credential.user.getIdToken()); }
    catch (err) { setError(authErrorMessage(err, "Google")); setLoading(false); }
  }

  return <main className="admin-page"><div className="login-card"><Link href="/" className="brand" aria-label="GeoVaultHQ home"><BrandIdentity siteName="GeoVaultHQ" /></Link><h1>Welcome back.</h1><p>Sign in to publish, edit, and manage GeoVaultHQ.</p><form className="admin-form" onSubmit={submit}><div className="form-field"><label htmlFor="email">Email address</label><input className="admin-input" id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></div><div className="form-field"><label htmlFor="password">Password</label><input className="admin-input" id="password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} /></div>{error && <div className="admin-notice" role="alert">{error}</div>}<button className="button button-dark" type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button></form><div className="login-divider" aria-hidden="true"><span>or</span></div><button className="button button-light google-login-button" type="button" onClick={() => void signInWithGoogle()} disabled={loading}><span className="google-mark" aria-hidden="true">G</span>{loading ? "Signing in…" : "Continue with Google"}</button><p className="login-help">Your Google account must also be listed as an active administrator in Firebase.</p><p className="login-help">First time here? Follow the Firebase setup and first-admin provisioning steps in the project README.</p></div></main>;
}
