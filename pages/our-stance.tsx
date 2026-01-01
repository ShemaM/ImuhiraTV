import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function OurStance() {
  const { t } = useTranslation('common');

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-black font-serif uppercase tracking-tighter leading-none text-slate-900 mb-6">
        {t('Our Stance')}
      </h1>
      <div className="prose prose-lg max-w-none">
        <p>
          {t('Imuhira is a platform for the Banyamulenge people to tell their stories and share their culture with the world. We are committed to providing a platform for all voices, and we believe that everyone has the right to be heard.')}
        </p>
        <p>
          {t('We understand that neutrality in a conflict can be seen as a political stance in itself. However, our goal is not to be neutral for the sake of neutrality. Our goal is to be fair and balanced in our reporting, and to provide a platform for all sides of the conflict to express their views. We believe that this is the only way to foster a genuine dialogue and to promote a peaceful resolution to the conflict.')}
        </p>
        <p>
          {t('We are aware that our work has led some to believe that we are aligned with one faction or another. We want to be clear: we are not. We are an independent platform, and we are not affiliated with any political group or militia. Our only allegiance is to the truth and to the Banyamulenge people.')}
        </p>
        <p>
          {t('Most of the articles on this website are derived from interviews that we have conducted with members of the Banyamulenge community. We believe that these interviews are a valuable resource for understanding the conflict and the perspectives of the people who are living it. We encourage you to watch the full interviews, which are embedded in each article, and to draw your own conclusions.')}
        </p>
        <p>
          {t('We are always open to feedback and criticism. If you have any questions or concerns about our work, please do not hesitate to contact us.')}
        </p>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common'])),
  },
});
