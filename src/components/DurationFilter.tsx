import React from 'react';
import { Clock, Timer, Hourglass, History } from 'lucide-react';

type Duration = 'any' | 'short' | 'medium' | 'long';

interface DurationFilterProps {
    duration: Duration;
    onDurationChange: (duration: Duration) => void;
}

export const DurationFilter: React.FC<DurationFilterProps> = ({ duration, onDurationChange }) => {
    const options = [
        { value: 'any', label: 'Any Duration', icon: History, description: 'All video lengths' },
        { value: 'short', label: 'Short', icon: Timer, description: '0-10 seconds' },
        { value: 'medium', label: 'Medium', icon: Clock, description: '11-30 seconds' },
        { value: 'long', label: 'Long', icon: Hourglass, description: '31+ seconds' }
    ];

    return (
        <div className="mb-6 space-y-4">
            <label className="block text-base font-semibold">Video Duration</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {options.map(({ value, label, icon: Icon, description }) => (
                    <button
                        key={value}
                        onClick={() => onDurationChange(value as Duration)}
                        className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all
                            ${duration === value
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'}`}
                    >
                        <Icon className={`w-6 h-6 mb-2 ${duration === value ? 'text-blue-500' : 'text-gray-500'}`} />
                        <span className="font-medium mb-1">{label}</span>
                        <span className="text-xs text-gray-500">{description}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};