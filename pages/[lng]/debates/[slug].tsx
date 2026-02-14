// pages/[lng]/debates/[slug].tsx (or wherever this file is located)

import { GetServerSideProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Layout from '../../../components/layouts/Layout';
import Sidebar from '../../../components/layouts/Sidebar';
import TrendingWidget from '../../../components/common/TrendingWidget';
import Badge from '../../../components/common/Badge';
import AdBanner from '../../../components/common/AdBanner';
import { db, debates } from '../../../db';
import { eq, desc } from 'drizzle-orm';
import { isValidYouTubeVideoId, isValidImageUrl } from '../../../lib/url-validation';
import { getLocalizedDebate, getLocalizedField } from '../../../lib/i18n-content';

// Types
interface TrendingArticle {
  id: number | string;
  title: string;
  slug: string;
  category: {
    name: string;
    href: string;
  };
  content: string[];
  excerpt: string;
  publishedAt: string | null;
  createdAt: string | null;
}

interface DebateProps {
  debate: {
    id: number | string;
    title: string;
    slug: string;
    category: string; // Changed from 'topic'
    summary: string | null;
    youtubeVideoId: string | null;
    mainImageUrl: string | null;
    authorName: string | null;
    publishedAt: string | null;
    
    // 🟢 New Merged Fields
    proposerName: string;
    proposerArguments: string;
    opposerName: string;
    opposerArguments: string;
  } | null;
  trendingArticles: TrendingArticle[];
}

export default function DebatePage({ debate, trendingArticles }: DebateProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation(['common', 'articles']);
  const currentLanguage = i18n.language || (router.query.lng as string) || 'en';

  if (router.isFallback) {
    return <div className="p-12 text-center">Loading debate...</div>;
  }

  if (!debate) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <h1 className="text-6xl font-serif font-black mb-6 text-slate-200">404</h1>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Debate Not Found</h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            The debate you are looking for may have been moved or is not yet published.
          </p>
          <Link href={`/${currentLanguage}`} className="bg-red-700 text-white px-6 py-3 rounded-sm font-bold uppercase tracking-widest hover:bg-slate-900 transition-colors">
            Return to Front Page
          </Link>
        </div>
      </Layout>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Layout title={debate.title}>
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* === MAIN COLUMN === */}
        {/* CSS FIX: min-w-0 prevents overflow */}
        <article className="w-full lg:w-2/3 min-w-0">
          
          <nav className="flex items-center text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">
            <Link href={`/${currentLanguage}`} className="hover:text-red-700 transition-colors">{t('Home')}</Link>
            <span className="mx-2">/</span>
            <span className="text-red-700">Debate</span>
          </nav>

          <header className="mb-8">
            <div className="mb-4">
              <Badge label="Debate" />
            </div>
            {/* CSS FIX: break-words */}
            <h1 className="text-3xl md:text-5xl font-serif font-black text-slate-900 leading-tight mb-6 wrap-break-word">
              {debate.title}
            </h1>
            
            {debate.summary && (
              <p className="text-xl text-slate-600 leading-relaxed font-serif border-l-4 border-red-700 pl-4 mb-8 italic">
                {debate.summary}
              </p>
            )}

            {/* THE MOTION */}
            <div className="bg-slate-900 rounded-lg p-8 mb-8 shadow-lg relative overflow-hidden">
               <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
               
               <h2 className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3 flex items-center gap-2">
                 <span>📢</span> The Motion
               </h2>
               <p className="text-2xl font-serif font-bold text-white leading-snug wrap-break-word">
                 &ldquo;{debate.category}&rdquo; {/* Fallback to category as topic, or use title */}
               </p>
            </div>

            <div className="flex items-center justify-between border-t border-b border-slate-200 py-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    {debate.authorName || 'Imuhira Staff'}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Moderator
                  </span>
                </div>
              </div>
              {debate.publishedAt && (
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {formatDate(debate.publishedAt)}
                </div>
              )}
            </div>
          </header>

          <figure className="mb-10 relative h-75 md:h-112.5 w-full bg-slate-100 rounded-sm overflow-hidden shadow-sm group">
            <Image 
              src={debate.youtubeVideoId 
                ? `https://img.youtube.com/vi/${debate.youtubeVideoId}/maxresdefault.jpg`
                : debate.mainImageUrl || '/placeholder-image.jpg'} 
              alt={debate.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              unoptimized
            />
             {debate.youtubeVideoId && (
               <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/10 transition-colors pointer-events-none">
                 <div className="w-16 h-16 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                     <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                 </div>
               </div>
             )}
          </figure>

          {debate.youtubeVideoId && (
            <div className="my-8 flex justify-center">
              <a
                href={`https://www.youtube.com/watch?v=${debate.youtubeVideoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#FF0000] hover:bg-[#D00000] text-white px-8 py-4 rounded-full font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                {t('Watch Full Debate')}
              </a>
            </div>
          )}

          {/* Arguments Section */}
          <div className="my-16 space-y-10">
            <div className="text-center mb-8">
               <h2 className="text-3xl font-serif font-black text-slate-900 inline-block border-b-4 border-red-700 pb-2">
                 Key Arguments
               </h2>
               <p className="text-slate-500 mt-4 max-w-lg mx-auto">
                 We have summarized the core points raised by both factions regarding the motion.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -ml-px"></div>

              {/* Proposer (Faction 1) */}
              <div className="flex flex-col gap-4">
                <div className="bg-blue-600 text-white p-4 rounded-t-lg text-center shadow-sm">
                  <h3 className="text-xl font-bold uppercase tracking-wider">{debate.proposerName}</h3>
                  <p className="text-blue-100 text-xs font-bold mt-1">PROPOSER</p>
                </div>
                <div className="space-y-4">
                   <div className="bg-white border-l-4 border-blue-600 rounded-r-lg shadow-xs p-5 hover:shadow-md transition-shadow">
                     {/* CSS FIX: break-words to handle long HTML text */}
                     <div className="text-slate-800 leading-relaxed font-serif wrap-break-word" dangerouslySetInnerHTML={{ __html: debate.proposerArguments }} />
                   </div>
                </div>
              </div>

              {/* Opposer (Faction 2) */}
              <div className="flex flex-col gap-4">
                <div className="bg-orange-600 text-white p-4 rounded-t-lg text-center shadow-sm">
                  <h3 className="text-xl font-bold uppercase tracking-wider">{debate.opposerName}</h3>
                  <p className="text-orange-100 text-xs font-bold mt-1">OPPOSER</p>
                </div>
                <div className="space-y-4">
                   <div className="bg-white border-l-4 border-orange-600 rounded-r-lg shadow-xs p-5 hover:shadow-md transition-shadow">
                     <div className="text-slate-800 leading-relaxed font-serif wrap-break-word" dangerouslySetInnerHTML={{ __html: debate.opposerArguments }} />
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Engagement */}
          <div className="my-12 bg-white rounded-lg p-8 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-slate-800">
              What do you think?
            </h2>
            <div className="prose max-w-none mb-6">
              <p className="text-slate-600 text-sm">
                {t('We have presented the arguments from both sides. Who do you think made the stronger case? Join the discussion in the comments.')}
              </p>
            </div>
            <button className="text-sm font-bold text-red-700 border border-red-700 px-6 py-2 rounded-sm hover:bg-red-700 hover:text-white transition-colors">
              Post a Comment
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Filed Under</h4>
            <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wide rounded-sm">
                  #{debate.category}
                </span>
            </div>
          </div>

        </article>

        <Sidebar>
          <TrendingWidget articles={trendingArticles} lng={currentLanguage} />
          
          <AdBanner type="sidebar" />
        </Sidebar>

      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
  const slug = params?.slug as string;
  const lng = params?.lng as string || locale || 'en';

  try {
    // 🟢 FETCH: Single query to debates table (using the new column names)
    const [debateData] = await db
      .select()
      .from(debates)
      .where(eq(debates.slug, slug));

    // 🟢 CHECK: Use 'isPublished' instead of status string
    if (!debateData || !debateData.isPublished) {
      return {
        props: {
          debate: null,
          lng,
          ...(await serverSideTranslations(lng, ['common', 'articles'])),
        },
      };
    }

    // Serialize dates and validate URLs for security
    // Only use URLs that pass validation to prevent SSRF
    const validatedYoutubeVideoId = isValidYouTubeVideoId(debateData.youtubeVideoId) 
      ? debateData.youtubeVideoId 
      : null;
    const validatedMainImageUrl = isValidImageUrl(debateData.mainImageUrl) 
      ? debateData.mainImageUrl 
      : null;

    // Get localized content based on current locale
    const localizedDebate = getLocalizedDebate(debateData, lng);

    const serializedDebate = {
      id: debateData.id,
      title: localizedDebate.title,
      slug: debateData.slug || '',
      category: debateData.category || 'Politics', // Map category
      summary: localizedDebate.summary,
      youtubeVideoId: validatedYoutubeVideoId,
      mainImageUrl: validatedMainImageUrl,
      authorName: 'Imuhira Staff',
      publishedAt: debateData.createdAt ? debateData.createdAt.toISOString() : null,
      
      // 🟢 MAP NEW COLUMNS with localized content
      proposerName: debateData.proposerName || 'Proposer',
      proposerArguments: localizedDebate.proposerArguments,
      opposerName: debateData.opposerName || 'Opposer',
      opposerArguments: localizedDebate.opposerArguments,
    };

    const trendingArticlesData = await db
        .select()
        .from(debates)
        .where(eq(debates.isPublished, true))
        .orderBy(desc(debates.createdAt))
        .limit(5)
        .execute();

    const trendingArticles = trendingArticlesData.map(a => {
        // Get localized title for trending articles
        const localizedTitle = getLocalizedField(a, 'title', lng);
        return {
            id: a.id,
            title: localizedTitle,
            slug: a.slug || '',
            category: {
                name: a.category || 'News',
                href: `/${lng}/category/${(a.category || 'news').toLowerCase()}`
            },
            content: [],
            excerpt: getLocalizedField(a, 'summary', lng).slice(0, 100) + '...',
            publishedAt: a.createdAt ? a.createdAt.toISOString() : null,
            createdAt: a.createdAt ? a.createdAt.toISOString() : null,
        };
    });

    return {
      props: {
        debate: serializedDebate,
        trendingArticles,
        lng,
        ...(await serverSideTranslations(lng, ['common', 'articles'])),
      },
    };
  } catch (error) {
    console.error('Error fetching debate:', error);
    return {
      props: {
        debate: null,
        trendingArticles: [],
        lng,
        ...(await serverSideTranslations(lng, ['common', 'articles'])),
      },
    };
  }
};