import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from 'src/local/en/translation.json';
import translationES from 'src/local/es/translation.json';

const resources = {
  en: {
    translation: translationEN,
  },
  es: {
    translation: translationES,
  },
};

// Inicialización de i18next
i18n
  .use(initReactI18next) // Conectar con react-i18next
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; // Exportar la instancia de i18next
