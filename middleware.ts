import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Inject Content-Security-Policy header
  res.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self';",
      "script-src 'self' 'unsafe-inline';",
      "style-src 'self' 'unsafe-inline';",
      "media-src 'self' blob:;",
      "img-src 'self' data: blob:;",
      "connect-src *;",
      "font-src 'self';",
      "frame-src 'none';",
    ].join(' ')
  );

  return res;
}

// 👇 This ensures the middleware runs on all pages except _next and static assets
export const config = {
  matcher: ['/', '/((?!_next|.*\\..*|favicon.ico).*)'],
};
