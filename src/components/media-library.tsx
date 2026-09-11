"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageIcon, TrashIcon } from "@/components/icons";
import type { MediaRecord } from "@/lib/types";

export function MediaLibrary({ initialAssets }: { initialAssets: MediaRecord[] }) {
  const [assets, setAssets] = useState(initialAssets);
  const [message, setMessage] = useState("");

  async function remove(asset: MediaRecord) {
    if (!window.confirm(`Delete “${asset.name}” from the media library?`)) return;
    const response = await fetch(`/api/media/${asset.id}`, { method: "DELETE" });
    if (!response.ok) { setMessage((await response.json().catch(() => null))?.error ?? "Unable to delete media."); return; }
    setAssets((current) => current.filter((item) => item.id !== asset.id));
    setMessage("Media deleted.");
  }

  return <>
    <div className="library-toolbar"><div className="card-heading-with-icon"><span className="card-heading-icon"><ImageIcon size={19} /></span><div><h2>Media assets</h2><p>{assets.length} visual{assets.length === 1 ? "" : "s"} in your library</p></div></div>{message && <p className="form-note" role="status">{message}</p>}</div>
    <div className="article-grid">{assets.map((asset) => <div className="admin-card" key={asset.id}><div className="card-image"><Image src={asset.url} alt={asset.alt} fill sizes="(max-width: 800px) 100vw, 33vw" /></div><p><strong>{asset.name}</strong></p><small>{asset.path === "demo" ? "Demo asset · Connect Firebase Storage to manage uploads" : `${asset.contentType} · ${(asset.size / 1024).toFixed(0)} KB`}</small>{asset.path !== "demo" && <div className="admin-actions"><button className="text-link danger-link" type="button" onClick={() => void remove(asset)}><TrashIcon size={14} /><span>Delete media</span></button></div>}</div>)}</div>
  </>;
}
