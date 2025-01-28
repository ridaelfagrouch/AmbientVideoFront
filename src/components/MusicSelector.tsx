import React, { useRef, useState, useEffect } from 'react';
import { Music, User, ChevronLeft, ChevronRight } from 'lucide-react';
import type { JamendoTrack } from '../types/music';
import { fetchAmbientMusic } from '../api/api';
import '../styles/MusicSelector.css';


const musicCategories = [
    // Core Ambient Categories
    'Ambient',
    'Electronic',
    'Classical',
    'Piano',
    'Cinematic',
    'Meditation',
    'Chillout',
    'Lofi',
    'Instrumental',

    // Moods
    'Relaxing',
    'Peaceful',
    'Calm',
    'Atmospheric',

    // Nature-Based
    'Nature',
    'Ocean',
    'Rain',
    'Forest',

    // Styles
    'Minimal',
    'Drone',
    'Space',
    'World',
    'Jazz',
    'Orchestra',

    // Specialized
    'Sleep',
    'Focus',
    'Zen',
    'Fantasy'
] as const;

type MusicCategory = typeof musicCategories[number];

interface MusicSelectorProps {
    music: JamendoTrack[];
    selectedMusic?: JamendoTrack;
    onMusicSelect: (track: JamendoTrack) => void;
    loading: boolean;
}

const MusicCardSkeleton = () => (
    <div className="flex-shrink-0 w-full p-4 rounded-lg border border-gray-200 animate-pulse">
        <div className="w-full aspect-video bg-gray-200 rounded-md mb-2" />
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-1" />
        <div className="flex items-center gap-1 mb-2">
            <div className="w-3 h-3 bg-gray-200 rounded-full" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="w-full h-8 bg-gray-200 rounded" />
    </div>
);

interface MusicCardProps {
    track: JamendoTrack;
    isSelected: boolean;
    onSelect: (track: JamendoTrack, e: React.MouseEvent) => void;
    onAudioPlay: (trackId: string) => void;
    audioRef: (el: HTMLAudioElement | null) => void;
}

const MusicCard: React.FC<MusicCardProps> = ({
    track,
    isSelected,
    onSelect,
    onAudioPlay,
    audioRef
}) => (
    <div
        onClick={(e) => onSelect(track, e)}
        className={`flex-shrink-0 w-full p-3 sm:p-4 rounded-lg border transition-all cursor-pointer
            ${isSelected
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-200 hover:shadow-md'
            }`}
    >
        <div className="aspect-video relative rounded-lg overflow-hidden mb-3">
            {track.image ? (
                <img
                    src={track.image}
                    alt={track.name}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Music className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
            )}
        </div>

        <h4 className="font-medium text-sm sm:text-base text-gray-900 mb-1 truncate" title={track.name}>
            {track.name}
        </h4>

        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 flex items-center gap-1">
            <User className="w-3 h-3 flex-shrink-0" />
            <span className="truncate" title={track.artist_name}>
                {track.artist_name}
            </span>
        </p>

        <div onClick={e => e.stopPropagation()} className="audio-controls">
            <audio
                ref={audioRef}
                src={track.audio}
                controls
                className="w-full"
                onPlay={() => onAudioPlay(track.id)}
            />
        </div>
    </div>
);

export const MusicSelector: React.FC<MusicSelectorProps> = ({
    music: initialMusic,
    selectedMusic,
    onMusicSelect,
    loading: initialLoading
}) => {
    const [activeCategory, setActiveCategory] = useState<MusicCategory>('Relaxing');
    const [music, setMusic] = useState<JamendoTrack[]>(initialMusic);
    const [loading, setLoading] = useState(initialLoading);
    const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadMusic = async () => {
            setLoading(true);
            try {
                const results = await fetchAmbientMusic(activeCategory);
                setMusic(results);
            } catch (error) {
                console.error('Error loading music:', error);
            }
            setLoading(false);
        };

        loadMusic();
    }, [activeCategory]);

    const handleCardClick = (track: JamendoTrack, e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'AUDIO' || target.closest('audio')) {
            return;
        }

        if (audioRefs.current[track.id]) {
            audioRefs.current[track.id]?.pause();
        }
        onMusicSelect(track);
    };

    const handleAudioPlay = (trackId: string) => {
        Object.entries(audioRefs.current).forEach(([id, audio]) => {
            if (id !== trackId && audio) {
                audio.pause();
            }
        });
    };

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

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                    <Music className="w-4 h-4 sm:w-5 sm:h-5" />
                    Background Music
                </h3>
            </div>

            <div className="relative">
                <div className="flex overflow-x-auto pb-2 hide-scrollbar">
                    <div className="flex gap-1.5 sm:gap-2 px-1">
                        {musicCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base 
                                    whitespace-nowrap transition-all
                                    ${activeCategory === category
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="relative group">
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 sm:p-2 
                        rounded-full bg-white/90 shadow-lg hover:bg-white transition-opacity duration-200
                        opacity-0 group-hover:opacity-100"
                >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <button
                    onClick={() => scroll('right')}
                    className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 sm:p-2 
                        rounded-full bg-white/90 shadow-lg hover:bg-white transition-opacity duration-200
                        opacity-0 group-hover:opacity-100"
                >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <div
                    ref={scrollContainerRef}
                    className="overflow-x-auto hide-scrollbar"
                >
                    {loading ? (
                        <div className="grid grid-rows-1 sm:grid-rows-2 auto-cols-[280px] sm:auto-cols-[300px] 
                            md:auto-cols-[320px] grid-flow-col gap-3 sm:gap-4 p-2 sm:p-4"
                        >
                            {[...Array(6)].map((_, index) => (
                                <MusicCardSkeleton key={`skeleton-${index}`} />
                            ))}
                        </div>
                    ) : music.length === 0 ? (
                        <div className="text-center py-6 sm:py-8">
                            <p className="text-gray-600 text-sm sm:text-base">
                                No music found in this category.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-rows-1 sm:grid-rows-2 auto-cols-[280px] sm:auto-cols-[300px] 
                            md:auto-cols-[320px] grid-flow-col gap-3 sm:gap-4 p-2 sm:p-4"
                        >
                            {music.map(track => (
                                <MusicCard
                                    key={track.id}
                                    track={track}
                                    isSelected={selectedMusic?.id === track.id}
                                    onSelect={handleCardClick}
                                    onAudioPlay={handleAudioPlay}
                                    audioRef={el => audioRefs.current[track.id] = el}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};