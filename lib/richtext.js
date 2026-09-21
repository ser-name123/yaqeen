// Convert rich-editor HTML back to clean plain text.
// Used for fields whose output must stay plain (SEO meta tags, and the
// "one item per line / Title | Description" list fields), while still letting
// the admin type them in the rich editor.
export function htmlToText(html) {
  if (html === null || html === undefined) return "";
  if (typeof html !== "string") return String(html);
  let s = html
    // block boundaries -> newlines so line-based parsing keeps working
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\/\s*(p|div|li|h[1-6]|tr)\s*>/gi, "\n")
    .replace(/<\s*li[^>]*>/gi, "")
    // strip all remaining tags
    .replace(/<[^>]+>/g, "")
    // decode the common entities Quill emits
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x2F;/gi, "/");
  // tidy whitespace
  s = s
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return s;
}

// True when a string looks like it already contains HTML markup.
export function looksLikeHtml(v) {
  return typeof v === "string" && /<[a-z][\s\S]*>/i.test(v);
}
