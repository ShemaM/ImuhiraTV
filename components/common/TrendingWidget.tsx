import Link from 'next/link';
import { useTranslation } from 'next-i18next';

interface TrendingArticle {
  id: number | string;
  title: string;
  slug: string;
  href?: string;
}

interface TrendingWidgetProps {
  articles: TrendingArticle[];
  lng: string;
}

export default function TrendingWidget({ articles, lng }: TrendingWidgetProps) {
  const { t } = useTranslation(['articles', 'common']);

  return (
    <div className="mb-8">
      <div className="flex items-center mb-6">
        <span className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></span>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
          {t('Trending', { ns: 'common' })}
        </h3>
      </div>
      
      <div className="flex flex-col space-y-6">
        {articles.length > 0 ? (
          articles.map((item, index) => {
            // FIX: Force construction of the correct URL if href is missing
            // This ensures it goes to /articles/slug, not just '#'
            const validUrl = item.slug ? `/${lng}/articles/${item.slug}` : '#';

            // Try to get translated title from articles.json using slug as key
            const translatedTitle = t(`${item.slug}.title`, { ns: 'articles', defaultValue: '' });
            const displayTitle = translatedTitle && translatedTitle !== `${item.slug}.title` ? translatedTitle : item.title;

            return (
              <Link 
                key={item.id} 
                href={validUrl} 
                className="group flex items-start gap-4"
              >
                <span className="text-3xl font-black text-slate-200 font-serif leading-none group-hover:text-red-200 select-none transition-colors">
                  {index + 1}
                </span>
                
                <div className="pt-1">
                  <h4 className="text-base font-bold leading-snug text-slate-900 font-serif group-hover:text-red-700 transition-colors">
                    {displayTitle}
                  </h4>
                  <span className="text-[10px] text-red-700 font-bold mt-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 block uppercase tracking-wide">
                    {t('View All News', { ns: 'common' })} &rarr;
                  </span>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="py-8 text-center bg-gradient-to-br from-slate-50 to-red-50/20 rounded-lg border border-slate-100">
            <p className="text-sm text-slate-400 italic">
              {t('No articles found in', { ns: 'common' })} {t('Trending', { ns: 'common' })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}