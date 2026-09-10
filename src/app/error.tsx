"use client";

import { useEffect } from "react";
import Link from "next/link";
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) { useEffect(() => { console.error(error); }, [error]); return <main className="container not-found"><span className="eyebrow">Something went wrong</span><h1>Let’s try that again.</h1><p>The page could not be loaded. Your content is safe.</p><div className="admin-actions" style={{ justifyContent: "center" }}><button className="button button-dark" type="button" onClick={() => reset()}>Try again</button><Link className="button button-light" href="/">Go home</Link></div></main>; }
