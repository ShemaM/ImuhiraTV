/**
 * Utility function to get translated content based on language code
 * 
 * Language mapping:
 * - 'en' -> base fields (title, excerpt, content)
 * - 'sw' -> Swahili fields (titleSw, excerptSw, contentSw)
 * - 'fr' -> French fields (titleFr, excerptFr, contentFr)
 * - 'ki' -> Kinyamulenge fields (titleKym, excerptKym, contentKym)
 */

export interface ArticleTranslationFields {
  // Base English fields
  title: string;
  excerpt: string | null;
  content: string;
  // Swahili
  titleSw: string | null;
  excerptSw: string | null;
  contentSw: string | null;
  // French
  titleFr: string | null;
  excerptFr: string | null;
  contentFr: string | null;
  // Kinyamulenge
  titleKym: string | null;
  excerptKym: string | null;
  contentKym: string | null;
}

export interface DebateTranslationFields {
  // Base English fields
  title: string;
  summary: string;
  proposerName: string;
  proposerArguments: string;
  opposerName: string;
  opposerArguments: string;
  // Swahili
  titleSw: string | null;
  summarySw: string | null;
  proposerNameSw: string | null;
  proposerArgumentsSw: string | null;
  opposerNameSw: string | null;
  opposerArgumentsSw: string | null;
  // French
  titleFr: string | null;
  summaryFr: string | null;
  proposerNameFr: string | null;
  proposerArgumentsFr: string | null;
  opposerNameFr: string | null;
  opposerArgumentsFr: string | null;
  // Kinyamulenge
  titleKym: string | null;
  summaryKym: string | null;
  proposerNameKym: string | null;
  proposerArgumentsKym: string | null;
  opposerNameKym: string | null;
  opposerArgumentsKym: string | null;
}

export interface TranslatedArticle {
  title: string;
  excerpt: string;
  content: string;
}

export interface TranslatedDebate {
  title: string;
  summary: string;
  proposerName: string;
  proposerArguments: string;
  opposerName: string;
  opposerArguments: string;
}

/**
 * Get translated article content based on language
 * Falls back to English if translation not available
 */
export function getTranslatedArticle(article: ArticleTranslationFields, lng: string): TranslatedArticle {
  switch (lng) {
    case 'sw':
      return {
        title: article.titleSw || article.title,
        excerpt: article.excerptSw || article.excerpt || '',
        content: article.contentSw || article.content,
      };
    case 'fr':
      return {
        title: article.titleFr || article.title,
        excerpt: article.excerptFr || article.excerpt || '',
        content: article.contentFr || article.content,
      };
    case 'ki':
      return {
        title: article.titleKym || article.title,
        excerpt: article.excerptKym || article.excerpt || '',
        content: article.contentKym || article.content,
      };
    default: // 'en' or any other
      return {
        title: article.title,
        excerpt: article.excerpt || '',
        content: article.content,
      };
  }
}

/**
 * Get translated debate content based on language
 * Falls back to English if translation not available
 */
export function getTranslatedDebate(debate: DebateTranslationFields, lng: string): TranslatedDebate {
  switch (lng) {
    case 'sw':
      return {
        title: debate.titleSw || debate.title,
        summary: debate.summarySw || debate.summary,
        proposerName: debate.proposerNameSw || debate.proposerName,
        proposerArguments: debate.proposerArgumentsSw || debate.proposerArguments,
        opposerName: debate.opposerNameSw || debate.opposerName,
        opposerArguments: debate.opposerArgumentsSw || debate.opposerArguments,
      };
    case 'fr':
      return {
        title: debate.titleFr || debate.title,
        summary: debate.summaryFr || debate.summary,
        proposerName: debate.proposerNameFr || debate.proposerName,
        proposerArguments: debate.proposerArgumentsFr || debate.proposerArguments,
        opposerName: debate.opposerNameFr || debate.opposerName,
        opposerArguments: debate.opposerArgumentsFr || debate.opposerArguments,
      };
    case 'ki':
      return {
        title: debate.titleKym || debate.title,
        summary: debate.summaryKym || debate.summary,
        proposerName: debate.proposerNameKym || debate.proposerName,
        proposerArguments: debate.proposerArgumentsKym || debate.proposerArguments,
        opposerName: debate.opposerNameKym || debate.opposerName,
        opposerArguments: debate.opposerArgumentsKym || debate.opposerArguments,
      };
    default: // 'en' or any other
      return {
        title: debate.title,
        summary: debate.summary,
        proposerName: debate.proposerName,
        proposerArguments: debate.proposerArguments,
        opposerName: debate.opposerName,
        opposerArguments: debate.opposerArguments,
      };
  }
}
