import React from 'react';

const BackgroundLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen relative bg-gradient-to-br from-indigo-800 via-purple-900 to-violet-950 overflow-hidden">
            {/* Enhanced animated orbs with more dramatic effects */}
            <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blue-500 rounded-full mix-blend-overlay filter blur-[80px] opacity-50 animate-blob" />
            <div className="fixed top-1/4 right-1/4 w-[500px] h-[500px] bg-fuchsia-500 rounded-full mix-blend-overlay filter blur-[80px] opacity-50 animate-blob animation-delay-2000" />
            <div className="fixed -bottom-32 left-1/3 w-[700px] h-[700px] bg-violet-600 rounded-full mix-blend-overlay filter blur-[80px] opacity-50 animate-blob animation-delay-4000" />

            {/* Light streaks */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(255,255,255,0.05)_100%)] pointer-events-none"></div>
            <div className="fixed inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] animate-grain pointer-events-none"></div>

            {/* Content container with enhanced blur effect */}
            <div className="relative min-h-screen">
                {children}
            </div>
        </div>
    );
};

// Enhanced animations
const style = document.createElement('style');
style.textContent = `
  @keyframes blob {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    25% {
      transform: translate(50px, -50px) scale(1.2);
    }
    50% {
      transform: translate(-20px, 40px) scale(0.9);
    }
    75% {
      transform: translate(-40px, -30px) scale(1.1);
    }
  }

  @keyframes grain {
    0%, 100% {
      transform: translate(0, 0) scale(1.5);
    }
    25% {
      transform: translate(10%, 15%) scale(1.4);
    }
    50% {
      transform: translate(-5%, 10%) scale(1.6);
    }
    75% {
      transform: translate(5%, -5%) scale(1.5);
    }
  }
  
  .animate-blob {
    animation: blob 20s infinite cubic-bezier(0.4, 0.0, 0.2, 1);
  }
  
  .animation-delay-2000 {
    animation-delay: -10s;
  }
  
  .animation-delay-4000 {
    animation-delay: -5s;
  }

  .animate-grain {
    animation: grain 8s infinite linear;
  }
`;
document.head.appendChild(style);

export default BackgroundLayout;