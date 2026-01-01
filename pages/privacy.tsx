import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Privacy() {
  const { t } = useTranslation('common');

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('Privacy Policy')}</h1>
      <p className="text-gray-500 mb-8">{t('Last Updated: December 2025')}</p>
      
      <div className="prose prose-red max-w-none text-gray-700">
        <p>{t('Imuhira respects your privacy. This policy describes the types of information we may collect from you.')}</p>
        <h3>{t('1. Information We Collect')}</h3>
        <p>{t('We collect information by which you may be personally identified, such as name and e-mail address when you subscribe to our newsletter.')}</p>
        <h3>{t('2. How We Use Your Information')}</h3>
        <p>{t('We use information that we collect about you to present our Website and to provide you with the news and services that you request from us.')}</p>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
