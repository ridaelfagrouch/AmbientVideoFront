import React, { useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';
import { CardHeader, CardTitle, CardContent } from "./ui/card";
import type { JamendoTrack } from '../api/api';
import type { VideoOption } from '../types/video';

interface PreviewSectionProps {
    selectedVideo: VideoOption;
    selectedMusic?: JamendoTrack;
    withMusic: boolean;
    generatedVideoUrl?: string | null;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({
    selectedVideo,
    selectedMusic,
    withMusic,
    generatedVideoUrl
}) => {
    const previewRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [selectedVideo, generatedVideoUrl]);

    // Handle audio-video sync
    useEffect(() => {
        const video = videoRef.current;
        const audio = audioRef.current;

        if (video && audio) {
            const handleVideoPlay = () => audio.play();
            const handleVideoPause = () => audio.pause();
            const handleVideoTimeUpdate = () => {
                if (Math.abs(video.currentTime - audio.currentTime) > 0.3) {
                    audio.currentTime = video.currentTime;
                }
            };

            video.addEventListener('play', handleVideoPlay);
            video.addEventListener('pause', handleVideoPause);
            video.addEventListener('timeupdate', handleVideoTimeUpdate);

            return () => {
                video.removeEventListener('play', handleVideoPlay);
                video.removeEventListener('pause', handleVideoPause);
                video.removeEventListener('timeupdate', handleVideoTimeUpdate);
            };
        }
    }, [selectedMusic, withMusic]);

    return (
        <div ref={previewRef}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Camera className="w-6 h-6" />
                    {generatedVideoUrl ? 'Generated Video' : 'Preview'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                    <video
                        ref={videoRef}
                        key={generatedVideoUrl || selectedVideo.preview_url}
                        src={generatedVideoUrl || selectedVideo.preview_url}
                        className="w-full h-full object-cover"
                        controls
                        autoPlay
                        loop
                        muted={withMusic && !generatedVideoUrl}
                        playsInline
                    >
                        <track kind="captions" />
                    </video>

                    {withMusic && selectedMusic && !generatedVideoUrl && (
                        <div className="mt-4">
                            <audio
                                ref={audioRef}
                                src={selectedMusic.audio}
                                loop
                                controls
                                className="w-full"
                            >
                                <track kind="captions" />
                            </audio>
                        </div>
                    )}
                </div>

                {generatedVideoUrl && (
                    <p className="mt-4 text-sm text-gray-500 text-center">
                        This is your generated video with synchronized audio.
                    </p>
                )}
            </CardContent>
        </div>
    );
};

export default PreviewSection;