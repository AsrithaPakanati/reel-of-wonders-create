
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Theme } from './ThemeSelector';
import { Style } from './StyleSelector';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { PlayCircle, PauseCircle, RotateCcw } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

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
}

export function StoryGenerator({ theme, style, topic, onBack, onFinish }: StoryGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [storyFrames, setStoryFrames] = useState<StoryFrame[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<number | null>(null);
  
  // In a real implementation, this would call an AI service to generate the story and images
  useEffect(() => {
    const generateStory = async () => {
      setIsGenerating(true);
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      // Mock story frames based on selected options
      const mockFrames = [
        {
          imageUrl: `https://source.unsplash.com/random/800x600?${style},${topic.split(' ').join(',')}`,
          text: `Once upon a time in the land of ${topic}, there was a wonderful adventure waiting to be discovered.`
        },
        {
          imageUrl: `https://source.unsplash.com/random/800x600?${style},${theme}`,
          text: `The ${theme === 'planet' ? 'explorers' : 'characters'} embarked on a journey filled with wonder and excitement.`
        },
        {
          imageUrl: `https://source.unsplash.com/random/800x600?${style},fantasy`,
          text: `They encountered challenges along the way, but their determination helped them overcome obstacles.`
        },
        {
          imageUrl: `https://source.unsplash.com/random/800x600?${style},magic`,
          text: `With a touch of magic and imagination, they discovered the true meaning of their quest.`
        },
        {
          imageUrl: `https://source.unsplash.com/random/800x600?${style},happy`,
          text: `And they lived happily ever after, with memories of their adventure warming their hearts.`
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
    };
  }, [theme, style, topic]);

  // Control playing and pausing the reel
  const handlePlayPause = (play?: boolean) => {
    const shouldPlay = play !== undefined ? play : !isPlaying;
    
    if (shouldPlay) {
      // Start the interval to auto-advance frames
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      
      const interval = window.setInterval(() => {
        setCurrentFrameIndex(prevIndex => {
          const nextIndex = prevIndex + 1;
          // If we've reached the end, loop back to beginning
          if (nextIndex >= storyFrames.length) {
            return 0;
          }
          return nextIndex;
        });
      }, 3000); // Change frame every 3 seconds
      
      intervalRef.current = interval;
      setIsPlaying(true);
    } else {
      // Stop the interval
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPlaying(false);
    }
  };

  // Reset to beginning and restart playback
  const handleRestart = () => {
    setCurrentFrameIndex(0);
    handlePlayPause(true);
  };

  // When the user completes the reel
  const handleComplete = () => {
    toast({
      title: "Story Complete!",
      description: "You've finished watching your story reel.",
    });
    onFinish();
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Your Story Reel</h1>
        <p className="text-muted-foreground">
          {isGenerating 
            ? "Crafting your magical story reel... Please wait" 
            : `${topic} - A ${theme} story in ${style} style`
          }
        </p>
      </div>
      
      <div className="flex flex-col items-center">
        {isGenerating ? (
          <Card className="w-full max-w-2xl overflow-hidden">
            <CardContent className="p-0">
              <Skeleton className="h-[400px] w-full" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="w-full max-w-2xl">
            <Carousel className="w-full">
              <CarouselContent>
                {storyFrames.map((frame, index) => (
                  <CarouselItem key={index} className={index === currentFrameIndex ? "block" : "hidden"}>
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
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
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <div className="flex items-center justify-center mt-4 gap-4">
              {isPlaying ? (
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handlePlayPause(false)}
                  className="rounded-full"
                >
                  <PauseCircle className="h-6 w-6" />
                  <span className="sr-only">Pause</span>
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handlePlayPause(true)}
                  className="rounded-full"
                >
                  <PlayCircle className="h-6 w-6" />
                  <span className="sr-only">Play</span>
                </Button>
              )}
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleRestart}
                className="rounded-full"
              >
                <RotateCcw className="h-6 w-6" />
                <span className="sr-only">Restart</span>
              </Button>
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
