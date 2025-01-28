import React, { useState, useEffect, useRef } from 'react';
import { Download } from 'lucide-react';
import type { VideoSettings } from '../types/video';

interface GenerateButtonProps {
    videoSettings: VideoSettings;
    generating: boolean;
    downloadUrl: string | null;
    onGenerate: (onProgress: (progress: number, status: string) => void) => void;
    onReset: () => void;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
    videoSettings,
    generating,
    downloadUrl,
    onGenerate,
    onReset
}) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('');
    const eventSourceRef = useRef<EventSource | null>(null);
    const isCompleteRef = useRef(false);

    const isDisabled = !videoSettings.selectedVideo ||
        generating ||
        (videoSettings.withMusic && !videoSettings.selectedMusic);

    useEffect(() => {
        return () => {
            // Cleanup EventSource on unmount
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, []);

    const setupEventSource = () => {
        // Close existing EventSource if any
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        // Create new EventSource
        const eventSource = new EventSource('/api/merge/progress');
        eventSourceRef.current = eventSource;

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (typeof data.progress === 'number') {
                    // Ensure progress never goes backwards and is capped at 99% until complete
                    const newProgress = Math.min(Math.round(data.progress), 99);
                    if (!isCompleteRef.current) {
                        setProgress(newProgress);
                        setStatus(data.status || 'Processing...');
                    }
                }
            } catch (err) {
                console.error('Error parsing progress data:', err);
            }
        };

        eventSource.onerror = () => {
            console.error('EventSource failed');
            eventSource.close();
        };

        return eventSource;
    };

    const handleProgress = (newProgress: number, newStatus: string) => {
        // Only handle final completion through this callback
        if (newStatus === "Complete!" || newProgress >= 100) {
            isCompleteRef.current = true;
            setProgress(100);
            setStatus("Complete!");

            // Close EventSource on completion
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
        }
    };

    const handleGenerate = () => {
        setProgress(0);
        setStatus('Preparing generation...');
        isCompleteRef.current = false;

        // Setup SSE before starting generation
        setupEventSource();

        // Start generation process
        onGenerate(handleProgress);
    };

    return (
        <div className="space-y-3">
            {!downloadUrl ? (
                <div className="space-y-2">
                    {generating ? (
                        <div className="space-y-2">
                            <div className="h-12 bg-gray-100 rounded-xl relative overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center text-white gap-2 z-10">
                                    <div className={`rounded-full h-5 w-5 border-3 border-white/30 border-t-white 
                                        ${!isCompleteRef.current ? 'animate-spin' : ''}`}
                                    />
                                    <span className="text-sm font-medium">
                                        {progress}%
                                    </span>
                                </div>
                            </div>
                            <div className="text-center text-sm text-gray-600">
                                {status}
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={handleGenerate}
                            disabled={isDisabled}
                            className={`w-full h-12 rounded-xl font-medium text-white transition-all
                                ${isDisabled
                                    ? 'bg-gray-400'
                                    : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
                                }`}
                        >
                            Generate Video
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-2">
                    <a
                        href={downloadUrl}
                        download={`ambient-video.${videoSettings.format}`}
                        className="flex items-center justify-center gap-2 w-full h-12 rounded-xl font-medium text-white bg-green-500 hover:bg-green-600 transition-colors"
                    >
                        <Download className="w-5 h-5" />
                        Download Video
                    </a>
                    <button
                        onClick={onReset}
                        className="w-full text-sm text-blue-500 hover:text-blue-600"
                    >
                        Generate Another
                    </button>
                </div>
            )}
        </div>
    );
};