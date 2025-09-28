import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLocalization();

  const buttonClasses = (lang: 'en' | 'es') => 
    `px-3 py-1 text-sm font-semibold rounded-md transition-colors ${
      language === lang 
        ? 'bg-indigo-600 text-white' 
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`;

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2">
      <button onClick={() => setLanguage('en')} className={buttonClasses('en')}>
        EN
      </button>
      <button onClick={() => setLanguage('es')} className={buttonClasses('es')}>
        ES
      </button>
    </div>
  );
};

export default LanguageSelector;
