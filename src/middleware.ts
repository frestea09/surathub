import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is a pass-through middleware. It doesn't perform any action
// and simply lets the request continue to its destination.
// It's here to prevent a server startup error caused by an
// empty or invalid middleware file.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// By not specifying a matcher in the config, this middleware
// will not run on any routes, effectively disabling it while
// still being a valid file.
export const config = {
  matcher: [],
};
