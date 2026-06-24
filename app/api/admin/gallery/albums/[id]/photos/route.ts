import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Photos are uploaded via /photos/upload-chunk (chunked binary upload).
// This endpoint is no longer used for uploads.
export async function POST() {
  return NextResponse.json(
    { message: "Use /photos/upload-chunk para enviar fotos." },
    { status: 410 },
  );
}
