import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

// Language display names for the loader message
const LANGUAGE_NAMES: Record<string, Record<string, string>> = {
  en: { en: 'English', fr: 'French', sw: 'Swahili', ki: 'Kinyamulenge' },
  fr: { en: 'Anglais', fr: 'Français', sw: 'Swahili', ki: 'Kinyamulenge' },
  sw: { en: 'Kiingereza', fr: 'Kifaransa', sw: 'Kiswahili', ki: 'Kinyamulenge' },
  ki: { en: 'Icyongereza', fr: 'Igifaransa', sw: 'Igiswahiri', ki: 'Ikinyamulenge' },
};

// Page names for display in loader
const PAGE_DISPLAY_NAMES: Record<string, Record<string, string>> = {
  en: {
    'about': 'About Us',
    'contact': 'Contact',
    'our-stance': 'Our Stance',
    'privacy': 'Privacy Policy',
    'terms': 'Terms of Service',
    'articles': 'Articles',
    'debates': 'Debates',
    'category': 'Category',
    'history': 'History',
    'culture': 'Culture',
    'conflict': 'Conflict',
    'stories': 'Stories',
    'politics': 'Politics',
    'humanitarian': 'Humanitarian',
    'news': 'News',
  },
  fr: {
    'about': 'À propos',
    'contact': 'Contact',
    'our-stance': 'Notre position',
    'privacy': 'Confidentialité',
    'terms': 'Conditions',
    'articles': 'Articles',
    'debates': 'Débats',
    'category': 'Catégorie',
    'history': 'Histoire',
    'culture': 'Culture',
    'conflict': 'Conflit',
    'stories': 'Histoires',
    'politics': 'Politique',
    'humanitarian': 'Humanitaire',
    'news': 'Nouvelles',
  },
  sw: {
    'about': 'Kuhusu Sisi',
    'contact': 'Wasiliana',
    'our-stance': 'Msimamo Wetu',
    'privacy': 'Sera ya Faragha',
    'terms': 'Masharti',
    'articles': 'Makala',
    'debates': 'Mijadala',
    'category': 'Kategoria',
    'history': 'Historia',
    'culture': 'Utamaduni',
    'conflict': 'Migogoro',
    'stories': 'Hadithi',
    'politics': 'Siasa',
    'humanitarian': 'Kibinadamu',
    'news': 'Habari',
  },
  ki: {
    'about': 'Turi bande',
    'contact': 'Twandikire',
    'our-stance': 'Iciyumviro Cyacu',
    'privacy': 'Ibanga',
    'terms': 'Amategeko',
    'articles': 'Inkuru',
    'debates': 'Impaka',
    'category': 'Icyiciro',
    'history': 'Amateka',
    'culture': 'Umuco',
    'conflict': 'Intambara',
    'stories': 'Inkuru',
    'politics': 'Politiki',
    'humanitarian': 'Ubufasha',
    'news': 'Amakuru',
  },
};

// Patience messages for long loading times
const PATIENCE_MESSAGES: Record<string, string[]> = {
  en: [
    'Almost there...',
    'Please wait a moment...',
    'Loading content for you...',
    'Thank you for your patience...',
  ],
  fr: [
    'Presque terminé...',
    'Veuillez patienter...',
    'Chargement en cours...',
    'Merci de votre patience...',
  ],
  sw: [
    'Karibu kumaliza...',
    'Tafadhali subiri...',
    'Inapakia maudhui...',
    'Asante kwa uvumilivu wako...',
  ],
  ki: [
    'Hafi kurangira...',
    'Tegereza gato...',
    'Irakurura ibintu...',
    'Urakoze kwihangana...',
  ],
};

/**
 * Determines the type of navigation action and returns appropriate loader message
 */
function getLoaderContext(fromUrl: string, toUrl: string, currentLang: string): {
  type: 'language' | 'page' | 'article' | 'general';
  message: string;
} {
  const lang = currentLang || 'en';
  const langNames = LANGUAGE_NAMES[lang] || LANGUAGE_NAMES['en'];
  const pageNames = PAGE_DISPLAY_NAMES[lang] || PAGE_DISPLAY_NAMES['en'];
  
  // Parse URLs to extract language and path segments
  const fromParts = fromUrl.split('/').filter(Boolean);
  const toParts = toUrl.split('/').filter(Boolean);
  
  const fromLang = fromParts[0];
  const toLang = toParts[0];
  
  // Check if this is a language switch (same path, different language)
  if (fromLang !== toLang && ['en', 'fr', 'sw', 'ki'].includes(toLang)) {
    const targetLangName = langNames[toLang] || toLang.toUpperCase();
    const messages: Record<string, string> = {
      en: `Switching to ${targetLangName}...`,
      fr: `Passage en ${targetLangName}...`,
      sw: `Kubadilisha kwenda ${targetLangName}...`,
      ki: `Guhindura mu ${targetLangName}...`,
    };
    return { type: 'language', message: messages[lang] || messages['en'] };
  }
  
  // Check if navigating to a specific page
  const targetPath = toParts.slice(1); // Remove language prefix
  if (targetPath.length > 0) {
    const firstSegment = targetPath[0].toLowerCase();
    
    // Check for article/debate detail pages
    if (firstSegment === 'articles' && targetPath.length > 1) {
      const messages: Record<string, string> = {
        en: 'Loading article...',
        fr: 'Chargement de l\'article...',
        sw: 'Inapakia makala...',
        ki: 'Irakurura inkuru...',
      };
      return { type: 'article', message: messages[lang] || messages['en'] };
    }
    
    if (firstSegment === 'debates' && targetPath.length > 1) {
      const messages: Record<string, string> = {
        en: 'Loading debate...',
        fr: 'Chargement du débat...',
        sw: 'Inapakia mjadala...',
        ki: 'Irakurura impaka...',
      };
      return { type: 'article', message: messages[lang] || messages['en'] };
    }
    
    // Check for category pages
    if (firstSegment === 'category' && targetPath.length > 1) {
      const categorySlug = targetPath[1].toLowerCase();
      const categoryName = pageNames[categorySlug] || categorySlug;
      const messages: Record<string, string> = {
        en: `Loading ${categoryName}...`,
        fr: `Chargement de ${categoryName}...`,
        sw: `Inapakia ${categoryName}...`,
        ki: `Irakurura ${categoryName}...`,
      };
      return { type: 'page', message: messages[lang] || messages['en'] };
    }
    
    // Check for known static pages
    const pageName = pageNames[firstSegment];
    if (pageName) {
      const messages: Record<string, string> = {
        en: `Navigating to ${pageName}...`,
        fr: `Navigation vers ${pageName}...`,
        sw: `Kwenda ${pageName}...`,
        ki: `Kujya kuri ${pageName}...`,
      };
      return { type: 'page', message: messages[lang] || messages['en'] };
    }
  }
  
  // Default general loading message
  const messages: Record<string, string> = {
    en: 'Fetching latest updates...',
    fr: 'Récupération des dernières mises à jour...',
    sw: 'Inapata sasisho mpya...',
    ki: 'Irakurura amakuru mashya...',
  };
  return { type: 'general', message: messages[lang] || messages['en'] };
}

/**
 * GlobalLoader Component
 * 
 * Displays a full-screen loading overlay during page transitions.
 * Features:
 * - Context-aware messages (language switch, page navigation, etc.)
 * - Animated spinning ring using brand colors (red-600)
 * - Pulsing logo in the center
 * - Patience message after 2 seconds of loading
 */
export default function GlobalLoader() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState('');
  const [showPatience, setShowPatience] = useState(false);
  const [patienceMessage, setPatienceMessage] = useState('');
  const patienceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentLang = i18n?.language || (router.query.lng as string) || 'en';

  useEffect(() => {
    // Handle route change start - show loader with context-aware message
    const handleStart = (url: string) => {
      if (url !== router.asPath) {
        const context = getLoaderContext(router.asPath, url, currentLang);
        setLoaderMessage(context.message);
        setLoading(true);
        setShowPatience(false);
        
        // Set patience message timer (2 seconds)
        patienceTimerRef.current = setTimeout(() => {
          const patienceMessages = PATIENCE_MESSAGES[currentLang] || PATIENCE_MESSAGES['en'];
          const randomIndex = Math.floor(Math.random() * patienceMessages.length);
          setPatienceMessage(patienceMessages[randomIndex]);
          setShowPatience(true);
        }, 2000);
      }
    };

    // Handle route change complete/error - hide loader
    const handleComplete = () => {
      setLoading(false);
      setShowPatience(false);
      if (patienceTimerRef.current) {
        clearTimeout(patienceTimerRef.current);
        patienceTimerRef.current = null;
      }
    };

    // Subscribe to router events
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    // Cleanup event listeners on unmount
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
      if (patienceTimerRef.current) {
        clearTimeout(patienceTimerRef.current);
      }
    };
  }, [router, currentLang]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm">
      {/* Spinning Ring Container */}
      <div className="relative flex items-center justify-center">
        {/* Outer spinning ring using brand colors */}
        <div className="w-24 h-24 rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
        
        {/* Logo in the center with pulse animation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 animate-pulse">
            <Image
              src="/images/logo.jpg"
              alt="Imuhira TV"
              width={56}
              height={56}
              className="rounded-full object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Context-aware loading message */}
      <p className="mt-6 text-slate-300 text-sm font-bold uppercase tracking-widest text-center px-4">
        {loaderMessage}
      </p>

      {/* Patience message - shown after 2 seconds */}
      {showPatience && (
        <p className="mt-3 text-slate-500 text-xs font-medium animate-pulse text-center px-4">
          {patienceMessage}
        </p>
      )}
    </div>
  );
}
