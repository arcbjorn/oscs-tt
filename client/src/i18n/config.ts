import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import englishTranslation from './en.json';
import russianTranslation from './ru.json';

const resources = {
  en: { englishTranslation },
  ru: { russianTranslation },
} as const;

i18n.use(initReactI18next).init({
  lng: 'en',
  resources,
});

export default resources;
