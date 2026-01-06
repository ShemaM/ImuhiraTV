// pages/[lng]/articles/[slug].tsx

import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CommentSection from '../../../components/common/CommentSection';

// Component Imports
import Layout from '../../../components/layouts/Layout';
import Sidebar from '../../../components/layouts/Sidebar';
import TrendingWidget from '../../../components/common/TrendingWidget';
import Badge from '../../../components/common/Badge';
import { languages } from '../../../i18n/settings';
import { db } from '../../../db';
import { debates, articles } from '../../../db/schema';
import { desc, eq } from 'drizzle-orm';
import { getTranslatedArticle, getTranslatedDebate } from '../../../lib/get-translated-content';

// Types
interface Category {
  name: string;
  href: string;
}

interface Article {
  id: number | string;
  title: string;
  slug: string;
  excerpt: string;
  mainImageUrl: string;
  authorName: string;
  publishedAt: string;
  category: Category;
  youtubeVideoId?: string | null;
  content: string; 
  // 🟢 UPDATED: Arguments are now HTML strings (Rich Text), not arrays
  faction1Label?: string | null;
  faction2Label?: string | null;
  faction1Arguments?: string | null; 
  faction2Arguments?: string | null;
}

interface PageProps {
  article: Article;
  trendingArticles: Article[];
}

export default function ArticlePage({ article, trendingArticles }: PageProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation(['common', 'articles']);
  const currentLanguage = i18n.language || (router.query.lng as string) || 'en';

  if (router.isFallback) {
    return <div className="p-12 text-center">Loading dispatch...</div>;
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h1 className="text-6xl font-serif font-black mb-6 text-slate-200">404</h1>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Content Unavailable</h2>
        <Link href={`/${currentLanguage}`} className="bg-red-700 text-white px-6 py-3 rounded-sm font-bold uppercase tracking-widest hover:bg-slate-900 transition-colors">
          Return to Front Page
        </Link>
      </div>
    );
  }

  const heroImageSrc = article.youtubeVideoId 
    ? `https://img.youtube.com/vi/${article.youtubeVideoId}/maxresdefault.jpg` 
    : article.mainImageUrl || '/images/placeholder.jpg';

  // 🟢 Check if rich text content exists (simple length check)
  const hasArguments = (article.faction1Arguments && article.faction1Arguments.length > 10) || 
                       (article.faction2Arguments && article.faction2Arguments.length > 10);

  return (
    <Layout title={article.title}>
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* === MAIN COLUMN === */}
        <article className="w-full lg:w-2/3 min-w-0">
          
          <nav className="flex items-center text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">
            <Link href={`/${currentLanguage}`} className="hover:text-red-700 transition-colors">{t('Home')}</Link>
            <span className="mx-2">/</span>
            <Link href={article.category.href} className="text-red-700 hover:underline">
              {t(article.category.name)}
            </Link>
          </nav>

          <header className="mb-8">
            <div className="mb-4">
               <Badge label={t(article.category.name)} />
            </div>
            {/* Added 'break-words' to prevent overflow */}
            <h1 className="text-3xl md:text-5xl font-serif font-black text-slate-900 leading-tight mb-6 wrap-break-word">
              {article.title}
            </h1>
            
            {article.excerpt && (
              <p className="text-xl text-slate-600 leading-relaxed font-serif border-l-4 border-red-700 pl-4 mb-8 italic">
                {article.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between border-t border-b border-slate-200 py-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    {article.authorName || t('Imuhira Staff')}
                  </span>
                </div>
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {article.publishedAt}
              </div>
            </div>
          </header>

          <figure className="mb-10 relative h-64 md:h-96 w-full bg-slate-100 rounded-sm overflow-hidden shadow-sm group">
            <Image 
              src={heroImageSrc}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized={!!article.youtubeVideoId} 
            />
            
            {article.youtubeVideoId && (
               <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/10 transition-colors pointer-events-none">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                     <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
               </div>
            )}
            <figcaption className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/80 to-transparent p-4 pt-12 text-[10px] md:text-xs text-white/90 font-sans">
              {article.youtubeVideoId 
                ? `${t('Video Report')} | ${article.authorName}` 
                : `${t('Image')} | ${article.authorName}`
              }
            </figcaption>
          </figure>

          {article.youtubeVideoId && (
            <div className="my-8 p-6 bg-slate-50 border border-slate-200 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{t('Watch the full report')}</h3>
                <p className="text-slate-500 text-sm">{t('View this segment directly on our YouTube channel.')}</p>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${article.youtubeVideoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-md whitespace-nowrap"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                {t('Watch on YouTube')}
              </a>
            </div>
          )}

          {/* Article Body */}
          <div className="prose prose-slate prose-lg max-w-none wrap-break-word font-serif text-slate-800 
            prose-p:first-of-type:first-letter:text-5xl 
            prose-p:first-of-type:first-letter:font-black 
            prose-p:first-of-type:first-letter:text-slate-900 
            prose-p:first-of-type:first-letter:mr-3 
            prose-p:first-of-type:first-letter:float-left">
            
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              <p className="italic text-slate-500 mt-8">
                 {t('No additional text content available.')}
              </p>
            )}
          </div>

          {/* 🟢 NEW: RICH TEXT ARGUMENTS SECTION */}
          {hasArguments && (
            <div className="my-12 bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-100 px-6 py-4 border-b border-slate-200">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-600 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                  {t('Key Arguments')}
                </h3>
              </div>

              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                
                {/* Group A (Proposer) */}
                <div className="p-6">
                  <h4 className="font-bold text-red-700 mb-4 border-b-2 border-red-100 pb-2 inline-block">
                    {article.faction1Label || 'Group A'}
                  </h4>
                  {/* Rich Text Container */}
                  <div 
                    className="prose prose-sm prose-red max-w-none text-slate-700 leading-relaxed wrap-break-word"
                    dangerouslySetInnerHTML={{ __html: article.faction1Arguments || '' }}
                  />
                </div>

                {/* Group B (Opposer) */}
                <div className="p-6 bg-slate-50/50">
                  <h4 className="font-bold text-blue-700 mb-4 border-b-2 border-blue-100 pb-2 inline-block">
                    {article.faction2Label || 'Group B'}
                  </h4>
                  {/* Rich Text Container */}
                  <div 
                    className="prose prose-sm prose-blue max-w-none text-slate-700 leading-relaxed wrap-break-word"
                    dangerouslySetInnerHTML={{ __html: article.faction2Arguments || '' }}
                  />
                </div>

              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">{t('Filed Under')}</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wide rounded-sm">
                #{article.category.name}
              </span>
            </div>
          </div>

      {/* 🟢 NEW COMMENT SECTION */}
      <CommentSection debateId={article.id} showVerdict={!!hasArguments} />

    
        </article>

        {/* === SIDEBAR === */}
        <Sidebar>
          <TrendingWidget articles={trendingArticles} lng={currentLanguage} />
          
          <div className="bg-slate-50 aspect-square w-full rounded-sm flex flex-col items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-200 mt-8">
             <span className="font-bold uppercase tracking-widest text-xs">{t('Advertisement')}</span>
          </div>
        </Sidebar>

      </div>
    </Layout>
  );
}

// === DATA FETCHING ===

export const getStaticPaths: GetStaticPaths = async () => {
  // Get slugs from both debates and articles tables
  const debatesData = await db.select({ slug: debates.slug }).from(debates);
  const articlesData = await db.select({ slug: articles.slug }).from(articles);
  
  const allSlugs = [
    ...debatesData.filter(d => d.slug !== null).map(d => d.slug as string),
    ...articlesData.filter(a => a.slug !== null).map(a => a.slug as string),
  ];
  
  const langs = languages || ['en'];
  const paths = langs.flatMap(lng => 
    allSlugs.map(slug => ({ params: { lng, slug } }))
  );
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slug = params?.slug as string;
  const lng = params?.lng as string || locale || 'en';
  
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-GB', { 
        day: 'numeric', month: 'long', year: 'numeric' 
    }).format(new Date(date));
  };

  // First, try to find in the articles table (only published articles)
  const articleFromArticles = await db.query.articles.findFirst({
    where: (articles, { and, eq }) => and(
      eq(articles.slug, slug),
      eq(articles.isPublished, true)
    ),
  });

  let article: Article | null = null;

  if (articleFromArticles) {
    // Get translated content based on language
    // Pass the database object directly since it contains all translation fields
    const translated = getTranslatedArticle(articleFromArticles, lng);

    // Map from articles table with translated content
    article = {
      id: articleFromArticles.id,
      title: translated.title,
      slug: articleFromArticles.slug || '',
      mainImageUrl: articleFromArticles.coverImage || '',
      authorName: 'Imuhira Staff',
      publishedAt: formatDate(articleFromArticles.createdAt),
      youtubeVideoId: articleFromArticles.videoUrl || null,
      category: {
        name: 'News',
        href: `/category/news`,
      },
      content: translated.content || '',
      excerpt: translated.excerpt ||
        (translated.content
          ? translated.content.replace(/<[^>]+>/g, '').slice(0, 150) + '...'
          : ''),
      // Articles don't have faction arguments
      faction1Label: null,
      faction2Label: null,
      faction1Arguments: null,
      faction2Arguments: null,
    };
  } else {
    // Fallback to debates table
    const articleFromDebates = await db.query.debates.findFirst({
      where: eq(debates.slug, slug),
    });

    if (articleFromDebates) {
      // Get translated content based on language
      // Pass the database object directly
      const translated = getTranslatedDebate(articleFromDebates, lng);

      article = {
        id: articleFromDebates.id,
        title: translated.title,
        slug: articleFromDebates.slug || '',
        mainImageUrl: articleFromDebates.mainImageUrl || '',
        authorName: 'Imuhira Staff',
        publishedAt: formatDate(articleFromDebates.createdAt),
        youtubeVideoId: articleFromDebates.youtubeVideoId || null,
        category: {
          name: articleFromDebates.category || 'Politics',
          href: `/category/${(articleFromDebates.category || 'politics').toLowerCase()}`,
        },
        content: translated.summary || '',
        excerpt: translated.summary
          ? translated.summary.replace(/<[^>]+>/g, '').slice(0, 150) + '...'
          : '',
        // Rich Text Mapping: Pass raw HTML strings directly
        faction1Label: translated.proposerName || 'Group A',
        faction2Label: translated.opposerName || 'Group B',
        faction1Arguments: translated.proposerArguments,
        faction2Arguments: translated.opposerArguments,
      };
    }
  }

  if (!article) {
    return { notFound: true };
  }

  const trendingData = await db
    .select()
    .from(debates)
    .orderBy(desc(debates.createdAt))
    .limit(5);

  // Get translated trending articles
  const trendingArticles = trendingData.map(a => {
    // Pass the database object directly
    const translated = getTranslatedDebate(a, lng);

    return {
      id: a.id,
      title: translated.title,
      slug: a.slug || '',
      excerpt: translated.summary ? translated.summary.replace(/<[^>]+>/g, '').slice(0, 100) + '...' : '',
      mainImageUrl: a.mainImageUrl || '',
      authorName: 'Imuhira Staff',
      publishedAt: formatDate(a.createdAt),
      category: {
        name: a.category || 'News',
        href: `/category/${(a.category || 'news').toLowerCase()}`
      },
      content: '',
      youtubeVideoId: a.youtubeVideoId || null
    };
  });

  return {
    props: {
      article,
      trendingArticles,
      lng,
      ...(await serverSideTranslations(lng, ['common', 'articles'])),
    },
    revalidate: 60,
  };
};