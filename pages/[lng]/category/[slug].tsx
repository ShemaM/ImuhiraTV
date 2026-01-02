import { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { LATEST_ARTICLES, NAV_LINKS } from '../../../constants/mockData';
import Layout from '../../../components/layouts/Layout';
import ArticleCard from '../../../components/common/ArticleCard';
import { useRouter } from 'next/router';
import { languages } from '../../../i18n/settings';

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
  const categoryPaths = NAV_LINKS
    .filter(link => link.href !== '/') 
    .map((link) => {
      // Robust slug extraction: splits by slash and grabs the last non-empty segment
      const parts = link.href.split('/').filter(Boolean);
      const slug = parts[parts.length - 1]; 
      return slug;
    });

  const paths = languages.flatMap(lng =>
    categoryPaths.map(slug => ({
      params: { lng, slug }
    }))
  );

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slug = (params?.slug as string) || '';

  // 1. Filter Articles
  const articles = LATEST_ARTICLES.filter((article) => {
    const categoryName = typeof article.category === 'string' 
      ? article.category 
      : article.category.name;
    
    // Compare lowercase to avoid 'History' vs 'history' mismatches
    return categoryName.toLowerCase() === slug.toLowerCase();
  });

  // 2. Find Category Object (The Fix)
  // We clean the link href same as we did in getStaticPaths to ensure a match
  const category = NAV_LINKS.find((link) => {
    const parts = link.href.split('/').filter(Boolean);
    const linkSlug = parts[parts.length - 1];
    return linkSlug?.toLowerCase() === slug.toLowerCase();
  });

  return {
    props: {
      articles,
      // If category is not found in NAV_LINKS, create a temporary one from the slug
      category: category || { name: slug, href: '#' },
      lng: params?.lng || 'en',
      ...(await serverSideTranslations(params?.lng as string || locale || 'en', ['common'])),
    },
  };
};