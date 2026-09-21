"use client";

import { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";

// Shared Quill rich-text editor (client only). Emits cleaned HTML via onChange.
export default function RichTextEditor({ value, onChange, placeholder = "Write here…", minHeight = "160px" }) {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    let mounted = true;
    if (containerRef.current && !quillRef.current) {
      import("quill").then(({ default: Quill }) => {
        if (!mounted || !containerRef.current || quillRef.current) return;
        const quill = new Quill(containerRef.current, {
          theme: "snow",
          placeholder,
          modules: {
            toolbar: [
              [{ header: [2, 3, 4, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "blockquote"],
              ["clean"],
            ],
          },
        });
        quillRef.current = quill;
        if (value) quill.root.innerHTML = value;
        quill.on("text-change", () => {
          const html = quill.root.innerHTML;
          onChangeRef.current && onChangeRef.current(html === "<p><br></p>" ? "" : html);
        });
      });
    }
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep editor in sync when the value is reset/loaded externally
  useEffect(() => {
    const q = quillRef.current;
    if (!q) return;
    const current = q.root.innerHTML;
    const normalizedCurrent = current === "<p><br></p>" ? "" : current;
    const next = value || "";
    if (next !== normalizedCurrent) q.root.innerHTML = next;
  }, [value]);

  return (
    <div className="quill-editor-container" style={{ position: "relative" }}>
      <div ref={containerRef} style={{ minHeight }} />
    </div>
  );
}
