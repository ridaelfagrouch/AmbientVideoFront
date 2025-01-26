

export interface Theme {
    id: string;
    name: string;
    icon: string;
    musicTags: string;
    category: string;
}

export type ThemeCategory = 'Nature' | 'Space' | 'Urban' | 'Abstract' | 'Seasonal' | 'Fantasy' | 'Relaxation';