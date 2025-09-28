import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

const Spinner: React.FC = () => {
    const { t } = useLocalization();
    return (
        <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-6 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
            <span className="text-gray-600 font-medium">{t('spinnerLabel')}</span>
        </div>
    );
};

export default Spinner;