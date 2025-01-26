import React, { useRef, useState, useEffect } from 'react';
import { Music, User } from 'lucide-react';
import type { JamendoTrack } from '../api/api';
import { fetchAmbientMusic } from '../api/api';
import '../styles/ThemeSelector.css';

const musicCategories = [
    'relaxing',
    'Ambient',
    'Electronic',
    'Classical',
    'Jazz',
    'Rock',
    'Pop',
    'Folk',
    'World',
    'Instrumental',
    'Acoustic',
    'Orchestral',
    'Piano',
    'Guitar',
    'Chillout',
    'Blues',
    'Latin',
    'Reggae',
    'Soul',
    'Country',
    'Metal',
    'Soundtrack',
    'Lounge',
    'House',
    'Meditation',
    'Techno'
] as const;

type MusicCategory = typeof musicCategories[number];

interface MusicSelectorProps {
    music: JamendoTrack[];
    selectedMusic?: JamendoTrack;
    onMusicSelect: (track: JamendoTrack) => void;
    loading: boolean;
}

// Skeleton component for loading state
const MusicCardSkeleton = () => (
    <div className="p-4 rounded-lg border border-gray-200 animate-pulse">
        <div className="w-full h-32 bg-gray-200 rounded-md mb-2" />
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-1" />
        <div className="flex items-center gap-1 mb-2">
            <div className="w-3 h-3 bg-gray-200 rounded-full" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="w-full h-8 bg-gray-200 rounded" />
    </div>
);

export const MusicSelector: React.FC<MusicSelectorProps> = ({
    music: initialMusic,
    selectedMusic,
    onMusicSelect,
    loading: initialLoading
}) => {
    const [activeCategory, setActiveCategory] = useState<MusicCategory>('Ambient');
    const [music, setMusic] = useState<JamendoTrack[]>(initialMusic);
    const [loading, setLoading] = useState(initialLoading);
    const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

    // Fetch music when category changes
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

    return (
        <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <Music className="w-5 h-5" />
                Background Music
            </h3>

            {/* Music Categories */}
            <div className="relative">
                <div className="flex overflow-x-auto pb-2 hide-scrollbar">
                    <div className="flex space-x-2">
                        {musicCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${activeCategory === category
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

            {/* Music Grid */}
            <div className="max-h-[600px] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading ? (
                        [...Array(6)].map((_, index) => (
                            <MusicCardSkeleton key={`skeleton-${index}`} />
                        ))
                    ) : music.length === 0 ? (
                        <div className="col-span-full text-center py-8">
                            <p className="text-gray-600">No music found in this category. Try another category.</p>
                        </div>
                    ) : (
                        music.map(track => (
                            <div
                                key={track.id}
                                onClick={(e) => handleCardClick(track, e)}
                                className={`p-4 rounded-lg border transition-all cursor-pointer ${selectedMusic?.id === track.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-200'
                                    }`}
                            >
                                {track.image && (
                                    <img
                                        src={track.image}
                                        alt={track.name}
                                        className="w-full h-32 object-cover rounded-md mb-2"
                                    />
                                )}
                                <h4 className="font-medium mb-1">{track.name}</h4>
                                <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {track.artist_name}
                                </p>
                                <div onClick={e => e.stopPropagation()}>
                                    <audio
                                        ref={el => audioRefs.current[track.id] = el}
                                        src={track.audio}
                                        controls
                                        className="w-full"
                                        onPlay={() => handleAudioPlay(track.id)}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};