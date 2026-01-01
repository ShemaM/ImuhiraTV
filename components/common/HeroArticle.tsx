// components/common/HeroArticle.tsx
import Link from 'next/link';
import Image from 'next/image';
import Badge from './Badge';

interface HeroArticleProps {
  article: {
    title: string;
    slug: string;
    excerpt: string;
    main_image_url: string;
    category: { name: string };
    author_name: string;
    published_at: string;
    href?: string; 
  };
  lng: string;
}

export default function HeroArticle({ article, lng }: HeroArticleProps) {
  // STEP 2 FIX: Consistent Link Construction
  // We prioritize the constructed slug URL to ensure it matches the file structure
  const validUrl = article.slug ? `/${lng}/articles/${article.slug}` : '#';

  return (
    <section className="mb-12 border-b border-slate-200 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        
        {/* 1. IMAGE COLUMN */}
        <div className="lg:col-span-8">
          <Link href={validUrl} className="group block relative h-[300px] md:h-[450px] overflow-hidden rounded-sm">
            <Image 
              src={article.main_image_url} 
              alt={article.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized 
            />
            <div className="absolute bottom-0 left-0 bg-red-700 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 uppercase tracking-widest">
              Breaking Analysis
            </div>
          </Link>
        </div>

        {/* 2. TEXT COLUMN */}
        <div className="lg:col-span-4 flex flex-col justify-center">
          <div className="mb-4">
             <Badge label={article.category.name} />
          </div>

          <Link href={validUrl} className="group block mb-4">
            <h1 className="text-3xl lg:text-4xl/tight font-serif font-bold text-slate-900 group-hover:text-red-700 transition-colors">
              {article.title}
            </h1>
          </Link>

          <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6 line-clamp-4">
            {article.excerpt}
          </p>

          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">
            <span className="text-slate-900 mr-2">{article.author_name}</span>
            <span className="text-slate-300 mr-2">•</span>
            <span>{article.published_at}</span>
          </div>
        </div>

      </div>
    </section>
  );
}