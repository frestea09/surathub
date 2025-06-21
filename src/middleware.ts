import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is a pass-through middleware. It doesn't perform any action
// and simply lets the request continue to its destination.
// By not exporting a "config" object, this middleware will run on all paths.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}
