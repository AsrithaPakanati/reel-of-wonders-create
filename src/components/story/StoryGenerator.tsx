
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Theme } from './ThemeSelector';
import { Style } from './StyleSelector';
import { Skeleton } from '@/components/ui/skeleton';

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
    };
    
    generateStory();
  }, [theme, style, topic]);

  const handlePrevFrame = () => {
    if (currentFrameIndex > 0) {
      setCurrentFrameIndex(currentFrameIndex - 1);
    }
  };

  const handleNextFrame = () => {
    if (currentFrameIndex < storyFrames.length - 1) {
      setCurrentFrameIndex(currentFrameIndex + 1);
    }
  };

  const isFirstFrame = currentFrameIndex === 0;
  const isLastFrame = currentFrameIndex === storyFrames.length - 1;
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Your Story</h1>
        <p className="text-muted-foreground">
          {isGenerating 
            ? "Crafting your magical story... Please wait" 
            : `${topic} - A ${theme} story in ${style} style`
          }
        </p>
      </div>
      
      <div className="flex flex-col items-center">
        <Card className="w-full max-w-2xl overflow-hidden">
          {isGenerating ? (
            <CardContent className="p-0">
              <Skeleton className="h-[400px] w-full" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          ) : (
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src={storyFrames[currentFrameIndex].imageUrl}
                  alt="Story Frame"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
                  {currentFrameIndex + 1} / {storyFrames.length}
                </div>
              </div>
              <div className="p-6">
                <p className="text-lg">{storyFrames[currentFrameIndex].text}</p>
              </div>
            </CardContent>
          )}
        </Card>
        
        <div className="flex justify-between w-full max-w-2xl mt-6">
          {isGenerating ? (
            <Button variant="outline" onClick={onBack}>Cancel</Button>
          ) : (
            <>
              <Button variant="outline" onClick={onBack}>Start Over</Button>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handlePrevFrame}
                  disabled={isFirstFrame}
                >
                  Previous
                </Button>
                {isLastFrame ? (
                  <Button onClick={onFinish}>Finish</Button>
                ) : (
                  <Button onClick={handleNextFrame}>Next</Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
