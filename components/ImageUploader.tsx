import React, { useCallback, useState } from 'react';
import { useLocalization } from '../contexts/LocalizationContext';

interface ImageUploaderProps {
    onImageUpload: (file: File) => void;
    disabled: boolean;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, disabled }) => {
    const [isDragging, setIsDragging] = useState(false);
    const { t } = useLocalization();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImageUpload(e.target.files[0]);
        }
    };

    const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) setIsDragging(true);
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (!disabled && e.dataTransfer.files && e.dataTransfer.files[0]) {
            onImageUpload(e.dataTransfer.files[0]);
        }
    }, [disabled, onImageUpload]);

    return (
        <div className="w-full max-w-lg mx-auto">
            <label
                htmlFor="file-upload"
                className={`flex justify-center w-full h-64 px-4 transition bg-white border-2 ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'} border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <span className="flex items-center space-x-2">
                    <div className="flex flex-col items-center justify-center text-center">
                       <UploadIcon />
                        <span className="font-medium text-gray-600">
                            {t('uploaderPrompt')}{' '}
                            <span className="text-indigo-600 underline">{t('uploaderBrowse')}</span>
                        </span>
                         <p className="text-sm text-gray-500 mt-1">{t('uploaderAcceptedFiles')}</p>
                    </div>
                </span>
                <input
                    id="file-upload"
                    type="file"
                    name="file_upload"
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                    disabled={disabled}
                />
            </label>
        </div>
    );
};

export default ImageUploader;