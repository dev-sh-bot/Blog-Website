"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { SearchIcon } from "./icons";

export function SearchForm({ compact = false }: { compact?: boolean }) {
  const params = useSearchParams(); const router = useRouter(); const [value, setValue] = useState(params.get("q") ?? "");
  function submit(event: FormEvent) { event.preventDefault(); router.push(`/search?q=${encodeURIComponent(value)}`); }
  return <form className={compact ? "search-form compact" : "search-form"} onSubmit={submit}><label className="sr-only" htmlFor="site-search">Search articles</label><input id="site-search" value={value} onChange={(event) => setValue(event.target.value)} placeholder="What are you curious about?" /><button type="submit" aria-label="Submit search"><SearchIcon /></button></form>;
}
