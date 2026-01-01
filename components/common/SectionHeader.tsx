// components/common/SectionHeader.tsx
import Link from 'next/link';

interface SectionHeaderProps {
  title: string;
  linkHref?: string;
  linkText?: string;
  lng: string;
}

export default function SectionHeader({ title, linkHref, linkText = "View All", lng }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
      <h2 className="text-2xl font-serif font-bold text-slate-900 border-l-4 border-red-700 pl-3 leading-none">
        {title}
      </h2>
      
      {linkHref && (
        <Link 
          href={`/${lng}${linkHref}`} 
          className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-red-700 transition-colors"
        >
          {linkText} &rarr;
        </Link>
      )}
    </div>
  );
}