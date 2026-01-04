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
import { TRENDING_ARTICLES } from '../../../constants/mockData';
import { db, debates, debateArguments } from '../../../db';
import { eq } from 'drizzle-orm';

// Types
interface Argument {
  id: number;
  speakerName: string | null;
  argument: string;
  orderIndex: number;
  createdAt?: string | null; // Added for type safety with serialized data
}

interface DebateProps {
  debate: {
    id: number;
    title: string;
    slug: string;
    topic: string;
    summary: string | null;
    verdict: string; // This is the content for our new section
    youtubeVideoId: string | null;
    youtubeVideoTitle: string | null;
    mainImageUrl: string | null;
    authorName: string | null;
    publishedAt: string | null;
    arguments: {
      idubu: Argument[];
      akagara: Argument[];
    };
  } | null;
}

export default function DebatePage({ debate }: DebateProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation(['common', 'articles']);
  const currentLanguage = i18n.language || (router.query.lng as string) || 'en';

  // Translate trending articles for sidebar
  const translatedTrendingArticles = TRENDING_ARTICLES.map((item, index) => ({
    ...item,
    title: t(`articles:trending_articles.${index}.title`, item.title),
  }));

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
        <article className="w-full lg:w-2/3">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">
            <Link href={`/${currentLanguage}`} className="hover:text-red-700 transition-colors">{t('Home')}</Link>
            <span className="mx-2">/</span>
            <span className="text-red-700">Debate</span>
          </nav>

          {/* Debate Header */}
          <header className="mb-8">
            <div className="mb-4">
              <Badge label="Debate" />
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-black text-slate-900 leading-tight mb-6">
              {debate.title}
            </h1>
            
            {debate.summary && (
              <p className="text-xl text-slate-600 leading-relaxed font-serif border-l-4 border-red-700 pl-4 mb-8 italic">
                {debate.summary}
              </p>
            )}

            {/* THE MOTION: Clearly stated topic */}
            <div className="bg-slate-900 rounded-lg p-8 mb-8 shadow-lg relative overflow-hidden">
               {/* Decorative background element */}
               <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
               
               <h2 className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3 flex items-center gap-2">
                 <span>📢</span> The Motion
               </h2>
               <p className="text-2xl font-serif font-bold text-white leading-snug">
                 &ldquo;{debate.topic}&rdquo;
               </p>
            </div>

            {/* Author Metadata Bar */}
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

          {/* Main Image / Video Thumbnail */}
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
             {/* Play Icon Overlay */}
             {debate.youtubeVideoId && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/10 transition-colors pointer-events-none">
                  <div className="w-16 h-16 bg-red-600/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              )}
          </figure>

          {/* Watch on YouTube Button */}
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
              {/* Vertical Divider (Hidden on mobile) */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -ml-px"></div>

              {/* Idubu Arguments */}
              <div className="flex flex-col gap-4">
                <div className="bg-blue-600 text-white p-4 rounded-t-lg text-center shadow-sm">
                  <h3 className="text-xl font-bold uppercase tracking-wider">Idubu</h3>
                  <p className="text-blue-100 text-xs font-bold mt-1">PRO-TWIRWANEHO</p>
                </div>
                <div className="space-y-4">
                  {debate.arguments.idubu.map((arg, index) => (
                    <div key={arg.id || index} className="bg-white border-l-4 border-blue-600 rounded-r-lg shadow-xs p-5 hover:shadow-md transition-shadow">
                      {arg.speakerName && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            {arg.speakerName}
                          </p>
                        </div>
                      )}
                      <p className="text-slate-800 leading-relaxed font-serif">&ldquo;{arg.argument}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Akagara Arguments */}
              <div className="flex flex-col gap-4">
                <div className="bg-orange-600 text-white p-4 rounded-t-lg text-center shadow-sm">
                  <h3 className="text-xl font-bold uppercase tracking-wider">Akagara</h3>
                  <p className="text-orange-100 text-xs font-bold mt-1">PRO-GOVERNMENT</p>
                </div>
                <div className="space-y-4">
                  {debate.arguments.akagara.map((arg, index) => (
                    <div key={arg.id || index} className="bg-white border-l-4 border-orange-600 rounded-r-lg shadow-xs p-5 hover:shadow-md transition-shadow">
                      {arg.speakerName && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            {arg.speakerName}
                          </p>
                        </div>
                      )}
                      <p className="text-slate-800 leading-relaxed font-serif">&ldquo;{arg.argument}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* === THE VERDICT / CONCLUSION SECTION === */}
          {debate.verdict && (
             <div className="my-16 bg-slate-50 border-y-4 border-slate-900 py-10 px-6 md:px-12">
               <h2 className="text-2xl font-black font-serif text-slate-900 mb-6 flex items-center gap-3">
                 <span>⚖️</span> The Verdict
               </h2>
               <div className="prose prose-lg prose-slate max-w-none font-serif">
                 {/* This displays the editorial conclusion/winner from the DB */}
                 <p>{debate.verdict}</p>
               </div>
               
               <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                 <span>Analysis by Imuhira Political Desk</span>
               </div>
             </div>
          )}

          {/* User Engagement Verdict */}
          <div className="my-12 bg-white rounded-lg p-8 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-slate-800">
              What do you think?
            </h2>
            <div className="prose max-w-none mb-6">
              <p className="text-slate-600 text-sm">
                {t('We have presented the arguments from both sides. Who do you think made the stronger case? Join the discussion in the comments.')}
              </p>
            </div>
            {/* Placeholder for Comment System */}
            <button className="text-sm font-bold text-red-700 border border-red-700 px-6 py-2 rounded-sm hover:bg-red-700 hover:text-white transition-colors">
              Post a Comment
            </button>
          </div>

          {/* Neutral Stance Reminder */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Filed Under</h4>
            <div className="flex flex-wrap gap-2">
              {['Debate', 'Banyamulenge', 'South Kivu', 'Twirwaneho', 'FARDC'].map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wide rounded-sm hover:bg-slate-200 cursor-pointer transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

        </article>

        {/* === SIDEBAR === */}
        <Sidebar>
          <TrendingWidget articles={translatedTrendingArticles} lng={currentLanguage} />
          
          <div className="bg-slate-100 aspect-square w-full rounded-sm flex flex-col items-center justify-center text-slate-400 text-sm border-2 border-dashed border-slate-300">
             <span className="font-bold">{t('Advertisement')}</span>
             <span className="text-xs">{t('Support Independent News')}</span>
          </div>
        </Sidebar>

      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
  const slug = params?.slug as string;
  const lng = params?.lng as string || locale || 'en';

  try {
    // Fetch the debate by slug
    const [debate] = await db
      .select()
      .from(debates)
      .where(eq(debates.slug, slug));

    if (!debate || debate.status !== 'published') {
      return {
        props: {
          debate: null,
          lng,
          ...(await serverSideTranslations(lng, ['common', 'articles'])),
        },
      };
    }

    // Fetch arguments
    const args = await db
      .select()
      .from(debateArguments)
      .where(eq(debateArguments.debateId, debate.id));

    // Serialize dates to strings for JSON
    const serializedDebate = {
      ...debate,
      createdAt: debate.createdAt?.toISOString() || null,
      updatedAt: debate.updatedAt?.toISOString() || null,
      publishedAt: debate.publishedAt?.toISOString() || null,
      arguments: {
        idubu: args
          .filter(a => a.faction === 'idubu')
          .map(a => ({
            ...a,
            createdAt: a.createdAt?.toISOString() || null,
          })),
        akagara: args
          .filter(a => a.faction === 'akagara')
          .map(a => ({
            ...a,
            createdAt: a.createdAt?.toISOString() || null,
          })),
      },
    };

    return {
      props: {
        debate: serializedDebate,
        lng,
        ...(await serverSideTranslations(lng, ['common', 'articles'])),
      },
    };
  } catch (error) {
    console.error('Error fetching debate:', error);
    return {
      props: {
        debate: null,
        lng,
        ...(await serverSideTranslations(lng, ['common', 'articles'])),
      },
    };
  }
};