import React from 'react';

export const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>{children}</div>
);

export const CardHeader = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`p-4 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>
);

export const CardContent = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`p-6 pt-0 ${className}`}>{children}</div>
);