// pages/[lng]/articles/[slug].tsx

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
import { languages } from '../../../i18n/settings';
import { db } from '../../../db';
import { debates } from '../../../db/schema';
import { desc, eq } from 'drizzle-orm';

// Types - Updated to match mockData.ts exactly
interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  main_image_url: string;
  author_name: string;
  published_at: string;
  category: {
    name: string;
    href: string;
  };
  youtube_video_id?: string;
  content: string[]; // Added content array
}

export default function ArticlePage({ article, trendingArticles }: { article: Article, trendingArticles: Article[] }) {
  const router = useRouter();
  // Safe language detection: try i18n first, then router, then fallback
  const { t, i18n } = useTranslation(['common', 'articles']);
  const currentLanguage = i18n.language || (router.query.lng as string) || 'en';

  // Handling for Fallback state
  if (router.isFallback) {
    return <div className="p-12 text-center">Loading article...</div>;
  }

  // Handling if article is somehow missing
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

  // Determine which image to show (YouTube Thumbnail vs Custom Image)
  const heroImageSrc = article.youtube_video_id 
    ? `https://img.youtube.com/vi/${article.youtube_video_id}/maxresdefault.jpg` 
    : article.main_image_url;

  return (
    <Layout title={article.title}>
    <div className="flex flex-col lg:flex-row gap-12">
      
      {/* === MAIN COLUMN === */}
      <article className="w-full lg:w-2/3">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">
          <Link href={`/${currentLanguage}`} className="hover:text-red-700 transition-colors">{t('Home')}</Link>
          <span className="mx-2">/</span>
          <span className="text-red-700">{t(article.category.name)}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="mb-4">
             <Badge label={t(article.category.name)} />
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-black text-slate-900 leading-tight mb-6">
            {t(`articles:${article.slug}.title`, { defaultValue: article.title })}
          </h1>
          
          <p className="text-xl text-slate-600 leading-relaxed font-serif border-l-4 border-red-700 pl-4 mb-8 italic">
            {t(`articles:${article.slug}.excerpt`, { defaultValue: article.excerpt })}
          </p>

          {/* Author Metadata Bar */}
          <div className="flex items-center justify-between border-t border-b border-slate-200 py-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  {article.author_name}
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

        {/* Main Image - Uses YouTube thumbnail if ID is present */}
        <figure className="mb-10 relative h-75 md:h-112.5 w-full bg-slate-100 rounded-sm overflow-hidden shadow-sm group">
          <Image 
            src={heroImageSrc}
            alt={t(`articles:${article.slug}.title`, { defaultValue: article.title })}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            unoptimized // Necessary for external YouTube CDN images
          />
          
          {/* Visual Overlay if it is a video */}
          {article.youtube_video_id && (
             <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                   <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
             </div>
          )}

          <figcaption className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/90 to-transparent p-4 pt-12 text-[10px] md:text-xs text-white/90 font-sans">
            {article.youtube_video_id ? 'Video via Imuhira Tv' : 'Image via Imuhira'}
          </figcaption>
        </figure>

        {/* Watch on YouTube Button */}
        {article.youtube_video_id && (
          <div className="my-8 p-6 bg-slate-50 border border-slate-200 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
                <h3 className="font-bold text-slate-900 text-lg">Watch the full report</h3>
                <p className="text-slate-500 text-sm">View this segment directly on our YouTube channel.</p>
            </div>
            <a
              href={`https://www.youtube.com/watch?v=${article.youtube_video_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-md whitespace-nowrap"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              {t('watchOnYouTube', { defaultValue: 'Watch on YouTube' })}
            </a>
          </div>
        )}

        {/* Article Body - DYNAMIC CONTENT RENDERING */}
        <div className="prose prose-slate prose-lg max-w-none font-serif text-slate-800">
          
          {/* Lead Paragraph (First item in content array, with dropcap) */}
          {article.content && article.content.length > 0 ? (
            <>
              <p className="lead">
                <span className="float-left text-5xl font-black text-slate-900 mr-3 -mt-1.5">
                  {article.content[0].charAt(0)}
                </span>
                {article.content[0].slice(1)}
              </p>
              
              {/* Remaining Paragraphs */}
              {article.content.slice(1).map((paragraph, index) => (
                <p key={index}>
                  {paragraph}
                </p>
              ))}
            </>
          ) : (
             <p className="italic text-slate-500 mt-8">
               [This is a video report. Please watch the video above for the full details.]
             </p>
          )}

          {/* Pull Quote Logic (Inserted if content is long enough) */}
          {article.content && article.content.length > 2 && (
             <blockquote className="border-l-4 border-red-700 pl-6 italic text-xl text-slate-700 my-10 bg-slate-50 py-6 pr-6 rounded-r-sm">
                &quot;For the residents of the High Plateaux, this is not just a political abstraction but a daily reality of survival.&quot;
             </blockquote>
          )}

          {/* Standard Footer text for all articles */}
          <p>
            As events unfold, Imuhira will continue to track developments and provide updates from the ground.
          </p>
        </div>

        {/* Tags / Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Filed Under</h4>
          <div className="flex flex-wrap gap-2">
            {[article.category.name, 'South Kivu', 'Great Lakes', 'Security', 'DRC'].map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wide rounded-sm hover:bg-slate-200 cursor-pointer transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        </div>

      </article>

      {/* === SIDEBAR === */}
      <Sidebar>
        <TrendingWidget articles={trendingArticles} lng={currentLanguage} />
        
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
  const allArticles = await db.select({ slug: debates.slug }).from(debates).execute();
  
  const langs = languages || ['en'];

  const paths = langs.flatMap(lng => 
    allArticles.map(article => ({
      params: { lng, slug: article.slug }
    }))
  );

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slug = params?.slug as string;
  const articleData = await db.query.debates.findFirst({
    where: eq(debates.slug, slug),
  });

  if (!articleData) {
    return {
      notFound: true,
    };
  }

  const article = {
    ...articleData,
    publishedAt: articleData.publishedAt ? articleData.publishedAt.toISOString() : null,
    createdAt: articleData.createdAt ? articleData.createdAt.toISOString() : null,
    category: {
      name: articleData.topic,
      href: `/category/${articleData.topic.toLowerCase()}`,
    },
    content: articleData.summary ? articleData.summary.split('\n') : [],
    excerpt: articleData.summary ? articleData.summary.slice(0, 150) : '',
  };

  const trendingArticlesData = await db.select().from(debates).orderBy(desc(debates.publishedAt)).limit(5).execute();

  const trendingArticles = trendingArticlesData.map(a => ({
      ...a,
      publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
      createdAt: a.createdAt ? a.createdAt.toISOString() : null,
      category: {
          name: a.topic,
          href: `/category/${a.topic.toLowerCase()}`
      },
      content: a.summary ? a.summary.split('\n') : [],
      excerpt: a.summary ? a.summary.slice(0, 150) : '',
  }));


  return {
    props: {
      article,
      trendingArticles,
      lng: params?.lng || 'en',
      ...(await serverSideTranslations(params?.lng as string || locale || 'en', ['common', 'articles'])),
    },
    revalidate: 60,
  };
};