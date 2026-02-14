import { NextRequest, NextResponse } from 'next/server';
import { fallbackLng, languages } from './i18n/settings';

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Skip admin routes - they don't need locale prefixes
  if (pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = languages.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = fallbackLng;

    // e.g. incoming request is /products
    // The new URL is now /en/products
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, req.url)
    );
  }
}

export const config = {
  // Matcher ignoring `/_next/`, `/api/`, and static files
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico|locales).*)'],
};
