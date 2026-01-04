import { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../../components/layouts/Layout';
import ArticleCard from '../../../components/common/ArticleCard';
import { useRouter } from 'next/router';
import { languages } from '../../../i18n/settings';
import { db } from '../../../db';
import { debates } from '../../../db/schema';
import { eq } from 'drizzle-orm';

// Types to match your mock data and component expectations
interface Article {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  main_image_url: string;
  // Ensure category always has a name and optional href
  category: string | { name: string; href?: string; slug?: string };
  published_at: string;
  author_name?: string;
}

interface CategoryPageProps {
  articles: Article[];
  category: { name: string; href: string };
}

export default function CategoryPage({ articles, category }: CategoryPageProps) {
  const router = useRouter();
  const lng = (router.query.lng as string) || 'en';
  useTranslation('common');

  if (router.isFallback) {
    return <div className="p-8 text-center">Loading category...</div>;
  }

  // Fallback title in case category name is missing
  const pageTitle = category?.name || 'Category';

  return (
    <Layout title={pageTitle}>
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8 capitalize">
        {pageTitle}
      </h1>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard 
            key={article.id} 
            article={{
              ...article,
              // IMPACT: Ensure category is always an object with a name
              category: typeof article.category === 'string' 
                ? { name: article.category, href: '#' } 
                : article.category
            }} 
            lng={lng} 
          />
        ))}
        
        {articles.length === 0 && (
           <div className="col-span-full text-center py-12">
             <p className="text-gray-500 text-lg">No articles found in {pageTitle}.</p>
           </div>
        )}
      </div>
    </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const topics = await db.selectDistinct({ topic: debates.topic }).from(debates).execute();

  const paths = languages.flatMap(lng =>
    topics.map(topic => ({
      params: { lng, slug: topic.topic.toLowerCase() }
    }))
  );

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slug = (params?.slug as string) || '';

  const articlesData = await db.select().from(debates).where(eq(debates.topic, slug)).execute();

  const articles = articlesData.map(a => ({
    ...a,
    publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
    createdAt: a.createdAt ? a.createdAt.toISOString() : null,
    category: {
      name: a.topic,
      href: `/category/${a.topic.toLowerCase()}`,
    },
    content: a.summary ? a.summary.split('\n') : [],
    excerpt: a.summary ? a.summary.slice(0, 150) : '',
  }));

  const category = { name: slug, href: `/category/${slug}` };

  return {
    props: {
      articles,
      category,
      lng: params?.lng || 'en',
      ...(await serverSideTranslations(params?.lng as string || locale || 'en', ['common'])),
    },
    revalidate: 60,
  };
};