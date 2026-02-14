// components/common/Breadcrumbs.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

/**
 * Breadcrumbs Component
 * 
 * Creates a dynamic breadcrumb navigation based on the current URL path.
 * Features:
 * - Parses the current URL path and generates clickable links for each level
 * - Home link points to the language root (e.g., /en, /fr)
 * - Automatically formats segment strings (capitalizes, removes hyphens)
 * - Uses next/link for routing, inheriting the active i18n locale
 * - Styled with Tailwind CSS (slate-500 for parents, slate-900 for current page)
 */

interface BreadcrumbItem {
  label: string;
  href: string;
  isLast: boolean;
}

/**
 * Formats a URL segment into a human-readable label.
 * - Replaces hyphens with spaces
 * - Capitalizes each word
 */
function formatSegment(segment: string): string {
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function Breadcrumbs() {
  const router = useRouter();
  
  // Get the current path without query strings
  const asPath = router.asPath.split('?')[0];
  
  // Get the current language from the router query
  const lng = (router.query.lng as string) || 'en';
  
  // Split the path into segments and filter out empty strings and the language prefix
  const segments = asPath.split('/').filter((segment) => segment && segment !== lng);
  
  // Build breadcrumb items
  const breadcrumbs: BreadcrumbItem[] = [];
  
  // Always start with Home
  breadcrumbs.push({
    label: 'Home',
    href: `/${lng}`,
    isLast: segments.length === 0,
  });
  
  // Build cumulative paths for each segment
  let cumulativePath = `/${lng}`;
  
  segments.forEach((segment, index) => {
    cumulativePath += `/${segment}`;
    breadcrumbs.push({
      label: formatSegment(segment),
      href: cumulativePath,
      isLast: index === segments.length - 1,
    });
  });

  // Don't render if we're on the home page
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center flex-wrap gap-1 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center">
            {/* Separator - show for all items except the first */}
            {index > 0 && (
              <ChevronRightIcon className="h-4 w-4 mx-2 text-slate-400 flex-shrink-0" />
            )}
            
            {/* Breadcrumb link or text */}
            {crumb.isLast ? (
              // Current page - not a link, bold styling
              <span className="text-slate-900 font-bold truncate max-w-[200px]" title={crumb.label}>
                {crumb.label}
              </span>
            ) : (
              // Parent links
              <Link
                href={crumb.href}
                className="text-slate-500 hover:text-red-600 transition-colors truncate max-w-[150px]"
                title={crumb.label}
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
