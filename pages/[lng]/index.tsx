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
import AdBanner from '../../components/common/AdBanner';
import SubscribeWidget from '../../components/common/SubscribeWidget';
import Layout from '../../components/layouts/Layout';
import { languages } from '../../i18n/settings';
import { db } from '../../db';
import { debates, articles } from '../../db/schema';
import { desc, eq } from 'drizzle-orm';
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

          {/* Advertisement Section */}
          <AdBanner type="sidebar" />

          {/* Newsletter */}
          <SubscribeWidget variant="light" />
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
  const lng = (params?.lng as string) || 'en';
  const translations = await serverSideTranslations(lng, ['common', 'articles']);

  const emptyResponse = {
    props: {
      lng,
      ...translations,
      featuredArticle: null,
      latestArticles: [],
      trendingArticles: [],
    },
    revalidate: 60,
  };

  if (!process.env.DATABASE_URL) {
    return emptyResponse;
  }

  // Fetch published debates
  let allArticles: ArticleUI[] = [];

  try {
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

  // Map debates to ArticleUI format
    const debatesFormatted: ArticleWithRawDate[] = debatesRaw.map(a => ({
      id: a.id,
      title: a.title,
      slug: a.slug || '',
      excerpt: a.summary ? a.summary.replace(/<[^>]+>/g, '').slice(0, 150) + '...' : '',
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
  }));

  // Map articles to ArticleUI format
    const articlesFormatted: ArticleWithRawDate[] = articlesRaw.map(a => ({
      id: a.id,
      title: a.title,
      slug: a.slug || '',
      excerpt: a.excerpt || (a.content ? a.content.replace(/<[^>]+>/g, '').slice(0, 150) + '...' : ''),
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
  }));

  // Combine and sort by creation date (newest first)
    allArticles = [...debatesFormatted, ...articlesFormatted]
      .sort((a, b) => {
        const dateA = a.createdAtRaw ? new Date(a.createdAtRaw).getTime() : 0;
        const dateB = b.createdAtRaw ? new Date(b.createdAtRaw).getTime() : 0;
        return dateB - dateA;
      })
      .map(({ createdAtRaw, ...rest }) => rest); // Remove the temporary sorting field
  } catch (error) {
    console.error('Failed to load articles for home page', error);
    return emptyResponse;
  }

  const featuredArticle = allArticles[0] || null;
  const latestArticles = allArticles.slice(1, 5);
  const trendingArticles = allArticles.slice(0, 5);

  return {
    props: {
      lng,
      ...translations,
      featuredArticle,
      latestArticles,
      trendingArticles,
    },
    revalidate: 60,
  };
};
