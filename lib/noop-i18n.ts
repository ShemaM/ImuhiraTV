export function useTranslation() {
  return {
    t: (key: string, options?: { defaultValue?: string }) =>
      options?.defaultValue !== undefined ? options.defaultValue : key,
    i18n: { language: "en" },
  };
}

export function appWithTranslation<T>(Component: T) {
  return Component;
}
