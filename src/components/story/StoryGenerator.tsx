
"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Theme } from "./ThemeSelector";
import { Style } from "./StyleSelector";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface StoryData {
  title: string;
  story: string;
  videoUrl: string;
  thumbnail: string;
  videoBase64?: string;
}

interface StoryGeneratorProps {
  theme: Theme;
  style: Style;
  topic: string;
  onBack: () => void;
  onFinish: () => void;
}

export function StoryGenerator({ theme, style, topic, onBack, onFinish }: StoryGeneratorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [videoBase64, setVideoBase64] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const generateStory = async () => {
      try {
        setIsLoading(true);
        
        // Use a placeholder story for "Twinkle Twinkle Little Star"
        const placeholderStory = `Twinkle, twinkle, little star,
How I wonder what you are!
Up above the world so high,
Like a diamond in the sky.

When the blazing sun is gone,
When he nothing shines upon,
Then you show your little light,
Twinkle, twinkle, all the night.

Then the traveler in the dark
Thanks you for your tiny spark,
How could he see where to go,
If you did not twinkle so?`;

        // Reliable placeholder video URL
        const placeholderVideoUrl = "https://cdn.pixabay.com/vimeo/149018784/twinkle-4005.mp4";
        
        setStoryData({
          title: topic || "Twinkle Twinkle Little Star",
          story: placeholderStory,
          videoUrl: placeholderVideoUrl,
          thumbnail: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800&auto=format&fit=crop',
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error generating story:', err);
        setError('Failed to generate story. Please try again.');
        setIsLoading(false);
      }
    };

    generateStory();
  }, [theme, style, topic]);

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !videoRef.current.muted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const handleSaveStory = async () => {
    if (!user || !storyData) return;
    
    setIsSaving(true);
    
    try {
      // Generate a simple thumbnail from the first frame or use a placeholder
      const thumbnail = storyData.thumbnail || 
        'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800&auto=format&fit=crop';
      
      // Insert story data into Supabase
      const { error: supabaseError } = await supabase
        .from('stories')
        .insert({
          user_id: user.id,
          title: storyData.title,
          theme: theme,
          style: style,
          story: storyData.story,
          video_base64: videoBase64,
          video_url: storyData.videoUrl,
          thumbnail: thumbnail
        });
      
      if (supabaseError) {
        console.error('Error saving story:', supabaseError);
        setError('Failed to save story. Please try again.');
      } else {
        onFinish();
      }
    } catch (err) {
      console.error('Error in save operation:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
        Generating your story...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={onBack} 
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!storyData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">{storyData.title}</h1>
      <p className="mb-6 max-w-xl text-center whitespace-pre-line">{storyData.story}</p>

      <div className="w-full max-w-2xl relative">
        <video
          ref={videoRef}
          controls
          autoPlay
          poster={storyData.thumbnail}
          className="w-full h-full rounded-lg"
          onEnded={() => setIsPlaying(false)}
          onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
          onLoadedMetadata={(e) => {
            setDuration(e.currentTarget.duration);
            setIsPlaying(true);
          }}
          muted={isMuted}
        >
          <source src={storyData.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="flex justify-between items-center mt-4">
          <button 
            onClick={() => {
              if (videoRef.current) {
                if (videoRef.current.paused) {
                  videoRef.current.play();
                  setIsPlaying(true);
                } else {
                  videoRef.current.pause();
                  setIsPlaying(false);
                }
              }
            }} 
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>

          <button 
            onClick={() => {
              if (videoRef.current) {
                const newMuted = !videoRef.current.muted;
                videoRef.current.muted = newMuted;
                setIsMuted(newMuted);
              }
            }} 
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            {isMuted ? "Unmute" : "Mute"}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => {
              const newVolume = parseFloat(e.target.value);
              setVolume(newVolume);
              if (videoRef.current) {
                videoRef.current.volume = newVolume;
                setIsMuted(newVolume === 0);
              }
            }}
            className="w-32"
          />
        </div>
        <div className="text-sm mt-2 text-center text-gray-600">
          {Math.floor(currentTime)}s / {Math.floor(duration)}s
        </div>
      </div>
      
      <div className="flex gap-4 mt-8">
        <button onClick={onBack} className="px-4 py-2 bg-gray-500 text-white rounded">
          Back
        </button>
        <button 
          onClick={handleSaveStory} 
          disabled={isSaving} 
          className="px-4 py-2 bg-green-500 text-white rounded flex items-center"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Story'
          )}
        </button>
      </div>
    </div>
  );
}

export default StoryGenerator;
