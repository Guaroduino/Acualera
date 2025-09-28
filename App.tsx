import React, { useState, useCallback } from 'react';
import { ProcessState } from './types';
import { convertToWatercolor } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ImageDisplay from './components/ImageDisplay';
import Spinner from './components/Spinner';
import Button from './components/Button';
import Alert from './components/Alert';

const WandIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v1.046a1 1 0 01-1.428.895L7.9 2.06a1 1 0 01-.172-1.414l.08-.08a1 1 0 011.414 0l2.078.28zM3 5.5A1.5 1.5 0 014.5 4h1a1.5 1.5 0 011.5 1.5v1A1.5 1.5 0 015.5 8h-1A1.5 1.5 0 013 6.5v-1zM1.072 9.928a1 1 0 01.172-1.414l2.078.28a1 1 0 01.895 1.428V12a1 1 0 01-1.046.928l-2.852-.387a1 1 0 01-.895-1.428v-1.185zM12 10a1 1 0 011 1v2.828l4.586-4.586a2 2 0 112.828 2.828L15.828 17H13a1 1 0 01-1-1v-6z" clipRule="evenodd" />
        <path d="M5.5 10A1.5 1.5 0 004 11.5v1A1.5 1.5 0 005.5 14h1A1.5 1.5 0 008 12.5v-1A1.5 1.5 0 006.5 10h-1zM11 11.5a1.5 1.5 0 011.5-1.5h1a1.5 1.5 0 011.5 1.5v1a1.5 1.5 0 01-1.5 1.5h-1a1.5 1.5 0 01-1.5-1.5v-1z" />
    </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


const App: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
    const [watercolorImage, setWatercolorImage] = useState<string | null>(null);
    const [processState, setProcessState] = useState<ProcessState>(ProcessState.IDLE);
    const [error, setError] = useState<string | null>(null);
    const [brushStrokeBoldness, setBrushStrokeBoldness] = useState<number>(50);
    const [colorSaturation, setColorSaturation] = useState<number>(50);
    const [paperTexture, setPaperTexture] = useState<number>(50);
    const [pencilDetail, setPencilDetail] = useState<number>(25);

    const handleImageUpload = useCallback((file: File) => {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError('Invalid file type. Please upload a JPG, PNG, or WEBP image.');
            setProcessState(ProcessState.ERROR);
            return;
        }

        setOriginalImage(file);
        setWatercolorImage(null);
        setError(null);
        setProcessState(ProcessState.IDLE);

        const reader = new FileReader();
        reader.onloadend = () => {
            setOriginalImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleConvertClick = async () => {
        if (!originalImagePreview) {
            setError('Please upload an image first.');
            setProcessState(ProcessState.ERROR);
            return;
        }

        setError(null);
        setProcessState(ProcessState.PROCESSING);
        setWatercolorImage(null);

        try {
            // data:image/png;base64,iVBORw0KGgo...
            const parts = originalImagePreview.split(',');
            const mimeType = parts[0].match(/:(.*?);/)?.[1];
            const base64Data = parts[1];

            if (!mimeType || !base64Data) {
                throw new Error('Could not parse image data.');
            }

            const resultImageUrl = await convertToWatercolor(base64Data, mimeType, brushStrokeBoldness, colorSaturation, paperTexture, pencilDetail);
            setWatercolorImage(resultImageUrl);
            setProcessState(ProcessState.SUCCESS);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
            setError(errorMessage);
            setProcessState(ProcessState.ERROR);
        }
    };

    const handleReset = () => {
        setOriginalImage(null);
        setOriginalImagePreview(null);
        setWatercolorImage(null);
        setError(null);
        setProcessState(ProcessState.IDLE);
        setBrushStrokeBoldness(50);
        setColorSaturation(50);
        setPaperTexture(50);
        setPencilDetail(25);
    };

    const handleDownload = () => {
        if (!watercolorImage) return;
        const link = document.createElement('a');
        link.href = watercolorImage;
        link.download = `watercolor-${originalImage?.name.split('.')[0] ?? 'painting'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const isProcessing = processState === ProcessState.PROCESSING;

    const ControlSliders = () => (
        <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-6 p-6 bg-white rounded-lg shadow-md">
            <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="brush-stroke-slider" className="font-semibold text-gray-700">Brush Stroke Boldness</label>
                    <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">{brushStrokeBoldness}</span>
                </div>
                <input
                    id="brush-stroke-slider"
                    type="range"
                    min="1"
                    max="100"
                    value={brushStrokeBoldness}
                    onChange={(e) => setBrushStrokeBoldness(Number(e.target.value))}
                    disabled={isProcessing}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
                    aria-label="Brush stroke boldness slider"
                />
            </div>
             <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="saturation-slider" className="font-semibold text-gray-700">Color Saturation</label>
                    <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">{colorSaturation}</span>
                </div>
                <input
                    id="saturation-slider"
                    type="range"
                    min="1"
                    max="100"
                    value={colorSaturation}
                    onChange={(e) => setColorSaturation(Number(e.target.value))}
                    disabled={isProcessing}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
                    aria-label="Color saturation slider"
                />
            </div>
             <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="texture-slider" className="font-semibold text-gray-700">Paper Texture</label>
                    <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">{paperTexture}</span>
                </div>
                <input
                    id="texture-slider"
                    type="range"
                    min="1"
                    max="100"
                    value={paperTexture}
                    onChange={(e) => setPaperTexture(Number(e.target.value))}
                    disabled={isProcessing}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
                    aria-label="Paper texture slider"
                />
            </div>
            <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                    <label htmlFor="pencil-slider" className="font-semibold text-gray-700">Pencil Sketch Detail</label>
                    <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">{pencilDetail}</span>
                </div>
                <input
                    id="pencil-slider"
                    type="range"
                    min="0"
                    max="100"
                    value={pencilDetail}
                    onChange={(e) => setPencilDetail(Number(e.target.value))}
                    disabled={isProcessing}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
                    aria-label="Pencil sketch detail slider"
                />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col items-center">
            <Header />
            <main className="container mx-auto p-4 md:p-8 flex-grow w-full">
                <div className="flex flex-col items-center gap-8">
                    {!originalImagePreview && (
                        <ImageUploader onImageUpload={handleImageUpload} disabled={isProcessing} />
                    )}

                    {error && <Alert message={error} />}

                    {originalImagePreview && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
                                <ImageDisplay title="Original Image" imageUrl={originalImagePreview} altText="User uploaded original" />
                                <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                                    <h3 className="text-lg font-semibold text-gray-700 p-4 bg-gray-50 border-b">Watercolor Version</h3>
                                    <div className="p-4 flex-grow flex items-center justify-center min-h-[200px]">
                                        {isProcessing && <Spinner />}
                                        {processState === ProcessState.SUCCESS && watercolorImage && (
                                            <img src={watercolorImage} alt="Watercolor painting" className="max-w-full max-h-96 h-auto object-contain rounded-md" />
                                        )}
                                        {!isProcessing && !watercolorImage && (
                                            <div className="text-center text-gray-500">
                                                <p>Your painting will appear here.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-6 mt-4 w-full">
                                <ControlSliders />
                                <div className="flex items-center gap-4">
                                   <Button onClick={handleConvertClick} disabled={isProcessing}>
                                       <WandIcon />
                                       {isProcessing ? 'Converting...' : 'Convert to Watercolor'}
                                   </Button>
                                    {processState === ProcessState.SUCCESS && watercolorImage && (
                                        <Button onClick={handleDownload} variant="secondary">
                                            <DownloadIcon />
                                            Download Image
                                        </Button>
                                    )}
                                   <Button onClick={handleReset} variant="secondary" disabled={isProcessing}>
                                       Start Over
                                   </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
            <footer className="w-full text-center p-4 text-gray-500 text-sm">
                <p>Powered by Google Gemini</p>
            </footer>
        </div>
    );
};

export default App;