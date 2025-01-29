import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Palette } from 'lucide-react';
import { ThemeCategory } from '../types/theme';
import { getThemesByCategory, getAllCategories, themes } from '../data/themes';

interface ThemeSelectorProps {
    selectedTheme: string;
    onThemeSelect: (themeId: string) => void;
}

interface ScrollState {
    canScrollLeft: boolean;
    canScrollRight: boolean;
}

type CategoryType = ThemeCategory | 'All';

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
    selectedTheme,
    onThemeSelect
}) => {
    const [activeCategory, setActiveCategory] = useState<CategoryType>('All');
    const [scrollState, setScrollState] = useState<ScrollState>({
        canScrollLeft: false,
        canScrollRight: false
    });

    const categories = useMemo(() => ['All', ...getAllCategories()], []);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const displayedThemes = useMemo(() => {
        if (activeCategory === 'All') {
            return themes;
        }
        return getThemesByCategory(activeCategory as ThemeCategory);
    }, [activeCategory]);

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
    }, [displayedThemes]);

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
        <div className="space-y-6 mb-8">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Palette className="w-4 h-4 sm:w-6 sm:h-6" />
                Choose Theme
            </h3>

            {/* Category Navigation */}
            <div className="relative">
                <div className="flex overflow-x-auto pb-2 hide-scrollbar">
                    <div className="flex space-x-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category as CategoryType)}
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

            {/* Themes Container */}
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
                    <div className="grid grid-rows-3 auto-cols-[160px] grid-flow-col gap-3 p-2">
                        {displayedThemes.map(theme => (
                            <ThemeCard
                                key={theme.id}
                                theme={theme}
                                isSelected={selectedTheme === theme.id}
                                onSelect={onThemeSelect}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ThemeCard: React.FC<{
    theme: typeof themes[number];
    isSelected: boolean;
    onSelect: (id: string) => void;
}> = ({ theme, isSelected, onSelect }) => (
    <button
        onClick={() => onSelect(theme.id)}
        className={`w-full p-4 sm:p-3 rounded-lg transition-all
            ${isSelected
                ? 'bg-blue-500 text-white border-transparent'
                : 'bg-white hover:bg-gray-50 border border-gray-200'
            }`}
    >
        <span className="text-2xl sm:text-xl mb-2 sm:mb-1 block">{theme.icon}</span>
        <span className="text-base sm:text-sm font-medium text-black">{theme.name}</span>
        <span className={`text-sm sm:text-xs block mt-1 ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
            {theme.category}
        </span>
    </button>
);