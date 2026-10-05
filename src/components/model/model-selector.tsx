"use client";

import { ChevronDown } from "lucide-react";
import type { ModelDefinition, ModelKey } from "@/lib/bedrock/types";
import { ModelStatus } from "./model-status";

export function ModelSelector({
  models,
  value,
  onChange,
}: {
  models: Omit<ModelDefinition, "envVar">[];
  value: ModelKey;
  onChange(value: ModelKey): void;
}) {
  const selected = models.find((model) => model.key === value)!;
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="relative">
        <label className="sr-only" htmlFor="model-select">AI model</label>
        <select
          id="model-select"
          value={value}
          onChange={(event) => onChange(event.target.value as ModelKey)}
          className="h-9 w-[174px] appearance-none truncate rounded-xl border border-slate-200 bg-white py-1 pl-3 pr-8 text-sm font-semibold text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 sm:w-auto"
        >
          {models.map((model) => (
            <option key={model.key} value={model.key}>
              {model.displayName}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute right-2.5 top-2.5 size-4 text-slate-400" />
      </div>
      <span className="hidden sm:inline-flex"><ModelStatus configured={Boolean(selected.configuredModelId)} /></span>
    </div>
  );
}
