import React from 'react';
import { Download } from 'lucide-react';
import type { VideoSettings } from '../types/video';

interface GenerateButtonProps {
    videoSettings: VideoSettings;
    generating: boolean;
    downloadUrl: string | null;
    onGenerate: () => void;
    onReset: () => void;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
    videoSettings,
    generating,
    downloadUrl,
    onGenerate,
    onReset
}) => {
    const isDisabled = !videoSettings.selectedVideo ||
        generating ||
        (videoSettings.withMusic && !videoSettings.selectedMusic);

    return (
        <div className="text-center space-y-4">
            {!downloadUrl ? (
                <button
                    onClick={onGenerate}
                    disabled={isDisabled}
                    className={`px-6 py-3 rounded-lg font-medium text-white transition-all ${isDisabled
                        ? 'bg-gray-400'
                        : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                >
                    {generating ? (
                        <span className="flex items-center gap-2 justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Generating...
                        </span>
                    ) : (
                        'Generate Video'
                    )}
                </button>
            ) : (
                <div className="space-y-2">
                    <a
                        href={downloadUrl}
                        download={`ambient-video.${videoSettings.format}`}
                        className="inline-block px-6 py-3 rounded-lg font-medium text-white bg-green-500 hover:bg-green-600"
                    >
                        <span className="flex items-center gap-2 justify-center">
                            <Download className="w-4 h-4" />
                            Download Video
                        </span>
                    </a>
                    <button
                        onClick={onReset}
                        className="block mx-auto text-sm text-blue-500 hover:text-blue-600"
                    >
                        Generate Another
                    </button>
                </div>
            )}
        </div>
    );
};