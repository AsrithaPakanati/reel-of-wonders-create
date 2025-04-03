
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Theme } from './ThemeSelector';
import { Style } from './StyleSelector';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { PlayCircle, PauseCircle, RotateCcw, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Slider } from '@/components/ui/slider';

interface StoryGeneratorProps {
  theme: Theme;
  style: Style;
  topic: string;
  onBack: () => void;
  onFinish: () => void;
}

interface StoryFrame {
  imageUrl: string;
  text: string;
  audioUrl?: string;
}

export function StoryGenerator({ theme, style, topic, onBack, onFinish }: StoryGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [storyFrames, setStoryFrames] = useState<StoryFrame[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  
  // In a real implementation, this would call an AI service to generate the story, video frames, and audio
  useEffect(() => {
    const generateStory = async () => {
      setIsGenerating(true);
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      // Mock story frames based on selected options
      // In a real implementation, this would generate actual video frames and audio narration
      const mockFrames = [
        {
          imageUrl: `https://source.unsplash.com/random/800x600?${style},${topic.split(' ').join(',')},1`,
          text: `Once upon a time in the grand court of Emperor Akbar, there lived a wise adviser named Birbal.`,
          audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' // Mock audio URL
        },
        {
          imageUrl: `https://source.unsplash.com/random/800x600?${style},${topic.split(' ').join(',')},2`,
          text: `Akbar was known for his curiosity and intelligence, often posing challenging questions to his courtiers.`,
          audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
        },
        {
          imageUrl: `https://source.unsplash.com/random/800x600?${style},${topic.split(' ').join(',')},3`,
          text: `One day, the Emperor decided to test Birbal's wit with a particularly difficult riddle.`,
          audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
        },
        {
          imageUrl: `https://source.unsplash.com/random/800x600?${style},${topic.split(' ').join(',')},4`,
          text: `"Birbal," said Akbar, "find me something that makes a sad person happy and a happy person sad."`,
          audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
        },
        {
          imageUrl: `https://source.unsplash.com/random/800x600?${style},${topic.split(' ').join(',')},5`,
          text: `After some thought, Birbal returned with a simple ring inscribed with the words: "This too shall pass."`,
          audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
        }
      ];
      
      setStoryFrames(mockFrames);
      setIsGenerating(false);
      // Start playing automatically once generated
      handlePlayPause(true);
    };
    
    generateStory();

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [theme, style, topic]);

  // Audio event handlers
  const setupAudio = () => {
    if (!storyFrames.length || !storyFrames[currentFrameIndex].audioUrl) return;
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    const audio = new Audio(storyFrames[currentFrameIndex].audioUrl);
    audio.volume = volume;
    audio.muted = isMuted;
    
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    });
    
    audio.addEventListener('ended', () => {
      // Move to the next frame when audio ends
      handleNextFrame();
    });
    
    audioRef.current = audio;
    
    if (isPlaying) {
      audio.play().catch(error => {
        console.error("Audio playback error:", error);
      });
    }
  };
  
  // Setup audio when current frame changes
  useEffect(() => {
    setupAudio();
  }, [currentFrameIndex, storyFrames]);
  
  // Handle volume and mute changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Handle progress bar changes
  const handleProgressChange = (value: number[]) => {
    if (audioRef.current && duration) {
      const newTime = (value[0] / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(value[0]);
    }
  };

  // Format time display (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Control playing and pausing the story
  const handlePlayPause = (play?: boolean) => {
    const shouldPlay = play !== undefined ? play : !isPlaying;
    
    if (shouldPlay) {
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error("Audio playback error:", error);
        });
      }
      setIsPlaying(true);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    }
  };

  // Handle moving to next frame
  const handleNextFrame = () => {
    setCurrentFrameIndex(prevIndex => {
      const nextIndex = prevIndex + 1;
      // If we've reached the end, loop back to beginning
      if (nextIndex >= storyFrames.length) {
        return 0;
      }
      return nextIndex;
    });
  };

  // Reset to beginning and restart playback
  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setCurrentFrameIndex(0);
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

  // When the user completes the reel
  const handleComplete = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    toast({
      title: "Story Complete!",
      description: "You've finished watching your story video.",
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
              <Carousel className="w-full">
                <CarouselContent>
                  {storyFrames.map((frame, index) => (
                    <CarouselItem key={index} className={index === currentFrameIndex ? "block" : "hidden"}>
                      <div className="relative">
                        <img 
                          src={frame.imageUrl}
                          alt={`Story Frame ${index + 1}`}
                          className="w-full h-[400px] object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                          <p className="text-lg text-white">{frame.text}</p>
                        </div>
                        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
                          {currentFrameIndex + 1} / {storyFrames.length}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

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
              <Button onClick={handleComplete}>Finish</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
