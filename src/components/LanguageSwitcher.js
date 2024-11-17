// LanguageSelector.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <div class="btn-group" role="group" aria-label="Basic example">
      <button onClick={() => changeLanguage('en')} type="button" class="btn btn-primary">English</button>
      <button onClick={() => changeLanguage('es')} type="button" class="btn btn-primary">Español</button>
    </div>
  );
};

export default LanguageSwitcher;
