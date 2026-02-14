// components/common/ArticleCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import Badge from './Badge';
import YouTubeIcon from './YouTubeIcon';
import { useTranslation } from 'next-i18next';

interface ArticleProps {
  article: {
    title: string;
    slug: string;
    excerpt: string;
    main_image_url: string;
    category: { name: string; slug?: string };
    published_at: string;
    author_name?: string;
    youtube_video_id?: string;
  };
  lng: string;
}

export default function ArticleCard({ article, lng }: ArticleProps) {
  const { t } = useTranslation(['articles', 'common']);
  
  // STEP 1 FIX: Create a robust URL variable.
  // This ensures we point to "/articles/" (plural) + the unique slug.
  // If slug is missing for some reason, it defaults to '#' to prevent crashing.
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
    <div className="group flex flex-col h-full">
      {/* Image Container - Linked */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden rounded-sm mb-4">
        <Link href={validUrl} className="block w-full h-full">
          <Image 
            src={article.main_image_url} 
            alt={displayTitle}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            unoptimized
          />
        </Link>
        {/* Badge */}
        <div className="absolute top-2 left-2 z-10">
          <Badge label={translatedCategory} />
        </div>
        
        {/* YouTube Hover Overlay */}
        {hasYouTubeVideo && youtubeUrl && (
          <a 
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
          >
            <div className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg transform group-hover:scale-105 transition-transform">
              <YouTubeIcon className="w-5 h-5" />
              {t('watchOnYouTube', { ns: 'common' })}
            </div>
          </a>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col grow">
        <Link href={validUrl} className="block mb-3">
          <h3 className="text-xl font-bold font-serif leading-tight text-slate-900 group-hover:text-red-700 transition-colors">
            {displayTitle}
          </h3>
        </Link>
        
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4 grow">
          {displayExcerpt}
        </p>

        {/* Footer / Metadata */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium font-sans">
           {article.author_name && (
             <span className="uppercase tracking-wider font-bold text-slate-800">
               {article.author_name}
             </span>
           )}
           <span>{article.published_at}</span>
        </div>
      </div>
    </div>
  );
}