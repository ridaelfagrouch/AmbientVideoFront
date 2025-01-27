import React, { useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';
import { CardHeader, CardTitle, CardContent } from "./ui/card";
import type { JamendoTrack } from '../api/api';
import type { VideoOption } from '../types/video';

interface PreviewSectionProps {
    selectedVideo: VideoOption;
    selectedMusic?: JamendoTrack;
    withMusic: boolean;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({
    selectedVideo,
    selectedMusic,
    withMusic
}) => {
    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [selectedVideo]);

    return (
        <div ref={previewRef}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Camera className="w-6 h-6" />
                    Preview
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                    <video
                        src={selectedVideo.preview_url}
                        className="w-full h-full object-cover"
                        controls
                        autoPlay
                        loop
                        muted={withMusic}
                    >
                        <track kind="captions" />
                    </video>
                    {withMusic && selectedMusic && (
                        <audio
                            src={selectedMusic.audio}
                            loop
                            controls
                            className="mt-4 w-full"
                        >
                            <track kind="captions" />
                        </audio>
                    )}
                </div>
            </CardContent>
        </div>
    );
};
