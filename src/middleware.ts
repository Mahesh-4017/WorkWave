import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Middleware redirection logic placeholder
  return NextResponse.next();
}

export const config = {
  matcher: ['/seeker/:path*', '/employer/:path*', '/admin/:path*'],
};
