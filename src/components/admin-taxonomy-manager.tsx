"use client";

import { useState, type FormEvent } from "react";
import { EditIcon, PlusIcon, TrashIcon, XIcon } from "@/components/icons";
import type { Author, Taxonomy } from "@/lib/types";

type Item = Taxonomy | Author;
type Collection = "categories" | "tags" | "authors";

export function AdminTaxonomyManager({ collection, initialItems }: { collection: Collection; initialItems: Item[] }) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<Item | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [message, setMessage] = useState("");
  const label = collection === "authors" ? "author" : collection === "categories" ? "category" : "tag";

  function reset() {
    setEditing(null);
    setName("");
    setSlug("");
    setDescription("");
    setAvatarUrl("");
  }

  function edit(item: Item) {
    setEditing(item);
    setName(item.name);
    setSlug(item.slug);
    setDescription("bio" in item ? item.bio : item.description ?? "");
    setAvatarUrl("avatarUrl" in item ? item.avatarUrl : "");
    setMessage("");
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setMessage("Saving…");
    const method = editing ? "PATCH" : "POST";
    const endpoint = editing ? `/api/taxonomy/${collection}/${editing.id}` : `/api/taxonomy/${collection}`;
    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, description: collection === "authors" ? undefined : description, bio: collection === "authors" ? description : undefined, avatarUrl: collection === "authors" ? avatarUrl : undefined }),
    });
    if (!response.ok) {
      setMessage((await response.json().catch(() => null))?.error ?? "Unable to save.");
      return;
    }
    const nextId = editing?.id ?? (slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    const saved = { id: nextId, name, slug: slug || nextId, ...(collection === "authors" ? { bio: description, avatarUrl } : { description }) } as Item;
    setItems((current) => editing ? current.map((item) => item.id === editing.id ? saved : item) : [saved, ...current]);
    setMessage(`${label[0].toUpperCase()}${label.slice(1)} saved.`);
    reset();
  }

  async function remove(item: Item) {
    if (!window.confirm(`Delete this ${label}?`)) return;
    const response = await fetch(`/api/taxonomy/${collection}/${item.id}`, { method: "DELETE" });
    if (!response.ok) {
      setMessage((await response.json().catch(() => null))?.error ?? "Unable to delete.");
      return;
    }
    setItems((current) => current.filter((entry) => entry.id !== item.id));
    setMessage(`${label[0].toUpperCase()}${label.slice(1)} deleted.`);
  }

  const FormIcon = editing ? EditIcon : PlusIcon;

  return <div className="admin-content-grid taxonomy-layout">
    <form className="editor-panel taxonomy-form" onSubmit={save}>
      <div className="card-heading-with-icon"><span className="card-heading-icon"><FormIcon size={19} /></span><div><h2>{editing ? `Edit ${label}` : `New ${label}`}</h2><p>Keep your editorial taxonomy organized.</p></div></div>
      <div className="form-field"><label htmlFor={`${collection}-name`}>Name</label><input className="admin-input" id={`${collection}-name`} required value={name} onChange={(event) => setName(event.target.value)} /></div>
      <div className="form-field"><label htmlFor={`${collection}-slug`}>Slug</label><input className="admin-input" id={`${collection}-slug`} value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="auto-generated" /></div>
      <div className="form-field"><label htmlFor={`${collection}-description`}>{collection === "authors" ? "Bio" : "Description"}</label><textarea className="admin-input" id={`${collection}-description`} rows={4} value={description} onChange={(event) => setDescription(event.target.value)} /></div>
      {collection === "authors" && <div className="form-field"><label htmlFor="author-avatar">Avatar URL</label><input className="admin-input" id="author-avatar" type="url" value={avatarUrl} onChange={(event) => setAvatarUrl(event.target.value)} /></div>}
      <div className="admin-actions"><button className="button button-dark" type="submit">{editing ? <EditIcon size={16} /> : <PlusIcon size={16} />}<span>{editing ? "Update" : "Create"}</span></button>{editing && <button className="button button-light" type="button" onClick={reset}><XIcon size={16} /><span>Cancel</span></button>}<span className="form-note" aria-live="polite">{message}</span></div>
    </form>
    <div className="admin-card">
      <div className="section-heading"><div><span className="eyebrow">{items.length} records</span><h2>Manage {collection}</h2></div></div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Slug</th><th>Details</th><th>Actions</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><strong>{item.name}</strong></td><td><code>{item.slug}</code></td><td>{"bio" in item ? item.bio : item.description}</td><td><div className="admin-row-actions"><button className="text-link" type="button" onClick={() => edit(item)}><EditIcon size={14} /><span>Edit</span></button><button className="text-link danger-link" type="button" onClick={() => void remove(item)}><TrashIcon size={14} /><span>Delete</span></button></div></td></tr>)}</tbody></table></div>
    </div>
  </div>;
}
