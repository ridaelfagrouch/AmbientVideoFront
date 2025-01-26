import React, { useState, useMemo } from 'react';
import { ThemeCategory } from '../types/theme';
import { getThemesByCategory, getAllCategories, themes } from '../data/themes';

interface ThemeSelectorProps {
    selectedTheme: string;
    onThemeSelect: (themeId: string) => void;
}

type CategoryType = ThemeCategory | 'All';

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
    selectedTheme,
    onThemeSelect
}) => {
    const [activeCategory, setActiveCategory] = useState<CategoryType>('Nature');
    const categories = useMemo(() => ['All', ...getAllCategories()], []);
    const displayedThemes = useMemo(() => {
        if (activeCategory === 'All') {
            return themes;
        }
        return getThemesByCategory(activeCategory as ThemeCategory);
    }, [activeCategory]);

    const needsHorizontalScroll = displayedThemes.length > 18;

    return (
        <div className="space-y-6 mb-8 ">
            <h3 className="text-lg font-semibold">Choose Theme</h3>

            {/* Category Navigation */}
            <div className="relative">
                <div className="flex overflow-x-auto pb-2 hide-scrollbar">
                    <div className="flex space-x-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category as CategoryType)}
                                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                                    activeCategory === category
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
            <div className={`relative ${needsHorizontalScroll ? 'h-96' : ''}`}>
                {!needsHorizontalScroll ? (
                    <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-2">
                        {displayedThemes.map(theme => (
                            <ThemeCard 
                                key={theme.id}
                                theme={theme}
                                isSelected={selectedTheme === theme.id}
                                onSelect={onThemeSelect}
                            />
                        ))}
                    </div>
                ) : (
                    // Horizontal scroll container
                    <div className="absolute inset-0 overflow-x-auto custom-scrollbar">
                        <div 
                            className="h-full inline-flex flex-col flex-wrap gap-3 sm:gap-2"
                            style={{ 
                                width: 'max-content',
                                maxHeight: '384px'
                            }}
                        >
                            {displayedThemes.map(theme => (
                                <div key={theme.id} className="w-72 sm:w-48">
                                    <ThemeCard 
                                        theme={theme}
                                        isSelected={selectedTheme === theme.id}
                                        onSelect={onThemeSelect}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ThemeCard component with larger mobile sizing
const ThemeCard: React.FC<{
    theme: typeof themes[number];
    isSelected: boolean;
    onSelect: (id: string) => void;
}> = ({ theme, isSelected, onSelect }) => (
    <button
        onClick={() => onSelect(theme.id)}
        className={`w-full p-4 sm:p-3 rounded-lg border transition-all ${
            isSelected
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-200'
        }`}
    >
        <span className="text-2xl sm:text-xl mb-2 sm:mb-1 block">{theme.icon}</span>
        <span className="text-base sm:text-sm font-medium">{theme.name}</span>
        <span className="text-sm sm:text-xs text-gray-500 block mt-1">{theme.category}</span>
    </button>
);