import createMiddleware from 'next-intl/middleware';
import {locales, pathnames, localePrefix} from './navigation';

export default createMiddleware({
  defaultLocale: 'id',
  locales,
  pathnames,
  localePrefix,
});

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next/static|_next/image|_vercel|.*\\..*).*)']
};
