import React from 'react';
import { Camera } from 'lucide-react';
import { VideoOption } from '../types/video';

interface VideoSelectorProps {
    videos: VideoOption[];
    selectedVideo?: VideoOption;
    onVideoSelect: (video: VideoOption) => void;
    loading: boolean;
}

const VideoSkeleton = () => (
    <div className="animate-pulse">
        <div className="w-full h-[190px] bg-gray-200 rounded-lg" />
    </div>
);

export const VideoSelector: React.FC<VideoSelectorProps> = ({
    videos,
    selectedVideo,
    onVideoSelect,
    loading
}) => {
    const skeletonCount = 9;

    return (
        <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Available Videos
            </h3>

            {/* Container with overflow handling */}
            <div className="relative overflow-x-auto custom-scrollbar">
                <div className="min-h-[620px]">
                    <div
                        className="grid grid-flow-col grid-rows-3 auto-cols-[360px] gap-3"
                        style={{
                            width: videos.length <= 9 ? '100%' : 'max-content',
                            maxWidth: videos.length <= 9 ? '100%' : 'none'
                        }}
                    >
                        {loading ? (
                            // Skeleton loading state
                            [...Array(skeletonCount)].map((_, index) => (
                                <div key={`skeleton-${index}`}>
                                    <VideoSkeleton />
                                </div>
                            ))
                        ) : videos.length === 0 ? (
                            <div className="col-span-full text-center py-8">
                                <p className="text-gray-600">No videos found. Try a different theme.</p>
                            </div>
                        ) : (
                            videos.map(video => (
                                <div
                                    key={video.id}
                                    onClick={() => onVideoSelect(video)}
                                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-colors ${selectedVideo?.id === video.id
                                            ? 'border-blue-500'
                                            : 'border-transparent hover:border-blue-200'
                                        }`}
                                >
                                    <div className="relative group">
                                        <video
                                            src={video.preview_url}
                                            className="w-full h-[190px] object-cover"
                                            muted
                                            loop
                                            onMouseOver={e => e.currentTarget.play()}
                                            onMouseOut={e => {
                                                e.currentTarget.pause();
                                                e.currentTarget.currentTime = 0;
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};