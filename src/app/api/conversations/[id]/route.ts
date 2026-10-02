import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json(
    {
      ok: false,
      error: {
        code: "CONVERSATION_NOT_FOUND",
        message: `Conversation ${id} is not available in the local starter repository.`,
        retryable: false,
      },
    },
    { status: 404 },
  );
}
