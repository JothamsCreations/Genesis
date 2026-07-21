"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { buildBlueprintDocuments } from "@/lib/blueprint/build-documents";
import type { ProductBlueprint } from "@/lib/blueprint/types";

export function BuildPackLibrary({ blueprint }: { blueprint: ProductBlueprint }) {
  const documents = useMemo(() => buildBlueprintDocuments(blueprint), [blueprint]);
  const [selectedId, setSelectedId] = useState(documents[0].id);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const selected = documents.find((document) => document.id === selectedId) ?? documents[0];

  async function copyDocument() {
    try {
      await navigator.clipboard.writeText(selected.markdown);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  function downloadDocument() {
    const url = URL.createObjectURL(new Blob([selected.markdown], { type: "text/markdown;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = selected.filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="build-library" aria-labelledby="build-library-heading">
      <header>
        <p className="section-label"><span>06 / Artifacts</span>From blueprint to execution</p>
        <h2 id="build-library-heading">Seven-document build pack</h2>
        <p>Every artifact is generated from the same risk-aware product contract and is ready to copy or download.</p>
      </header>
      <div className="build-library-grid">
        <nav aria-label="Build pack documents">
          {documents.map((document) => (
            <button
              aria-label={document.filename}
              aria-current={document.id === selected.id ? "page" : undefined}
              className="document-tab"
              key={document.id}
              onClick={() => {
                setSelectedId(document.id);
                setCopyStatus("idle");
              }}
              type="button"
            >
              <span>{document.filename}</span>
              <small>{document.description}</small>
            </button>
          ))}
        </nav>
        <div className="document-preview">
          <div className="document-preview-toolbar">
            <div><span>Selected artifact</span><strong>{selected.filename}</strong></div>
            <div>
              <Button onClick={copyDocument} variant="secondary">Copy</Button>
              <Button onClick={downloadDocument} variant="quiet">Download</Button>
            </div>
          </div>
          <pre tabIndex={0}>{selected.markdown}</pre>
          {copyStatus === "copied" ? <p className="copy-status success" role="status">{selected.filename} copied.</p> : null}
          {copyStatus === "error" ? <p className="copy-status error" role="status">Copy failed. Download remains available.</p> : null}
        </div>
      </div>
    </section>
  );
}
