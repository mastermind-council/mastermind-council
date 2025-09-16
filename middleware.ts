import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define your CSP as a constant for clarity
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "media-src 'self' blob: data:",
  "connect-src 'self' https://api.openai.com",
  "object-src 'none'",
].join("; ");

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Set the CSP header directly
  res.headers.set("Content-Security-Policy", CSP);
  return res;
}
