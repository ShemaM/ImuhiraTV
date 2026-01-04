import { AppProps } from 'next/app';
import { AuthProvider } from '../context/AuthContext';
import { ArticleProvider } from '../context/ArticleContext';
import '../styles/globals.css';
import 'react-quill-new/dist/quill.snow.css';
import { appWithTranslation } from 'next-i18next';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ArticleProvider>
        <Component {...pageProps} />
      </ArticleProvider>
    </AuthProvider>
  );
}

export default appWithTranslation(MyApp);
