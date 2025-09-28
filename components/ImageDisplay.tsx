import React from 'react';
import { useLocalization } from '../contexts/LocalizationContext';
import { TranslationKey } from '../localization/translations';

interface ImageDisplayProps {
    titleKey: TranslationKey;
    imageUrl: string;
    altText: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ titleKey, imageUrl, altText }) => {
    const { t } = useLocalization();
    return (
        <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
            <h3 className="text-lg font-semibold text-gray-700 p-4 bg-gray-50 border-b">{t(titleKey)}</h3>
            <div className="p-4 flex-grow flex items-center justify-center">
                <img src={imageUrl} alt={altText} className="max-w-full max-h-96 h-auto object-contain rounded-md" />
            </div>
        </div>
    );
};

export default ImageDisplay;