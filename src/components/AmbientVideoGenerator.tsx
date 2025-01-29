import React, { useState, useCallback, useEffect } from 'react';
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
import BackgroundLayout from './BackgroundLayout';
import '../styles/AmbientVideoGenerator.css';
import IntroSection from './IntroSection';

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

    const handleGeneration = async (onProgress: (progress: number, status: string) => void) => {
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
                videoSettings.format,
                onProgress
            );

            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
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
            <BackgroundLayout>
                <div className="min-h-screen p-8 flex items-center justify-center">
                    <div className="glass-container relative rounded-xl p-6 w-full max-w-md">
                        <p className="text-white text-center mb-4">
                            {error instanceof Error ? error.message : 'An error occurred'}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </BackgroundLayout>
        );
    }

    return (
        <BackgroundLayout>
            <div className="min-h-screen py-8 px-4 sm:px-6">
                <div className="relative max-w-6xl mx-auto">
                    <div className="mb-8 space-y-6">
                        {/* Title */}
                        <div className="flex items-center gap-2 text-xl sm:text-2xl font-semibold text-white">
                            <Video className="w-6 h-6 text-blue-400" />
                            Ambient Video Generator
                        </div>

                        <IntroSection />

                        {/* Theme Section */}
                        <div className="glass-container relative rounded-xl p-6">
                            <ThemeSelector
                                selectedTheme={videoSettings.theme}
                                onThemeSelect={onThemeSelect}
                            />
                        </div>

                        {/* Duration Filter */}
                        <div className="glass-container relative rounded-xl p-6">
                            <DurationFilter
                                duration={videoSettings.duration_filter}
                                onDurationChange={(duration) => setVideoSettings(prev => ({
                                    ...prev,
                                    duration_filter: duration
                                }))}
                            />
                        </div>

                        {/* Video Selector */}
                        <div className="glass-container relative rounded-xl p-6">
                            <VideoSelector
                                videos={videos}
                                selectedVideo={videoSettings.selectedVideo}
                                onVideoSelect={handleVideoSelect}
                                loading={isLoadingVideos}
                            />
                        </div>

                        {/* Music Section */}
                        <div className="glass-container relative rounded-xl p-6">
                            <div className="flex items-center gap-3 p-2 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="music-toggle"
                                    checked={videoSettings.withMusic}
                                    onChange={handleMusicToggle}
                                    className="w-4 h-4 rounded border-white/30 text-blue-500 focus:ring-blue-500 bg-white/20"
                                />
                                <label htmlFor="music-toggle" className="text-sm font-medium text-white">
                                    Include Background Music
                                </label>
                            </div>

                            {videoSettings.withMusic && (
                                <div className="mt-4">
                                    <MusicSelector
                                        music={music}
                                        selectedMusic={videoSettings.selectedMusic}
                                        onMusicSelect={handleMusicSelect}
                                        loading={isLoadingMusic}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Format Selector */}
                        <div className="glass-container relative rounded-xl p-6">
                            <FormatSelector
                                format={videoSettings.format}
                                onFormatSelect={handleFormatSelect}
                            />
                        </div>

                        {/* Generate Button */}
                        <div className="pt-4">
                            <GenerateButton
                                videoSettings={videoSettings}
                                generating={generating}
                                downloadUrl={downloadUrl}
                                onGenerate={handleGeneration}
                                onReset={handleReset}
                            />
                        </div>
                    </div>

                    {/* Preview Section */}
                    {videoSettings.selectedVideo && (
                        <div className="glass-container relative rounded-xl p-6 transition-all duration-300 ease-in-out">
                            <PreviewSection
                                selectedVideo={videoSettings.selectedVideo}
                                selectedMusic={videoSettings.selectedMusic}
                                withMusic={videoSettings.withMusic}
                                generatedVideoUrl={downloadUrl}
                            />
                        </div>
                    )}
                </div>
            </div>
        </BackgroundLayout>
    );
};

export default AmbientVideoGenerator;