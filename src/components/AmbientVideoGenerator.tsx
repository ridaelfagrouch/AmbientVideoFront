import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Video } from 'lucide-react';
import type { JamendoTrack } from '../api/api';
import type { VideoOption, VideoSettings } from '../types/video';
import { useVideos, useMusic } from '../hooks/useMediaQueries';
import { ThemeSelector } from './ThemeSelector';
import { VideoSelector } from './VideoSelector';
import { MusicSelector } from './MusicSelector';
import { PreviewSection } from './PreviewSection';
import { GenerateButton } from './GenerateButton';
import { mergeVideoAndAudio } from '../services/videoService';
import { FormatSelector } from './FormatSelector';
import { DurationFilter } from './DurationFilter';

const AmbientVideoGenerator: React.FC = () => {
    const [videoSettings, setVideoSettings] = useState<VideoSettings>({
        theme: 'nature',
        resolution: '1920x1080',
        withMusic: true,
        format: 'webm',
        duration_filter: 'any'
    });

    const [generating, setGenerating] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    // Use custom hooks for data fetching
    const {
        data: videos = [],
        isLoading: isLoadingVideos,
        error: videoError
    } = useVideos(videoSettings.theme, videoSettings.duration_filter);

    const {
        data: music = [],
        isLoading: isLoadingMusic,
        error: musicError
    } = useMusic(videoSettings.theme, videoSettings.withMusic);

    const handleFormatSelect = useCallback((format: 'webm' | 'mp4' | 'mov') => {
        setVideoSettings(prev => ({ ...prev, format }));
    }, []);

    const onThemeSelect = useCallback((theme: string) => {
        setVideoSettings(prev => ({ ...prev, theme }));
    }, []);

    const handleVideoSelect = useCallback((video: VideoOption) => {
        setVideoSettings(prev => ({ ...prev, selectedVideo: video }));
    }, []);

    const handleMusicSelect = useCallback((track: JamendoTrack) => {
        setVideoSettings(prev => ({ ...prev, selectedMusic: track }));
    }, []);

    const handleMusicToggle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setVideoSettings(prev => ({
            ...prev,
            withMusic: e.target.checked,
            selectedMusic: e.target.checked ? prev.selectedMusic : undefined
        }));
    }, []);

    const handleGeneration = async () => {
        if (!videoSettings.selectedVideo) return;

        setGenerating(true);
        try {
            const videoUrl = videoSettings.selectedVideo.download_url;
            const audioUrl = videoSettings.withMusic && videoSettings.selectedMusic
                ? videoSettings.selectedMusic.audio
                : '';

            const blob = await mergeVideoAndAudio(
                videoUrl,
                audioUrl,
                videoSettings.format
            );

            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);

            const previewVideo = document.querySelector('video');
            if (previewVideo) {
                previewVideo.src = url;
            }
        } catch (error) {
            console.error('Error generating video:', error);
        } finally {
            setGenerating(false);
        }
    };

    const handleReset = useCallback(() => {
        if (downloadUrl) {
            URL.revokeObjectURL(downloadUrl);
            setDownloadUrl(null);
        }
    }, [downloadUrl]);

    useEffect(() => {
        return () => {
            if (downloadUrl) {
                URL.revokeObjectURL(downloadUrl);
            }
        };
    }, [downloadUrl]);

    const error = videoError || musicError;
    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6">
                        <p className="text-red-500 text-center">
                            {error instanceof Error ? error.message : 'An error occurred'}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Retry
                        </button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-2">
            <div className="max-w-6xl mx-auto">
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Video className="w-6 h-6" />
                            Ambient Video Generator
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ThemeSelector
                            selectedTheme={videoSettings.theme}
                            onThemeSelect={onThemeSelect}
                        />

                        <DurationFilter
                            duration={videoSettings.duration_filter}
                            onDurationChange={(duration) => setVideoSettings(prev => ({
                                ...prev,
                                duration_filter: duration
                            }))}
                        />

                        <VideoSelector
                            videos={videos}
                            selectedVideo={videoSettings.selectedVideo}
                            onVideoSelect={handleVideoSelect}
                            loading={isLoadingVideos}
                        />

                        <div className="flex items-center gap-2 mt-4 mb-8">
                            <input
                                type="checkbox"
                                id="music-toggle"
                                checked={videoSettings.withMusic}
                                onChange={handleMusicToggle}
                                className="w-4 h-4"
                            />
                            <label htmlFor="music-toggle" className="text-sm font-medium">
                                Include Background Music
                            </label>
                        </div>

                        {videoSettings.withMusic && (
                            <MusicSelector
                                music={music}
                                selectedMusic={videoSettings.selectedMusic}
                                onMusicSelect={handleMusicSelect}
                                loading={isLoadingMusic}
                            />
                        )}

                        <FormatSelector format={videoSettings.format} onFormatSelect={handleFormatSelect} />

                        <GenerateButton
                            videoSettings={videoSettings}
                            generating={generating}
                            downloadUrl={downloadUrl}
                            onGenerate={handleGeneration}
                            onReset={handleReset}
                        />
                    </CardContent>
                </Card>

                {videoSettings.selectedVideo && (
                    <PreviewSection
                        selectedVideo={videoSettings.selectedVideo}
                        selectedMusic={videoSettings.selectedMusic}
                        withMusic={videoSettings.withMusic}
                    />
                )}
            </div>
        </div>
    );
};

export default AmbientVideoGenerator;