"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

// ─── Inline Copy Button for Code Blocks ───────────────────────────────────────

function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() =>
        navigator.clipboard.writeText(code).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
      }
      className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.06] hover:bg-white/10 border border-white/10 text-gray-500 hover:text-gray-200 transition-all duration-200 text-[10px] font-mono shrink-0"
    >
      {copied ? (
        <><Check className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
      ) : (
        <><Copy className="w-3 h-3" /><span>Copy</span></>
      )}
    </button>
  );
}

// ─── Inline Markdown Parser ────────────────────────────────────────────────────
// Handles: **bold**, *italic*, ***bold-italic***, ~~strikethrough~~,
//          `inline code`, [link text](url), ![alt](url)

export function parseInlineMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  // Regex order matters — longer patterns first
  const tokenPattern =
    /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|~~[^~]+~~|`[^`]+`|\[([^\]]+)\]\(([^)]+)\)|!\[([^\]]*)\]\(([^)]+)\))/g;

  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyCounter = 0;

  while ((match = tokenPattern.exec(text)) !== null) {
    const full = match[0];
    const start = match.index;

    // Add plain text before this token
    if (start > lastIndex) {
      result.push(<span key={keyCounter++}>{text.slice(lastIndex, start)}</span>);
    }

    // Image: ![alt](url)
    if (full.startsWith("![")) {
      const alt = match[4] ?? "";
      const src = match[5] ?? "";
      result.push(
        <img
          key={keyCounter++}
          src={src}
          alt={alt}
          className="inline max-w-full rounded-lg my-1"
        />
      );
    }
    // Link: [text](url)
    else if (full.startsWith("[")) {
      const linkText = match[2] ?? "";
      const href = match[3] ?? "";
      result.push(
        <a
          key={keyCounter++}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="text-[#00a3ff] hover:text-[#00d1ff] underline underline-offset-2 decoration-[#00a3ff]/30 hover:decoration-[#00a3ff] transition-colors"
        >
          {linkText}
        </a>
      );
    }
    // Bold-Italic: ***text***
    else if (full.startsWith("***")) {
      result.push(
        <strong key={keyCounter++}>
          <em className="text-white italic">{full.slice(3, -3)}</em>
        </strong>
      );
    }
    // Bold: **text**
    else if (full.startsWith("**")) {
      result.push(
        <strong key={keyCounter++} className="text-white font-bold">
          {full.slice(2, -2)}
        </strong>
      );
    }
    // Italic: *text*
    else if (full.startsWith("*")) {
      result.push(
        <em key={keyCounter++} className="text-gray-300 italic">
          {full.slice(1, -1)}
        </em>
      );
    }
    // Strikethrough: ~~text~~
    else if (full.startsWith("~~")) {
      result.push(
        <del key={keyCounter++} className="text-gray-500 line-through">
          {full.slice(2, -2)}
        </del>
      );
    }
    // Inline code: `code`
    else if (full.startsWith("`")) {
      result.push(
        <code
          key={keyCounter++}
          className="px-1.5 py-0.5 rounded-md bg-white/[0.08] border border-white/[0.12] text-[#00a3ff] font-mono text-[0.85em] break-words"
        >
          {full.slice(1, -1)}
        </code>
      );
    }

    lastIndex = start + full.length;
  }

  // Remaining plain text
  if (lastIndex < text.length) {
    result.push(<span key={keyCounter++}>{text.slice(lastIndex)}</span>);
  }

  return result.length === 1 && typeof result[0] === "string" ? result[0] : <>{result}</>;
}

// ─── Full Markdown Parser ──────────────────────────────────────────────────────

export function parseMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  const lines = text.split("\n");
  const result: React.ReactNode[] = [];
  let i = 0;
  let keyCounter = 0;
  const k = () => keyCounter++;

  // Helper: get a slug-id from heading text
  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  // Helper: close list
  function collectList(
    startIndex: number,
    type: "ul" | "ol",
    baseIndent: number
  ): [React.ReactNode, number] {
    const items: React.ReactNode[] = [];
    let j = startIndex;

    while (j < lines.length) {
      const line = lines[j];
      const trimmed = line.trimEnd();

      // Detect indent level
      const leadingSpaces = line.length - line.trimStart().length;

      const isUlItem = /^(\s*)([-*])\s+/.test(trimmed);
      const isOlItem = /^(\s*)(\d+)\.\s+/.test(trimmed);

      if (!isUlItem && !isOlItem) break;

      const thisIndent = leadingSpaces;
      if (thisIndent < baseIndent) break;
      if (thisIndent > baseIndent) {
        // nested — handled inside item
        j++;
        continue;
      }

      // This item
      const itemType = isUlItem ? "ul" : "ol";
      if (itemType !== type) break;

      const rawContent = isUlItem
        ? trimmed.replace(/^\s*[-*]\s+/, "")
        : trimmed.replace(/^\s*\d+\.\s+/, "");

      // Collect sub-items
      let subList: React.ReactNode | null = null;
      let nextJ = j + 1;
      if (nextJ < lines.length) {
        const nextLine = lines[nextJ];
        const nextLeading = nextLine.length - nextLine.trimStart().length;
        if (nextLeading > baseIndent && (nextLine.trimStart().startsWith("- ") || nextLine.trimStart().startsWith("* ") || /^\d+\./.test(nextLine.trimStart()))) {
          const nextType = nextLine.trimStart().startsWith("- ") || nextLine.trimStart().startsWith("* ") ? "ul" : "ol";
          const [sl, consumed] = collectList(nextJ, nextType, nextLeading);
          subList = sl;
          nextJ = consumed;
        }
      }

      items.push(
        <li key={k()} className="leading-relaxed">
          <span>{parseInlineMarkdown(rawContent)}</span>
          {subList}
        </li>
      );
      j = nextJ;
    }

    const listEl =
      type === "ul" ? (
        <ul key={k()} className="list-disc pl-6 mb-4 space-y-1.5 text-gray-300 text-base marker:text-[#00a3ff]/60">
          {items}
        </ul>
      ) : (
        <ol key={k()} className="list-decimal pl-6 mb-4 space-y-1.5 text-gray-300 text-base marker:text-[#00a3ff]/60">
          {items}
        </ol>
      );

    return [listEl, j];
  }

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trimEnd();

    // ── Fenced Code Block ──────────────────────────────────────────────
    if (line.trimStart().startsWith("```")) {
      const lang = line.trim().slice(3).trim().toLowerCase() || "";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimEnd().trimStart().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      const codeContent = codeLines.join("\n");

      result.push(
        <div key={k()} className="relative my-6 rounded-2xl border border-white/[0.08] bg-[#07080d] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
          {/* Header bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-[#0a0b10]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50 border border-red-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50 border border-yellow-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50 border border-green-500/20" />
              </div>
              {lang && (
                <span className="ml-2 text-[10px] font-mono font-bold text-[#00a3ff]/70 uppercase tracking-widest">
                  {lang}
                </span>
              )}
            </div>
            <CopyCodeButton code={codeContent} />
          </div>
          {/* Code content */}
          <pre className="overflow-x-auto p-5 text-[13px] font-mono text-gray-200 leading-[1.65] whitespace-pre">
            <code>{codeContent}</code>
          </pre>
        </div>
      );
      continue;
    }

    // ── Table ──────────────────────────────────────────────────────────
    // Detect table: line with | ... | and next line is separator |---|---|
    if (line.includes("|") && i + 1 < lines.length && /^\|[-| :]+\|/.test(lines[i + 1].trim())) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const [headerRow, , ...bodyRows] = tableLines; // skip separator row
      const parseRow = (row: string) =>
        row
          .split("|")
          .map(c => c.trim())
          .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1); // remove leading/trailing empty

      const headers = parseRow(headerRow);
      result.push(
        <div key={k()} className="my-6 overflow-x-auto rounded-xl border border-white/[0.08] shadow-lg">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-[#0a0b10]">
                {headers.map((h, hi) => (
                  <th
                    key={hi}
                    className="px-4 py-3 text-[11px] font-black uppercase tracking-wider text-[#00a3ff]/80 whitespace-nowrap"
                  >
                    {parseInlineMarkdown(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, ri) => {
                const cells = parseRow(row);
                return (
                  <tr
                    key={ri}
                    className={`border-b border-white/[0.04] ${ri % 2 === 0 ? "bg-[#060609]" : "bg-[#07080d]"} hover:bg-white/[0.02] transition-colors`}
                  >
                    {cells.map((cell, ci) => (
                      <td key={ci} className="px-4 py-3 text-gray-300 text-sm">
                        {parseInlineMarkdown(cell)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // ── Blockquote (multi-line) ────────────────────────────────────────
    if (line.startsWith("> ") || line === ">") {
      const bqLines: string[] = [];
      while (i < lines.length && (lines[i].startsWith("> ") || lines[i].trimEnd() === ">")) {
        bqLines.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      result.push(
        <blockquote
          key={k()}
          className="border-l-4 border-[#00a3ff]/50 pl-5 py-2 my-6 bg-[#00a3ff]/[0.04] rounded-r-xl italic"
        >
          <div className="space-y-2 text-gray-300 text-base leading-relaxed">
            {bqLines.map((bql, bqi) =>
              bql.trim() === "" ? (
                <div key={bqi} className="h-2" />
              ) : (
                <p key={bqi}>{parseInlineMarkdown(bql)}</p>
              )
            )}
          </div>
        </blockquote>
      );
      continue;
    }

    // ── Headings ───────────────────────────────────────────────────────
    if (line.startsWith("###### ")) {
      const txt = line.slice(7);
      result.push(<h6 key={k()} id={slugify(txt)} className="text-sm font-bold text-white mt-5 mb-2 scroll-mt-28">{parseInlineMarkdown(txt)}</h6>);
      i++; continue;
    }
    if (line.startsWith("##### ")) {
      const txt = line.slice(6);
      result.push(<h5 key={k()} id={slugify(txt)} className="text-base font-bold text-white mt-5 mb-2 scroll-mt-28">{parseInlineMarkdown(txt)}</h5>);
      i++; continue;
    }
    if (line.startsWith("#### ")) {
      const txt = line.slice(5);
      result.push(<h4 key={k()} id={slugify(txt)} className="text-lg font-bold text-white mt-6 mb-2 scroll-mt-28">{parseInlineMarkdown(txt)}</h4>);
      i++; continue;
    }
    if (line.startsWith("### ")) {
      const txt = line.slice(4);
      result.push(
        <h3 key={k()} id={slugify(txt)} className="text-xl sm:text-2xl font-bold text-white mt-8 mb-3 tracking-tight scroll-mt-28">
          {parseInlineMarkdown(txt)}
        </h3>
      );
      i++; continue;
    }
    if (line.startsWith("## ")) {
      const txt = line.slice(3);
      result.push(
        <h2 key={k()} id={slugify(txt)} className="text-2xl sm:text-3xl font-bold text-white border-b border-white/[0.06] pb-2 mt-10 mb-4 tracking-tight scroll-mt-28">
          {parseInlineMarkdown(txt)}
        </h2>
      );
      i++; continue;
    }
    if (line.startsWith("# ")) {
      const txt = line.slice(2);
      result.push(
        <h1 key={k()} id={slugify(txt)} className="text-3xl sm:text-4xl font-black text-white border-b border-white/[0.08] pb-3 mt-10 mb-5 tracking-tight scroll-mt-28">
          {parseInlineMarkdown(txt)}
        </h1>
      );
      i++; continue;
    }

    // ── Horizontal Rule ────────────────────────────────────────────────
    if (line.trim() === "---" || line.trim() === "***" || line.trim() === "___") {
      result.push(<hr key={k()} className="my-8 border-white/[0.08]" />);
      i++; continue;
    }

    // ── Unordered List ─────────────────────────────────────────────────
    if (/^(\s*)([-*])\s+/.test(line)) {
      const leadingSpaces = rawLine.length - rawLine.trimStart().length;
      const [listNode, newI] = collectList(i, "ul", leadingSpaces);
      result.push(listNode);
      i = newI;
      continue;
    }

    // ── Ordered List ───────────────────────────────────────────────────
    if (/^(\s*)(\d+)\.\s+/.test(line)) {
      const leadingSpaces = rawLine.length - rawLine.trimStart().length;
      const [listNode, newI] = collectList(i, "ol", leadingSpaces);
      result.push(listNode);
      i = newI;
      continue;
    }

    // ── Empty line ─────────────────────────────────────────────────────
    if (line.trim() === "") {
      result.push(<div key={k()} className="h-3" />);
      i++; continue;
    }

    // ── Regular Paragraph ──────────────────────────────────────────────
    result.push(
      <p key={k()} className="text-gray-300 text-base leading-relaxed mb-3">
        {parseInlineMarkdown(line)}
      </p>
    );
    i++;
  }

  return <div className="markdown-body space-y-1">{result}</div>;
}

// ─── Extract headings for Table of Contents ────────────────────────────────────

export interface TocHeading {
  level: number; // 1-6
  text: string;
  id: string;
}

export function extractHeadings(text: string): TocHeading[] {
  if (!text) return [];
  const headings: TocHeading[] = [];
  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const lines = text.split("\n");
  for (const line of lines) {
    const m = line.match(/^(#{1,6})\s+(.+)/);
    if (m) {
      headings.push({
        level: m[1].length,
        text: m[2].replace(/\*\*/g, "").replace(/\*/g, "").replace(/`/g, "").trim(),
        id: slugify(m[2].replace(/\*\*/g, "").replace(/\*/g, "").replace(/`/g, "").trim()),
      });
    }
  }
  return headings;
}
