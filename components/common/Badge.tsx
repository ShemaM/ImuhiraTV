// components/common/Badge.tsx
import Link from 'next/link';

interface BadgeProps {
  label: string;
  href?: string;
  className?: string;
}

export default function Badge({ label, href, className = "" }: BadgeProps) {
  // Styles: Dark Red background, white text, sharp corners (rounded-sm)
  // Added shadow-sm so it stands out against images
  // Font: Sans-serif, bold, uppercase, tracking-widest, small text size (text-xs)
  const baseStyles = "inline-block bg-red-700 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-sm shadow-sm font-sans";
  
  if (href) {
    return (
      <Link href={href} className={`${baseStyles} hover:bg-slate-900 transition-colors ${className}`}>
        {label}
      </Link>
    );
  }

  return <span className={`${baseStyles} ${className}`}>{label}</span>;
}