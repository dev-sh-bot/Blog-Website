import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-session";
export async function POST() { const response = NextResponse.json({ ok: true }); response.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", expires: new Date(0), path: "/" }); return response; }
