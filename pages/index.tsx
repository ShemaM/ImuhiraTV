import { GetServerSideProps } from 'next';
import { fallbackLng, languages } from '@/i18n/settings';

const destinationLng = languages.includes(fallbackLng) ? fallbackLng : 'en';

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: `/${destinationLng}`,
    permanent: false,
  },
});

/**
 * This page exists solely to redirect "/" traffic to the default language route.
 */
export default function Index() {
  return null;
}
