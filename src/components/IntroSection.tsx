import { Video, Music, Download, Sparkles, PlayCircle, Pause, Volume2, VolumeX } from 'lucide-react';
import { useState, useRef } from 'react';

// Add styles to your CSS or styles file
const style = document.createElement('style');
style.textContent = `

  @keyframes float {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-10px) scale(1.1); }
  }

  @keyframes icon-float {
    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
    50% { transform: translate(-5px, -5px) scale(1.1); opacity: 1; }
  }

  @keyframes pulse-ring {
    0% { transform: scale(0.8); opacity: 0; }
    50% { transform: scale(1.1); opacity: 0.3; }
    100% { transform: scale(1.3); opacity: 0; }
  }

  @keyframes particle {
    0%, 100% { transform: scale(0) translate(0, 0); opacity: 0; }
    25%, 75% { transform: scale(1) translate(10px, -10px); opacity: 0.5; }
    50% { transform: scale(1.2) translate(20px, -20px); opacity: 0.2; }
  }

  @keyframes grid-fade {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.1; }
  }

  @keyframes border-shine {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 0.2; }
  }

  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-float-delay { animation: float 6s ease-in-out infinite; animation-delay: -3s; }
  .animate-float-delay-2 { animation: float 6s ease-in-out infinite; animation-delay: -4s; }
  .animate-icon-float { animation: icon-float 4s ease-in-out infinite; }
  .animate-icon-float-delay-1 { animation: icon-float 4s ease-in-out infinite; animation-delay: -1.3s; }
  .animate-icon-float-delay-2 { animation: icon-float 4s ease-in-out infinite; animation-delay: -2.6s; }
  .animate-pulse-ring { animation: pulse-ring 3s ease-out infinite; }
  .animate-particle { animation: particle 5s ease-in-out infinite; }
  .animate-grid-fade { animation: grid-fade 4s ease-in-out infinite; }
  .animate-border-shine { animation: border-shine 4s ease-in-out infinite; }
`;
document.head.appendChild(style);

const IntroSection = () => {
    const [_, setIsHovered] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleMuteToggle = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div
            className="glass-container relative w-full mb-8 overflow-hidden group rounded-xl
        h-[300px] sm:h-[250px] md:h-[200px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-blue-500/20 rounded-full blur-xl animate-float" />
                <div className="absolute top-1/2 left-1/4 w-12 sm:w-20 h-12 sm:h-20 bg-pink-500/20 rounded-full blur-xl animate-float-delay-2" />
                <div className="absolute bottom-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-purple-500/20 rounded-full blur-xl animate-float-delay" />

                {/* Grid background */}
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:15px_15px] sm:bg-[size:20px_20px] animate-grid-fade" />
            </div>

            {/* Gradient Border */}
            <div className="absolute inset-0 rounded-xl p-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-border-shine" />

            {/* Video Background */}
            <div className="absolute inset-0 bg-black/20">
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover opacity-20 scale-105 blur-sm"
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                >
                    <source src="/preview-ambient.mp4" type="video/mp4" />
                </video>
            </div>

            {/* Main Content */}
            <div className="relative h-full flex flex-col md:flex-row items-center p-4 sm:p-6">
                {/* Icon Stack */}
                <div className="w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
                    <div className="relative w-16 sm:w-20 h-16 sm:h-20 transform transition-transform group-hover:scale-110">
                        <div className="absolute inset-0 animate-icon-float">
                            <Video className="w-full h-full text-white/80" />
                        </div>
                        <div className="absolute inset-0 animate-icon-float-delay-1">
                            <Music className="w-full h-full text-white/60" />
                        </div>
                        <div className="absolute inset-0 animate-icon-float-delay-2">
                            <Sparkles className="w-full h-full text-white/40" />
                        </div>
                        <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-pulse-ring" />
                    </div>
                </div>

                {/* Text Content */}
                <div className="w-full md:w-2/3 md:pr-8 space-y-2 sm:space-y-3 text-center md:text-left">
                    <h2 className="text-lg sm:text-xl font-semibold text-white group-hover:text-blue-200 transition-colors">
                        Create Stunning Ambient Videos
                    </h2>
                    <p className="text-white/80 transition-opacity group-hover:text-white text-sm sm:text-base 
                        max-w-md mx-auto md:mx-0">
                        Transform your ideas into captivating ambient videos. Choose from a variety of themes,
                        add atmospheric music, and generate the perfect background video.
                    </p>

                    {/* Controls */}
                    <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                        <div className="flex items-center gap-2 text-white/60 group-hover:text-white/80 transition-colors">
                            <Download className="w-4 h-4" />
                            <span className="text-xs sm:text-sm">Multiple formats</span>
                        </div>
                        <div className="h-4 w-[1px] bg-white/20" />
                        <div className="flex gap-2">
                            <button
                                onClick={handlePlayPause}
                                className="p-1 rounded-full hover:bg-white/10 transition-colors active:bg-white/20"
                                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                            >
                                {isPlaying ?
                                    <Pause className="w-4 h-4 text-white/60 hover:text-white" /> :
                                    <PlayCircle className="w-4 h-4 text-white/60 hover:text-white" />
                                }
                            </button>
                            <button
                                onClick={handleMuteToggle}
                                className="p-1 rounded-full hover:bg-white/10 transition-colors active:bg-white/20"
                                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                            >
                                {isMuted ?
                                    <VolumeX className="w-4 h-4 text-white/60 hover:text-white" /> :
                                    <Volume2 className="w-4 h-4 text-white/60 hover:text-white" />
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full animate-particle hidden sm:block"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default IntroSection;