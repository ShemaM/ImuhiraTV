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
import CommentSection from '../../../components/common/CommentSection';

// Logic & Data
import { languages } from '../../../i18n/settings';
import { db } from '../../../db';
import { debates, articles } from '../../../db/schema';
import { desc, eq } from 'drizzle-orm';
import { 
  isValidYouTubeVideoId, 
  isValidImageUrl,
  extractAndValidateYouTubeVideoId 
} from '../../../lib/url-validation';

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

  // Handling the loading state for 'blocking' fallback
  if (router.isFallback) {
    return <div className="p-12 text-center font-serif text-slate-500">Loading dispatch...</div>;
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

  const hasArguments = (article.faction1Arguments && article.faction1Arguments.length > 10) || 
                       (article.faction2Arguments && article.faction2Arguments.length > 10);

  return (
    <Layout title={article.title}>
      <div className="flex flex-col lg:flex-row gap-12">
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
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  {article.authorName || t('Imuhira Staff')}
                </span>
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
               <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                     <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
               </div>
            )}
          </figure>

          <div className="prose prose-slate prose-lg max-w-none wrap-break-word font-serif text-slate-800 mb-12">
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              <p className="italic text-slate-500">{t('No additional text content available.')}</p>
            )}
          </div>

          {hasArguments && (
            <div className="my-12 bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                <div className="p-6">
                  <h4 className="font-bold text-red-700 mb-4">{article.faction1Label || 'Group A'}</h4>
                  <div className="prose prose-sm max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: article.faction1Arguments || '' }} />
                </div>
                <div className="p-6 bg-slate-50/50">
                  <h4 className="font-bold text-blue-700 mb-4">{article.faction2Label || 'Group B'}</h4>
                  <div className="prose prose-sm max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: article.faction2Arguments || '' }} />
                </div>
              </div>
            </div>
          )}

          <CommentSection debateId={article.id} showVerdict={!!hasArguments} />
        </article>

        <Sidebar>
          <TrendingWidget articles={trendingArticles} lng={currentLanguage} />
        </Sidebar>
      </div>
    </Layout>
  );
}

// === DATA FETCHING ===

export const getStaticPaths: GetStaticPaths = async () => {
  // ⚡ FIX: We return empty paths and 'blocking' to avoid DB connection during build
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slug = params?.slug as string;
  const currentLocale = (params?.lng as string) || (locale as string) || 'en';

  // Safety Check: If DB is not initialized (common during build scans)
  if (!db) {
    return {
      props: {
        article: {
          id: slug || 'placeholder',
          title: slug || 'Article',
          slug: slug || '',
          excerpt: '',
          mainImageUrl: '/images/placeholder.jpg',
          authorName: 'Imuhira Staff',
          publishedAt: '',
          category: { name: 'News', href: `/${currentLocale}/category/news` },
          content: '',
        },
        trendingArticles: [],
        lng: currentLocale,
        ...(await serverSideTranslations(currentLocale, ['common', 'articles'])),
      },
      revalidate: 60,
    };
  }

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-GB', { 
        day: 'numeric', month: 'long', year: 'numeric' 
    }).format(new Date(date));
  };

  try {
    // 1. Check Articles Table
    const articleFromArticles = await db.query.articles.findFirst({
      where: (articles, { and, eq }) => and(
        eq(articles.slug, slug),
        eq(articles.isPublished, true)
      ),
    });

    let article: Article | null = null;

    if (articleFromArticles) {
      // Validate URLs for security (prevent SSRF with legacy data)
      const coverImage = articleFromArticles.coverImage;
      const validatedCoverImage = (coverImage && isValidImageUrl(coverImage)) 
        ? coverImage 
        : '';
      const validatedVideoId = extractAndValidateYouTubeVideoId(articleFromArticles.videoUrl);

      article = {
        id: articleFromArticles.id,
        title: articleFromArticles.title,
        slug: articleFromArticles.slug || '',
        mainImageUrl: validatedCoverImage,
        authorName: 'Imuhira Staff',
        publishedAt: formatDate(articleFromArticles.createdAt),
        youtubeVideoId: validatedVideoId,
        category: { name: 'News', href: `/${currentLocale}/category/news` },
        content: articleFromArticles.content || '',
        excerpt: articleFromArticles.excerpt || (articleFromArticles.content?.replace(/<[^>]+>/g, '').slice(0, 150) + '...'),
      };
    } else {
      // 2. Check Debates Table
      const articleFromDebates = await db.query.debates.findFirst({
        where: eq(debates.slug, slug),
      });

      if (articleFromDebates) {
        // Validate URLs for security (prevent SSRF with legacy data)
        const mainImageUrl = articleFromDebates.mainImageUrl;
        const validatedMainImageUrl = (mainImageUrl && isValidImageUrl(mainImageUrl)) 
          ? mainImageUrl 
          : '';
        const youtubeVideoId = articleFromDebates.youtubeVideoId;
        const validatedYoutubeVideoId = (youtubeVideoId && isValidYouTubeVideoId(youtubeVideoId)) 
          ? youtubeVideoId 
          : null;

        article = {
          id: articleFromDebates.id,
          title: articleFromDebates.title,
          slug: articleFromDebates.slug || '',
          mainImageUrl: validatedMainImageUrl,
          authorName: 'Imuhira Staff',
          publishedAt: formatDate(articleFromDebates.createdAt),
          youtubeVideoId: validatedYoutubeVideoId,
          category: {
            name: articleFromDebates.category || 'Politics',
            href: `/${currentLocale}/category/${(articleFromDebates.category || 'politics').toLowerCase()}`,
          },
          content: articleFromDebates.summary || '',
          excerpt: articleFromDebates.summary?.replace(/<[^>]+>/g, '').slice(0, 150) + '...',
          faction1Label: articleFromDebates.proposerName,
          faction2Label: articleFromDebates.opposerName,
          faction1Arguments: articleFromDebates.proposerArguments,
          faction2Arguments: articleFromDebates.opposerArguments,
        };
      }
    }

    if (!article) {
      return {
        props: {
          article: {
            id: slug || 'placeholder',
            title: slug || 'Article',
            slug: slug || '',
            excerpt: '',
            mainImageUrl: '/images/placeholder.jpg',
            authorName: 'Imuhira Staff',
            publishedAt: '',
            category: { name: 'News', href: `/${currentLocale}/category/news` },
            content: '',
          },
          trendingArticles: [],
          lng: currentLocale,
          ...(await serverSideTranslations(currentLocale, ['common', 'articles'])),
        },
        revalidate: 60,
      };
    }

    // 3. Fetch Trending
    const trendingData = await db.select().from(debates).orderBy(desc(debates.createdAt)).limit(5);
    const trendingArticles = trendingData.map(a => ({
        id: a.id,
        title: a.title,
        slug: a.slug || '',
        mainImageUrl: a.mainImageUrl || '',
        publishedAt: formatDate(a.createdAt),
        category: { name: a.category || 'News', href: `/${currentLocale}/category/news` },
    }));

    return {
      props: {
        article,
        trendingArticles,
        lng: currentLocale,
        ...(await serverSideTranslations(currentLocale, ['common', 'articles'])),
      },
      revalidate: 60, // Refresh page every 60 seconds
    };
  } catch (error) {
    console.error("Database error during fetch:", error);
    return { notFound: true };
  }
};
