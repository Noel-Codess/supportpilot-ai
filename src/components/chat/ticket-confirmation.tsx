import { CheckCircle2, Ticket } from "lucide-react";
import type { TicketSummary } from "@/types";

export function TicketConfirmation({ ticket }: { ticket: TicketSummary }) {
  return (
    <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-emerald-600 p-2 text-white"><Ticket className="size-4" /></div>
        <div>
          <p className="flex items-center gap-1.5 text-sm font-bold text-emerald-950">
            Ticket created <CheckCircle2 className="size-4" />
          </p>
          <p className="mt-1 text-xs text-emerald-800">{ticket.ticketId} · {ticket.category.replaceAll("_", " ")} · {ticket.status}</p>
        </div>
      </div>
    </div>
  );
}
