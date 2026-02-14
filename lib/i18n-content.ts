/**
 * Utility functions for getting localized content from database records
 * with fallback to English (default language)
 */

type LanguageCode = 'en' | 'fr' | 'sw' | 'ki';

/**
 * Mapping from URL locale codes to database field suffixes.
 * - 'en' (English): No suffix - uses base field (e.g., 'title')
 * - 'fr' (French): Uses 'Fr' suffix (e.g., 'titleFr')
 * - 'sw' (Swahili): Uses 'Sw' suffix (e.g., 'titleSw')
 * - 'ki' (Kinyamulenge): Uses 'Kym' suffix (e.g., 'titleKym')
 * 
 * Note: 'ki' is the URL/locale code while 'Kym' is the database field suffix
 */
const LANGUAGE_SUFFIX_MAP: Record<LanguageCode, string> = {
  en: '',      // English is the default, no suffix
  fr: 'Fr',    // French
  sw: 'Sw',    // Swahili
  ki: 'Kym',   // Kinyamulenge (URL code 'ki' maps to DB suffix 'Kym')
};

/**
 * Gets the localized value of a field from a database record.
 * Falls back to the English (base) value if the translated value is empty.
 * 
 * @param record - The database record containing the fields
 * @param fieldName - The base field name (e.g., 'title', 'content', 'summary')
 * @param locale - The current locale (e.g., 'en', 'fr', 'sw', 'ki')
 * @returns The localized value or the base value if translation is not available
 * 
 * @example
 * // For an article with { title: 'Hello', titleFr: 'Bonjour' }
 * getLocalizedField(article, 'title', 'fr') // returns 'Bonjour'
 * getLocalizedField(article, 'title', 'en') // returns 'Hello'
 * getLocalizedField(article, 'title', 'sw') // returns 'Hello' (fallback)
 */
export function getLocalizedField<T extends Record<string, unknown>>(
  record: T,
  fieldName: string,
  locale: string
): string {
  const langCode = (locale as LanguageCode) || 'en';
  const suffix = LANGUAGE_SUFFIX_MAP[langCode] || '';
  
  // For English or unknown locales, return the base field
  if (suffix === '') {
    const value = record[fieldName];
    return typeof value === 'string' ? value : '';
  }
  
  // Try to get the translated field (e.g., titleFr, contentSw)
  const translatedFieldName = `${fieldName}${suffix}`;
  const translatedValue = record[translatedFieldName];
  
  // If translation exists and is not empty, return it
  if (typeof translatedValue === 'string' && translatedValue.trim() !== '') {
    return translatedValue;
  }
  
  // Fall back to the base (English) field
  const baseValue = record[fieldName];
  return typeof baseValue === 'string' ? baseValue : '';
}

/**
 * Gets multiple localized fields from a record at once.
 * Useful for getting all translatable fields of an article or debate.
 * 
 * @param record - The database record containing the fields
 * @param fieldNames - Array of base field names to localize
 * @param locale - The current locale
 * @returns Object with field names as keys and localized values
 * 
 * @example
 * const localized = getLocalizedFields(article, ['title', 'excerpt', 'content'], 'fr');
 * // returns { title: 'Bonjour', excerpt: '...', content: '...' }
 */
export function getLocalizedFields<T extends Record<string, unknown>>(
  record: T,
  fieldNames: string[],
  locale: string
): Record<string, string> {
  const result: Record<string, string> = {};
  
  for (const fieldName of fieldNames) {
    result[fieldName] = getLocalizedField(record, fieldName, locale);
  }
  
  return result;
}

/**
 * Helper to get article-specific localized content
 */
export function getLocalizedArticle<T extends Record<string, unknown>>(
  article: T,
  locale: string
): { title: string; excerpt: string; content: string } {
  return {
    title: getLocalizedField(article, 'title', locale),
    excerpt: getLocalizedField(article, 'excerpt', locale),
    content: getLocalizedField(article, 'content', locale),
  };
}

/**
 * Helper to get debate-specific localized content
 */
export function getLocalizedDebate<T extends Record<string, unknown>>(
  debate: T,
  locale: string
): { 
  title: string; 
  summary: string; 
  proposerArguments: string; 
  opposerArguments: string;
} {
  return {
    title: getLocalizedField(debate, 'title', locale),
    summary: getLocalizedField(debate, 'summary', locale),
    proposerArguments: getLocalizedField(debate, 'proposerArguments', locale),
    opposerArguments: getLocalizedField(debate, 'opposerArguments', locale),
  };
}
