// AmbientVideoGenerator.tsx
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

    // const handleGeneration = async () => {
    //     if (!videoSettings.selectedVideo) return;

    //     setGenerating(true);
    //     try {
    //         const videoUrl = videoSettings.selectedVideo.download_url;
    //         const audioUrl = videoSettings.withMusic && videoSettings.selectedMusic
    //             ? videoSettings.selectedMusic.audio
    //             : '';

    //         const blob = await mergeVideoAndAudio(
    //             videoUrl,
    //             audioUrl,
    //             videoSettings.format
    //         );

    //         const url = URL.createObjectURL(blob);
    //         setDownloadUrl(url);
    //     } catch (error) {
    //         console.error('Error generating video:', error);
    //     } finally {
    //         setGenerating(false);
    //     }
    // };

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
            <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-gray-800 overflow-auto">
                <div className="min-h-screen p-8 flex items-center justify-center">
                    <Card className="w-full max-w-md backdrop-blur-sm bg-white/95">
                        <CardContent className="p-6">
                            <p className="text-red-500 text-center">
                                {error instanceof Error ? error.message : 'An error occurred'}
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Retry
                            </button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 overflow-auto">
            <div className="min-h-screen py-8 px-4 sm:px-6">
                <div className="relative max-w-6xl mx-auto">
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl -z-10"
                        aria-hidden="true"
                    />

                    <Card className="mb-8 backdrop-blur-sm bg-white/95 border-white/20 shadow-xl">
                        <CardHeader className="border-b border-gray-100/10">
                            <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                                <Video className="w-6 h-6 text-blue-500" />
                                Ambient Video Generator
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 p-6">
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

                            <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50/90 hover:bg-gray-50 transition-colors">
                                <input
                                    type="checkbox"
                                    id="music-toggle"
                                    checked={videoSettings.withMusic}
                                    onChange={handleMusicToggle}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                                />
                                <label htmlFor="music-toggle" className="text-sm font-medium text-gray-700">
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

                            <FormatSelector
                                format={videoSettings.format}
                                onFormatSelect={handleFormatSelect}
                            />

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
                        <div className="transition-all duration-300 ease-in-out backdrop-blur-sm bg-white/95 border-white/20 shadow-xl rounded-lg">
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
        </div>
    );
};

export default AmbientVideoGenerator;