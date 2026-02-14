import { AppProps } from 'next/app';
import { AuthProvider } from '../context/AuthContext';
import { ArticleProvider } from '../context/ArticleContext';
import GlobalLoader from '../components/common/GlobalLoader';
import '../styles/globals.css';
import 'react-quill-new/dist/quill.snow.css';
import { appWithTranslation } from 'next-i18next';
import nextI18NextConfig from '../next-i18next.config.js';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ArticleProvider>
        <GlobalLoader />
        <Component {...pageProps} />
      </ArticleProvider>
    </AuthProvider>
  );
}

export default appWithTranslation(MyApp, nextI18NextConfig);
