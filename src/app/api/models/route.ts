import { NextResponse } from "next/server";
import { publicModelRegistry } from "@/lib/bedrock/model-registry";

export async function GET() {
  return NextResponse.json({ ok: true, data: publicModelRegistry() });
}
