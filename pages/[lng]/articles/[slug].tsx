import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// Component Imports
import Layout from '../../../components/layouts/Layout';
import Sidebar from '../../../components/layouts/Sidebar';
import TrendingWidget from '../../../components/common/TrendingWidget';
import Badge from '../../../components/common/Badge';
import {
  FEATURED_ARTICLE,
  LATEST_ARTICLES,
  TRENDING_ARTICLES
} from '../../../constants/mockData';
import { languages } from '../../../i18n/settings';

// Types
interface Article {
  slug: string;
  title: string;
  excerpt?: string;
  category?: {
    name: string;
  };
  author_name?: string;
  published_at?: string;
  main_image_url?: string;
  youtube_video_id?: string;
}

export default function ArticlePage({ article }: { article: Article }) {
  const router = useRouter();
  // Safe language detection: try i18n first, then router, then fallback
  const { t, i18n } = useTranslation(['common', 'articles']);
  const currentLanguage = i18n.language || (router.query.lng as string) || 'en';

  // Translate trending articles for sidebar
  const translatedTrendingArticles = TRENDING_ARTICLES.map((item, index) => ({
    ...item,
    title: t(`articles:trending_articles.${index}.title`, item.title),
  }));

  // Handling for Fallback state or if article is somehow missing
  if (router.isFallback) {
    return <div className="p-12 text-center">Loading article...</div>;
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h1 className="text-6xl font-serif font-black mb-6 text-slate-200">404</h1>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Article Unavailable</h2>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          The dispatch you are looking for may have been moved or archived.
        </p>
        <Link href={`/${currentLanguage}`} className="bg-red-700 text-white px-6 py-3 rounded-sm font-bold uppercase tracking-widest hover:bg-slate-900 transition-colors">
          Return to Front Page
        </Link>
      </div>
    );
  }

  return (
    <Layout title={article.title}>
    <div className="flex flex-col lg:flex-row gap-12">
      
      {/* === MAIN COLUMN === */}
      <article className="w-full lg:w-2/3">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">
          <Link href={`/${currentLanguage}`} className="hover:text-red-700 transition-colors">{t('Home')}</Link>
          <span className="mx-2">/</span>
          <span className="text-red-700">{t(article.category?.name || 'News')}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="mb-4">
             <Badge label={t(article.category?.name || 'News')} />
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-black text-slate-900 leading-tight mb-6">
            {/* FIX: Use defaultValue object to prevent TS errors */}
            {t(`articles:${article.slug}.title`, { defaultValue: article.title })}
          </h1>
          
          <p className="text-xl text-slate-600 leading-relaxed font-serif border-l-4 border-red-700 pl-4 mb-8 italic">
            {t(`articles:${article.slug}.excerpt`, { defaultValue: article.excerpt || '' })}
          </p>

          {/* Author Metadata Bar */}
          <div className="flex items-center justify-between border-t border-b border-slate-200 py-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  {article.author_name || 'Staff Writer'}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Correspondent
                </span>
              </div>
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {article.published_at}
            </div>
          </div>
        </header>

        {/* Main Image - Use YouTube thumbnail if available */}
        <figure className="mb-10 relative h-75 md:h-112.5 w-full bg-slate-100 rounded-sm overflow-hidden shadow-sm">
          <Image 
            src={article.youtube_video_id 
              ? `https://img.youtube.com/vi/${article.youtube_video_id}/maxresdefault.jpg`
              : article.main_image_url || '/placeholder-image.jpg'} 
            alt={t(`articles:${article.slug}.title`, { defaultValue: article.title })}
            fill
            className="object-cover"
            unoptimized
          />
          <figcaption className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/90 to-transparent p-4 pt-12 text-[10px] md:text-xs text-white/90 font-sans">
            Photo via Local Sources / Archives
          </figcaption>
        </figure>

        {/* Watch on YouTube Button */}
        {article.youtube_video_id && (
          <div className="my-8">
            <a
              href={`https://www.youtube.com/watch?v=${article.youtube_video_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-md"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              {t('watchOnYouTube')}
            </a>
          </div>
        )}

        {/* Article Body (Simulated for Mock Data) */}
        <div className="prose prose-slate prose-lg max-w-none font-serif text-slate-800">
          <p className="lead">
            <span className="float-left text-5xl font-black text-slate-900 mr-3 -mt-1.5">T</span>
            he situation regarding <strong>{t(`articles:${article.slug}.title`, { defaultValue: article.title })}</strong> has reached a critical point this week. 
            Local sources confirm that tensions have been escalating in the {t(article.category?.name || 'News')} sector, drawing the attention of regional observers.
          </p>
          <p>
            &quot;We are seeing unprecedented developments,&quot; stated a local civil society leader who wished to remain anonymous for security reasons. 
            This report, filed by {article.author_name}, highlights the urgent need for attention in the region.
          </p>

          <h3 className="font-bold text-slate-900 mt-8 mb-4 text-xl">Strategic Implications</h3>
          <p>
            The recent events described as &quot;{t(`articles:${article.slug}.excerpt`, { defaultValue: article.excerpt || '' })}&quot; have triggered a series of responses from local authorities. 
            According to data collected by Imuhira, this fits a pattern observed over the last three months.
          </p>
          
          {/* Pull Quote */}
          <blockquote className="border-l-4 border-red-700 pl-6 italic text-xl text-slate-700 my-10 bg-slate-50 py-6 pr-6 rounded-r-sm">
            &quot;For the residents of the High Plateaux, this is not just a political abstraction but a daily reality of survival.&quot;
          </blockquote>

          <p>
            As night falls over the region, the sound of distant activity serves as a grim reminder that stability remains elusive. 
            Markets remain closed, and the price of basic goods has tripled in the last 48 hours. 
            Imuhira will continue to track developments as they happen.
          </p>
        </div>

        {/* Tags / Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Filed Under</h4>
          <div className="flex flex-wrap gap-2">
            {[article.category?.name, 'South Kivu', 'Great Lakes', 'Security', 'DRC'].map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wide rounded-sm hover:bg-slate-200 cursor-pointer transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        </div>

      </article>

      {/* === SIDEBAR === */}
      <Sidebar>
        {/* Pass translated articles to the widget */}
        <TrendingWidget articles={translatedTrendingArticles} lng={currentLanguage} />
        
        {/* Advertisement Placeholder */}
        <div className="bg-slate-100 aspect-square w-full rounded-sm flex flex-col items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-300">
           <span className="font-bold">{t('Advertisement')}</span>
           <span className="text-xs">{t('Support Independent News')}</span>
        </div>
      </Sidebar>

    </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allArticles = [
    FEATURED_ARTICLE,
    ...LATEST_ARTICLES,
    ...TRENDING_ARTICLES
  ];
  
  const paths = languages.flatMap(lng => 
    allArticles.map(article => ({
      params: { lng, slug: article.slug }
    }))
  );

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const allArticles = [
    FEATURED_ARTICLE,
    ...LATEST_ARTICLES,
    ...TRENDING_ARTICLES
  ];
  
  const article = allArticles.find(a => a.slug === params?.slug);

  // FIX: Return 404 if article not found (prevents crash on 'undefined')
  if (!article) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      article,
      lng: params?.lng || 'en',
      ...(await serverSideTranslations(params?.lng as string || locale || 'en', ['common', 'articles'])),
    },
  };
};