// pages/[lng]/category/[slug].tsx

import { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../../../components/layouts/Layout';
import ArticleCard from '../../../components/common/ArticleCard';
import { useRouter } from 'next/router';
import { db } from '../../../db';
import { debates } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { CATEGORY_DESCRIPTIONS } from '../../../constants/site';

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

interface CategoryDescription {
  title: string;
  description: string;
  highlights: string[];
}

interface CategoryPageProps {
  articles: Article[];
  category: { name: string; href: string };
  categoryDescription: CategoryDescription | null;
}

export default function CategoryPage({ articles, category, categoryDescription }: CategoryPageProps) {
  const router = useRouter();
  const lng = (router.query.lng as string) || 'en';
  const { t } = useTranslation('common');

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
        
        {articles.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                lng={lng} 
              />
            ))}
          </div>
        ) : (
          <div className="max-w-3xl">
            {categoryDescription ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 font-serif">
                  {t(categoryDescription.title)}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {t(categoryDescription.description)}
                </p>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {t('Topics we cover')}:
                  </h3>
                  <ul className="space-y-2">
                    {categoryDescription.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-600 mr-2">•</span>
                        <span className="text-gray-600">{t(highlight)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 italic">
                    {t('Articles and debates for this category are coming soon. Check back later or subscribe to our newsletter to be notified when new content is published.')}
                  </p>
                </div>
              </div>
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">{t('No articles found in')} {pageTitle}.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

// === DATA FETCHING ===

export const getStaticPaths: GetStaticPaths = async () => {
  // ⚡ FIX: Return empty paths to prevent the build server from connecting to the DB.
  // This avoids the "ECONNREFUSED 127.0.0.1:5432" error.
  return {
    paths: [],
    fallback: 'blocking', // 'blocking' is better than 'true' for SEO and UX here
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slug = (params?.slug as string) || '';
  const slugLower = slug.toLowerCase();
  const currentLng = (params?.lng as string) || (locale as string) || 'en';

  // Get category description - always available even without database
  const categoryDescription = CATEGORY_DESCRIPTIONS[slugLower] || null;
  const category = { name: slug, href: `/category/${slug}` };

  // If no valid category description exists for unknown slugs, return 404
  const validCategories = Object.keys(CATEGORY_DESCRIPTIONS);
  if (!categoryDescription && !validCategories.includes(slugLower)) {
    return { notFound: true };
  }

  // Safety check: if DB didn't initialize, return empty articles with category description
  if (!db) {
    return {
      props: {
        articles: [],
        category,
        categoryDescription,
        lng: currentLng,
        ...(await serverSideTranslations(currentLng, ['common'])),
      },
      revalidate: 60,
    };
  }

  try {
    // 1. Fetch articles where category matches the slug
    const articlesData = await db
      .select()
      .from(debates)
      .where(eq(debates.category, slug)) 
      .execute();

    // 2. Map DB fields
    const articles: Article[] = articlesData.map(a => ({
      id: a.id,
      title: a.title,
      slug: a.slug || '',
      excerpt: a.summary 
        ? a.summary.replace(/<[^>]+>/g, '').slice(0, 150) + '...' 
        : '',
      main_image_url: a.mainImageUrl || '/images/placeholder.jpg',
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

    return {
      props: {
        articles,
        category,
        categoryDescription,
        lng: currentLng,
        ...(await serverSideTranslations(currentLng, ['common'])),
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Database fetch error in category page:", error);
    // Return empty articles with category description if DB is down
    return {
      props: {
        articles: [],
        category,
        categoryDescription,
        lng: currentLng,
        ...(await serverSideTranslations(currentLng, ['common'])),
      },
      revalidate: 60,
    };
  }
};