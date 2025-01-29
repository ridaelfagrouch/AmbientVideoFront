import React from 'react';
import { Video, Film, VideoIcon } from 'lucide-react';

interface FormatSelectorProps {
    format: 'webm' | 'mp4' | 'mov';
    onFormatSelect: (format: 'webm' | 'mp4' | 'mov') => void;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({ format, onFormatSelect }) => {
    const formats = [
        {
            value: 'webm',
            label: 'WebM',
            icon: Video,
            description: 'Best quality, larger file size',
            features: ['High compression', 'Open source']
        },
        {
            value: 'mp4',
            label: 'MP4',
            icon: Film,
            description: 'Universal compatibility',
            features: ['Wide support', 'Good quality']
        },
        {
            value: 'mov',
            label: 'MOV',
            icon: VideoIcon,
            description: 'High quality Apple format',
            features: ['Mac optimized', 'High quality']
        }
    ];

    return (
        <div className="space-y-6 mb-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Video className="w-4 h-4 sm:w-6 sm:h-6" />
                Output Format
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {formats.map(({ value: formatValue, label, icon: Icon, description, features }) => (
                    <div
                        key={formatValue}
                        onClick={() => onFormatSelect(formatValue as 'webm' | 'mp4' | 'mov')}
                        className={`relative cursor-pointer group rounded-xl p-4 transition-all duration-200
              ${format === formatValue
                                ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-500'
                                : 'bg-white border-2 border-gray-200 hover:border-blue-300 hover:shadow-md'}`}
                    >
                        <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${format === formatValue ? 'bg-blue-500' : 'bg-gray-100 group-hover:bg-blue-50'}`}>
                                <Icon className={`w-5 h-5 ${format === formatValue ? 'text-white' : 'text-gray-600 group-hover:text-blue-500'}`} />
                            </div>
                            <div>
                                <h3 className={`font-medium ${format === formatValue ? 'text-blue-700' : 'text-gray-900'}`}>
                                    {label}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">{description}</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {features.map((feature, index) => (
                                        <span
                                            key={index}
                                            className={`text-xs px-2 py-1 rounded-full
                        ${format === formatValue
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-gray-100 text-gray-600'}`}
                                        >
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {format === formatValue && (
                            <div className="absolute top-2 right-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};