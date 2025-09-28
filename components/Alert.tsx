import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

interface AlertProps {
    message: string;
}

const Alert: React.FC<AlertProps> = ({ message }) => {
    const { t } = useLocalization();
    return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
            <p className="font-bold">{t('alertTitle')}</p>
            <p>{message}</p>
        </div>
    );
};

export default Alert;