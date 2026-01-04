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
import { debates } from '../../db/schema';
import { desc } from 'drizzle-orm';
import { Article } from '../../types';

interface HomeProps {
  featuredArticle: Article;
  latestArticles: Article[];
  trendingArticles: Article[];
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
          <TrendingWidget articles={trendingArticles} lng={lng} />

          {/* Advertisement Placeholder */}
          <div className="bg-gray-100 h-64 rounded-lg flex flex-col items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-300">
            <span className="font-bold">{t('Advertisement')}</span>
            <span className="text-xs">300x250</span>
          </div>

          {/* Newsletter (Optional Sidebar Module) */}
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
  const allArticlesRaw = await db.select().from(debates).orderBy(desc(debates.publishedAt)).execute();

  const allArticles = allArticlesRaw.map(a => ({
    ...a,
    publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
    createdAt: a.createdAt ? a.createdAt.toISOString() : null,
  }));

  const featuredArticle = allArticles[0] || null;
  const latestArticles = allArticles.slice(1, 5);
  // For now, "trending" is the same as "latest".
  const trendingArticles = allArticles.slice(0, 5);

  return {
    props: {
      lng: params?.lng || 'en',
      ...(await serverSideTranslations(params?.lng as string || 'en', ['common', 'articles'])),
      featuredArticle,
      latestArticles,
      trendingArticles,
    },
    revalidate: 60, // Re-generate the page every 60 seconds
  };
};
