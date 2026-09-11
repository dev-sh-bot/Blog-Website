"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "@/components/icons";
import { classNames } from "@/lib/utils";
import type { SearchableOption } from "./searchable-select";

type MultiSearchableSelectProps = {
  id: string;
  label: string;
  values: string[];
  options: SearchableOption[];
  onChange: (values: string[]) => void;
  placeholder?: string;
};

export function MultiSearchableSelect({ id, label, values, options, onChange, placeholder = "Select options" }: MultiSearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selectedValues = useMemo(() => new Set(values), [values]);
  const selectedCount = options.filter((option) => selectedValues.has(option.value)).length;
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return options;
    return options.filter((option) => option.label.toLowerCase().includes(normalizedQuery));
  }, [options, query]);

  useEffect(() => {
    function closeOnOutsidePointer(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  function toggleOption(value: string) {
    onChange(selectedValues.has(value) ? values.filter((item) => item !== value) : [...values, value]);
  }

  return (
    <div className="form-field searchable-select multi-searchable-select" ref={rootRef}>
      <label htmlFor={id}>{label}</label>
      <button
        className="admin-select searchable-select-trigger"
        type="button"
        id={id}
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={`${id}-options`}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={classNames(!selectedCount && "placeholder")}>{selectedCount ? `${selectedCount} selected` : placeholder}</span>
        <ChevronDownIcon size={16} />
      </button>
      {open && (
        <div className="searchable-select-menu">
          <div className="searchable-select-search">
            <SearchIcon size={15} />
            <input
              ref={searchRef}
              type="search"
              aria-label={`Search ${label.toLowerCase()}`}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`}
            />
          </div>
          <div id={`${id}-options`} className="searchable-select-options" role="listbox" aria-label={`${label} options`} aria-multiselectable="true">
            {filteredOptions.length ? filteredOptions.map((option) => {
              const selected = selectedValues.has(option.value);
              return (
                <label className={classNames("searchable-select-option", "multi-searchable-select-option", selected && "selected")} key={option.value}>
                  <input type="checkbox" checked={selected} onChange={() => toggleOption(option.value)} aria-label={option.label} />
                  <span>{option.label}</span>
                  {selected && <CheckIcon size={14} />}
                </label>
              );
            }) : <p className="searchable-select-empty">No {label.toLowerCase()} found.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
