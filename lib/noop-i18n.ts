type TranslationOptions = Record<string, unknown>;

export function useTranslation() {
  return {
    t: (key: string, options?: TranslationOptions) =>
      options && 'defaultValue' in options && options.defaultValue !== undefined
        ? String(options.defaultValue)
        : key,
    i18n: { language: "en" },
  };
}

export function appWithTranslation<T>(Component: T) {
  return Component;
}
