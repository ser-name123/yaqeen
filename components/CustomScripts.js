"use client";

import { useEffect } from "react";

/**
 * Helper to safely execute scripts injected via strings.
 * Standard innerHTML does not execute <script> tags for security in browser DOM,
 * so we parse and recreate executable <script> tags.
 */
function injectExecutableNodes(htmlString, targetContainer, containerId) {
  if (typeof window === "undefined" || !htmlString || !targetContainer) return;

  // Remove existing container with this ID if any
  let existing = document.getElementById(containerId);
  if (existing) {
    existing.remove();
  }

  const wrapper = document.createElement("div");
  wrapper.id = containerId;
  wrapper.style.display = "none";

  // Parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  // Transfer all non-script elements (meta, link, style, noscript, etc.)
  const nonScripts = doc.head.querySelectorAll("meta, link, style, noscript");
  nonScripts.forEach((node) => {
    wrapper.appendChild(node.cloneNode(true));
  });

  const bodyNonScripts = doc.body.querySelectorAll("meta, link, style, noscript, div, iframe");
  bodyNonScripts.forEach((node) => {
    wrapper.appendChild(node.cloneNode(true));
  });

  // Re-create and execute all script elements
  const allScripts = [...doc.querySelectorAll("script")];
  allScripts.forEach((oldScript) => {
    const newScript = document.createElement("script");
    // Copy all attributes (src, async, defer, type, id, etc.)
    Array.from(oldScript.attributes).forEach((attr) => {
      newScript.setAttribute(attr.name, attr.value);
    });
    // Copy inline script content
    if (oldScript.innerHTML) {
      newScript.innerHTML = oldScript.innerHTML;
    }
    wrapper.appendChild(newScript);
  });

  targetContainer.appendChild(wrapper);
}

export default function CustomScripts({ headerScripts, bodyScripts, footerScripts }) {
  useEffect(() => {
    if (headerScripts && headerScripts.trim()) {
      injectExecutableNodes(headerScripts, document.head, "custom-header-scripts-injected");
    }
    if (bodyScripts && bodyScripts.trim()) {
      injectExecutableNodes(bodyScripts, document.body, "custom-body-scripts-injected");
    }
    if (footerScripts && footerScripts.trim()) {
      injectExecutableNodes(footerScripts, document.body, "custom-footer-scripts-injected");
    }

    return () => {
      // Cleanup on unmount if needed
      const h = document.getElementById("custom-header-scripts-injected");
      const b = document.getElementById("custom-body-scripts-injected");
      const f = document.getElementById("custom-footer-scripts-injected");
      if (h) h.remove();
      if (b) b.remove();
      if (f) f.remove();
    };
  }, [headerScripts, bodyScripts, footerScripts]);

  return (
    <>
      {/* SSR Rendered containers for SEO crawlers and non-JS verification */}
      {headerScripts ? (
        <div
          id="ssr-header-scripts"
          style={{ display: "none" }}
          dangerouslySetInnerHTML={{ __html: headerScripts }}
        />
      ) : null}
      {bodyScripts ? (
        <div
          id="ssr-body-scripts"
          style={{ display: "none" }}
          dangerouslySetInnerHTML={{ __html: bodyScripts }}
        />
      ) : null}
      {footerScripts ? (
        <div
          id="ssr-footer-scripts"
          style={{ display: "none" }}
          dangerouslySetInnerHTML={{ __html: footerScripts }}
        />
      ) : null}
    </>
  );
}
