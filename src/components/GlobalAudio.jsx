import React, { useEffect, useRef } from "react";
import useDesktopStore from "../store/useDesktopStore";

const GlobalAudio = () => {
    const { audio, setAudio } = useDesktopStore();
    const audioRef = useRef(null);
    const youtubePlayerRef = useRef(null);
    const containerRef = useRef(null);

    // Initialize YouTube player
    useEffect(() => {
        if (!audio.youtubeId || youtubePlayerRef.current) return;

        const initYTPlayer = () => {
            if (window.YT && window.YT.Player) {
                youtubePlayerRef.current = new window.YT.Player(containerRef.current, {
                    height: '1',
                    width: '1',
                    videoId: audio.youtubeId,
                    playerVars: {
                        autoplay: audio.isPlaying ? 1 : 0,
                        controls: 0,
                        disablekb: 1,
                        fs: 0,
                        modestbranding: 1,
                        playsinline: 1,
                    },
                    events: {
                        onReady: (event) => {
                            if (audio.isPlaying) {
                                event.target.playVideo();
                            }
                            setAudio({ duration: event.target.getDuration() });
                        },
                        onStateChange: (event) => {
                            if (event.data === window.YT.PlayerState.ENDED) {
                                setAudio({ isPlaying: false });
                            }
                        },
                    },
                });

                // Update time periodically
                const interval = setInterval(() => {
                    if (youtubePlayerRef.current && youtubePlayerRef.current.getCurrentTime) {
                        const currentTime = youtubePlayerRef.current.getCurrentTime();
                        setAudio({ currentTime });
                    }
                }, 500);

                return () => clearInterval(interval);
            }
        };

        if (!window.YT) {
            window.onYouTubeIframeAPIReady = initYTPlayer;
        } else {
            initYTPlayer();
        }
    }, [audio.youtubeId]);

    // Handle YouTube playback state
    useEffect(() => {
        if (!youtubePlayerRef.current || !audio.isYouTube) return;

        if (audio.isPlaying) {
            youtubePlayerRef.current.playVideo?.();
        } else {
            youtubePlayerRef.current.pauseVideo?.();
        }
    }, [audio.isPlaying, audio.isYouTube]);

    // Handle regular audio playback
    useEffect(() => {
        if (!audioRef.current || audio.isYouTube) return;

        if (audio.isPlaying) {
            audioRef.current.play().catch(e => {
                console.log("Audio play failed:", e);
                setAudio({ isPlaying: false });
            });
        } else {
            audioRef.current.pause();
        }
    }, [audio.isPlaying, audio.trackUrl, audio.isYouTube]);

    // Clean up YouTube player on track change
    useEffect(() => {
        return () => {
            if (youtubePlayerRef.current && youtubePlayerRef.current.destroy) {
                youtubePlayerRef.current.destroy();
                youtubePlayerRef.current = null;
            }
        };
    }, [audio.youtubeId]);

    const handleTimeUpdate = () => {
        if (audioRef.current && !audio.isYouTube) {
            setAudio({ currentTime: audioRef.current.currentTime });
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current && !audio.isYouTube) {
            setAudio({ duration: audioRef.current.duration });
        }
    };

    return (
        <>
            {/* YouTube Player Container (hidden) */}
            {audio.isYouTube && (
                <div
                    ref={containerRef}
                    style={{
                        position: 'absolute',
                        left: '-9999px',
                        width: '1px',
                        height: '1px'
                    }}
                />
            )}

            {/* Regular Audio Element */}
            {!audio.isYouTube && audio.trackUrl && (
                <audio
                    ref={audioRef}
                    src={audio.trackUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    loop
                />
            )}
        </>
    );
};

export default GlobalAudio;
