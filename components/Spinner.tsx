import React from 'react';

const Spinner: React.FC = () => {
    return (
        <div className="flex items-center justify-center space-x-2">
            <div className="w-6 h-6 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin"></div>
            <span className="text-gray-600 font-medium">Painting your masterpiece...</span>
        </div>
    );
};

export default Spinner;
