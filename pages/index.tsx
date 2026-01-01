import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import Sidebar from '../components/layouts/Sidebar';
import HeroArticle from '../components/common/HeroArticle';
import ArticleCard from '../components/common/ArticleCard';
import SectionHeader from '../components/common/SectionHeader';
import TrendingWidget from '../components/common/TrendingWidget';
import { FEATURED_ARTICLE, LATEST_ARTICLES, TRENDING_ARTICLES } from '../constants/mockData';
import Layout from '../components/layouts/Layout';

export default function Home() {
  const router = useRouter();
  const { lng } = router.query;
  const { t } = useTranslation(['common', 'articles']);

  const translatedFeaturedArticle = {
    ...FEATURED_ARTICLE,
    title: t(`articles:featured_article.title`, FEATURED_ARTICLE.title),
    excerpt: t(`articles:featured_article.excerpt`, FEATURED_ARTICLE.excerpt),
  };

  const translatedLatestArticles = LATEST_ARTICLES.map((article, index) => ({
    ...article,
    title: t(`articles:latest_articles.${index}.title`, article.title),
    excerpt: t(`articles:latest_articles.${index}.excerpt`, article.excerpt),
  }));

  const translatedTrendingArticles = TRENDING_ARTICLES.map((article, index) => ({
    ...article,
    title: t(`articles:trending_articles.${index}.title`, article.title),
  }));

  return (
    <Layout>
      {/* 1. HERO SECTION */}
      <HeroArticle article={translatedFeaturedArticle} lng={lng as string} />

      <div className="my-8 text-center">
        <p className="text-sm text-gray-600">
          {t('we are a neutral platform. read our')}{' '}
          <a href="/our-stance" className="text-red-600 hover:underline">
            {t('editorial stance')}
          </a>
          .
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* 2. MAIN CONTENT COLUMN (Left, 2/3 width) */}
        <div className="w-full lg:w-2/3">
          {/* Replaced raw h2 with standardized SectionHeader */}
          <SectionHeader 
            title={t('Latest News')}
            linkHref="/articles" 
            linkText={t('View All News')}
            lng={lng as string}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {translatedLatestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} lng={lng as string} />
            ))}
          </div>
        </div>

        {/* 3. SIDEBAR (Right, 1/3 width) */}
        {/* Replaced raw aside with sticky Sidebar wrapper */}
        <Sidebar>
          {/* Replaced raw list with TrendingWidget */}
          <TrendingWidget articles={translatedTrendingArticles} lng={lng as string} />

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

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'articles'])),
  },
});
