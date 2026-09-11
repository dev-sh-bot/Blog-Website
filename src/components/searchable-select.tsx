"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon, SearchIcon } from "@/components/icons";
import { classNames } from "@/lib/utils";

export type SearchableOption = { value: string; label: string };

type SearchableSelectProps = {
  id: string;
  label: string;
  value: string;
  options: SearchableOption[];
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchableSelect({ id, label, value, options, onChange, placeholder = "Select an option" }: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selected = options.find((option) => option.value === value);
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

  function chooseOption(option: SearchableOption) {
    onChange(option.value);
    setOpen(false);
    setQuery("");
  }

  return (
    <div className="form-field searchable-select" ref={rootRef}>
      <label htmlFor={id}>{label}</label>
      <button
        className="admin-select searchable-select-trigger"
        type="button"
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={`${id}-options`}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={classNames(!selected && "placeholder")}>{selected?.label ?? placeholder}</span>
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
          <div id={`${id}-options`} className="searchable-select-options" role="listbox" aria-label={label}>
            {filteredOptions.length ? filteredOptions.map((option) => (
              <button
                className={classNames("searchable-select-option", option.value === value && "selected")}
                type="button"
                role="option"
                aria-selected={option.value === value}
                key={option.value}
                onClick={() => chooseOption(option)}
              >
                <span>{option.label}</span>
                {option.value === value && <CheckIcon size={14} />}
              </button>
            )) : <p className="searchable-select-empty">No {label.toLowerCase()} found.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
