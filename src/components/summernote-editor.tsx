"use client";

import "summernote/dist/summernote-lite.css";
import { useEffect, useRef, useState } from "react";

type SummernoteApi = {
  summernote?: (options: Record<string, unknown> | string, value?: string) => unknown;
};

export function SummernoteEditor({ value, onChange, onImageUpload }: { value: string; onChange: (value: string) => void; onImageUpload?: (file: File) => Promise<string> }) {
  const ref = useRef<HTMLDivElement>(null);
  const apiRef = useRef<SummernoteApi | null>(null);
  const initializedRef = useRef(false);
  const lastEditorValue = useRef(value);
  const initialValue = useRef(value);
  const onChangeRef = useRef(onChange);
  const onImageUploadRef = useRef(onImageUpload);
  const [fallbackMode, setFallbackMode] = useState(false);

  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => { onImageUploadRef.current = onImageUpload; }, [onImageUpload]);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!ref.current) return;
      let summernoteInitialized = false;
      try {
        const jquery = (await import("jquery")).default;
        await import("summernote/dist/summernote-lite.js");
        if (!active || !ref.current) return;
        const editor = jquery(ref.current) as unknown as SummernoteApi;
        if (typeof editor.summernote === "function") {
          ref.current.innerHTML = initialValue.current;
          editor.summernote({
            height: 320,
            placeholder: "Tell the story…",
            toolbar: [["style", ["style"]], ["font", ["bold", "italic", "underline", "clear", "fontname", "fontsize"]], ["color", ["color"]], ["para", ["ul", "ol", "paragraph"]], ["table", ["table"]], ["insert", ["link", "picture", "video"]], ["view", ["fullscreen", "codeview", "help"]]],
            fontNames: ["Arial", "Arial Black", "Comic Sans MS", "Courier New", "Helvetica", "Impact", "Tahoma", "Times New Roman", "Verdana"],
            fontSizes: ["8", "9", "10", "11", "12", "14", "16", "18", "20", "24", "28", "36"],
            callbacks: {
              onChange: (html: string) => { lastEditorValue.current = html; onChangeRef.current(html); },
              onImageUpload: async (files: File[]) => {
                for (const file of files) {
                  const url = await onImageUploadRef.current?.(file);
                  if (url) apiRef.current?.summernote?.("insertImage", url);
                }
              },
            },
          });
          summernoteInitialized = true;
          apiRef.current = editor;
          initializedRef.current = true;
          lastEditorValue.current = initialValue.current;
          const editable = ref.current.querySelector<HTMLElement>(".note-editable");
          editable?.setAttribute("role", "textbox");
          editable?.setAttribute("aria-multiline", "true");
          editable?.setAttribute("aria-label", "Article content");
          try { editor.summernote("code", initialValue.current); } catch { /* Summernote already has the initial HTML. */ }
          return;
        }
      } catch {
        // The accessible contentEditable fallback remains usable if Summernote cannot load.
      }
      const summernoteEditorExists = Boolean(ref.current?.parentElement?.querySelector(".note-editor"));
      if (active && ref.current && !summernoteInitialized && !summernoteEditorExists) {
        setFallbackMode(true);
        ref.current.innerHTML = initialValue.current;
      }
    })();
    return () => {
      active = false;
      if (initializedRef.current) apiRef.current?.summernote?.("destroy");
      apiRef.current = null;
      initializedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!initializedRef.current || !apiRef.current || value === lastEditorValue.current) return;
    apiRef.current.summernote?.("code", value);
    lastEditorValue.current = value;
  }, [value]);

  function fallbackInput(event: React.FormEvent<HTMLDivElement>) {
    const html = event.currentTarget.innerHTML;
    lastEditorValue.current = html;
    onChangeRef.current(html);
  }

  return <div className="summernote-shell">{fallbackMode && <div className="summernote-toolbar" aria-label="Editor controls"><button type="button" onClick={() => document.execCommand("bold")}>Bold</button><button type="button" onClick={() => document.execCommand("italic")}>Italic</button><button type="button" onClick={() => document.execCommand("insertUnorderedList")}>List</button><button type="button" onClick={() => document.execCommand("formatBlock", false, "h2")}>Heading</button><button type="button" onClick={() => document.execCommand("formatBlock", false, "blockquote")}>Quote</button></div>}<div ref={ref} className="summernote-content" hidden={!fallbackMode} contentEditable={fallbackMode} suppressContentEditableWarning onInput={fallbackMode ? fallbackInput : undefined} role="textbox" aria-multiline="true" aria-label="Article content" /> </div>;
}
