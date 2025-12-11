import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from '../context/AuthContext';
import { ArticleProvider } from '../context/ArticleContext'; // <--- Import this

// ... (Font configs remain the same) ...

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`font-sans`}>
      <AuthProvider>
        <ArticleProvider> {/* <--- WRAP HERE */}
          <Component {...pageProps} />
        </ArticleProvider>
      </AuthProvider>
    </main>
  );
}