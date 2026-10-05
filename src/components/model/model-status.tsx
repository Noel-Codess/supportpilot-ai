import { CircleAlert, CircleCheck } from "lucide-react";

export function ModelStatus({ configured }: { configured: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        configured ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
      }`}
    >
      {configured ? <CircleCheck className="size-3.5" /> : <CircleAlert className="size-3.5" />}
      {configured ? "Configured" : "Setup required"}
    </span>
  );
}
