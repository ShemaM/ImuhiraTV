type TranslationOptions = Record<string, unknown>;

type Namespace = string | string[] | undefined;

export function useTranslation(_namespaces?: Namespace) {
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
