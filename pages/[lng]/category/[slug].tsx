// pages/[lng]/category/[slug].tsx

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

// Types to match your component expectations
interface Article {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  main_image_url: string;
  category: { name: string; href?: string; slug?: string };
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

  // Capitalize title for display (e.g. "politics" -> "Politics")
  const pageTitle = category?.name 
    ? category.name.charAt(0).toUpperCase() + category.name.slice(1) 
    : 'Category';

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
              article={article} 
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

// === DATA FETCHING ===

export const getStaticPaths: GetStaticPaths = async () => {
  // 1. Fetch distinct categories from the DB
  const categories = await db
    .selectDistinct({ category: debates.category })
    .from(debates)
    .execute();

  // 2. Generate paths for all languages and categories
  const paths = languages.flatMap(lng =>
    categories
      .filter(c => c.category) // Ensure not null
      .map(c => ({
        params: { lng, slug: c.category.toLowerCase() }
      }))
  );

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slug = (params?.slug as string) || '';

  // 1. Fetch articles where category matches the slug
  // Note: We store categories as lowercase in the DB now ('politics'), so exact match works.
  const articlesData = await db
    .select()
    .from(debates)
    .where(eq(debates.category, slug)) 
    .execute();

  // 2. Map DB fields (camelCase) to Component Props (snake_case)
  const articles: Article[] = articlesData.map(a => ({
    id: a.id,
    title: a.title,
    slug: a.slug || '',
    
    // Create excerpt from summary
    excerpt: a.summary 
      ? a.summary.replace(/<[^>]+>/g, '').slice(0, 150) + '...' 
      : '',

    // Map mainImageUrl -> main_image_url
    main_image_url: a.mainImageUrl || '/images/placeholder.jpg',
    
    // Map createdAt -> published_at
    published_at: a.createdAt 
      ? new Date(a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) 
      : '',
      
    author_name: 'Imuhira Staff',
    
    category: {
      name: a.category || slug,
      href: `/category/${(a.category || slug).toLowerCase()}`,
      slug: (a.category || slug).toLowerCase()
    },
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