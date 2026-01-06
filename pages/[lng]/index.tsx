import { GetStaticProps, GetStaticPaths } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Sidebar from '../../components/layouts/Sidebar';
import HeroArticle from '../../components/common/HeroArticle';
import ArticleCard from '../../components/common/ArticleCard';
import SectionHeader from '../../components/common/SectionHeader';
import TrendingWidget from '../../components/common/TrendingWidget';
import Layout from '../../components/layouts/Layout';
import { languages } from '../../i18n/settings';
import { db } from '../../db';
import { debates, articles } from '../../db/schema';
import { desc, eq } from 'drizzle-orm';
import { getTranslatedArticle, getTranslatedDebate } from '../../lib/get-translated-content';
// We define the interface locally to ensure it matches the mapping below exactly
interface ArticleUI {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  main_image_url: string;
  published_at: string;
  author_name: string;
  category: { name: string; slug?: string };
}

// Internal type for sorting with raw date
interface ArticleWithRawDate extends ArticleUI {
  createdAtRaw: Date | null;
}

interface HomeProps {
  featuredArticle: ArticleUI | null;
  latestArticles: ArticleUI[];
  trendingArticles: ArticleUI[];
}

export default function Home({ featuredArticle, latestArticles, trendingArticles }: HomeProps) {
  const router = useRouter();
  const lng = router.query.lng?.toString() ?? 'en';
  const { t } = useTranslation(['common', 'articles']);

  return (
    <Layout>
      {/* 1. HERO SECTION */}
      {featuredArticle && <HeroArticle article={featuredArticle} lng={lng} />}

      <div className="my-8 text-center">
        <p className="text-sm text-gray-600">
          {t('we are a neutral platform. read our')}{' '}
          <Link href={`/${lng}/our-stance`} className="text-red-600 hover:underline">
            {t('editorial stance')}
          </Link>
          .
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* 2. MAIN CONTENT COLUMN (Left, 2/3 width) */}
        <div className="w-full lg:w-2/3">
          <SectionHeader 
            title={t('Latest News')}
            linkHref="/articles" 
            linkText={t('View All News')}
            lng={lng}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} lng={lng} />
            ))}
          </div>
        </div>

        {/* 3. SIDEBAR (Right, 1/3 width) */}
        <Sidebar>
          {/* Note: Ensure TrendingWidget accepts the ArticleUI shape */}
          <TrendingWidget articles={trendingArticles} lng={lng} />

          {/* Advertisement Placeholder */}
          <div className="bg-gray-100 h-64 rounded-lg flex flex-col items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-300">
            <span className="font-bold">{t('Advertisement')}</span>
            <span className="text-xs">300x250</span>
          </div>

          {/* Newsletter */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">{t('Subscribe')}</h3>
            <p className="text-sm text-gray-600 mb-4">{t('Get the latest updates delivered to your inbox.')}</p>
            <input 
              type="email" 
              placeholder={t('Your email address')}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-sm"
            />
            <button className="w-full bg-red-600 text-white text-sm font-bold py-2 rounded hover:bg-red-700 transition-colors">
              {t('Join Now')}
            </button>
          </div>
        </Sidebar>

      </div>
    </Layout>
  );
}


export const getStaticPaths: GetStaticPaths = async () => {
  const paths = languages.map(lng => ({ params: { lng } }));
  
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const lng = params?.lng as string || 'en';

  // Fetch published debates
  const debatesRaw = await db
    .select()
    .from(debates)
    .where(eq(debates.isPublished, true))
    .orderBy(desc(debates.createdAt))
    .execute();

  // Fetch published articles from the articles table
  const articlesRaw = await db
    .select()
    .from(articles)
    .where(eq(articles.isPublished, true))
    .orderBy(desc(articles.createdAt))
    .execute();

  // Map debates to ArticleUI format with translations
  const debatesFormatted: ArticleWithRawDate[] = debatesRaw.map(a => {
    // Pass the database object directly since it contains all translation fields
    const translated = getTranslatedDebate(a, lng);

    return {
      id: a.id,
      title: translated.title,
      slug: a.slug || '',
      excerpt: translated.summary ? translated.summary.replace(/<[^>]+>/g, '').slice(0, 150) + '...' : '',
      main_image_url: a.mainImageUrl || '/images/placeholder.jpg',
      published_at: a.createdAt 
        ? new Date(a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) 
        : '',
      author_name: 'Imuhira Staff',
      category: { 
        name: a.category || 'Politics', 
        slug: (a.category || 'politics').toLowerCase() 
      },
      createdAtRaw: a.createdAt,
    };
  });

  // Map articles to ArticleUI format with translations
  const articlesFormatted: ArticleWithRawDate[] = articlesRaw.map(a => {
    // Pass the database object directly since it contains all translation fields
    const translated = getTranslatedArticle(a, lng);

    return {
      id: a.id,
      title: translated.title,
      slug: a.slug || '',
      excerpt: translated.excerpt || (translated.content ? translated.content.replace(/<[^>]+>/g, '').slice(0, 150) + '...' : ''),
      main_image_url: a.coverImage || '/images/placeholder.jpg',
      published_at: a.createdAt 
        ? new Date(a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) 
        : '',
      author_name: 'Imuhira Staff',
      category: { 
        name: 'News', 
        slug: 'news' 
      },
      createdAtRaw: a.createdAt,
    };
  });

  // Combine and sort by creation date (newest first)
  const allArticles: ArticleUI[] = [...debatesFormatted, ...articlesFormatted]
    .sort((a, b) => {
      const dateA = a.createdAtRaw ? new Date(a.createdAtRaw).getTime() : 0;
      const dateB = b.createdAtRaw ? new Date(b.createdAtRaw).getTime() : 0;
      return dateB - dateA;
    })
    .map(({ createdAtRaw, ...rest }) => rest); // Remove the temporary sorting field

  const featuredArticle = allArticles[0] || null;
  const latestArticles = allArticles.slice(1, 5);
  const trendingArticles = allArticles.slice(0, 5);

  return {
    props: {
      lng,
      ...(await serverSideTranslations(lng, ['common', 'articles'])),
      featuredArticle,
      latestArticles,
      trendingArticles,
    },
    revalidate: 60,
  };
};