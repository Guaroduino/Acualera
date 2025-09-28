import React from 'react';
import LanguageSelector from './LanguageSelector';
import { useLocalization } from '../contexts/LocalizationContext';

const PaintBrushIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);


const Header: React.FC = () => {
    const { t } = useLocalization();

    return (
        <header className="relative w-full text-center py-6 bg-white shadow-md">
            <LanguageSelector />
            <div className="flex items-center justify-center gap-3">
                <PaintBrushIcon />
                <h1 className="text-3xl font-bold text-gray-800">
                    {t('headerTitle')}
                </h1>
            </div>
            <p className="text-gray-500 mt-1">{t('headerSubtitle')}</p>
        </header>
    );
};

export default Header;