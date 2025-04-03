
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Theme } from './ThemeSelector';
import { Style } from './StyleSelector';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { PlayCircle, PauseCircle, RotateCcw, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface StoryGeneratorProps {
  theme: Theme;
  style: Style;
  topic: string;
  onBack: () => void;
  onFinish: () => void;
}

interface StoryVideoData {
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
}

export function StoryGenerator({ theme, style, topic, onBack, onFinish }: StoryGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [storyData, setStoryData] = useState<StoryVideoData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  // For real implementation, generate video based on theme, style, topic
  useEffect(() => {
    const generateStoryVideo = async () => {
      setIsGenerating(true);
      
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 3000));
        
        // In a real implementation, this would call your AI video generation service
        // For now using sample video
        const mockVideoData = {
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Sample video
          thumbnailUrl: `https://source.unsplash.com/random/800x600?${style},${topic.split(' ').join(',')}`,
          duration: 60, // Default duration in seconds
        };
        
        setStoryData(mockVideoData);
        setIsGenerating(false);
        
        // This would be replaced with actual video generation API call
        console.log("Generating video with:", { theme, style, topic });
      } catch (error) {
        console.error("Error generating video:", error);
        toast({
          title: "Error",
          description: "Failed to generate story video. Please try again.",
          variant: "destructive"
        });
      }
    };
    
    generateStoryVideo();
  }, [theme, style, topic]);

  // Video element event handlers
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !storyData) return;
    
    const onLoadedMetadata = () => {
      setDuration(videoElement.duration);
    };
    
    const onTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
      setProgress((videoElement.currentTime / videoElement.duration) * 100);
    };
    
    const onEnded = () => {
      setIsPlaying(false);
      videoElement.currentTime = 0;
      setProgress(0);
    };
    
    videoElement.addEventListener('loadedmetadata', onLoadedMetadata);
    videoElement.addEventListener('timeupdate', onTimeUpdate);
    videoElement.addEventListener('ended', onEnded);
    
    // Set initial volume
    videoElement.volume = volume;
    videoElement.muted = isMuted;
    
    return () => {
      videoElement.removeEventListener('loadedmetadata', onLoadedMetadata);
      videoElement.removeEventListener('timeupdate', onTimeUpdate);
      videoElement.removeEventListener('ended', onEnded);
    };
  }, [storyData]);

  // Handle volume and mute changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);
  
  // Format time display (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Control playing and pausing the video
  const handlePlayPause = (play?: boolean) => {
    if (!videoRef.current) return;
    
    const shouldPlay = play !== undefined ? play : !isPlaying;
    
    if (shouldPlay) {
      videoRef.current.play().catch(error => {
        console.error("Video playback error:", error);
      });
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Handle progress bar changes
  const handleProgressChange = (value: number[]) => {
    if (videoRef.current && duration) {
      const newTime = (value[0] / 100) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(value[0]);
    }
  };

  // Reset to beginning and restart playback
  const handleRestart = () => {
    if (!videoRef.current) return;
    
    videoRef.current.currentTime = 0;
    setProgress(0);
    setCurrentTime(0);
    handlePlayPause(true);
  };

  // Toggle mute
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Toggle fullscreen
  const handleToggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // When the user completes watching the video
  const handleComplete = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    
    toast({
      title: "Story Complete!",
      description: "Your story video has been saved to your library.",
    });
    
    onFinish();
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Your Story Video</h1>
        <p className="text-muted-foreground">
          {isGenerating 
            ? "Creating your magical story video... Please wait" 
            : `${topic} - A ${theme} story in ${style} style`
          }
        </p>
      </div>
      
      <div className="flex flex-col items-center">
        {isGenerating ? (
          <Card className="w-full max-w-2xl overflow-hidden">
            <div className="p-0">
              <Skeleton className="h-[400px] w-full" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </Card>
        ) : (
          <div className="w-full max-w-2xl" ref={videoContainerRef}>
            <div className="relative bg-black rounded-lg overflow-hidden">
              {/* Video element */}
              <video
                ref={videoRef}
                src={storyData?.videoUrl}
                poster={storyData?.thumbnailUrl}
                className="w-full h-[400px] object-cover"
                playsInline
              />

              {/* Video controls overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                {/* Progress bar */}
                <Slider
                  value={[progress]}
                  min={0}
                  max={100}
                  step={0.1}
                  onValueChange={handleProgressChange}
                  className="mb-2"
                />
                
                {/* Time display */}
                <div className="flex justify-between text-xs text-white mb-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                
                {/* Control buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {isPlaying ? (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handlePlayPause(false)}
                        className="text-white hover:bg-white/20"
                      >
                        <PauseCircle className="h-6 w-6" />
                        <span className="sr-only">Pause</span>
                      </Button>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handlePlayPause(true)}
                        className="text-white hover:bg-white/20"
                      >
                        <PlayCircle className="h-6 w-6" />
                        <span className="sr-only">Play</span>
                      </Button>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleRestart}
                      className="text-white hover:bg-white/20"
                    >
                      <RotateCcw className="h-5 w-5" />
                      <span className="sr-only">Restart</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleToggleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? (
                        <VolumeX className="h-5 w-5" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                      <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
                    </Button>
                    
                    {/* Volume slider */}
                    <div className="w-24 hidden sm:block">
                      <Slider
                        value={[isMuted ? 0 : volume * 100]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => {
                          setVolume(value[0] / 100);
                          if (value[0] > 0 && isMuted) setIsMuted(false);
                        }}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleToggleFullscreen}
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize2 className="h-5 w-5" />
                    <span className="sr-only">Fullscreen</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between w-full max-w-2xl mt-6">
          {isGenerating ? (
            <Button variant="outline" onClick={onBack}>Cancel</Button>
          ) : (
            <>
              <Button variant="outline" onClick={onBack}>Start Over</Button>
              <Button onClick={handleComplete}>Save to Library</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
