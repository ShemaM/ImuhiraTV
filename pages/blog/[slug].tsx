import { GetServerSideProps } from 'next';
import { db } from '../../db';
import { articles } from '../../db/schema';
import { eq } from 'drizzle-orm';
import Head from 'next/head';
import Image from 'next/image';
import { extractAndValidateYouTubeVideoId } from '../../lib/url-validation';

interface ArticleProps {
  article: {
    title: string;
    content: string;
    videoUrl: string | null;
    coverImage: string | null;
    createdAt: string;
  } | null;
}

// Helper to convert YouTube watch URL to Embed URL (with validation)
const getEmbedUrl = (url: string | null) => {
  const videoId = extractAndValidateYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

export default function BlogPost({ article }: ArticleProps) {
  if (!article) return <div className="text-center py-20">Article not found</div>;

  const embedUrl = getEmbedUrl(article.videoUrl);

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <Head>
        <title>{article.title} | Daily Pulse</title>
      </Head>

      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
          {article.title}
        </h1>
        <div className="text-slate-500 text-sm">
          Published on {new Date(article.createdAt).toLocaleDateString(undefined, {
            year: 'numeric', month: 'long', day: 'numeric'
          })}
        </div>
      </header>

      {/* 1. YouTube Video Embed (If available) */}
      {embedUrl ? (
        <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl mb-12 bg-black">
          <iframe
            src={embedUrl}
            title={article.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : article.coverImage ? (
        /* Fallback to Cover Image if no video */
        <div className="relative w-full h-auto mb-12">
          <Image 
            src={article.coverImage} 
            alt={article.title} 
            width={1200}
            height={675}
            className="w-full h-auto rounded-xl shadow-lg" 
            priority
          />
        </div>
      ) : null}

      {/* 2. Rich Text Content */}
      <div 
        className="prose prose-lg prose-slate max-w-none 
                   prose-headings:font-black prose-headings:text-slate-900
                   prose-p:leading-relaxed prose-p:text-slate-700
                   prose-blockquote:border-red-600 prose-blockquote:bg-slate-50 prose-blockquote:py-1"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!process.env.DATABASE_URL) {
    return { notFound: true };
  }

  const slug = params?.slug as string;

  const [data] = await db
    .select()
    .from(articles)
    .where(eq(articles.slug, slug))
    .limit(1);

  if (!data || !data.isPublished) {
    return { notFound: true };
  }

  return {
    props: {
      article: {
        ...data,
        createdAt: data.createdAt?.toISOString() || null,
        updatedAt: data.updatedAt?.toISOString() || null,
      },
    },
  };
};
