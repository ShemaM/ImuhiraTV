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

interface Argument {
  id: number;
  speakerName: string | null;
  argument: string;
  orderIndex: number;
}

interface DebateProps {
  debate: {
    id: number;
    title: string;
    slug: string;
    topic: string;
    summary: string | null;
    verdict: string;
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
  const { t, i18n } = useTranslation(['common']);
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

            {/* Topic/Question */}
            <div className="bg-slate-100 rounded-lg p-6 mb-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">The Question</h2>
              <p className="text-xl font-serif text-slate-800">{debate.topic}</p>
            </div>

            {/* Author Metadata Bar */}
            <div className="flex items-center justify-between border-t border-b border-slate-200 py-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    {debate.authorName || 'Imuhira Staff'}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Editor
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

          {/* Main Image */}
          {debate.mainImageUrl && (
            <figure className="mb-10 relative h-75 md:h-112.5 w-full bg-slate-100 rounded-sm overflow-hidden shadow-sm">
              <Image 
                src={debate.mainImageUrl} 
                alt={debate.title}
                fill
                className="object-cover"
                unoptimized
              />
            </figure>
          )}

          {/* YouTube Video */}
          {debate.youtubeVideoId && (
            <div className="my-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">
                📺 Watch the Interview
              </h3>
              {debate.youtubeVideoTitle && (
                <p className="text-slate-600 mb-3 italic">{debate.youtubeVideoTitle}</p>
              )}
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${debate.youtubeVideoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-lg"
                ></iframe>
              </div>
            </div>
          )}

          {/* Arguments Section */}
          <div className="my-12 space-y-8">
            <h2 className="text-2xl font-serif font-bold text-slate-900 border-b-2 border-slate-200 pb-4">
              ⚖️ The Debate
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Idubu Arguments */}
              <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-blue-800">Idubu Perspective</h3>
                  <p className="text-sm text-blue-600">Pro-Twirwaneho</p>
                </div>
                <div className="space-y-4">
                  {debate.arguments.idubu.map((arg, index) => (
                    <div key={arg.id || index} className="bg-white rounded-lg p-4">
                      {arg.speakerName && (
                        <p className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
                          {arg.speakerName}
                        </p>
                      )}
                      <p className="text-slate-700 leading-relaxed">&ldquo;{arg.argument}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Akagara Arguments */}
              <div className="bg-orange-50 rounded-lg p-6 border-l-4 border-orange-600">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-orange-800">Akagara Perspective</h3>
                  <p className="text-sm text-orange-600">Pro-Government/FARDC</p>
                </div>
                <div className="space-y-4">
                  {debate.arguments.akagara.map((arg, index) => (
                    <div key={arg.id || index} className="bg-white rounded-lg p-4">
                      {arg.speakerName && (
                        <p className="text-xs font-bold uppercase tracking-wider text-orange-700 mb-2">
                          {arg.speakerName}
                        </p>
                      )}
                      <p className="text-slate-700 leading-relaxed">&ldquo;{arg.argument}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Verdict Section */}
          <div className="my-12 bg-slate-800 rounded-lg p-8 text-white">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>⚖️</span> The Verdict
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{debate.verdict}</p>
            </div>
          </div>

          {/* Neutral Stance Reminder */}
          <div className="mt-12 pt-8 border-t border-slate-200 bg-slate-50 rounded-lg p-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">📌 Our Editorial Stance</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Imuhira is committed to providing a platform for all voices. This debate presents both 
              Idubu and Akagara perspectives fairly. We encourage readers to watch the full interview 
              and draw their own conclusions.{' '}
              <Link href={`/${currentLanguage}/our-stance`} className="text-red-600 hover:underline">
                Read more about our stance →
              </Link>
            </p>
          </div>

          {/* Tags / Footer */}
          <div className="mt-8 pt-8 border-t border-slate-200">
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
          <TrendingWidget articles={TRENDING_ARTICLES} lng={currentLanguage} />
          
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
          ...(await serverSideTranslations(lng, ['common'])),
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
        ...(await serverSideTranslations(lng, ['common'])),
      },
    };
  } catch (error) {
    console.error('Error fetching debate:', error);
    return {
      props: {
        debate: null,
        lng,
        ...(await serverSideTranslations(lng, ['common'])),
      },
    };
  }
};
