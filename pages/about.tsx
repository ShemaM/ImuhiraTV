import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function About() {
  const { t } = useTranslation('common');

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-serif text-gray-900 mb-6">
          {t('A Voice for the Voiceless.')}
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed font-serif">
          {t('a platform for the banyamulenge people to tell their stories and share their culture with the world.')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center text-gray-400">
           <span className="font-bold">{t('Newsroom Photo Placeholder')}</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('Our Mission')}</h2>
          <div className="prose text-gray-700 space-y-4">
            <p>
              {t('Founded in 2024, we started as a simple newsletter to bridge the gap between complex regional events and the public\'s need for clarity.')}
            </p>
            <p>
              {t('We believe that reliable information is the foundation of a just society. Our team of local journalists works around the clock to verify facts on the ground, bypassing rumors and algorithms.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
