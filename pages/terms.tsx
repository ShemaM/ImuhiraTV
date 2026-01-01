import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Terms() {
  const { t } = useTranslation('common');

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('Terms of Service')}</h1>
      <div className="prose prose-red max-w-none text-gray-700">
        <h3>{t('1. Acceptance of Terms')}</h3>
        <p>{t('By accessing this website, you agree to be bound by these Terms and Conditions of Use.')}</p>
        <h3>{t('2. Intellectual Property')}</h3>
        <p>{t('All content published on Imuhira is the property of Imuhira and protected by international copyright laws.')}</p>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
