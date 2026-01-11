import { GetServerSideProps } from 'next';
import { fallbackLng } from '../i18n/settings';

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: `/${fallbackLng}`,
    permanent: false,
  },
});

export default function Index() {
  return null;
}
