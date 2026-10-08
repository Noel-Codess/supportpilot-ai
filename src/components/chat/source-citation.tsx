import { FileText } from "lucide-react";
import type { SourceCitation as Citation } from "@/types";

export function SourceCitation({ citation, index }: { citation: Citation; index: number }) {
  return (
    <details className="group rounded-xl border border-teal-100 bg-teal-50/70 px-3 py-2 text-xs text-slate-700">
      <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold text-teal-800">
        <span className="grid size-5 place-items-center rounded-md bg-teal-600 text-[10px] text-white">{index}</span>
        <FileText className="size-3.5" />
        {citation.title}
      </summary>
      <p className="mt-2 leading-5 text-slate-600">{citation.excerpt}</p>
    </details>
  );
}
