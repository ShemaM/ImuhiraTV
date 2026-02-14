// components/common/HeroArticle.tsx
import Link from 'next/link';
import Image from 'next/image';
import Badge from './Badge';
import YouTubeIcon from './YouTubeIcon';
import { useTranslation } from 'next-i18next';

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
    youtube_video_id?: string;
  };
  lng: string;
}

export default function HeroArticle({ article, lng }: HeroArticleProps) {
  const { t } = useTranslation(['articles', 'common']);
  
  // STEP 2 FIX: Consistent Link Construction
  // We prioritize the constructed slug URL to ensure it matches the file structure
  const validUrl = article.slug ? `/${lng}/articles/${article.slug}` : '#';

  // Try to get translated title and excerpt from articles.json using slug as key
  // If translation exists, use it; otherwise fall back to database values
  const translatedTitle = t(`${article.slug}.title`, { ns: 'articles', defaultValue: '' });
  const translatedExcerpt = t(`${article.slug}.excerpt`, { ns: 'articles', defaultValue: '' });
  
  const displayTitle = translatedTitle && translatedTitle !== `${article.slug}.title` ? translatedTitle : article.title;
  const displayExcerpt = translatedExcerpt && translatedExcerpt !== `${article.slug}.excerpt` ? translatedExcerpt : article.excerpt;

  // Translate category name
  const translatedCategory = t(article.category?.name || 'News', { ns: 'common' });

  // Determine if article has YouTube video
  const hasYouTubeVideo = !!article.youtube_video_id;
  const youtubeUrl = hasYouTubeVideo 
    ? `https://www.youtube.com/watch?v=${article.youtube_video_id}` 
    : null;

  return (
    <section className="mb-12 border-b border-slate-200 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        
        {/* 1. IMAGE COLUMN */}
        <div className="lg:col-span-8 group">
          <div className="relative h-[300px] md:h-[450px] overflow-hidden rounded-sm">
            <Link href={validUrl} className="block w-full h-full">
              <Image 
                src={article.main_image_url} 
                alt={displayTitle}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized 
              />
            </Link>
            <div className="absolute bottom-0 left-0 bg-red-700 text-white text-[10px] md:text-xs font-bold px-3 py-1.5 uppercase tracking-widest z-10">
              {t('Featured Article', { ns: 'common' })}
            </div>
            
            {/* YouTube Hover Overlay */}
            {hasYouTubeVideo && youtubeUrl && (
              <a 
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
              >
                <div className="flex items-center gap-3 bg-red-600 text-white px-6 py-3 rounded-full font-bold text-base shadow-lg transform group-hover:scale-105 transition-transform">
                  <YouTubeIcon className="w-6 h-6" />
                  {t('watchOnYouTube', { ns: 'common' })}
                </div>
              </a>
            )}
          </div>
        </div>

        {/* 2. TEXT COLUMN */}
        <div className="lg:col-span-4 flex flex-col justify-center">
          <div className="mb-4">
             <Badge label={translatedCategory} />
          </div>

          <Link href={validUrl} className="group block mb-4">
            <h1 className="text-3xl lg:text-4xl/tight font-serif font-bold text-slate-900 group-hover:text-red-700 transition-colors">
              {displayTitle}
            </h1>
          </Link>

          <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6 line-clamp-4">
            {displayExcerpt}
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