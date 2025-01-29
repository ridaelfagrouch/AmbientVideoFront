import React, { useRef, useEffect, useState } from 'react';
import { Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import { VideoOption } from '../types/video';

interface VideoSelectorProps {
    videos: VideoOption[];
    selectedVideo?: VideoOption;
    onVideoSelect: (video: VideoOption) => void;
    loading: boolean;
}

interface ScrollState {
    canScrollLeft: boolean;
    canScrollRight: boolean;
}

const VideoSkeleton = () => (
    <div className="flex-shrink-0 w-full animate-pulse">
        <div className="w-full aspect-video bg-gray-200 rounded-lg" />
    </div>
);

export const VideoSelector: React.FC<VideoSelectorProps> = ({
    videos,
    selectedVideo,
    onVideoSelect,
    loading
}) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
    const [scrollState, setScrollState] = useState<ScrollState>({
        canScrollLeft: false,
        canScrollRight: false
    });

    const checkScrollability = (container: HTMLElement): ScrollState => {
        const hasOverflow = container.scrollWidth > container.clientWidth;
        if (!hasOverflow) {
            return { canScrollLeft: false, canScrollRight: false };
        }

        return {
            canScrollLeft: container.scrollLeft > 0,
            canScrollRight: container.scrollLeft + container.clientWidth < container.scrollWidth - 1
        };
    };

    useEffect(() => {
        const updateScrollState = () => {
            if (scrollContainerRef.current) {
                setScrollState(checkScrollability(scrollContainerRef.current));
            }
        };

        updateScrollState();

        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', updateScrollState);
            window.addEventListener('resize', updateScrollState);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', updateScrollState);
                window.removeEventListener('resize', updateScrollState);
            }
        };
    }, [videos, loading]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = window.innerWidth * 0.8;
            scrollContainerRef.current.scrollTo({
                left: scrollContainerRef.current.scrollLeft +
                    (direction === 'left' ? -scrollAmount : scrollAmount),
                behavior: 'smooth'
            });
        }
    };

    const handleVideoInteraction = (videoId: number, action: 'enter' | 'leave') => {
        const video = videoRefs.current[videoId];
        if (video) {
            if (action === 'enter') {
                video.play().catch(() => {
                    // Handle autoplay failure silently
                });
            } else {
                video.pause();
                video.currentTime = 0;
            }
        }
    };

    return (
        <div className="space-y-4 mb-8">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Camera className="w-4 h-4 sm:w-6 sm:h-6" />
                Available Videos
            </h3>

            <div className="relative group">
                {scrollState.canScrollLeft && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full
                            bg-gray-900/80 shadow-lg hover:bg-gray-900 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                        <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                )}

                {scrollState.canScrollRight && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full
                            bg-gray-900/80 shadow-lg hover:bg-gray-900 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                        <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                )}

                <div
                    ref={scrollContainerRef}
                    className="overflow-x-auto hide-scrollbar"
                >
                    {loading ? (
                        <div className="grid grid-rows-1 sm:grid-rows-3 auto-cols-[280px] sm:auto-cols-[300px] 
                            md:auto-cols-[320px] grid-flow-col gap-3 sm:gap-4 p-2 sm:p-4"
                        >
                            {[...Array(9)].map((_, index) => (
                                <VideoSkeleton key={`skeleton-${index}`} />
                            ))}
                        </div>
                    ) : videos.length === 0 ? (
                        <div className="text-center py-6 sm:py-8">
                            <p className="text-gray-600 text-sm sm:text-base">
                                No videos found. Try a different theme.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-rows-1 sm:grid-rows-3 auto-cols-[280px] sm:auto-cols-[300px] 
                            md:auto-cols-[320px] grid-flow-col gap-3 sm:gap-4 p-2 sm:p-4"
                        >
                            {videos.map(video => (
                                <div
                                    key={video.id}
                                    onClick={() => onVideoSelect(video)}
                                    onMouseEnter={() => handleVideoInteraction(video.id, 'enter')}
                                    onMouseLeave={() => handleVideoInteraction(video.id, 'leave')}
                                    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all
                                        hover:shadow-lg ${selectedVideo?.id === video.id
                                            ? 'border-blue-500 shadow-md'
                                            : 'border-transparent hover:border-blue-200'
                                        }`}
                                >
                                    <div className="relative group aspect-video">
                                        <video
                                            ref={el => videoRefs.current[video.id] = el}
                                            src={video.preview_url}
                                            className="w-full h-full object-cover"
                                            muted
                                            loop
                                            playsInline
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 
                                            group-hover:bg-opacity-10 transition-opacity" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};